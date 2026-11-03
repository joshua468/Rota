import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createTestContext, resetDatabases, type TestContext } from './helpers/app';
import {
  addMember,
  createTeam,
  createTeamWithOwner,
  depsOf,
  seedSubscription,
  signUp,
} from './helpers/billing';
import { RENEWALS_QUEUE, registerBillingJobs, runRenewals } from '../src/jobs/billing';
import { createLogger } from '../src/lib/logger';

/**
 * Renewal sweep (seat-billing-ledger skill): at period end pending changes
 * become effective and the next amount is recomputed from `plans`; an unpaid
 * period walks active → past_due (5-day grace, owner reminders on day 0/1/3)
 * → restricted, each notice deduped in the outbox. With no saved
 * authorization in the schema the sweep never charges a card — payment is
 * collected through checkout and applied by the webhook (Rule 01).
 */

const DAY_MS = 86_400_000;
const GRACE_MS = 5 * DAY_MS;

let ctx: TestContext;
const log = createLogger('silent');

beforeAll(async () => {
  ctx = await createTestContext();
  registerBillingJobs(ctx.queue, depsOf(ctx));
});

beforeEach(async () => {
  await resetDatabases(ctx);
});

afterAll(async () => {
  await ctx.queue.close();
  await ctx.close();
});

async function sweep(): Promise<void> {
  await runRenewals(depsOf(ctx), log);
}

interface SubRow {
  plan_key: string;
  seats: number;
  extra_seats: number;
  status: string;
  next_amount_cents: number;
  grace_until: Date | null;
  pending_plan_key: string | null;
  pending_seats: number | null;
  period_end: Date;
}

async function subRow(teamId: string): Promise<SubRow | undefined> {
  const db = ctx.topology.shardDb(ctx.topology.scopeFor(teamId));
  return db.one<SubRow>(
    `SELECT plan_key, seats, extra_seats, status, next_amount_cents, grace_until,
            pending_plan_key, pending_seats, period_end
       FROM subscriptions WHERE team_id = $1`,
    [teamId],
  );
}

interface NoticeRow {
  user_id: string;
  category: string;
  urgency: string;
  data: Record<string, unknown>;
}

async function notices(teamId: string): Promise<NoticeRow[]> {
  const db = ctx.topology.shardDb(ctx.topology.scopeFor(teamId));
  return db.query<NoticeRow>(
    'SELECT user_id, category, urgency, data FROM outbox WHERE team_id = $1 ORDER BY created_at, id',
    [teamId],
  );
}

/** An overdue subscription: period ended one hour ago. */
function overdueSeed(overrides: NonNullable<Parameters<typeof seedSubscription>[2]> = {}) {
  const now = Date.now();
  return {
    planKey: 'team' as const,
    seats: 15,
    status: 'active' as const,
    periodStart: new Date(now - 35 * DAY_MS),
    periodEnd: new Date(now - 3_600_000),
    nextAmountCents: 5000,
    ...overrides,
  };
}

describe('renewal sweep — current periods', () => {
  it('leaves a subscription whose period is still running untouched', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    await seedSubscription(ctx, teamId, { planKey: 'starter', seats: 5, nextAmountCents: 2000 });

    await sweep();

    const sub = await subRow(teamId);
    expect(sub).toMatchObject({
      plan_key: 'starter',
      seats: 5,
      status: 'active',
      grace_until: null,
      pending_plan_key: null,
      next_amount_cents: 2000,
    });
    expect(await notices(teamId)).toHaveLength(0);
    expect((await notices(teamId)).find((n) => n.user_id === owner.id)).toBeUndefined();
  });
});

