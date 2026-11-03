import type { Logger } from 'pino';
import type { PlanKey } from '@rota/contract';
import type { AppDeps } from '../app';
import type { TeamScope, Queryable } from '../db/types';
import type { Topology } from '../db/topology';
import type { SubscriptionRow } from '../billing/entitlements';
import { getPlan, getSubscription } from '../billing/entitlements';
import {
  MS_PER_DAY,
  PERIOD_DAYS,
  extraSeatsFor,
  periodPriceCents,
  planFacts,
} from '../billing/proration';
import { createPaymentProvider, toMinorUnits } from '../billing/flutterwave';
import { appendLedgerEntry } from '../repos/ledger';
import { cleanupExpiredIdempotency } from '../repos/idempotency';
import {
  getWebhookEvent,
  isRecord,
  settleWebhookEvent,
  staleWebhookEvents,
  type WebhookEventRow,
} from '../repos/webhooks';
import { PUSH_QUEUE, runPushJob } from './push';
import type { Queue } from './queue';

/**
 * Background billing work (Rule 01): webhook processing, renewal sweeps and
 * outbox push delivery. Nothing here runs inside a request; every handler
 * retries through the queue's exponential backoff and is safe to re-run
 * (ledger `ref`, `(provider, event_key)` and intent status are the guards).
 */

export const WEBHOOK_QUEUE = 'webhooks';
export const RENEWALS_QUEUE = 'renewals';

/** Self-scheduling cadence for the renewal sweep (hourly, plus one at boot). */
const RENEWAL_SWEEP_MS = 60 * 60 * 1000;
const RENEWAL_START_DELAY_MS = 30_000;
const GRACE_DAYS = 5;
const GRACE_MS = GRACE_DAYS * MS_PER_DAY;
const REMINDER_DAYS = [0, 1, 3, 5];

export interface PaymentIntentRow {
  id: string;
  team_id: string;
  reference: string;
  amount_cents: number;
  currency: string;
  plan_key: PlanKey;
  seats: number;
  status: 'pending' | 'paid' | 'failed';
  authorization_url: string | null;
  created_by: string | null;
  created_at: Date;
}

export interface BillingJobsOptions {
  /**
   * Serverless invocations are frozen after the response, so a self-scheduling
   * renewal sweep would never fire reliably there. The container deployment
   * keeps the default (true).
   */
  scheduleRenewals?: boolean;
}

export function registerBillingJobs(queue: Queue, deps: AppDeps, options: BillingJobsOptions = {}): void {
  queue.register(WEBHOOK_QUEUE, async (payload, ctx) => {
    const eventId = isRecord(payload) && typeof payload.eventId === 'string' ? payload.eventId : null;
    if (!eventId) throw new Error('webhooks job requires an eventId');
    await processWebhookEvent(deps, eventId, ctx.log);
  });

  queue.register(RENEWALS_QUEUE, async (_payload, ctx) => {
    await runRenewals(deps, ctx.log);
    await reconcileWebhookEvents(deps, ctx.log);
    const removed = await cleanupExpiredIdempotency(deps.topology.global);
    if (removed > 0) ctx.log.info({ removed }, 'expired idempotency keys cleaned');
    await queue.add(RENEWALS_QUEUE, {}, { delayMs: RENEWAL_SWEEP_MS, attempts: 5 });
  });

  queue.register(PUSH_QUEUE, async (_payload, ctx) => {
    await runPushJob(deps, ctx.log);
  });

  // first sweep shortly after boot, then the handler reschedules itself
  if (options.scheduleRenewals !== false) {
    void queue.add(RENEWALS_QUEUE, {}, { delayMs: RENEWAL_START_DELAY_MS, attempts: 5 });
  }
}

/* ------------------------------------------------------------------ */
/* webhook reconciliation                                             */
/* ------------------------------------------------------------------ */

/**
 * Re-enqueues events that never left `received`. This closes the gap left by a
 * crash between the webhook insert and the queue enqueue (or a queue outage):
 * instead of waiting for a provider retry that may never come, the hourly sweep
 * makes the inbox self-healing.
 */
export async function reconcileWebhookEvents(deps: AppDeps, log: Logger): Promise<number> {
  const olderThan = new Date(Date.now() - 5 * 60 * 1000);
  const stale = await staleWebhookEvents(deps.topology.global, olderThan);
  for (const event of stale) {
    await deps.queue.add(WEBHOOK_QUEUE, { eventId: event.id }, { attempts: 5 });
  }
  if (stale.length > 0) log.warn({ count: stale.length }, 're-enqueued stale webhook events');
  return stale.length;
}

