import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import type { Shift } from '@rota/contract';
import { MemoryCache, cached, createCache, invalidate, invalidatePrefix, type Cache } from '../src/cache/cache';
import { calendarKey, calendarPrefix, rosterKey } from '../src/cache/keys';
import { createLogger } from '../src/lib/logger';
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

const WINDOW = { from: '2026-10-01T00:00:00Z', to: '2026-11-01T00:00:00Z' };

interface Fixture {
  teamId: string;
  owner: RosterUser;
  alice: RosterUser;
  bob: RosterUser;
}

async function fixture(): Promise<Fixture> {
  const { teamId, owner } = await createTeam(ctx, 'Cooks', 'owner@cache.test');
  const alice = await inviteAndJoin(ctx, teamId, 'Cooks', 'alice@cache.test', 'member', owner);
  const bob = await inviteAndJoin(ctx, teamId, 'Cooks', 'bob@cache.test', 'member', owner);
  return { teamId, owner, alice, bob };
}

async function listMembers(f: Fixture, by: RosterUser): Promise<unknown[]> {
  const res = await ctx.app.inject({ method: 'GET', url: `/v1/teams/${f.teamId}/members`, headers: auth(by) });
  expect(res.statusCode).toBe(200);
  return res.json() as unknown[];
}

async function listShifts(
  f: Fixture,
  by: RosterUser,
  query: Record<string, string> = WINDOW,
): Promise<{ items: Shift[]; nextCursor: string | null }> {
  const res = await ctx.app.inject({ method: 'GET', url: `/v1/teams/${f.teamId}/shifts`, headers: auth(by), query });
  expect(res.statusCode).toBe(200);
  return res.json() as { items: Shift[]; nextCursor: string | null };
}

async function createShift(f: Fixture, userId: string, startsAt: string, endsAt: string): Promise<Shift> {
  const res = await ctx.app.inject({
    method: 'POST',
    url: `/v1/teams/${f.teamId}/shifts`,
    headers: auth(f.owner),
    payload: { userId, startsAt, endsAt, role: 'Chef', location: 'Kitchen' },
  });
  expect(res.statusCode).toBe(200);
  return res.json() as Shift;
}

describe('read-through cache', () => {
  it('caches the roster and drops it when a member is removed', async () => {
    const f = await fixture();
    expect(await listMembers(f, f.owner)).toHaveLength(3);
    expect(await ctx.cache.get(rosterKey(f.teamId))).toBeDefined();

    const removed = await ctx.app.inject({
      method: 'DELETE',
      url: `/v1/teams/${f.teamId}/members/${f.bob.id}`,
      headers: auth(f.owner),
    });
    expect(removed.statusCode).toBe(204);
    expect(await ctx.cache.get(rosterKey(f.teamId))).toBeUndefined();

    expect(await listMembers(f, f.owner)).toHaveLength(2);
  });

  it('caches the calendar and drops the whole family when a shift changes', async () => {
    const f = await fixture();
    const key = calendarKey(f.teamId, { ...WINDOW, mine: '0', user: '', cursor: '', limit: 50 });

    expect((await listShifts(f, f.owner)).items).toHaveLength(0);
    expect(await ctx.cache.get(key)).toBeDefined();

    await createShift(f, f.alice.id, '2026-10-15T09:00:00Z', '2026-10-15T17:00:00Z');
    expect(await ctx.cache.get(key)).toBeUndefined();

    expect((await listShifts(f, f.owner)).items).toHaveLength(1);
  });

  it('caches a shift for the right person when a swap is approved', async () => {
    const f = await fixture();
    const shift = await createShift(f, f.alice.id, '2026-10-15T09:00:00Z', '2026-10-15T17:00:00Z');

    const request = await ctx.app.inject({
      method: 'POST',
      url: `/v1/shifts/${shift.id}/swap-requests`,
      headers: auth(f.alice),
      payload: { toUserId: f.bob.id },
    });
    expect(request.statusCode).toBe(200);
    const swapId = (request.json() as { id: string }).id;

    const key = calendarKey(f.teamId, { ...WINDOW, mine: '0', user: '', cursor: '', limit: 50 });
    await listShifts(f, f.owner);
    expect(await ctx.cache.get(key)).toBeDefined();

    const decided = await ctx.app.inject({
      method: 'POST',
      url: `/v1/swaps/${swapId}/decision`,
      headers: auth(f.owner),
      payload: { decision: 'approve' },
    });
    expect(decided.statusCode).toBe(200);
    expect(await ctx.cache.get(key)).toBeUndefined();

    const page = await listShifts(f, f.owner);
    expect(page.items[0]?.user?.id).toBe(f.bob.id);
  });

  it('never serves one member the cached mine=1 calendar of another', async () => {
    const f = await fixture();
    await createShift(f, f.alice.id, '2026-10-15T09:00:00Z', '2026-10-15T17:00:00Z');

    const aliceKey = calendarKey(f.teamId, { ...WINDOW, mine: '1', user: f.alice.id, cursor: '', limit: 50 });
    const bobKey = calendarKey(f.teamId, { ...WINDOW, mine: '1', user: f.bob.id, cursor: '', limit: 50 });
    expect(aliceKey).not.toBe(bobKey);

    expect((await listShifts(f, f.alice, { ...WINDOW, mine: '1' })).items).toHaveLength(1);
    expect(await ctx.cache.get(aliceKey)).toBeDefined();
    expect((await listShifts(f, f.bob, { ...WINDOW, mine: '1' })).items).toHaveLength(0);
  });
});

describe('cache primitives', () => {
  it('expires entries by TTL and clears whole prefixes', async () => {
    const cache = new MemoryCache();
    await cache.set('roster:t1', { n: 1 }, 1_000);
    await cache.set('cal:t1:a', 1, 1_000);
    await cache.set('cal:t1:b', 2, 1_000);
    await cache.set('cal:t2:a', 3, 1_000);
    await cache.set('gone', 'x', 0);

    expect(await cache.get('roster:t1')).toEqual({ n: 1 });
    expect(await cache.get('gone')).toBeUndefined();

    await cache.delByPrefix(calendarPrefix('t1'));
    expect(await cache.get('cal:t1:a')).toBeUndefined();
    expect(await cache.get('cal:t1:b')).toBeUndefined();
    expect(await cache.get('cal:t2:a')).toBe(3);

    await cache.del([rosterKey('t1')]);
    expect(await cache.get(rosterKey('t1'))).toBeUndefined();
  });

  it('degrades to no cache when the cache itself throws', async () => {
    const down: Cache = {
      get: async () => {
        throw new Error('cache down');
      },
      set: async () => {
        throw new Error('cache down');
      },
      del: async () => {
        throw new Error('cache down');
      },
      delByPrefix: async () => {
        throw new Error('cache down');
      },
      close: async () => undefined,
    };

    expect(await cached(down, 'k', 1_000, async () => 42)).toBe(42);
    await expect(invalidate(down, ['k'])).resolves.toBeUndefined();
    await expect(invalidatePrefix(down, 'k')).resolves.toBeUndefined();
  });

  it('uses the in-memory driver when REDIS_URL is empty', async () => {
    const cache = await createCache('', createLogger('silent'));
    expect(cache).toBeInstanceOf(MemoryCache);
    await cache.close();
  });
});
