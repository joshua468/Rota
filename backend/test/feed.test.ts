import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  PagedResponse,
  RequestBodies,
  Shift,
  SwapRequest,
  ActivityItem,
} from '@rota/contract';
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

async function feed(by: RosterUser, f: { teamId: string }, query: Record<string, string> = {}) {
  const res = await ctx.app.inject({ method: 'GET', url: `/v1/teams/${f.teamId}/activity`, headers: auth(by), query });
  expect(res.statusCode).toBe(200);
  return PagedResponse(ActivityItem).parse(res.json());
}

describe('feed', () => {
  it('records team, member, shift and swap events', async () => {
    const { teamId, owner } = await createTeam(ctx, 'Cooks', 'owner@feed.test');
    const alice = await inviteAndJoin(ctx, teamId, 'Cooks', 'alice@feed.test', 'member', owner);
    const bob = await inviteAndJoin(ctx, teamId, 'Cooks', 'bob@feed.test', 'member', owner);

    const shiftRes = await ctx.app.inject({
      method: 'POST',
      url: `/v1/teams/${teamId}/shifts`,
      headers: auth(owner),
      payload: RequestBodies.createShift.parse({
        userId: alice.id,
        startsAt: '2026-10-15T09:00:00Z',
        endsAt: '2026-10-15T17:00:00Z',
      }),
    });
    const shift = Shift.parse(shiftRes.json());
    const swapRes = await ctx.app.inject({
      method: 'POST',
      url: `/v1/shifts/${shift.id}/swap-requests`,
      headers: auth(alice),
      payload: RequestBodies.createSwapRequest.parse({ toUserId: bob.id }),
    });
    const swap = SwapRequest.parse(swapRes.json());

    const page = await feed(owner, { teamId });
    const types = page.items.map((item) => item.type);
    for (const expected of ['team.created', 'member.invited', 'member.joined', 'shift.created', 'swap.requested']) {
      expect(types).toContain(expected);
    }

    const joined = page.items.find((item) => item.type === 'member.joined' && item.actor?.id === alice.id);
    expect(joined?.actor).toEqual({ id: alice.id, name: 'alice', avatarUrl: null });
    expect(swap.status).toBe('pending');
  });

  it('serves the feed newest-first and pages without loss', async () => {
    const { teamId, owner } = await createTeam(ctx, 'Cooks', 'owner@feed.test');
    const alice = await inviteAndJoin(ctx, teamId, 'Cooks', 'alice@feed.test', 'member', owner);
    const bob = await inviteAndJoin(ctx, teamId, 'Cooks', 'bob@feed.test', 'member', owner);

    for (const [i, userId] of [alice.id, bob.id].entries()) {
      const res = await ctx.app.inject({
        method: 'POST',
        url: `/v1/teams/${teamId}/shifts`,
        headers: auth(owner),
        payload: RequestBodies.createShift.parse({
          userId,
          startsAt: `2026-10-${15 + i}T09:00:00Z`,
          endsAt: `2026-10-${15 + i}T17:00:00Z`,
        }),
      });
      expect(res.statusCode).toBe(200);
    }

    const first = await feed(owner, { teamId }, { limit: '3' });
    expect(first.items).toHaveLength(3);
    for (let index = 0; index < first.items.length - 1; index += 1) {
      expect(first.items[index]!.createdAt >= first.items[index + 1]!.createdAt).toBe(true);
    }

    const second = await feed(owner, { teamId }, { limit: '3', cursor: first.nextCursor ?? '' });
    expect(second.items.length).toBeGreaterThan(0);

    const all = [...first.items, ...second.items];
    expect(new Set(all.map((item) => item.id)).size).toBe(all.length);
  });
});