/* ------------------------------------------------------------------ */
/* webhook job                                                         */
/* ------------------------------------------------------------------ */

interface Outcome {
  status: 'processed' | 'rejected';
  note: string;
}

export async function processWebhookEvent(deps: AppDeps, eventId: string, log: Logger): Promise<void> {
  const event = await getWebhookEvent(deps.topology.global, eventId);
  if (!event) throw new Error(`webhook event ${eventId} not found`);
  if (event.status !== 'received') return; // already settled — a late retry stops here

  const type = typeof event.payload.event === 'string' ? event.payload.event : '';
  const data = isRecord(event.payload.data) ? event.payload.data : {};
  const chargeStatus = typeof data.status === 'string' ? data.status : '';
  let outcome: Outcome;
  try {
    if (type === 'charge.completed' && chargeStatus === 'successful') {
      outcome = await applyChargeSuccess(deps, event, log);
    } else if (type === 'charge.failed' || (type === 'charge.completed' && chargeStatus === 'failed')) {
      outcome = await applyChargeFailed(deps, event, log);
    } else if (type === 'charge.completed') {
      outcome = { status: 'processed', note: `ignored charge.completed with status ${chargeStatus || 'unknown'}` };
    } else {
      outcome = { status: 'processed', note: `ignored event type ${type || 'unknown'}` };
    }
  } catch (error) {
    log.warn({ paymentRef: event.event_key, eventId, err: error }, 'webhook job failed — will retry');
    throw error;
  }

  await settleWebhookEvent(deps.topology.global, { id: event.id, status: outcome.status, note: outcome.note });
  log.info({ paymentRef: event.event_key, eventId, result: outcome.status, note: outcome.note }, 'webhook handled');
}

async function findIntent(
  topology: Topology,
  reference: string,
): Promise<{ scope: TeamScope; row: PaymentIntentRow } | null> {
  for (const shard of topology.shards) {
    const row = await shard.one<PaymentIntentRow>('SELECT * FROM payment_intents WHERE reference = $1', [reference]);
    if (row) return { scope: topology.scopeFor(row.team_id), row };
  }
  return null;
}

/** Flutterwave identifies the transaction by `tx_ref`; older shapes used `reference`. */
function paymentReference(data: Record<string, unknown>): string {
  if (typeof data.tx_ref === 'string') return data.tx_ref;
  if (typeof data.reference === 'string') return data.reference;
  return '';
}

async function applyChargeSuccess(deps: AppDeps, event: WebhookEventRow, log: Logger): Promise<Outcome> {
  const data = isRecord(event.payload.data) ? event.payload.data : {};
  const reference = paymentReference(data);
  if (!reference) return { status: 'rejected', note: 'payload has no data.tx_ref' };

  const located = await findIntent(deps.topology, reference);
  if (!located) {
    log.warn({ paymentRef: reference }, 'webhook references an unknown payment intent');
    return { status: 'rejected', note: 'unknown payment reference' };
  }
  const { scope, row: intent } = located;
  if (intent.status === 'paid') return { status: 'processed', note: 'charge already applied' };

  // Cross-check what Flutterwave says it collected against what we asked for
  // (amount is decimal major units → convert to integer cents, plus currency)
  // before any state changes.
  let matches = true;
  if (typeof data.amount === 'number') matches = toMinorUnits(data.amount) === intent.amount_cents;
  if (matches && typeof data.currency === 'string' && data.currency.length > 0) {
    matches = data.currency.toLowerCase() === intent.currency.toLowerCase();
  }
  if (matches && typeof data.amount !== 'number') {
    const verified = await createPaymentProvider(deps.env).verify(reference);
    matches = verified.ok && (verified.amountCents === undefined || verified.amountCents === intent.amount_cents);
  }
  if (!matches) {
    await deps.topology.shardDb(scope).query(
      "UPDATE payment_intents SET status = 'failed', updated_at = now() WHERE id = $1 AND team_id = $2 AND status = 'pending'",
      [intent.id, scope.teamId],
    );
    log.warn({ paymentRef: reference }, 'webhook rejected: amount or currency mismatch');
    return { status: 'rejected', note: 'amount or currency does not match the payment intent' };
  }

  const notified = await deps.topology.shardDb(scope).tx((tx) => applyChargeInTx(tx, scope, intent));
  if (notified) await deps.queue.add(PUSH_QUEUE, {}, { attempts: 5 });
  return { status: 'processed', note: `charge ${intent.reference} applied` };
}

