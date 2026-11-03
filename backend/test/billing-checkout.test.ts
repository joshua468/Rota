import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import type { PlanKey } from '@rota/contract';
import { createTestContext, resetDatabases, type TestContext } from './helpers/app';
import {
  addMember,
  checkout,
  createTeam,
  createTeamWithOwner,
  errorCode,
  seedInvite,
  seedSubscription,
  signUp,
  type TeamFixture,
} from './helpers/billing';
import { sha256 } from '../src/lib/crypto';
import { newId } from '../src/lib/ids';
import { canonicalJson } from '../src/repos/idempotency';
import type { PaymentIntentRow } from '../src/jobs/billing';

/**
 * Checkout (PRD 6.5, rules 01/02/06): the server derives every cent from
 * `plans`, seats are validated against the live roster, the request must carry
 * an Idempotency-Key, and creating a payment intent never mutates the
 * subscription — only the webhook may do that.
 */

let ctx: TestContext;

beforeAll(async () => {
  ctx = await createTestContext();
});

beforeEach(async () => {
  await resetDatabases(ctx);
});

afterAll(async () => {
  await ctx.close();
});

function requestHash(teamId: string, body: { planKey: PlanKey; seats: number }): string {
  return sha256(canonicalJson({ teamId, body }));
}

async function intents(teamId: string): Promise<PaymentIntentRow[]> {
  return ctx.topology.shardDb(ctx.topology.scopeFor(teamId)).query<PaymentIntentRow>(
    'SELECT * FROM payment_intents WHERE team_id = $1 ORDER BY created_at ASC, id ASC',
    [teamId],
  );
}

async function subscriptionRow(teamId: string) {
  return ctx.topology.shardDb(ctx.topology.scopeFor(teamId)).one<{
    plan_key: string;
    seats: number;
    status: string;
    pending_plan_key: string | null;
    pending_seats: number | null;
  }>('SELECT plan_key, seats, status, pending_plan_key, pending_seats FROM subscriptions WHERE team_id = $1', [
    teamId,
  ]);
}

async function expectStatus(
  res: { statusCode: number; body: string; json(): unknown },
  status: number,
  code?: string,
): Promise<void> {
  expect(res.statusCode, res.body).toBe(status);
  if (code) expect(errorCode(res.json())).toBe(code);
}

describe('checkout guards', () => {
  it('requires an Idempotency-Key header', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    const res = await checkout(ctx, { token: owner.token, teamId, body: { planKey: 'starter', seats: 5 } });
    await expectStatus(res, 400, 'VALIDATION_FAILED');
    expect(res.json().error.message).toContain('Idempotency-Key');
  });

  it('requires authentication and membership', async () => {
    const { teamId } = await createTeamWithOwner(ctx);
    const anonymous = await checkout(ctx, { teamId, body: { planKey: 'starter', seats: 5 }, key: 'k1' });
    await expectStatus(anonymous, 401, 'UNAUTHORIZED');

    const outsider = await signUp(ctx, 'outsider@rota.test');
    const denied = await checkout(ctx, {
      token: outsider.token,
      teamId,
      body: { planKey: 'starter', seats: 5 },
      key: 'k2',
    });
    await expectStatus(denied, 404, 'NOT_FOUND');
  });

  it('rejects an unknown plan key', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    const res = await checkout(ctx, {
      token: owner.token,
      teamId,
      body: { planKey: 'enterprise' as PlanKey, seats: 5 },
      key: 'unknown-plan',
    });
    await expectStatus(res, 400, 'VALIDATION_FAILED');
  });

  it('refuses money from the request body (Rule 02)', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    const res = await ctx.app.inject({
      method: 'POST',
      url: `/v1/teams/${teamId}/billing/checkout`,
      headers: { authorization: owner.token, 'idempotency-key': 'client-money' },
      payload: { planKey: 'starter', seats: 5, amountCents: 1 },
    });
    await expectStatus(res, 400, 'VALIDATION_FAILED');
  });
});

