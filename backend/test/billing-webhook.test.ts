import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestContext, resetDatabases, type TestContext } from './helpers/app';
import {
  createTeamWithOwner,
  depsOf,
  errorCode,
  seedIntent,
  seedSubscription,
  shardOf,
} from './helpers/billing';
import { WEBHOOK_QUEUE, reconcileWebhookEvents, registerBillingJobs } from '../src/jobs/billing';
import { createLogger } from '../src/lib/logger';

/**
 * Flutterwave webhook end to end (webhook-idempotency skill): a `verif-hash`
 * header compared in constant time, dedupe by (provider, event_key), and the
 * `webhooks` job performs the guarded state changes — intent → paid,
 * subscription, append-only ledger, owner notice — exactly once no matter how
 * often the event is delivered. Flutterwave amounts are decimal major units
 * (e.g. 20.00 USD), so 20 maps to the 2000-cent intent.
 */

let ctx: TestContext;

beforeAll(async () => {
  ctx = await createTestContext();
  registerBillingJobs(ctx.queue, depsOf(ctx));
});

beforeEach(async () => {
  await resetDatabases(ctx);
});

afterAll(async () => {
  // the renewals handler reschedules itself with a 1h delay; drop it first
  await ctx.queue.close();
  await ctx.close();
});

interface PostResult {
  statusCode: number;
  body: string;
  json(): unknown;
}

async function postWebhook(payload: unknown, opts: { signature?: string } = {}): Promise<PostResult> {
  const raw = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const signature = opts.signature ?? ctx.env.FLUTTERWAVE_SECRET_HASH;
  return ctx.app.inject({
    method: 'POST',
    url: '/v1/webhooks/flutterwave',
    headers: { 'content-type': 'application/json', 'verif-hash': signature },
    payload: raw,
  });
}

async function drainJobs(): Promise<void> {
  await ctx.queue.drain(10_000);
}

interface EventRow {
  id: string;
  event_key: string;
  status: 'received' | 'processed' | 'rejected';
  note: string | null;
}

async function events(): Promise<EventRow[]> {
  return ctx.topology.global.query<EventRow>('SELECT id, event_key, status, note FROM webhook_events ORDER BY created_at');
}

interface IntentRow {
  status: 'pending' | 'paid' | 'failed';
  amount_cents: number;
}

async function intent(teamId: string, reference: string): Promise<IntentRow | undefined> {
  return shardOf(ctx, teamId).one<IntentRow>(
    'SELECT status, amount_cents FROM payment_intents WHERE team_id = $1 AND reference = $2',
    [teamId, reference],
  );
}

async function ledger(teamId: string) {
  return shardOf(ctx, teamId).query<{ kind: string; amount_cents: number; ref: string }>(
    'SELECT kind, amount_cents, ref FROM ledger_entries WHERE team_id = $1 ORDER BY created_at, id',
    [teamId],
  );
}

async function notices(teamId: string) {
  return shardOf(ctx, teamId).query<{
    user_id: string;
    category: string;
    urgency: string;
    data: Record<string, unknown>;
  }>('SELECT user_id, category, urgency, data FROM outbox WHERE team_id = $1 ORDER BY created_at, id', [teamId]);
}

async function subscription(teamId: string) {
  return shardOf(ctx, teamId).one<{
    plan_key: string;
    seats: number;
    status: string;
    pending_plan_key: string | null;
    pending_seats: number | null;
    next_amount_cents: number;
    period_start: Date;
    period_end: Date;
  }>('SELECT * FROM subscriptions WHERE team_id = $1', [teamId]);
}

/** A successful card charge in Flutterwave's `charge.completed` shape. */
function chargeCompleted(data: Record<string, unknown>) {
  return { event: 'charge.completed', data: { status: 'successful', currency: 'USD', ...data } };
}