/**
 * The one transaction that turns a verified payment into money facts: intent →
 * paid, subscription advanced (upgrades now, downgrades parked as pending),
 * ledger row appended, owner notified. Retries are harmless: the intent is
 * locked and checked, and the ledger `ref` is unique.
 */
async function applyChargeInTx(tx: Queryable, scope: TeamScope, intent: PaymentIntentRow): Promise<boolean> {
  const locked = await tx.one<PaymentIntentRow>(
    'SELECT * FROM payment_intents WHERE id = $1 AND team_id = $2 FOR UPDATE',
    [intent.id, scope.teamId],
  );
  if (!locked || locked.status === 'paid') return false;

  const now = new Date();
  const plan = await getPlan(tx, locked.plan_key);
  const facts = planFacts(plan);
  const seats = locked.seats;
  const extra = extraSeatsFor(facts, seats);
  const price = periodPriceCents(facts, seats);
  const sub = await getSubscription(tx, scope.teamId);
  const periodEnd = new Date(now.getTime() + PERIOD_DAYS * MS_PER_DAY);

  if (!sub) {
    await tx.query(
      `INSERT INTO subscriptions (team_id, plan_key, status, seats, extra_seats, period_start, period_end, next_amount_cents)
       VALUES ($1, $2, 'active', $3, $4, $5, $6, $7)
       ON CONFLICT (team_id) DO UPDATE SET
         plan_key = EXCLUDED.plan_key, status = 'active', seats = EXCLUDED.seats,
         extra_seats = EXCLUDED.extra_seats, period_start = EXCLUDED.period_start,
         period_end = EXCLUDED.period_end, next_amount_cents = EXCLUDED.next_amount_cents,
         grace_until = NULL, pending_plan_key = NULL, pending_seats = NULL, updated_at = now()`,
      [scope.teamId, locked.plan_key, seats, extra, now.toISOString(), periodEnd.toISOString(), price],
    );
  } else {
    const currentPlan = await getPlan(tx, sub.plan_key);
    const currentPrice = periodPriceCents(planFacts(currentPlan), sub.seats);
    const isDowngrade = price < currentPrice || (price === currentPrice && seats < sub.seats);
    const periodOver = new Date(sub.period_end).getTime() <= now.getTime();

    if (isDowngrade && !periodOver) {
      // PRD 6.5: downgrades and seat removals take effect at period end, no refund.
      await tx.query(
        `UPDATE subscriptions SET pending_plan_key = $1, pending_seats = $2, next_amount_cents = $3, updated_at = now()
          WHERE team_id = $4`,
        [locked.plan_key, seats, price, scope.teamId],
      );
    } else {
      const start = periodOver ? now : new Date(sub.period_start);
      const end = periodOver ? periodEnd : new Date(sub.period_end);
      await tx.query(
        `UPDATE subscriptions SET plan_key = $1, seats = $2, extra_seats = $3, period_start = $4, period_end = $5,
           next_amount_cents = $6, status = 'active', grace_until = NULL,
           pending_plan_key = NULL, pending_seats = NULL, updated_at = now()
          WHERE team_id = $7`,
        [locked.plan_key, seats, extra, start.toISOString(), end.toISOString(), price, scope.teamId],
      );
    }
  }

  await tx.query("UPDATE payment_intents SET status = 'paid', updated_at = now() WHERE id = $1 AND team_id = $2", [
    locked.id,
    scope.teamId,
  ]);

  const previous = sub ? `${sub.plan_key} (${sub.seats} seats)` : 'no previous subscription';
  await appendLedgerEntry(tx, scope, {
    kind: 'charge',
    amountCents: locked.amount_cents,
    ref: `pay:${locked.reference}`,
    reason: `${plan.name} plan, ${seats} seats, ${locked.amount_cents} cents; before: ${previous}`,
  });

  return notifyOwner(tx, scope, {
    kind: 'payment_success',
    url: 'rota://billing',
    reference: locked.reference,
    planKey: locked.plan_key,
    seats,
    amountCents: locked.amount_cents,
  }, 'Payment received', `Your ${plan.name} plan payment was received. The subscription is active.`);
}

