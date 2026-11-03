import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import type { PlanKey } from '@rota/contract';
import {
  MS_PER_DAY,
  PERIOD_DAYS,
  computeProration,
  extraSeatsFor,
  periodPriceCents,
  planFacts,
  type Entitlement,
  type PlanFacts,
} from '../src/billing/proration';
import type { PlanRow } from '../src/billing/entitlements';
import { createTestContext, resetDatabases, type TestContext } from './helpers/app';

/**
 * Proration arithmetic (Rule 02, PRD 6.5, proration skill): every case reads
 * the plan facts from the `plans` table — never a hardcoded price — and checks
 * the exact integer-cent results of
 *   daysRemaining = periodDays - floor(elapsed / day)
 *   credit/cost   = floor(price * days / periodDays)
 *   charge        = max(0, cost - credit)
 */

let ctx: TestContext;
const facts = new Map<PlanKey, PlanFacts>();

const PERIOD_START = new Date('2026-03-01T00:00:00.000Z');
const PERIOD_END = new Date(PERIOD_START.getTime() + PERIOD_DAYS * MS_PER_DAY);

/** `now` exactly `day` days into the period. */
function at(day: number, msIntoDay = 0): Date {
  return new Date(PERIOD_START.getTime() + day * MS_PER_DAY + msIntoDay);
}

function plan(key: PlanKey): PlanFacts {
  const found = facts.get(key);
  if (!found) throw new Error(`plan ${key} missing from the database`);
  return found;
}

function entitlement(key: PlanKey, seats: number): Entitlement {
  return { plan: plan(key), seats };
}

beforeAll(async () => {
  ctx = await createTestContext();
  const rows = await ctx.topology.global.query<PlanRow>('SELECT * FROM plans ORDER BY key');
  for (const row of rows) facts.set(row.key, planFacts(row));
});

beforeEach(async () => {
  await resetDatabases(ctx);
});

afterAll(async () => {
  await ctx.close();
});

describe('plan facts come from the plans table', () => {
  it('loads every active plan with its seed values', () => {
    expect([...facts.keys()].sort()).toEqual(['business', 'starter', 'team']);
    expect(plan('starter')).toMatchObject({ priceCents: 2000, includedSeats: 5, extraSeatCents: null, maxSeats: 5 });
    expect(plan('team')).toMatchObject({ priceCents: 5000, includedSeats: 15, extraSeatCents: 300, maxSeats: 100 });
    expect(plan('business')).toMatchObject({
      priceCents: 12000,
      includedSeats: 40,
      extraSeatCents: 200,
      maxSeats: 500,
    });
  });

  it('charges nothing for seats a plan already includes', () => {
    expect(extraSeatsFor(plan('starter'), 5)).toBe(0);
    expect(extraSeatsFor(plan('starter'), 1)).toBe(0);
    expect(extraSeatsFor(plan('team'), 16)).toBe(1);
    expect(extraSeatsFor(plan('team'), 10)).toBe(0);
    expect(extraSeatsFor(plan('business'), 45)).toBe(5);
  });

  it('prices a full period as base plus paid extra seats', () => {
    expect(periodPriceCents(plan('starter'), 5)).toBe(2000);
    // Starter has no extra-seat price, so extra seats cannot add cost
    expect(periodPriceCents(plan('starter'), 6)).toBe(2000);
    expect(periodPriceCents(plan('team'), 15)).toBe(5000);
    expect(periodPriceCents(plan('team'), 16)).toBe(5300);
    expect(periodPriceCents(plan('team'), 100)).toBe(5000 + 85 * 300);
    expect(periodPriceCents(plan('business'), 41)).toBe(12200);
    expect(periodPriceCents(plan('business'), 500)).toBe(12000 + 460 * 200);
  });
});