describe('checkout pricing (server-derived cents)', () => {
  it('charges a full period for a team that never subscribed', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    const res = await checkout(ctx, {
      token: owner.token,
      teamId,
      body: { planKey: 'starter', seats: 5 },
      key: 'first-checkout',
    });
    await expectStatus(res, 200);
    const url = new URL(res.json().url as string);
    expect(url.pathname).toBe('/flutterwave/authorize');
    expect(url.searchParams.get('tx_ref')).toMatch(/^co_/);
    expect(url.searchParams.get('amount')).toBe('2000');

    const rows = await intents(teamId);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      status: 'pending',
      amount_cents: 2000,
      currency: 'USD',
      plan_key: 'starter',
      seats: 5,
    });
    expect(rows[0]?.authorization_url).toBe(res.json().url);
  });

  it('worked example: starter → team with 20 days left charges 2000', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    await seedSubscription(ctx, teamId, { planKey: 'starter', seats: 5 });

    const res = await checkout(ctx, {
      token: owner.token,
      teamId,
      body: { planKey: 'team', seats: 15 },
      key: 'upgrade-starter-team',
    });
    await expectStatus(res, 200);
    expect(res.json().url).toContain('amount=2000');
    const rows = await intents(teamId);
    expect(rows[0]?.amount_cents).toBe(2000);

    // checkout alone must not touch the subscription (Rule 01)
    const sub = await subscriptionRow(teamId);
    expect(sub).toMatchObject({
      plan_key: 'starter',
      seats: 5,
      status: 'active',
      pending_plan_key: null,
      pending_seats: null,
    });
  });

  it('worked example: team 15 → 18 seats with 12 days left charges 360', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    const now = Date.now();
    await seedSubscription(ctx, teamId, {
      planKey: 'team',
      seats: 15,
      periodStart: new Date(now - 18 * 86_400_000),
      periodEnd: new Date(now + 12 * 86_400_000),
    });

    const res = await checkout(ctx, {
      token: owner.token,
      teamId,
      body: { planKey: 'team', seats: 18 },
      key: 'add-seats',
    });
    await expectStatus(res, 200);
    const rows = await intents(teamId);
    expect(rows[0]?.amount_cents).toBe(360);
  });

  it('charges nothing for a mid-period downgrade but still starts checkout', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    await seedSubscription(ctx, teamId, { planKey: 'team', seats: 15 });

    const res = await checkout(ctx, {
      token: owner.token,
      teamId,
      body: { planKey: 'starter', seats: 5 },
      key: 'downgrade',
    });
    await expectStatus(res, 200);
    expect(res.json().url).toContain('amount=0');

    const rows = await intents(teamId);
    expect(rows[0]?.amount_cents).toBe(0);
    const sub = await subscriptionRow(teamId);
    expect(sub).toMatchObject({ plan_key: 'team', seats: 15, pending_plan_key: null, pending_seats: null });
  });

  it('charges nothing for a mid-period seat reduction', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    await seedSubscription(ctx, teamId, { planKey: 'team', seats: 18, extraSeats: 3 });

    const res = await checkout(ctx, {
      token: owner.token,
      teamId,
      body: { planKey: 'team', seats: 15 },
      key: 'fewer-seats',
    });
    await expectStatus(res, 200);
    const rows = await intents(teamId);
    expect(rows[0]?.amount_cents).toBe(0);
    const sub = await subscriptionRow(teamId);
    expect(sub).toMatchObject({ seats: 18, pending_seats: null });
  });

  it('treats an expired period as fresh: full period price', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    const now = Date.now();
    await seedSubscription(ctx, teamId, {
      planKey: 'starter',
      seats: 5,
      status: 'past_due',
      periodStart: new Date(now - 35 * 86_400_000),
      periodEnd: new Date(now - 5 * 86_400_000),
    });

    const res = await checkout(ctx, {
      token: owner.token,
      teamId,
      body: { planKey: 'starter', seats: 5 },
      key: 'renewal',
    });
    await expectStatus(res, 200);
    const rows = await intents(teamId);
    expect(rows[0]?.amount_cents).toBe(2000);
  });
});

describe('checkout plan and roster guards', () => {
  it('refuses seats past a plan without extras (422) and replays the stored error', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    const body = { planKey: 'starter' as PlanKey, seats: 6 };
    const key = 'too-many-seats';

    const first = await checkout(ctx, { token: owner.token, teamId, body, key });
    await expectStatus(first, 422, 'PLAN_UPGRADE_REQUIRED');

    const replay = await checkout(ctx, { token: owner.token, teamId, body, key });
    await expectStatus(replay, 422, 'PLAN_UPGRADE_REQUIRED');
    expect(replay.json()).toEqual(first.json());
    expect(await intents(teamId)).toHaveLength(0);
  });

  it('refuses seats past the plan maximum (402)', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    const res = await checkout(ctx, {
      token: owner.token,
      teamId,
      body: { planKey: 'team', seats: 101 },
      key: 'over-max',
    });
    await expectStatus(res, 402, 'SEAT_LIMIT');
  });

  it('cannot check out below the active roster, counting open invites (402 then 200)', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    await addMember(ctx, teamId, newId(), 'member');
    await addMember(ctx, teamId, newId(), 'member');
    await seedInvite(ctx, teamId); // 3 members + 1 open invite = 4 seats used

    const tooSmall = await checkout(ctx, {
      token: owner.token,
      teamId,
      body: { planKey: 'starter', seats: 3 },
      key: 'roster-low',
    });
    await expectStatus(tooSmall, 402, 'SEAT_LIMIT');

    const exact = await checkout(ctx, {
      token: owner.token,
      teamId,
      body: { planKey: 'starter', seats: 4 },
      key: 'roster-ok',
    });
    await expectStatus(exact, 200);
  });

  it('rejects a same-plan same-seats checkout with 409 and creates no intent', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    await seedSubscription(ctx, teamId, { planKey: 'team', seats: 15 });
    const body = { planKey: 'team' as PlanKey, seats: 15 };

    const first = await checkout(ctx, { token: owner.token, teamId, body, key: 'noop-1' });
    await expectStatus(first, 409, 'CONFLICT');

    const replay = await checkout(ctx, { token: owner.token, teamId, body, key: 'noop-1' });
    await expectStatus(replay, 409, 'CONFLICT');

    const freshKey = await checkout(ctx, { token: owner.token, teamId, body, key: 'noop-2' });
    await expectStatus(freshKey, 409, 'CONFLICT');

    expect(await intents(teamId)).toHaveLength(0);
  });
});