async function applyChargeFailed(deps: AppDeps, event: WebhookEventRow, log: Logger): Promise<Outcome> {
  const data = isRecord(event.payload.data) ? event.payload.data : {};
  const reference = paymentReference(data);
  if (!reference) return { status: 'rejected', note: 'payload has no data.tx_ref' };

  const located = await findIntent(deps.topology, reference);
  if (!located) {
    log.warn({ paymentRef: reference }, 'failed-charge webhook references an unknown payment intent');
    return { status: 'rejected', note: 'unknown payment reference' };
  }
  const { scope, row: intent } = located;

  const notified = await deps.topology.shardDb(scope).tx(async (tx) => {
    await tx.query(
      "UPDATE payment_intents SET status = 'failed', updated_at = now() WHERE id = $1 AND team_id = $2 AND status = 'pending'",
      [intent.id, scope.teamId],
    );
    return notifyOwner(
      tx,
      scope,
      { kind: 'payment_failed', url: 'rota://billing', reference: intent.reference },
      'Payment failed',
      'Your latest payment did not go through. Open Billing to try again.',
    );
  });
  if (notified) await deps.queue.add(PUSH_QUEUE, {}, { attempts: 5 });
  return { status: 'processed', note: `charge ${intent.reference} failed` };
}

/** Owner-only urgent billing notice; returns false when there is no owner. */
async function notifyOwner(
  tx: Queryable,
  scope: TeamScope,
  data: Record<string, unknown>,
  title: string,
  body: string,
): Promise<boolean> {
  const owner = await tx.one<{ user_id: string }>(
    'SELECT user_id FROM team_members WHERE team_id = $1 AND role = $2 AND active = true',
    [scope.teamId, 'owner'],
  );
  if (!owner) return false;
  await tx.query(
    `INSERT INTO outbox (team_id, user_id, category, urgency, title, body, data)
     VALUES ($1, $2, 'billing', 'urgent', $3, $4, $5)`,
    [scope.teamId, owner.user_id, title, body, JSON.stringify(data)],
  );
  return true;
}

/* ------------------------------------------------------------------ */
/* renewals job                                                        */
/* ------------------------------------------------------------------ */

export interface RenewalResult {
  status: SubscriptionRow['status'];
  appliedPending: boolean;
  notified: boolean;
}

/**
 * Hourly sweep for periods that have ended (seat-billing-ledger skill):
 * pending downgrades/seat removals become effective (no refund), the quoted
 * next amount is recomputed from `plans`, and an unpaid period walks
 * active → past_due (5-day grace, reminders day 0/1/3/5) → restricted.
 *
 * There is no saved-authorization column in this schema, so this job cannot
 * charge a card itself; payment is collected through hosted checkout, and the
 * signature-verified webhook is what restores the subscription (Rule 01/02).
 */
export async function runRenewals(deps: AppDeps, log: Logger): Promise<void> {
  // Only one node may sweep at a time (ADR-0008): the job is self-scheduling on
  // every instance, so a Redis lock keeps concurrent sweeps from racing on the
  // same subscriptions. TTL covers a slow sweep; the sweep is idempotent anyway.
  const release = await deps.lock.acquire('billing:renewals', 5 * 60 * 1000);
  if (!release) {
    log.info('renewals sweep already running on another node — skipping');
    return;
  }
  try {
    for (const shard of deps.topology.shards) {
      const due = await shard.query<SubscriptionRow>(
        `SELECT * FROM subscriptions
          WHERE period_end <= now() AND status IN ('trialing', 'active', 'past_due', 'restricted')
          ORDER BY period_end ASC
          LIMIT 200`,
      );
      for (const row of due) {
        const scope = deps.topology.scopeFor(row.team_id);
        try {
          const result = await renewOne(deps, shard, scope);
          if (result) {
            log.info(
              { teamId: scope.teamId, status: result.status, appliedPending: result.appliedPending },
              'renewal handled',
            );
            if (result.notified) await deps.queue.add(PUSH_QUEUE, {}, { attempts: 5 });
          }
        } catch (error) {
          log.warn({ teamId: scope.teamId, err: error }, 'renewal failed');
        }
      }
    }
  } finally {
    await release();
  }
}

