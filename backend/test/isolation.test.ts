import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { RequestBodies } from '@rota/contract';
import { createTestContext, resetDatabases, type TestContext } from './helpers/app';
import { auth, createTeam, inviteAndJoin, type RosterUser } from './helpers/roster';

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

function errorCodeOf(res: { json(): unknown }): string {
  return ((res.json() as { error?: { code?: string } }).error?.code) ?? 'NO_ERROR';
}

async function team(name: string, ownerEmail: string): Promise<{ teamId: string; owner: RosterUser }> {
  return createTeam(ctx, name, ownerEmail);
}

describe('isolation', () => {
  it('a foreign team reads as 404, never 403', async () => {
    const a = await team('Team A', 'outer@iso.test');
    const b = await team('Team B', 'inner@iso.test');

    const read = await ctx.app.inject({ method: 'GET', url: `/v1/teams/${b.teamId}`, headers: auth(a.owner) });
    expect(read.statusCode).toBe(404);
    expect(errorCodeOf(read)).toBe('NOT_FOUND');

    const members = await ctx.app.inject({ method: 'GET', url: `/v1/teams/${b.teamId}/members`, headers: auth(a.owner) });
    expect(members.statusCode).toBe(404);

    const invite = await ctx.app.inject({
      method: 'POST',
      url: `/v1/teams/${b.teamId}/invites`,
      headers: auth(a.owner),
      payload: RequestBodies.createInvite.parse({ email: 'stray@iso.test', role: 'member' }),
    });
    expect(invite.statusCode).toBe(404);
  });

  it('hides shifts and swaps that belong to another team (404)', async () => {
    const a = await team('Team A', 'outer@iso.test');
    const b = await team('Team B', 'inner@iso.test');
    const alice = await inviteAndJoin(ctx, b.teamId, 'Team B', 'alice@iso.test', 'member', b.owner);

    const shiftRes = await ctx.app.inject({
      method: 'POST',
      url: `/v1/teams/${b.teamId}/shifts`,
      headers: auth(b.owner),
      payload: RequestBodies.createShift.parse({
        userId: alice.id,
        startsAt: '2026-10-15T09:00:00Z',
        endsAt: '2026-10-15T17:00:00Z',
      }),
    });
    const shiftId = (shiftRes.json() as { id: string }).id;

    // GET /v1/shifts/:id does not exist — a foreign list of another team's
    // shifts counts as a 404 too.
    const listForeign = await ctx.app.inject({
      method: 'GET',
      url: `/v1/teams/${b.teamId}/shifts`,
      headers: auth(a.owner),
      query: { from: '2026-10-01T00:00:00Z', to: '2026-11-01T00:00:00Z' },
    });
    expect(listForeign.statusCode).toBe(404);
    const patchShift = await ctx.app.inject({
      method: 'PATCH',
      url: `/v1/shifts/${shiftId}`,
      headers: auth(a.owner),
      payload: RequestBodies.updateShift.parse({ notes: 'sneaky' }),
    });
    expect(patchShift.statusCode).toBe(404);

    const swapRes = await ctx.app.inject({
      method: 'POST',
      url: `/v1/shifts/${shiftId}/swap-requests`,
      headers: auth(alice),
      payload: RequestBodies.createSwapRequest.parse({}),
    });
    const swapId = (swapRes.json() as { id: string }).id;
    const decide = await ctx.app.inject({
      method: 'POST',
      url: `/v1/swaps/${swapId}/decision`,
      headers: auth(a.owner),
      payload: RequestBodies.decideSwap.parse({ decision: 'approve' }),
    });
    expect(decide.statusCode).toBe(404);
  });

  it('removed members lose access to shifts they used to touch', async () => {
    const b = await team('Team B', 'inner@iso.test');
    const alice = await inviteAndJoin(ctx, b.teamId, 'Team B', 'alice@iso.test', 'member', b.owner);
    const shiftRes = await ctx.app.inject({
      method: 'POST',
      url: `/v1/teams/${b.teamId}/shifts`,
      headers: auth(b.owner),
      payload: RequestBodies.createShift.parse({
        userId: alice.id,
        startsAt: '2026-10-15T09:00:00Z',
        endsAt: '2026-10-15T17:00:00Z',
      }),
    });
    const shiftId = (shiftRes.json() as { id: string }).id;

    const remove = await ctx.app.inject({
      method: 'DELETE',
      url: `/v1/teams/${b.teamId}/members/${alice.id}`,
      headers: auth(b.owner),
    });
    expect(remove.statusCode).toBe(204);

    const patch = await ctx.app.inject({
      method: 'PATCH',
      url: `/v1/shifts/${shiftId}`,
      headers: auth(alice),
      payload: RequestBodies.updateShift.parse({ notes: 'still here?' }),
    });
    expect(patch.statusCode).toBe(404);
  });

  it('unknown ids resolve to 404, not an oracle', async () => {
    const b = await team('Team B', 'inner@iso.test');
    const phantom = '00000000-0000-4000-8000-000000000000';

    expect((await ctx.app.inject({ method: 'GET', url: `/v1/teams/${phantom}/members`, headers: auth(b.owner) })).statusCode).toBe(404);
    expect((await ctx.app.inject({ method: 'GET', url: `/v1/shifts/${phantom}`, headers: auth(b.owner) })).statusCode).toBe(404);
    const decide = await ctx.app.inject({
      method: 'POST',
      url: `/v1/swaps/${phantom}/decision`,
      headers: auth(b.owner),
      payload: RequestBodies.decideSwap.parse({ decision: 'reject' }),
    });
    expect(decide.statusCode).toBe(404);
    expect(errorCodeOf(decide)).toBe('NOT_FOUND');
  });

  it('accepting a token joins the team the token names, nothing else', async () => {
    const a = await team('Team A', 'outer@iso.test');
    const b = await team('Team B', 'inner@iso.test');
    const carol = await inviteAndJoin(ctx, a.teamId, 'Team A', 'carol@iso.test', 'member', a.owner);

    expect((await ctx.app.inject({ method: 'GET', url: `/v1/teams/${a.teamId}`, headers: auth(carol) })).statusCode).toBe(200);
    expect((await ctx.app.inject({ method: 'GET', url: `/v1/teams/${b.teamId}`, headers: auth(carol) })).statusCode).toBe(404);
  });

  it('rejects client-supplied team ids and roles as foreign fields', async () => {
    const b = await team('Team B', 'inner@iso.test');
    const res = await ctx.app.inject({
      method: 'POST',
      url: `/v1/teams/${b.teamId}/invites`,
      headers: auth(b.owner),
      payload: { email: 'sneaky@iso.test', role: 'member', teamId: b.teamId },
    });
    expect(res.statusCode).toBe(400);
    expect(errorCodeOf(res)).toBe('VALIDATION_FAILED');
  });

  it('every cross-team write attempt 404s and leaves zero side effects', async () => {
    const a = await team('Team A', 'outer@iso.test');
    const b = await team('Team B', 'inner@iso.test');
    const alice = await inviteAndJoin(ctx, b.teamId, 'Team B', 'alice@iso.test', 'member', b.owner);

    // Team B's world: one shift notes "B only", one pending swap on it.
    const shiftRes = await ctx.app.inject({
      method: 'POST',
      url: `/v1/teams/${b.teamId}/shifts`,
      headers: auth(b.owner),
      payload: RequestBodies.createShift.parse({
        userId: alice.id,
        startsAt: '2026-10-15T09:00:00Z',
        endsAt: '2026-10-15T17:00:00Z',
        notes: 'B only',
      }),
    });
    const shiftId = (shiftRes.json() as { id: string }).id;
    const swapRes = await ctx.app.inject({
      method: 'POST',
      url: `/v1/shifts/${shiftId}/swap-requests`,
      headers: auth(alice),
      payload: RequestBodies.createSwapRequest.parse({}),
    });
    const swapId = (swapRes.json() as { id: string }).id;
    const feedBefore = await ctx.app.inject({ method: 'GET', url: `/v1/teams/${b.teamId}/activity`, headers: auth(b.owner) });
    const feedBeforeCount = (feedBefore.json() as { items: unknown[] }).items.length;

    // Team A's attempts — every route scopes the team before it can write.
    const create = await ctx.app.inject({
      method: 'POST',
      url: `/v1/teams/${b.teamId}/shifts`,
      headers: auth(a.owner),
      payload: RequestBodies.createShift.parse({
        userId: alice.id,
        startsAt: '2026-10-20T09:00:00Z',
        endsAt: '2026-10-20T17:00:00Z',
      }),
    });
    expect(create.statusCode).toBe(404);

    const patch = await ctx.app.inject({
      method: 'PATCH',
      url: `/v1/shifts/${shiftId}`,
      headers: auth(a.owner),
      payload: RequestBodies.updateShift.parse({ notes: 'rewritten by a stranger' }),
    });
    expect(patch.statusCode).toBe(404);

    const del = await ctx.app.inject({ method: 'DELETE', url: `/v1/shifts/${shiftId}`, headers: auth(a.owner) });
    expect(del.statusCode).toBe(404);

    const respond = await ctx.app.inject({
      method: 'POST',
      url: `/v1/shifts/${shiftId}/respond`,
      headers: auth(a.owner),
      payload: { action: 'accept' },
    });
    expect(respond.statusCode).toBe(404);

    const removeMember = await ctx.app.inject({
      method: 'DELETE',
      url: `/v1/teams/${b.teamId}/members/${alice.id}`,
      headers: auth(a.owner),
    });
    expect(removeMember.statusCode).toBe(404);

    const foreignSwap = await ctx.app.inject({
      method: 'POST',
      url: `/v1/shifts/${shiftId}/swap-requests`,
      headers: auth(a.owner),
      payload: RequestBodies.createSwapRequest.parse({}),
    });
    expect(foreignSwap.statusCode).toBe(404);

    const decide = await ctx.app.inject({
      method: 'POST',
      url: `/v1/swaps/${swapId}/decision`,
      headers: auth(a.owner),
      payload: RequestBodies.decideSwap.parse({ decision: 'approve' }),
    });
    expect(decide.statusCode).toBe(404);

    expect((await ctx.app.inject({ method: 'GET', url: `/v1/teams/${b.teamId}/swaps`, headers: auth(a.owner) })).statusCode).toBe(404);
    expect((await ctx.app.inject({ method: 'GET', url: `/v1/teams/${b.teamId}/activity`, headers: auth(a.owner) })).statusCode).toBe(404);

    // B's data is exactly as A found it: one shift, untouched notes and
    // version, both members active, one still-pending swap, same feed.
    const shifts = await ctx.app.inject({
      method: 'GET',
      url: `/v1/teams/${b.teamId}/shifts`,
      headers: auth(b.owner),
      query: { from: '2026-10-01T00:00:00Z', to: '2026-11-01T00:00:00Z' },
    });
    const shiftItems = (shifts.json() as { items: { id: string; notes: string | null; version: number }[] }).items;
    expect(shiftItems).toHaveLength(1);
    const shift = shiftItems.find((s) => s.id === shiftId);
    expect(shift?.notes).toBe('B only');
    expect(shift?.version).toBe(1);

    const members = (await ctx.app.inject({ method: 'GET', url: `/v1/teams/${b.teamId}/members`, headers: auth(b.owner) })).json() as {
      id: string;
      active: boolean;
    }[];
    expect(members).toHaveLength(2);
    expect(members.find((m) => m.id === alice.id)?.active).toBe(true);

    const swaps = (await ctx.app.inject({ method: 'GET', url: `/v1/teams/${b.teamId}/swaps`, headers: auth(b.owner) })).json() as {
      items: { id: string; status: string }[];
    };
    expect(swaps.items).toHaveLength(1);
    expect(swaps.items[0]?.status).toBe('pending');

    const feedAfter = await ctx.app.inject({ method: 'GET', url: `/v1/teams/${b.teamId}/activity`, headers: auth(b.owner) });
    expect((feedAfter.json() as { items: unknown[] }).items).toHaveLength(feedBeforeCount);
  });

  it('hides swap suggestions from a foreign team even with the feature flag on', async () => {
    const a = await team('Team A', 'outer@iso.test');
    const b = await team('Team B', 'inner@iso.test');
    const alice = await inviteAndJoin(ctx, b.teamId, 'Team B', 'alice@iso.test', 'member', b.owner);
    const shiftRes = await ctx.app.inject({
      method: 'POST',
      url: `/v1/teams/${b.teamId}/shifts`,
      headers: auth(b.owner),
      payload: RequestBodies.createShift.parse({
        userId: alice.id,
        startsAt: '2026-10-15T09:00:00Z',
        endsAt: '2026-10-15T17:00:00Z',
      }),
    });
    const shiftId = (shiftRes.json() as { id: string }).id;

    ctx.env.FEATURE_SWAP_ASSIST = true;
    try {
      const res = await ctx.app.inject({ method: 'GET', url: `/v1/shifts/${shiftId}/swap-suggestions`, headers: auth(a.owner) });
      expect(res.statusCode).toBe(404);
      expect(errorCodeOf(res)).toBe('NOT_FOUND');
    } finally {
      ctx.env.FEATURE_SWAP_ASSIST = false;
    }
  });
});