describe('webhook signature verification', () => {
  it('rejects a missing or wrong verif-hash', async () => {
    const raw = JSON.stringify({ event: 'charge.completed', data: { id: 'e1', tx_ref: 'r1', amount: 100 } });
    const missing = await ctx.app.inject({
      method: 'POST',
      url: '/v1/webhooks/flutterwave',
      headers: { 'content-type': 'application/json' },
      payload: raw,
    });
    expect(missing.statusCode).toBe(401);
    expect(errorCode(missing.json())).toBe('UNAUTHORIZED');

    const wrong = await postWebhook(raw, { signature: 'not-the-right-hash' });
    expect(wrong.statusCode).toBe(401);
    expect(errorCode(wrong.json())).toBe('UNAUTHORIZED');
  });

  it('accepts a correctly signed payload', async () => {
    const res = await postWebhook({ event: 'customer.updated', data: { id: 'evt_ok' } });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ received: true });
    await drainJobs();
    const rows = await events();
    expect(rows).toHaveLength(1);
    expect(rows[0]?.status).toBe('processed');
  });

  it('rejects malformed JSON even with a valid signature', async () => {
    const res = await postWebhook('{"event":');
    expect(res.statusCode).toBe(400);
    expect(errorCode(res.json())).toBe('VALIDATION_FAILED');
    expect(await events()).toHaveLength(0);
  });

  it('rejects a payload without an event type', async () => {
    const res = await postWebhook({ data: { id: 'evt_no_type' } });
    expect(res.statusCode).toBe(400);
    expect(errorCode(res.json())).toBe('VALIDATION_FAILED');
  });
});

describe('webhook deduplication', () => {
  it('stores one inbox row for repeated deliveries of the same event', async () => {
    const payload = chargeCompleted({ id: 'evt_dupe', tx_ref: 'pay_dupe', amount: 0 });
    const first = await postWebhook(payload);
    const second = await postWebhook(payload);
    const third = await postWebhook(payload);
    expect([first.statusCode, second.statusCode, third.statusCode]).toEqual([200, 200, 200]);
    await drainJobs();

    expect(await events()).toHaveLength(1);
    // no intent exists for this reference, so the job settles it as rejected
    expect((await events())[0]?.status).toBe('rejected');
  });

  it('requeues a duplicate that is still received (crash between insert and enqueue)', async () => {
    const payload = chargeCompleted({ id: 'evt_crash', tx_ref: 'pay_crash', amount: 20 });
    await postWebhook(payload);
    await drainJobs();
    expect((await events())[0]?.status).toBe('rejected');

    // Simulate the first delivery dying before its job could process it.
    await ctx.topology.global.query("UPDATE webhook_events SET status = 'received', processed_at = NULL");
    const redelivery = await postWebhook(payload);
    expect(redelivery.statusCode).toBe(200);
    await drainJobs();

    expect(await events()).toHaveLength(1);
    expect((await events())[0]?.status).toBe('rejected');
  });

  it('rolls the inbox row back when the queue is unavailable, so a retry can insert it', async () => {
    const add = vi.spyOn(ctx.queue, 'add').mockRejectedValueOnce(new Error('redis down'));
    try {
      const res = await postWebhook(chargeCompleted({ id: 'evt_queue_down', tx_ref: 'pay_queue_down', amount: 20 }));
      expect(res.statusCode).toBe(500);
    } finally {
      add.mockRestore();
    }
    expect(await events()).toHaveLength(0);
  });

  it('reconciliation re-enqueues events left in received', async () => {
    await ctx.topology.global.query(
      `INSERT INTO webhook_events (provider, event_key, payload, status, created_at)
       VALUES ('flutterwave', 'charge.completed:evt_recon', '{"event":"charge.completed","data":{"id":"evt_recon","tx_ref":"pay_recon","status":"successful","amount":20}}', 'received', now() - interval '10 minutes')`,
    );
    const count = await reconcileWebhookEvents(depsOf(ctx), createLogger('silent'));
    expect(count).toBe(1);
    await drainJobs();
    expect((await events())[0]?.status).toBe('rejected');
  });
});

