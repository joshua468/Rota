import type { Plan, Subscription } from '@rota/contract';
import { ApiError } from '../lib/errors';
import type { Queryable } from '../db/types';
import { getPlan, type PlanRow, type SubscriptionRow } from './entitlements';
import { periodPriceCents, planFacts } from './proration';

/** Shapes a `plans` row for the contract; anything outside USD is a server bug. */
export function toPlanContract(row: PlanRow): Plan {
  if (row.currency !== 'USD') {
    throw new ApiError('INTERNAL', 500, `plan ${row.key} has an unsupported currency`);
  }
  return {
    key: row.key,
    name: row.name,
    priceCents: row.price_cents,
    currency: 'USD',
    includedSeats: row.included_seats,
    extraSeatCents: row.extra_seat_cents,
    maxSeats: row.max_seats,
  };
}

/**
 * The quoted `nextAmountCents` follows what the team will actually owe: a
 * pending downgrade/seat removal waits for period end, so the quote already
 * uses the pending plan and seat count (PRD 6.5 business rules).
 */
export async function buildSubscription(db: Queryable, row: SubscriptionRow): Promise<Subscription> {
  const currentPlan = await getPlan(db, row.plan_key);
  const targetPlan = row.pending_plan_key ? await getPlan(db, row.pending_plan_key) : currentPlan;
  const targetSeats = row.pending_seats ?? row.seats;
  return {
    teamId: row.team_id,
    planKey: row.plan_key,
    status: row.status,
    seats: row.seats,
    extraSeats: row.extra_seats,
    periodStart: new Date(row.period_start).toISOString(),
    periodEnd: new Date(row.period_end).toISOString(),
    nextAmountCents: periodPriceCents(planFacts(targetPlan), targetSeats),
    graceUntil: row.grace_until ? new Date(row.grace_until).toISOString() : null,
    pendingPlanKey: row.pending_plan_key,
    pendingSeats: row.pending_seats,
  };
}