describe('renewal sweep — unpaid periods', () => {
  it('moves active → past_due with a five-day grace window, recomputes the quote and sends the day-0 notice', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    await seedSubscription(ctx, teamId, overdueSeed({ nextAmountCents: 99_999 }));

    await sweep();

    const sub = await subRow(teamId);
    expect(sub?.status).toBe('past_due');
    expect(sub?.next_amount_cents).toBe(5000); // from plans, not the stored quote
    const now = Date.now();
    const grace = new Date(sub!.grace_until!).getTime();
    expect(grace).toBeGreaterThanOrEqual(now + GRACE_MS - 5_000);
    expect(grace).toBeLessThanOrEqual(now + GRACE_MS + 5_000);

    const rows = await notices(teamId);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ user_id: owner.id, category: 'billing', urgency: 'urgent' });
    expect(rows[0]?.data.kind).toBe('renewal_grace');
    expect(rows[0]?.data.day).toBe(0);
    expect(rows[0]?.data.url).toBe('rota://billing');
  });

  it('does not repeat the reminder for the same grace day', async () => {
    const { teamId } = await createTeamWithOwner(ctx);
    await seedSubscription(ctx, teamId, overdueSeed());

    await sweep();
    await sweep();

    expect(await notices(teamId)).toHaveLength(1);
    expect((await subRow(teamId))?.status).toBe('past_due');
  });

  it('sends a distinct reminder when grace reaches day 1', async () => {
    const { teamId } = await createTeamWithOwner(ctx);
    await seedSubscription(ctx, teamId, overdueSeed());

    await sweep();
    // one hour inside the one-day boundary so the day index cannot regress
    const db = ctx.topology.shardDb(ctx.topology.scopeFor(teamId));
    await db.query("UPDATE subscriptions SET grace_until = now() + interval '4 days' - interval '1 hour' WHERE team_id = $1", [
      teamId,
    ]);
    await sweep();

    const rows = await notices(teamId);
    expect(rows).toHaveLength(2);
    const days = rows.map((r) => Number(r.data.day)).sort();
    expect(days).toEqual([0, 1]);
    expect(rows.every((r) => r.data.kind === 'renewal_grace')).toBe(true);
  });

  it('restricts after the grace window and notifies exactly once', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    await seedSubscription(
      ctx,
      teamId,
      overdueSeed({ status: 'past_due', graceUntil: new Date(Date.now() - 3_600_000) }),
    );

    await sweep();
    expect((await subRow(teamId))?.status).toBe('restricted');
    let rows = await notices(teamId);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ user_id: owner.id, category: 'billing', urgency: 'urgent' });
    expect(rows[0]?.data.kind).toBe('subscription_restricted');

    await sweep();
    rows = await notices(teamId);
    expect(rows).toHaveLength(1);
    expect((await subRow(teamId))?.status).toBe('restricted');
  });

  it('keeps a restricted subscription restricted across sweeps', async () => {
    const { teamId } = await createTeamWithOwner(ctx);
    await seedSubscription(
      ctx,
      teamId,
      overdueSeed({ status: 'restricted', graceUntil: new Date(Date.now() - DAY_MS) }),
    );

    await sweep();
    await sweep();

    expect((await subRow(teamId))?.status).toBe('restricted');
    expect(await notices(teamId)).toHaveLength(1); // one owner notice, not one per sweep
  });
});

describe('renewal sweep — pending changes', () => {
  it('applies a pending downgrade at period end and quotes the new plan', async () => {
    const { teamId } = await createTeamWithOwner(ctx);
    await seedSubscription(
      ctx,
      teamId,
      overdueSeed({ planKey: 'team', seats: 15, pendingPlanKey: 'starter', pendingSeats: 5 }),
    );

    await sweep();

    expect(await subRow(teamId)).toMatchObject({
      plan_key: 'starter',
      seats: 5,
      extra_seats: 0,
      status: 'past_due',
      next_amount_cents: 2000,
      pending_plan_key: null,
      pending_seats: null,
    });
  });
});

describe('renewal sweep — scope', () => {
  it('moves an expired trial to past_due but leaves a canceled subscription alone', async () => {
    const trialing = await createTeamWithOwner(ctx, 'trial@rota.test');
    const canceled = await createTeamWithOwner(ctx, 'canceled@rota.test');
    await seedSubscription(ctx, trialing.teamId, overdueSeed({ planKey: 'starter', status: 'trialing' }));
    await seedSubscription(ctx, canceled.teamId, overdueSeed({ planKey: 'starter', status: 'canceled' }));

    await sweep();

    expect((await subRow(trialing.teamId))?.status).toBe('past_due');
    expect((await subRow(canceled.teamId))?.status).toBe('canceled');
    expect(await notices(canceled.teamId)).toHaveLength(0);
  });

  it('handles a team with no owner without crashing or notifying', async () => {
    const member = await signUp(ctx, 'solo@rota.test');
    const teamId = await createTeam(ctx, 'Ownerless');
    await addMember(ctx, teamId, member.id, 'member');
    await seedSubscription(ctx, teamId, overdueSeed());

    await sweep();

    expect((await subRow(teamId))?.status).toBe('past_due');
    expect(await notices(teamId)).toHaveLength(0);
  });
});

describe('renewals queue handler', () => {
  it('cleans expired idempotency keys and reschedules the sweep', async () => {
    const { owner } = await createTeamWithOwner(ctx);
    await ctx.topology.global.query(
      `INSERT INTO idempotency_keys (user_id, key, request_hash, expires_at)
       VALUES ($1, 'stale', 'hash', now() - interval '1 hour')`,
      [owner.id],
    );

    await ctx.queue.add(RENEWALS_QUEUE, {});
    await ctx.queue.drain(3_000);

    const remaining = await ctx.topology.global.query<{ id: string }>(
      'SELECT id FROM idempotency_keys WHERE user_id = $1',
      [owner.id],
    );
    expect(remaining).toHaveLength(0);
    // the handler enqueued the next hourly sweep, so the queue is not idle
    expect(ctx.queue.inFlight()).toBeGreaterThanOrEqual(1);
  });
});
