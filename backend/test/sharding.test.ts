import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { RequestBodies } from '@rota/contract';
import { createTestContext, type TestContext } from './helpers/app';
import { auth, createTeam, inviteAndJoin, type RosterUser } from './helpers/roster';

let ctx: TestContext;

beforeAll(async () => {
  ctx = await createTestContext({ SHARD_COUNT: '2' });
});

afterAll(async () => {
  await ctx.close();
});

async function teamOnShard(want: 0 | 1, tag: string): Promise<{ teamId: string; owner: RosterUser }> {
  for (let attempt = 0; attempt < 50; attempt++) {
    const created = await createTeam(ctx, `Shard ${want}-${tag}-${attempt}`, `s${want}-${tag}-${attempt}@shard.test`);
    if (ctx.topology.scopeFor(created.teamId).shard === want) return created;
  }
  throw new Error(`could not mint a team for shard ${want} in 50 attempts`);
}

describe('sharding (SHARD_COUNT=2)', () => {
  it('places teams on distinct shards and never moves them', async () => {
    const a = await teamOnShard(0, 'place');
    const b = await teamOnShard(1, 'place');

    expect(ctx.topology.shards).toHaveLength(2);
    expect(ctx.topology.scopeFor(a.teamId).shard).toBe(0);
    expect(ctx.topology.scopeFor(b.teamId).shard).toBe(1);
    // The placement is fnv1a(teamId) % 2, so it is stable across calls.
    expect(ctx.topology.scopeFor(a.teamId)).toEqual(ctx.topology.scopeFor(a.teamId));
    expect(ctx.topology.shardDb(ctx.topology.scopeFor(a.teamId))).toBe(ctx.topology.shards[0]);
    expect(ctx.topology.shardDb(ctx.topology.scopeFor(b.teamId))).toBe(ctx.topology.shards[1]);

    // Each team row exists only on its owning shard.
    const [shard0, shard1] = ctx.topology.shards;
    if (!shard0 || !shard1) throw new Error('expected two shards');
    expect(await shard0.query('SELECT id FROM teams WHERE id = $1', [a.teamId])).toHaveLength(1);
    expect(await shard1.query('SELECT id FROM teams WHERE id = $1', [a.teamId])).toHaveLength(0);
    expect(await shard0.query('SELECT id FROM teams WHERE id = $1', [b.teamId])).toHaveLength(0);
    expect(await shard1.query('SELECT id FROM teams WHERE id = $1', [b.teamId])).toHaveLength(1);
  });

  it('routes every write through the owning shard only', async () => {
    const a = await teamOnShard(0, 'write');
    const b = await teamOnShard(1, 'write');
    const alice = await inviteAndJoin(ctx, a.teamId, 'Shard A', 'alice@shard.test', 'member', a.owner);

    const shiftRes = await ctx.app.inject({
      method: 'POST',
      url: `/v1/teams/${a.teamId}/shifts`,
      headers: auth(a.owner),
      payload: RequestBodies.createShift.parse({
        userId: alice.id,
        startsAt: '2026-11-05T09:00:00Z',
        endsAt: '2026-11-05T17:00:00Z',
      }),
    });
    expect(shiftRes.statusCode).toBe(200);
    const shiftId = (shiftRes.json() as { id: string }).id;

    const [shard0, shard1] = ctx.topology.shards;
    if (!shard0 || !shard1) throw new Error('expected two shards');
    expect(await shard0.query('SELECT id FROM shifts WHERE id = $1', [shiftId])).toHaveLength(1);
    expect(await shard1.query('SELECT id FROM shifts WHERE id = $1', [shiftId])).toHaveLength(0);
    expect(await shard1.query('SELECT id FROM shifts WHERE team_id = $1', [a.teamId])).toHaveLength(0);

    // Reads for each team resolve against their own shard, disjointly.
    const shiftsA = await ctx.app.inject({
      method: 'GET',
      url: `/v1/teams/${a.teamId}/shifts`,
      headers: auth(a.owner),
      query: { from: '2026-11-01T00:00:00Z', to: '2026-12-01T00:00:00Z' },
    });
    expect((shiftsA.json() as { items: { id: string }[] }).items).toHaveLength(1);
    const shiftsB = await ctx.app.inject({
      method: 'GET',
      url: `/v1/teams/${b.teamId}/shifts`,
      headers: auth(b.owner),
      query: { from: '2026-11-01T00:00:00Z', to: '2026-12-01T00:00:00Z' },
    });
    expect((shiftsB.json() as { items: unknown[] }).items).toHaveLength(0);
  });

  it('migrates the global database and both shards', async () => {
    // routeSmoke: every shard must accept the same core schema, so one
    // SHARD_COUNT bump needs no new migrations.
    for (const [index, shard] of ctx.topology.shards.entries()) {
      const tables = await shard.query<{ table_name: string }>(
        `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`,
      );
      const names = tables.map((row) => row.table_name);
      expect(names, `shard ${index}`).toEqual(expect.arrayContaining(['teams', 'shifts', 'swap_requests', 'ledger_entries']));
    }
    const globalTables = await ctx.topology.global.query<{ table_name: string }>(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`,
    );
    expect(globalTables.map((row) => row.table_name)).toEqual(
      expect.arrayContaining(['users', 'refresh_tokens', 'one_time_tokens']),
    );
  });
});