describe('computeProration — PRD 6.5 worked examples', () => {
  it('starter → team with 20 days remaining charges 2000', () => {
    const result = computeProration({
      current: entitlement('starter', 5),
      next: entitlement('team', 15),
      now: at(10),
      periodStart: PERIOD_START,
      periodEnd: PERIOD_END,
    });
    expect(result.daysRemaining).toBe(20);
    expect(result.creditCents).toBe(1333); // floor(2000 * 20 / 30)
    expect(result.costCents).toBe(3333); // floor(5000 * 20 / 30)
    expect(result.chargeCents).toBe(2000);
    expect(result.effective).toBe('now');
  });

  it('team 15 → 18 seats with 12 days remaining charges 360', () => {
    const result = computeProration({
      current: entitlement('team', 15),
      next: entitlement('team', 18),
      now: at(18),
      periodStart: PERIOD_START,
      periodEnd: PERIOD_END,
    });
    expect(result.daysRemaining).toBe(12);
    expect(result.creditCents).toBe(2000); // floor(5000 * 12 / 30)
    expect(result.costCents).toBe(2360); // floor(5900 * 12 / 30)
    expect(result.chargeCents).toBe(360);
    expect(result.effective).toBe('now');
  });
});

describe('computeProration — rounding', () => {
  it('floors credit and cost independently and never rounds the charge up', () => {
    const result = computeProration({
      current: entitlement('starter', 5),
      next: entitlement('team', 15),
      now: at(11), // 19 days left: 2000*19/30 = 1266.67, 5000*19/30 = 3166.67
      periodStart: PERIOD_START,
      periodEnd: PERIOD_END,
    });
    expect(result.daysRemaining).toBe(19);
    expect(result.creditCents).toBe(1266);
    expect(result.costCents).toBe(3166);
    expect(result.chargeCents).toBe(1900);
  });

  it('keeps extra-seat proration integral on the business plan', () => {
    const result = computeProration({
      current: entitlement('business', 40),
      next: entitlement('business', 45),
      now: at(20), // 10 days left
      periodStart: PERIOD_START,
      periodEnd: PERIOD_END,
    });
    expect(result.creditCents).toBe(4000); // floor(12000 * 10 / 30)
    expect(result.costCents).toBe(4333); // floor(13000 * 10 / 30)
    expect(result.chargeCents).toBe(333);
  });

  it('derives periodDays from the actual window (a one-day window uses 1)', () => {
    const oneDayEnd = new Date(PERIOD_START.getTime() + MS_PER_DAY);
    const result = computeProration({
      current: null,
      next: entitlement('team', 15),
      now: new Date(PERIOD_START.getTime() + 12 * 3_600_000),
      periodStart: PERIOD_START,
      periodEnd: oneDayEnd,
    });
    expect(result.daysRemaining).toBe(1);
    expect(result.costCents).toBe(5000);
  });
});

describe('computeProration — downgrades and seat removals', () => {
  it('charges nothing for a mid-period downgrade (credit exceeds cost)', () => {
    const result = computeProration({
      current: entitlement('team', 15),
      next: entitlement('starter', 5),
      now: at(10),
      periodStart: PERIOD_START,
      periodEnd: PERIOD_END,
    });
    expect(result.creditCents).toBe(3333);
    expect(result.costCents).toBe(1333);
    expect(result.chargeCents).toBe(0);
    expect(result.effective).toBe('period_end');
  });

  it('charges nothing when removing paid seats', () => {
    const result = computeProration({
      current: entitlement('team', 18),
      next: entitlement('team', 15),
      now: at(10),
      periodStart: PERIOD_START,
      periodEnd: PERIOD_END,
    });
    expect(result.chargeCents).toBe(0);
    expect(result.effective).toBe('period_end');
  });

  it('never produces a negative charge on the last day of a downgrade', () => {
    const result = computeProration({
      current: entitlement('team', 15),
      next: entitlement('starter', 5),
      now: at(29), // one day left
      periodStart: PERIOD_START,
      periodEnd: PERIOD_END,
    });
    expect(result.creditCents).toBe(166); // floor(5000 * 1 / 30)
    expect(result.costCents).toBe(66); // floor(2000 * 1 / 30)
    expect(result.chargeCents).toBe(0);
  });

  it('charges nothing for an identical plan and seat count mid-period', () => {
    const result = computeProration({
      current: entitlement('team', 15),
      next: entitlement('team', 15),
      now: at(10),
      periodStart: PERIOD_START,
      periodEnd: PERIOD_END,
    });
    expect(result.chargeCents).toBe(0);
    expect(result.creditCents).toBe(result.costCents);
    expect(result.effective).toBe('period_end');
  });
});