describe('charge.completed processing', () => {
  it('creates the subscription, pays the intent, appends one ledger row and notifies the owner', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    await seedIntent(ctx, teamId, {
      reference: 'pay_happy',
      amountCents: 2000,
      planKey: 'starter',
      seats: 5,
      createdBy: owner.id,
    });

    const res = await postWebhook(chargeCompleted({ id: 'evt_happy', tx_ref: 'pay_happy', amount: 20 }));
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ received: true });
    await drainJobs();

    const rows = await events();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ status: 'processed', event_key: 'charge.completed:evt_happy' });
    expect(rows[0]?.note).toContain('pay_happy');

    expect(await intent(teamId, 'pay_happy')).toMatchObject({ status: 'paid', amount_cents: 2000 });

    const sub = await subscription(teamId);
    expect(sub).toMatchObject({ plan_key: 'starter', seats: 5, status: 'active' });
    const periodMs = new Date(sub!.period_end).getTime() - new Date(sub!.period_start).getTime();
    expect(periodMs).toBe(30 * 86_400_000);

    const entries = await ledger(teamId);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({ kind: 'charge', amount_cents: 2000, ref: 'pay:pay_happy' });

    const rowsOut = await notices(teamId);
    expect(rowsOut).toHaveLength(1);
    expect(rowsOut[0]).toMatchObject({ user_id: owner.id, category: 'billing', urgency: 'urgent' });
    expect(rowsOut[0]?.data.kind).toBe('payment_success');
    expect(rowsOut[0]?.data.url).toBe('rota://billing');
  });

  it('cannot double-record on redelivery or a retried job', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    await seedIntent(ctx, teamId, {
      reference: 'pay_once',
      amountCents: 2000,
      planKey: 'starter',
      seats: 5,
      createdBy: owner.id,
    });
    const payload = chargeCompleted({ id: 'evt_once', tx_ref: 'pay_once', amount: 20 });

    await postWebhook(payload);
    await drainJobs();
    const before = await subscription(teamId);

    // HTTP-level redelivery: the inbox rejects it before a job is queued
    const redelivery = await postWebhook(payload);
    expect(redelivery.statusCode).toBe(200);
    await drainJobs();

    // job-level retry after a crash before the event was settled
    const row = (await events())[0];
    expect(row).toBeDefined();
    await ctx.topology.global.query("UPDATE webhook_events SET status = 'received', processed_at = NULL");
    await ctx.queue.add(WEBHOOK_QUEUE, { eventId: row!.id });
    await drainJobs();

    expect(await events()).toHaveLength(1);
    expect((await events())[0]?.status).toBe('processed');
    expect(await ledger(teamId)).toHaveLength(1);
    expect(await notices(teamId)).toHaveLength(1);
    expect(await intent(teamId, 'pay_once')).toMatchObject({ status: 'paid' });
    const after = await subscription(teamId);
    expect(after).toMatchObject({
      plan_key: before!.plan_key,
      seats: before!.seats,
      period_start: before!.period_start,
      period_end: before!.period_end,
    });
  });

  it('applies an upgrade immediately and keeps the billing period', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    await seedSubscription(ctx, teamId, { planKey: 'starter', seats: 5 });
    const before = await subscription(teamId);
    await seedIntent(ctx, teamId, {
      reference: 'pay_upgrade',
      amountCents: 2000,
      planKey: 'team',
      seats: 15,
      createdBy: owner.id,
    });

    await postWebhook(chargeCompleted({ id: 'evt_upgrade', tx_ref: 'pay_upgrade', amount: 20 }));
    await drainJobs();

    expect(await subscription(teamId)).toMatchObject({
      plan_key: 'team',
      seats: 15,
      status: 'active',
      pending_plan_key: null,
      pending_seats: null,
      period_start: before!.period_start,
      period_end: before!.period_end,
    });
    expect(await ledger(teamId)).toHaveLength(1);
  });

  it('parks a downgrade as pending until period end (PRD 6.5)', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    await seedSubscription(ctx, teamId, { planKey: 'team', seats: 15, nextAmountCents: 5000 });
    const before = await subscription(teamId);
    await seedIntent(ctx, teamId, {
      reference: 'pay_downgrade',
      amountCents: 0,
      planKey: 'starter',
      seats: 5,
      createdBy: owner.id,
    });

    await postWebhook(chargeCompleted({ id: 'evt_downgrade', tx_ref: 'pay_downgrade', amount: 0 }));
    await drainJobs();

    const sub = await subscription(teamId);
    expect(sub).toMatchObject({
      plan_key: 'team',
      seats: 15,
      status: 'active',
      pending_plan_key: 'starter',
      pending_seats: 5,
      next_amount_cents: 2000, // quoted from the pending plan
      period_start: before!.period_start,
      period_end: before!.period_end,
    });
    expect(await intent(teamId, 'pay_downgrade')).toMatchObject({ status: 'paid' });
    expect(await ledger(teamId)).toHaveLength(1);
  });
});

