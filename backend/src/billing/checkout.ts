import type { PlanKey } from '@rota/contract';
import type { AppDeps } from '../app';
import type { Queryable, TeamScope } from '../db/types';
import { conflict, planUpgradeRequiredError, seatLimit } from '../lib/errors';
import { newId } from '../lib/ids';
import { getPlan, getSubscription, seatUsage, type SubscriptionRow } from './entitlements';
import { createPaymentProvider, type PaymentProvider } from './flutterwave';
import {
  MS_PER_DAY,
  PERIOD_DAYS,
  computeProration,
  planFacts,
  type PlanFacts,
  type Proration,
} from './proration';

export interface CheckoutBody {
  planKey: PlanKey;
  seats: number;
  callbackUrl?: string | undefined;
}

export interface CheckoutInput {
  scope: TeamScope;
  userId: string;
  email: string;
  body: CheckoutBody;
}

export interface CheckoutResult {
  url: string;
  reference: string;
  amountCents: number;
  proration: Proration;
}

interface Prepared {
  reference: string;
  amountCents: number;
  proration: Proration;
}

/**
 * Creates a payment intent and starts hosted checkout (ADR-0007). Money facts
 * come from the `plans` table only (Rule 02), seats are validated against the
 * live roster inside a transaction, and nothing here changes subscription
 * state — only the signature-verified webhook may do that (Rule 01).
 */
export async function createCheckout(deps: AppDeps, input: CheckoutInput): Promise<CheckoutResult> {
  const db = deps.topology.shardDb(input.scope);
  const provider: PaymentProvider = createPaymentProvider(deps.env);

  const prepared = await db.tx((tx) => prepare(tx, input));

  let authorizationUrl: string;
  try {
    const result = await provider.authorize({
      reference: prepared.reference,
      amountCents: prepared.amountCents,
      email: input.email,
      callbackUrl: input.body.callbackUrl,
    });
    authorizationUrl = result.authorizationUrl;
  } catch (error) {
    await db.query("UPDATE payment_intents SET status = 'failed', updated_at = now() WHERE reference = $1 AND team_id = $2", [
      prepared.reference,
      input.scope.teamId,
    ]);
    throw error;
  }

  await db.query(
    'UPDATE payment_intents SET authorization_url = $1, updated_at = now() WHERE reference = $2 AND team_id = $3',
    [authorizationUrl, prepared.reference, input.scope.teamId],
  );

  return {
    url: authorizationUrl,
    reference: prepared.reference,
    amountCents: prepared.amountCents,
    proration: prepared.proration,
  };
}

async function prepare(tx: Queryable, input: CheckoutInput): Promise<Prepared> {
  const { scope, body } = input;
  const now = new Date();

  const nextPlan = await getPlan(tx, body.planKey);
  const target = planFacts(nextPlan);

  if (target.extraSeatCents === null && body.seats > target.includedSeats) {
    throw planUpgradeRequiredError(
      `The ${target.name} plan includes ${target.includedSeats} seats. Upgrade to add more people.`,
    );
  }
  if (body.seats > target.maxSeats) {
    throw seatLimit(`The ${target.name} plan allows at most ${target.maxSeats} seats.`);
  }

  const subscription = await getSubscription(tx, scope.teamId);

  if (
    subscription &&
    !subscription.pending_plan_key &&
    subscription.pending_seats === null &&
    subscription.plan_key === body.planKey &&
    subscription.seats === body.seats &&
    (subscription.status === 'active' || subscription.status === 'trialing')
  ) {
    throw conflict(
      `Already on ${subscription.plan_key} with ${subscription.seats} seats — there is nothing to change.`,
    );
  }

  const usage = await seatUsage(tx, scope.teamId);
  if (body.seats < usage.used) {
    throw seatLimit(
      `${usage.used} seat${usage.used === 1 ? '' : 's'} already in use (active members and open invites); cannot check out for ${body.seats}.`,
    );
  }

  const proration = await priceChange(tx, subscription, { plan: target, seats: body.seats }, now);

  const reference = `co_${newId()}`;
  const inserted = await tx.one<{ id: string }>(
    `INSERT INTO payment_intents (team_id, reference, amount_cents, currency, plan_key, seats, created_by)
     VALUES ($1, $2, $3, 'USD', $4, $5, $6)
     RETURNING id`,
    [scope.teamId, reference, proration.chargeCents, body.planKey, body.seats, input.userId],
  );
  if (!inserted) throw conflict('Could not create a payment intent for this checkout.');

  return { reference, amountCents: proration.chargeCents, proration };
}

/**
 * PRD 6.5 pricing against the team's *current* paid entitlement. A period that
 * has already ended has no remaining days to credit, so the window is treated
 * as fresh: a renewal checkout therefore charges a full period price.
 */
async function priceChange(
  tx: Queryable,
  subscription: SubscriptionRow | undefined,
  next: { plan: PlanFacts; seats: number },
  now: Date,
): Promise<Proration> {
  const periodStart = subscription ? new Date(subscription.period_start) : now;
  const periodEnd = subscription
    ? new Date(subscription.period_end)
    : new Date(now.getTime() + PERIOD_DAYS * MS_PER_DAY);
  const hasRemaining = periodEnd.getTime() > now.getTime();

  const current =
    subscription && hasRemaining
      ? { plan: planFacts(await getPlan(tx, subscription.plan_key)), seats: subscription.seats }
      : null;

  return computeProration({
    current,
    next,
    now,
    periodStart: hasRemaining ? periodStart : now,
    periodEnd: hasRemaining ? periodEnd : new Date(now.getTime() + PERIOD_DAYS * MS_PER_DAY),
  });
}
