import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import type { LightMyRequestResponse } from 'fastify';
import { createTestContext, resetDatabases, type TestContext } from './helpers/app';
import { createTeam, auth, signup, addMember, type RosterUser } from './helpers/roster';
import { checkout, errorCode, seedSubscription } from './helpers/billing';

/**
 * Restricted subscriptions are read-only (skills/seat-billing-ledger): once the
 * renewals job moves a team past grace to `restricted`, team members can still
 * read and reach billing, but booking, swapping and roster changes are refused
 * with 403 `SUBSCRIPTION_RESTRICTED` so the owner restores access at checkout.
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

interface Fixture {
  teamId: string;
  owner: RosterUser;
  alice: RosterUser;
  shiftId: string;
  swapId: string;
}

const SHIFT = {
  startsAt: '2026-10-15T09:00:00Z',
  endsAt: '2026-10-15T17:00:00Z',
};

async function fixture(status: 'active' | 'restricted'): Promise<Fixture> {
  const { teamId, owner } = await createTeam(ctx, 'Restricted Co', 'owner@restricted.test');
  const alice = await signup(ctx, 'alice@restricted.test');
  await addMember(ctx, teamId, alice.id, 'member');
  await seedSubscription(ctx, teamId, { status: 'active', planKey: 'team', seats: 15 });

  // A shift and an open swap exist from when the plan was healthy, so the
  // restricted checks below exercise update/delete/decide, not create only.
  const created = await ctx.app.inject({
    method: 'POST',
    url: `/v1/teams/${teamId}/shifts`,
    headers: auth(owner),
    payload: { userId: alice.id, ...SHIFT, role: 'Chef', location: 'Kitchen' },
  });
  expect(created.statusCode).toBe(200);
  const shiftId = (created.json() as { id: string }).id;

  const swap = await ctx.app.inject({
    method: 'POST',
    url: `/v1/shifts/${shiftId}/swap-requests`,
    headers: auth(owner),
    payload: {},
  });
  expect(swap.statusCode).toBe(200);
  const swapId = (swap.json() as { id: string }).id;

  if (status === 'restricted') {
    await seedSubscription(ctx, teamId, { status: 'restricted', planKey: 'team', seats: 15 });
  }
  return { teamId, owner, alice, shiftId, swapId };
}

function inject(
  method: 'POST' | 'PATCH' | 'DELETE',
  url: string,
  user: RosterUser,
  payload?: object,
): Promise<LightMyRequestResponse> {
  return ctx.app.inject({ method, url, headers: auth(user), payload });
}

describe('restricted subscription is read-only', () => {
  it('refuses shift create, update and delete with 403 SUBSCRIPTION_RESTRICTED', async () => {
    const f = await fixture('restricted');

    const create = await inject('POST', `/v1/teams/${f.teamId}/shifts`, f.owner, {
      userId: f.alice.id,
      ...SHIFT,
      role: 'Chef',
      location: 'Kitchen',
    });
    expect(create.statusCode).toBe(403);
    expect(errorCode(create.json())).toBe('SUBSCRIPTION_RESTRICTED');

    const patch = await inject('PATCH', `/v1/shifts/${f.shiftId}`, f.owner, { role: 'Sous' });
    expect(patch.statusCode).toBe(403);
    expect(errorCode(patch.json())).toBe('SUBSCRIPTION_RESTRICTED');

    const del = await inject('DELETE', `/v1/shifts/${f.shiftId}`, f.owner);
    expect(del.statusCode).toBe(403);
    expect(errorCode(del.json())).toBe('SUBSCRIPTION_RESTRICTED');
  });

  it('refuses swap requests and decisions', async () => {
    const f = await fixture('restricted');

    const request = await inject('POST', `/v1/shifts/${f.shiftId}/swap-requests`, f.owner, {});
    expect(request.statusCode).toBe(403);
    expect(errorCode(request.json())).toBe('SUBSCRIPTION_RESTRICTED');

    // A manager could normally decide (`swap.decide` is scheduler-gated), so a
    // restricted plan is what refuses here — not the permission matrix.
    const manager = await signup(ctx, 'restricted-manager@restricted.test');
    await addMember(ctx, f.teamId, manager.id, 'manager');
    const decision = await inject('POST', `/v1/swaps/${f.swapId}/decision`, manager, {
      decision: 'approve',
    });
    expect(decision.statusCode).toBe(403);
    expect(errorCode(decision.json())).toBe('SUBSCRIPTION_RESTRICTED');
  });

  it('refuses inviting and removing members, but lets a member leave', async () => {
    const f = await fixture('restricted');

    const invite = await inject('POST', `/v1/teams/${f.teamId}/invites`, f.owner, {
      email: 'new@restricted.test',
      role: 'member',
    });
    expect(invite.statusCode).toBe(403);
    expect(errorCode(invite.json())).toBe('SUBSCRIPTION_RESTRICTED');

    const remove = await inject('DELETE', `/v1/teams/${f.teamId}/members/${f.alice.id}`, f.owner);
    expect(remove.statusCode).toBe(403);
    expect(errorCode(remove.json())).toBe('SUBSCRIPTION_RESTRICTED');

    // Leaving is not a paying action — a member may always walk away.
    const leave = await inject('DELETE', `/v1/teams/${f.teamId}/members/${f.alice.id}`, f.alice);
    expect(leave.statusCode).toBe(204);
  });

  it('keeps reads and billing open so the owner can restore access', async () => {
    const f = await fixture('restricted');

    const team = await ctx.app.inject({ method: 'GET', url: `/v1/teams/${f.teamId}`, headers: auth(f.owner) });
    expect(team.statusCode).toBe(200);
    const shifts = await ctx.app.inject({
      method: 'GET',
      url: `/v1/teams/${f.teamId}/shifts`,
      headers: auth(f.owner),
      query: { from: '2026-10-01T00:00:00Z', to: '2026-11-01T00:00:00Z' },
    });
    expect(shifts.statusCode).toBe(200);

    const bill = await checkout(ctx, {
      token: f.owner.token,
      teamId: f.teamId,
      body: { planKey: 'team', seats: 15 },
      key: 'restricted-checkout-1',
    });
    expect(errorCode(bill.json())).not.toBe('SUBSCRIPTION_RESTRICTED');
  });

  it('allows writes again once the plan is active', async () => {
    const f = await fixture('active');
    const create = await inject('POST', `/v1/teams/${f.teamId}/shifts`, f.owner, {
      userId: f.alice.id,
      startsAt: '2026-10-20T09:00:00Z',
      endsAt: '2026-10-20T17:00:00Z',
      role: 'Chef',
      location: 'Kitchen',
    });
    expect(create.statusCode).toBe(200);
  });
});