describe('checkout idempotency', () => {
  it('replays the stored response and creates exactly one payment intent', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    const body = { planKey: 'starter' as PlanKey, seats: 5 };
    const key = 'replay-me';

    const first = await checkout(ctx, { token: owner.token, teamId, body, key });
    await expectStatus(first, 200);
    const second = await checkout(ctx, { token: owner.token, teamId, body, key });
    await expectStatus(second, 200);
    expect(second.json()).toEqual(first.json());
    expect(await intents(teamId)).toHaveLength(1);
  });

  it('422s when the same key carries a different body', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    const key = 'reused-key';

    const first = await checkout(ctx, {
      token: owner.token,
      teamId,
      body: { planKey: 'starter', seats: 5 },
      key,
    });
    await expectStatus(first, 200);

    const different = await checkout(ctx, {
      token: owner.token,
      teamId,
      body: { planKey: 'team', seats: 15 },
      key,
    });
    await expectStatus(different, 422, 'IDEMPOTENCY_MISMATCH');
    expect(await intents(teamId)).toHaveLength(1);
  });

  it('409s while an identical request is still in flight', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    const body = { planKey: 'starter' as PlanKey, seats: 5 };
    const key = 'in-flight';
    await ctx.topology.global.query(
      `INSERT INTO idempotency_keys (user_id, key, request_hash, created_at, expires_at)
       VALUES ($1, $2, $3, now(), now() + interval '24 hours')`,
      [owner.id, key, requestHash(teamId, body)],
    );

    const res = await checkout(ctx, { token: owner.token, teamId, body, key });
    await expectStatus(res, 409, 'IDEMPOTENCY_IN_PROGRESS');
    expect(await intents(teamId)).toHaveLength(0);
  });

  it('takes over an in-flight key that has been stuck for more than five minutes', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    const body = { planKey: 'starter' as PlanKey, seats: 5 };
    const key = 'orphaned';
    await ctx.topology.global.query(
      `INSERT INTO idempotency_keys (user_id, key, request_hash, created_at, expires_at)
       VALUES ($1, $2, $3, now() - interval '6 minutes', now() + interval '24 hours')`,
      [owner.id, key, requestHash(teamId, body)],
    );

    const res = await checkout(ctx, { token: owner.token, teamId, body, key });
    await expectStatus(res, 200);
    expect(await intents(teamId)).toHaveLength(1);
  });

  it('ignores an expired finished key and starts over', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    const body = { planKey: 'starter' as PlanKey, seats: 5 };
    const key = 'expired';
    await ctx.topology.global.query(
      `INSERT INTO idempotency_keys (user_id, key, request_hash, state, response_status, response_body, created_at, expires_at)
       VALUES ($1, $2, $3, 'finished', 200, '{"url":"stale"}', now() - interval '25 hours', now() - interval '1 hour')`,
      [owner.id, key, requestHash(teamId, body)],
    );

    const res = await checkout(ctx, { token: owner.token, teamId, body, key });
    await expectStatus(res, 200);
    expect(res.json().url).not.toBe('stale');
    expect(await intents(teamId)).toHaveLength(1);
  });
});

describe('checkout rate limiting', () => {
  it('limits one team+user to ten checkouts a minute and scopes the bucket per team', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    const body = { planKey: 'starter' as PlanKey, seats: 5 };

    for (let i = 0; i < 10; i += 1) {
      const res = await checkout(ctx, { token: owner.token, teamId, body, key: `burst-${i}` });
      expect(res.statusCode, `request ${i + 1}`).toBe(200);
    }
    const limited = await checkout(ctx, { token: owner.token, teamId, body, key: 'burst-11' });
    await expectStatus(limited, 429, 'RATE_LIMITED');

    // a different team for the same user has its own bucket
    const secondTeam = await createTeam(ctx, 'Second Team');
    await addMember(ctx, secondTeam, owner.id, 'owner');
    const other = await checkout(ctx, { token: owner.token, teamId: secondTeam, body, key: 'other-team' });
    await expectStatus(other, 200);
  });
});
