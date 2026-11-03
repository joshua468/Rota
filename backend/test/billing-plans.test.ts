import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { ErrorEnvelope, LedgerEntry, Plan, Subscription } from '@rota/contract';
import { createTestContext, resetDatabases, type TestContext } from './helpers/app';
import {
  createTeam,
  createTeamWithOwner,
  addMember,
  errorCode,
  seedLedger,
  seedSubscription,
  signUp,
} from './helpers/billing';

/**
 * Read side of billing: the catalog comes from `plans`, the subscription and
 * ledger views are team-scoped and role-gated, and every query/param is
 * validated strictly (Rule 01/06).
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

describe('GET /v1/plans', () => {
  it('rejects an unauthenticated request', async () => {
    const res = await ctx.app.inject({ method: 'GET', url: '/v1/plans' });
    expect(res.statusCode).toBe(401);
    expect(errorCode(res.json())).toBe('UNAUTHORIZED');
  });

  it('serves every active plan from the plans table, cheapest first', async () => {
    const user = await signUp(ctx, 'reader@rota.test');
    const res = await ctx.app.inject({
      method: 'GET',
      url: '/v1/plans',
      headers: { authorization: user.token },
    });
    expect(res.statusCode).toBe(200);
    const plans: Plan[] = res.json().map((row: unknown) => Plan.parse(row));
    expect(plans.map((p) => p.key)).toEqual(['starter', 'team', 'business']);
    expect(plans.map((p) => p.priceCents)).toEqual([2000, 5000, 12000]);
    expect(plans[0]?.extraSeatCents).toBeNull();
    expect(plans[1]?.extraSeatCents).toBe(300);
    expect(plans[2]?.maxSeats).toBe(500);
  });

  it('rejects unknown query parameters', async () => {
    const user = await signUp(ctx, 'reader2@rota.test');
    const res = await ctx.app.inject({
      method: 'GET',
      url: '/v1/plans?foo=1',
      headers: { authorization: user.token },
    });
    expect(res.statusCode).toBe(400);
    expect(errorCode(res.json())).toBe('VALIDATION_FAILED');
  });
});

describe('GET /v1/teams/:teamId/billing/subscription', () => {
  it('401s without a token and 404s for a non-member', async () => {
    const { teamId } = await createTeamWithOwner(ctx);
    const anonymous = await ctx.app.inject({
      method: 'GET',
      url: `/v1/teams/${teamId}/billing/subscription`,
    });
    expect(anonymous.statusCode).toBe(401);

    const outsider = await signUp(ctx, 'outsider@rota.test');
    const res = await ctx.app.inject({
      method: 'GET',
      url: `/v1/teams/${teamId}/billing/subscription`,
      headers: { authorization: outsider.token },
    });
    expect(res.statusCode).toBe(404);
    expect(errorCode(res.json())).toBe('NOT_FOUND');
  });

  it('403s for a plain member (billing.read is admin and above)', async () => {
    const { teamId } = await createTeamWithOwner(ctx);
    const member = await signUp(ctx, 'member@rota.test');
    await addMember(ctx, teamId, member.id, 'member');
    const res = await ctx.app.inject({
      method: 'GET',
      url: `/v1/teams/${teamId}/billing/subscription`,
      headers: { authorization: member.token },
    });
    expect(res.statusCode).toBe(403);
    expect(errorCode(res.json())).toBe('FORBIDDEN');
  });

  it('returns a JSON null body when the team never subscribed', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    const res = await ctx.app.inject({
      method: 'GET',
      url: `/v1/teams/${teamId}/billing/subscription`,
      headers: { authorization: owner.token },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toBeNull();
  });

  it('returns the subscription shaped by the contract', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    await seedSubscription(ctx, teamId, { planKey: 'team', seats: 18, extraSeats: 3, nextAmountCents: 5900 });
    const res = await ctx.app.inject({
      method: 'GET',
      url: `/v1/teams/${teamId}/billing/subscription`,
      headers: { authorization: owner.token },
    });
    expect(res.statusCode).toBe(200);
    const subscription = Subscription.parse(res.json());
    expect(subscription.teamId).toBe(teamId);
    expect(subscription.planKey).toBe('team');
    expect(subscription.status).toBe('active');
    expect(subscription.seats).toBe(18);
    expect(subscription.extraSeats).toBe(3);
    expect(subscription.nextAmountCents).toBe(5900); // from plans, not the row
    expect(subscription.pendingPlanKey).toBeNull();
    expect(subscription.graceUntil).toBeNull();
  });

  it('quotes the pending downgrade in nextAmountCents while staying on the current plan', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    await seedSubscription(ctx, teamId, {
      planKey: 'team',
      seats: 15,
      pendingPlanKey: 'starter',
      pendingSeats: 5,
      nextAmountCents: 2000,
    });
    const res = await ctx.app.inject({
      method: 'GET',
      url: `/v1/teams/${teamId}/billing/subscription`,
      headers: { authorization: owner.token },
    });
    const subscription = Subscription.parse(res.json());
    expect(subscription.planKey).toBe('team');
    expect(subscription.pendingPlanKey).toBe('starter');
    expect(subscription.pendingSeats).toBe(5);
    expect(subscription.nextAmountCents).toBe(2000);
  });

  it('rejects unknown query parameters', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    const res = await ctx.app.inject({
      method: 'GET',
      url: `/v1/teams/${teamId}/billing/subscription?limit=1`,
      headers: { authorization: owner.token },
    });
    expect(res.statusCode).toBe(400);
    expect(errorCode(res.json())).toBe('VALIDATION_FAILED');
  });
});

describe('GET /v1/teams/:teamId/billing/ledger', () => {
  async function ledger(token: string, teamId: string, query = '') {
    return ctx.app.inject({
      method: 'GET',
      url: `/v1/teams/${teamId}/billing/ledger${query}`,
      headers: { authorization: token },
    });
  }

  it('is owner-only: admins get 403, owners get a page', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    const admin = await signUp(ctx, 'admin@rota.test');
    await addMember(ctx, teamId, admin.id, 'admin');

    const denied = await ledger(admin.token, teamId);
    expect(denied.statusCode).toBe(403);
    expect(errorCode(denied.json())).toBe('FORBIDDEN');

    const allowed = await ledger(owner.token, teamId);
    expect(allowed.statusCode).toBe(200);
    expect(allowed.json()).toEqual({ items: [], nextCursor: null });
  });

  it('404s for a non-member', async () => {
    const { teamId } = await createTeamWithOwner(ctx);
    const outsider = await signUp(ctx, 'outsider2@rota.test');
    const res = await ledger(outsider.token, teamId);
    expect(res.statusCode).toBe(404);
  });

  it('pages with an opaque cursor — no duplicates, no gaps, newest first', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    const base = Date.UTC(2026, 0, 1, 12, 0, 0);
    for (let i = 0; i < 5; i += 1) {
      await seedLedger(ctx, teamId, {
        amountCents: 1000 + i,
        ref: `page-${i}`,
        createdAt: new Date(base + i * 1000),
      });
    }

    const seen: string[] = [];
    let cursor: string | null = null;
    let pages = 0;
    do {
      const query = `?limit=2${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`;
      const res = await ledger(owner.token, teamId, query);
      expect(res.statusCode).toBe(200);
      const page = res.json() as { items: unknown[]; nextCursor: string | null };
      for (const item of page.items) seen.push(LedgerEntry.parse(item).ref);
      cursor = page.nextCursor;
      pages += 1;
      expect(pages).toBeLessThan(10);
    } while (cursor);

    expect(seen).toEqual(['page-4', 'page-3', 'page-2', 'page-1', 'page-0']);
    expect(new Set(seen).size).toBe(5);
  });

  it('rejects a malformed cursor', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    const res = await ledger(owner.token, teamId, '?cursor=not-a-real-cursor');
    expect(res.statusCode).toBe(400);
    expect(errorCode(res.json())).toBe('VALIDATION_FAILED');
  });

  it('validates limit strictly', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    const tooBig = await ledger(owner.token, teamId, '?limit=51');
    expect(tooBig.statusCode).toBe(400);
    const zero = await ledger(owner.token, teamId, '?limit=0');
    expect(zero.statusCode).toBe(400);
    const unknown = await ledger(owner.token, teamId, '?sort=asc');
    expect(unknown.statusCode).toBe(400);
  });

  it('never leaks another team’s ledger entries', async () => {
    const first = await createTeamWithOwner(ctx, 'one@rota.test');
    const second = await createTeam(ctx, 'Second Team');
    await seedLedger(ctx, first.teamId, { amountCents: 5000, ref: 'team-one-entry' });
    await seedLedger(ctx, second, { amountCents: 9000, ref: 'team-two-entry' });

    const res = await ledger(first.owner.token, first.teamId);
    const page = res.json() as { items: unknown[] };
    const refs = page.items.map((item) => LedgerEntry.parse(item).ref);
    expect(refs).toEqual(['team-one-entry']);
    expect(refs).not.toContain('team-two-entry');
  });

  it('rejects an unauthenticated request', async () => {
    const { teamId } = await createTeamWithOwner(ctx);
    const res = await ctx.app.inject({ method: 'GET', url: `/v1/teams/${teamId}/billing/ledger` });
    expect(res.statusCode).toBe(401);
  });
});
