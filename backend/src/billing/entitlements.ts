import type { PlanKey, SubscriptionStatus } from '@rota/contract';
import type { Queryable } from '../db/types';
import { ApiError, seatLimit, subscriptionRestricted } from '../lib/errors';

/**
 * Seat entitlements are server-derived (Rule 01/02): plan rows come from the
 * `plans` table, seat usage from active members plus unexpired invites, and the
 * decision is taken inside the caller's transaction so two racing invites cannot
 * both take the last seat.
 *
 * A team that has never subscribed behaves as a `starter` trial: included
 * seats only, no extras (Starter has no extra-seat price in `plans`).
 */
export interface SubscriptionRow {
  team_id: string;
  plan_key: PlanKey;
  status: SubscriptionStatus;
  seats: number;
  extra_seats: number;
  period_start: Date;
  period_end: Date;
  next_amount_cents: number;
  grace_until: Date | null;
  pending_plan_key: PlanKey | null;
  pending_seats: number | null;
}

export interface PlanRow {
  key: PlanKey;
  name: string;
  price_cents: number;
  currency: string;
  included_seats: number;
  extra_seat_cents: number | null;
  max_seats: number;
  active: boolean;
}

export interface Entitlements {
  plan: PlanRow;
  subscription: SubscriptionRow | null;
  status: SubscriptionStatus;
  seats: number;
  extraSeats: number;
  /** seats this team may hold: included + purchased extras */
  seatCap: number;
}

export async function getPlan(db: Queryable, key: PlanKey): Promise<PlanRow> {
  const plan = await db.one<PlanRow>('SELECT * FROM plans WHERE key = $1', [key]);
  if (!plan) throw new ApiError('INTERNAL', 500, `plan ${key} missing from plans table`);
  return plan;
}

export async function getSubscription(db: Queryable, teamId: string): Promise<SubscriptionRow | undefined> {
  return db.one<SubscriptionRow>('SELECT * FROM subscriptions WHERE team_id = $1 FOR UPDATE', [teamId]);
}

export async function entitlementsFor(db: Queryable, teamId: string): Promise<Entitlements> {
  const subscription = (await db.one<SubscriptionRow>('SELECT * FROM subscriptions WHERE team_id = $1', [
    teamId,
  ])) ?? null;
  const planKey: PlanKey = subscription?.plan_key ?? 'starter';
  const plan = await getPlan(db, planKey);
  const extraSeats = subscription?.extra_seats ?? 0;
  return {
    plan,
    subscription,
    status: subscription?.status ?? 'trialing',
    seats: subscription?.seats ?? plan.included_seats,
    extraSeats,
    seatCap: plan.included_seats + (plan.extra_seat_cents === null ? 0 : extraSeats),
  };
}

/**
 * The renewals job marks a team `restricted` once a payment has been overdue
 * through its grace period (see jobs/billing.ts). While restricted, the team is
 * read-only: booking, swapping and roster changes are refused with
 * `SUBSCRIPTION_RESTRICTED` (403) so the owner can restore access at checkout.
 * Reads and the billing routes themselves stay open, otherwise there would be
 * no way back. Called by write routes after their role check.
 */
export async function assertTeamWritable(db: Queryable, teamId: string): Promise<void> {
  const subscription = await db.one<{ status: SubscriptionStatus }>(
    'SELECT status FROM subscriptions WHERE team_id = $1',
    [teamId],
  );
  if (subscription?.status === 'restricted') throw subscriptionRestricted();
}

export interface SeatUsage {  members: number;
  invites: number;
  used: number;
  cap: number;
}

export async function seatUsage(db: Queryable, teamId: string): Promise<SeatUsage> {
  const members = await db.one<{ n: string }>(
    'SELECT count(*)::text AS n FROM team_members WHERE team_id = $1 AND active = true',
    [teamId],
  );
  const invites = await db.one<{ n: string }>(
    `SELECT count(*)::text AS n FROM invites
      WHERE team_id = $1 AND accepted_at IS NULL AND revoked_at IS NULL AND expires_at > now()`,
    [teamId],
  );
  const entitlements = await entitlementsFor(db, teamId);
  const used = Number(members?.n ?? 0) + Number(invites?.n ?? 0);
  return { members: Number(members?.n ?? 0), invites: Number(invites?.n ?? 0), used, cap: entitlements.seatCap };
}

/**
 * Guards an invite (or any operation that grows the roster). Runs against the
 * same transaction that will write the row, with the subscription locked.
 * Starter has no extra seats, so going past `included` asks for an upgrade.
 */
export async function assertSeatAvailable(tx: Queryable, teamId: string, additional = 1): Promise<void> {
  const subscription = await getSubscription(tx, teamId);
  const planKey: PlanKey = subscription?.plan_key ?? 'starter';
  const plan = await getPlan(tx, planKey);
  const extraSeats = subscription?.extra_seats ?? 0;
  const cap = plan.included_seats + (plan.extra_seat_cents === null ? 0 : extraSeats);

  const members = await tx.one<{ n: string }>(
    'SELECT count(*)::text AS n FROM team_members WHERE team_id = $1 AND active = true',
    [teamId],
  );
  const invites = await tx.one<{ n: string }>(
    `SELECT count(*)::text AS n FROM invites
      WHERE team_id = $1 AND accepted_at IS NULL AND revoked_at IS NULL AND expires_at > now()`,
    [teamId],
  );
  const used = Number(members?.n ?? 0) + Number(invites?.n ?? 0);
  if (used + additional <= cap) return;

  if (plan.extra_seat_cents === null) {
    // Starter has no extras: the 6th seat is a 402 SEAT_LIMIT with an upgrade
    // hint (skills/seat-billing-ledger).
    throw seatLimit(`The ${plan.name} plan includes ${plan.included_seats} seats. Upgrade your plan to add more people.`);
  }
  if (used + additional > plan.max_seats) {
    throw seatLimit(`This plan allows at most ${plan.max_seats} seats.`);
  }
  throw seatLimit(`Seat limit reached (${used}/${cap}). Add seats at checkout.`);
}