async function renewOne(
  deps: AppDeps,
  shard: Queryable,
  scope: TeamScope,
): Promise<RenewalResult | null> {
  let notified = false;

  const result = await shard.tx(async (tx) => {
    const sub = await getSubscription(tx, scope.teamId);
    if (!sub) return null;
    const now = Date.now();
    if (new Date(sub.period_end).getTime() > now) return null; // a payment already renewed it

    const applyPending = sub.pending_plan_key !== null || sub.pending_seats !== null;
    const planKey = sub.pending_plan_key ?? sub.plan_key;
    const seats = sub.pending_seats ?? sub.seats;
    const plan = await getPlan(tx, planKey);
    const facts = planFacts(plan);
    const extra = extraSeatsFor(facts, seats);
    const price = periodPriceCents(facts, seats);

    let status = sub.status;
    let graceUntil = sub.grace_until ? new Date(sub.grace_until) : null;
    if (status === 'trialing' || status === 'active') {
      status = 'past_due';
      graceUntil = graceUntil ?? new Date(now + GRACE_MS);
    }
    if (status === 'past_due' && graceUntil && graceUntil.getTime() <= now) {
      status = 'restricted';
    }

    await tx.query(
      `UPDATE subscriptions SET plan_key = $1, seats = $2, extra_seats = $3, next_amount_cents = $4,
         pending_plan_key = NULL, pending_seats = NULL, status = $5, grace_until = $6, updated_at = now()
        WHERE team_id = $7`,
      [
        planKey,
        seats,
        extra,
        price,
        status,
        graceUntil ? graceUntil.toISOString() : null,
        scope.teamId,
      ],
    );

    if (status === 'past_due' || status === 'restricted') {
      notified = await writeRenewalNotice(tx, scope, status, plan.name, graceUntil, now);
    }
    return { status, appliedPending: applyPending, notified } satisfies RenewalResult;
  });

  return result;
}

async function writeRenewalNotice(
  tx: Queryable,
  scope: TeamScope,
  status: RenewalResult['status'],
  planName: string,
  graceUntil: Date | null,
  now: number,
): Promise<boolean> {
  const owner = await tx.one<{ user_id: string }>(
    'SELECT user_id FROM team_members WHERE team_id = $1 AND role = $2 AND active = true',
    [scope.teamId, 'owner'],
  );
  if (!owner) return false;

  if (status === 'restricted') {
    if (await noticeExists(tx, scope.teamId, owner.user_id, 'subscription_restricted')) return false;
    await tx.query(
      `INSERT INTO outbox (team_id, user_id, category, urgency, title, body, data)
       VALUES ($1, $2, 'billing', 'urgent', $3, $4, $5)`,
      [
        scope.teamId,
        owner.user_id,
        'Subscription restricted',
        `Payment is overdue, so ${planName} is restricted. Open Billing to restore it.`,
        JSON.stringify({ kind: 'subscription_restricted', url: 'rota://billing' }),
      ],
    );
    return true;
  }

  if (!graceUntil) return false;
  const day = Math.floor((now - (graceUntil.getTime() - GRACE_MS)) / MS_PER_DAY);
  if (!REMINDER_DAYS.includes(day)) return false;
  if (await noticeExists(tx, scope.teamId, owner.user_id, 'renewal_grace', day)) return false;

  await tx.query(
    `INSERT INTO outbox (team_id, user_id, category, urgency, title, body, data)
     VALUES ($1, $2, 'billing', 'urgent', $3, $4, $5)`,
    [
      scope.teamId,
      owner.user_id,
      'Payment needed',
      `${planName} renewal is awaiting payment (grace day ${day} of ${GRACE_DAYS}). Open Billing to pay.`,
      JSON.stringify({ kind: 'renewal_grace', day, url: 'rota://billing' }),
    ],
  );
  return true;
}

async function noticeExists(
  tx: Queryable,
  teamId: string,
  userId: string,
  kind: string,
  day?: number,
): Promise<boolean> {
  const params: unknown[] = [teamId, userId, kind];
  let sql = `SELECT 1 AS present FROM outbox
              WHERE team_id = $1 AND user_id = $2 AND category = 'billing' AND data->>'kind' = $3`;
  if (day !== undefined) {
    params.push(String(day));
    sql += ` AND data->>'day' = $${params.length}`;
  }
  return (await tx.one(sql, params)) !== undefined;
}