describe('computeProration — no current subscription', () => {
  it('charges the full next price at the start of a fresh period', () => {
    const result = computeProration({
      current: null,
      next: entitlement('team', 15),
      now: PERIOD_START,
      periodStart: PERIOD_START,
      periodEnd: PERIOD_END,
    });
    expect(result.creditCents).toBe(0);
    expect(result.costCents).toBe(5000);
    expect(result.chargeCents).toBe(5000);
    expect(result.effective).toBe('now');
  });

  it('scales the full price by the remaining days when the period is partly used', () => {
    const result = computeProration({
      current: null,
      next: entitlement('business', 40),
      now: at(15),
      periodStart: PERIOD_START,
      periodEnd: PERIOD_END,
    });
    expect(result.daysRemaining).toBe(15);
    expect(result.chargeCents).toBe(6000); // floor(12000 * 15 / 30)
  });
});

describe('computeProration — daysRemaining boundaries', () => {
  it('counts 30 days at the exact start', () => {
    const result = computeProration({
      current: entitlement('starter', 5),
      next: entitlement('starter', 5),
      now: PERIOD_START,
      periodStart: PERIOD_START,
      periodEnd: PERIOD_END,
    });
    expect(result.daysRemaining).toBe(30);
  });

  it('counts 29 days after one elapsed day', () => {
    const result = computeProration({
      current: entitlement('starter', 5),
      next: entitlement('starter', 5),
      now: at(1),
      periodStart: PERIOD_START,
      periodEnd: PERIOD_END,
    });
    expect(result.daysRemaining).toBe(29);
  });

  it('floors partial days: 29.9 days elapsed leaves 1 day', () => {
    const result = computeProration({
      current: entitlement('starter', 5),
      next: entitlement('starter', 5),
      now: at(29, 0.9 * MS_PER_DAY),
      periodStart: PERIOD_START,
      periodEnd: PERIOD_END,
    });
    expect(result.daysRemaining).toBe(1);
    expect(result.chargeCents).toBe(0); // same price both sides, one day left
  });

  it('hits zero exactly at period end and stays there', () => {
    const atEnd = computeProration({
      current: entitlement('team', 15),
      next: entitlement('business', 40),
      now: PERIOD_END,
      periodStart: PERIOD_START,
      periodEnd: PERIOD_END,
    });
    expect(atEnd.daysRemaining).toBe(0);
    expect(atEnd.chargeCents).toBe(0);

    const pastEnd = computeProration({
      current: entitlement('team', 15),
      next: entitlement('business', 40),
      now: new Date(PERIOD_END.getTime() + 5 * MS_PER_DAY),
      periodStart: PERIOD_START,
      periodEnd: PERIOD_END,
    });
    expect(pastEnd.daysRemaining).toBe(0);
    expect(pastEnd.chargeCents).toBe(0);
    expect(pastEnd.effective).toBe('period_end');
  });

  it('clamps to the full period when now is before period start', () => {
    const result = computeProration({
      current: entitlement('starter', 5),
      next: entitlement('team', 15),
      now: new Date(PERIOD_START.getTime() - 12 * 3_600_000),
      periodStart: PERIOD_START,
      periodEnd: PERIOD_END,
    });
    expect(result.daysRemaining).toBe(30);
    expect(result.chargeCents).toBe(3000); // floor(5000*30/30) - floor(2000*30/30)
  });
});

describe('computeProration — cross-plan upgrades', () => {
  it('starter → business at mid-period charges 5000', () => {
    const result = computeProration({
      current: entitlement('starter', 5),
      next: entitlement('business', 40),
      now: at(15),
      periodStart: PERIOD_START,
      periodEnd: PERIOD_END,
    });
    expect(result.creditCents).toBe(1000); // floor(2000 * 15 / 30)
    expect(result.costCents).toBe(6000); // floor(12000 * 15 / 30)
    expect(result.chargeCents).toBe(5000);
    expect(result.effective).toBe('now');
  });

  it('team → business at the start charges the price difference in full', () => {
    const result = computeProration({
      current: entitlement('team', 15),
      next: entitlement('business', 40),
      now: PERIOD_START,
      periodStart: PERIOD_START,
      periodEnd: PERIOD_END,
    });
    expect(result.creditCents).toBe(5000);
    expect(result.costCents).toBe(12000);
    expect(result.chargeCents).toBe(7000);
  });
});