describe('charge.completed rejections', () => {
  it('rejects an amount that does not match the payment intent', async () => {
    const { teamId } = await createTeamWithOwner(ctx);
    await seedIntent(ctx, teamId, { reference: 'pay_wrong_amount', amountCents: 2000, planKey: 'starter', seats: 5 });

    await postWebhook(chargeCompleted({ id: 'evt_amt', tx_ref: 'pay_wrong_amount', amount: 30 }));
    await drainJobs();

    expect((await events())[0]).toMatchObject({ status: 'rejected' });
    expect(await intent(teamId, 'pay_wrong_amount')).toMatchObject({ status: 'failed' });
    expect(await ledger(teamId)).toHaveLength(0);
    expect(await subscription(teamId)).toBeUndefined();
    expect(await notices(teamId)).toHaveLength(0);
  });

  it('rejects a currency that does not match the payment intent', async () => {
    const { teamId } = await createTeamWithOwner(ctx);
    await seedIntent(ctx, teamId, { reference: 'pay_wrong_ccy', amountCents: 2000, planKey: 'starter', seats: 5 });

    await postWebhook({ event: 'charge.completed', data: { id: 'evt_ccy', tx_ref: 'pay_wrong_ccy', status: 'successful', amount: 20, currency: 'NGN' } });
    await drainJobs();

    expect((await events())[0]?.status).toBe('rejected');
    expect(await intent(teamId, 'pay_wrong_ccy')).toMatchObject({ status: 'failed' });
    expect(await ledger(teamId)).toHaveLength(0);
  });

  it('rejects an unknown payment reference', async () => {
    await postWebhook(chargeCompleted({ id: 'evt_ghost', tx_ref: 'pay_does_not_exist', amount: 20 }));

    await drainJobs();

    const row = (await events())[0];
    expect(row?.status).toBe('rejected');
    expect(row?.note).toContain('unknown payment reference');
  });

  it('fails closed when the payload carries no amount to verify', async () => {
    const { teamId } = await createTeamWithOwner(ctx);
    await seedIntent(ctx, teamId, { reference: 'pay_no_amount', amountCents: 2000, planKey: 'starter', seats: 5 });

    await postWebhook({ event: 'charge.completed', data: { id: 'evt_no_amt', tx_ref: 'pay_no_amount', status: 'successful' } });
    await drainJobs();

    expect((await events())[0]?.status).toBe('rejected');
    expect(await intent(teamId, 'pay_no_amount')).toMatchObject({ status: 'failed' });
    expect(await ledger(teamId)).toHaveLength(0);
  });
});

describe('failed and unknown events', () => {
  it('records a failed charge without touching the subscription', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    await seedIntent(ctx, teamId, { reference: 'pay_bust', amountCents: 2000, planKey: 'starter', seats: 5 });

    await postWebhook({ event: 'charge.completed', data: { id: 'evt_bust', tx_ref: 'pay_bust', status: 'failed' } });
    await drainJobs();

    expect((await events())[0]?.status).toBe('processed');
    expect(await intent(teamId, 'pay_bust')).toMatchObject({ status: 'failed' });
    expect(await subscription(teamId)).toBeUndefined();
    expect(await ledger(teamId)).toHaveLength(0);

    const rowsOut = await notices(teamId);
    expect(rowsOut).toHaveLength(1);
    expect(rowsOut[0]).toMatchObject({ user_id: owner.id, category: 'billing', urgency: 'urgent' });
    expect(rowsOut[0]?.data.kind).toBe('payment_failed');
  });

  it('ignores a charge.completed event with an unrecognised status', async () => {
    await postWebhook({ event: 'charge.completed', data: { id: 'evt_pending', tx_ref: 'pay_pending', status: 'pending' } });
    await drainJobs();

    const row = (await events())[0];
    expect(row?.status).toBe('processed');
    expect(row?.note).toContain('ignored charge.completed');
  });

  it('settles unknown event types as ignored', async () => {
    await postWebhook({ event: 'charge.refunded', data: { id: 'evt_unknown' } });
    await drainJobs();

    const row = (await events())[0];
    expect(row?.status).toBe('processed');
    expect(row?.note).toContain('ignored');
  });
});
