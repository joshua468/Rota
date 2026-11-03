import type { PlanKey } from '@rota/contract';
import type { PlanRow } from './entitlements';

/**
 * Proration (Rule 02, PRD 6.5, proration skill): pure integer-cent arithmetic
 * with `Math.floor` exactly as the PRD specifies. No I/O, no clock of its own,
 * no provider — the caller passes `now` and the server-derived period bounds.
 */

export const MS_PER_DAY = 86_400_000;
/** Billing periods are one calendar month expressed as 30 whole days. */
export const PERIOD_DAYS = 30;

export interface PlanFacts {
  key: PlanKey;
  name: string;
  priceCents: number;
  currency: string;
  includedSeats: number;
  extraSeatCents: number | null;
  maxSeats: number;
}

export interface Entitlement {
  plan: PlanFacts;
  seats: number;
}

export interface ProrationInput {
  /** what the team is paying for today; `null` when there is no period left */
  current: Entitlement | null;
  next: Entitlement;
  now: Date;
  periodStart: Date;
  periodEnd: Date;
}

export interface Proration {
  chargeCents: number;
  creditCents: number;
  costCents: number;
  daysRemaining: number;
  /** an upgrade or seat addition is charged now; a downgrade waits for period end */
  effective: 'now' | 'period_end';
}

export function planFacts(row: PlanRow): PlanFacts {
  return {
    key: row.key,
    name: row.name,
    priceCents: row.price_cents,
    currency: row.currency,
    includedSeats: row.included_seats,
    extraSeatCents: row.extra_seat_cents,
    maxSeats: row.max_seats,
  };
}

/** seats above `included` that this plan actually charges for (Starter has none). */
export function extraSeatsFor(plan: PlanFacts, seats: number): number {
  return Math.max(0, seats - plan.includedSeats);
}

/** price of one full period: base + paid extra seats, integer cents. */
export function periodPriceCents(plan: PlanFacts, seats: number): number {
  const extra = extraSeatsFor(plan, seats);
  return plan.priceCents + extra * (plan.extraSeatCents ?? 0);
}

/**
 * PRD 6.5:
 *   daysRemaining = periodDays - floor((now - periodStart) / 86_400_000), clamped
 *   credit = floor(currentPrice * daysRemaining / periodDays)
 *   cost   = floor(nextPrice     * daysRemaining / periodDays)
 *   charge = max(0, cost - credit)
 */
export function computeProration(input: ProrationInput): Proration {
  const periodMs = input.periodEnd.getTime() - input.periodStart.getTime();
  const periodDays = Math.max(1, Math.round(periodMs / MS_PER_DAY));
  const elapsedMs = input.now.getTime() - input.periodStart.getTime();
  const daysRemaining = Math.min(periodDays, Math.max(0, periodDays - Math.floor(elapsedMs / MS_PER_DAY)));

  const currentPrice = input.current ? periodPriceCents(input.current.plan, input.current.seats) : 0;
  const nextPrice = periodPriceCents(input.next.plan, input.next.seats);

  const creditCents = input.current ? Math.floor((currentPrice * daysRemaining) / periodDays) : 0;
  const costCents = Math.floor((nextPrice * daysRemaining) / periodDays);
  const chargeCents = Math.max(0, costCents - creditCents);

  return {
    chargeCents,
    creditCents,
    costCents,
    daysRemaining,
    effective: chargeCents > 0 ? 'now' : 'period_end',
  };
}
