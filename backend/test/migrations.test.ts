import { afterEach, describe, expect, it } from 'vitest';
import { newId } from '../src/lib/ids';
import { ACTIVITY_COLUMNS } from '../src/repos/feed';
import { LEDGER_COLUMNS } from '../src/repos/ledger';
import { MEMBER_COLUMNS } from '../src/repos/teams';
import { SHIFT_COLUMNS } from '../src/repos/shifts';
import { SWAP_COLUMNS } from '../src/repos/swaps';
import { WEBHOOK_EVENT_COLUMNS } from '../src/repos/webhooks';
import { createTestContext, type TestContext } from './helpers/app';

const SHARD_TABLES: [table: string, columns: string][] = [
  ['shifts', SHIFT_COLUMNS],
  ['swap_requests', SWAP_COLUMNS],
  ['team_members', MEMBER_COLUMNS],
  ['activity', ACTIVITY_COLUMNS],
  ['ledger_entries', LEDGER_COLUMNS],
];

const GLOBAL_TABLES: [table: string, columns: string][] = [
  ['webhook_events', WEBHOOK_EVENT_COLUMNS],
];

let ctx: TestContext | undefined;

afterEach(async () => {
  await ctx?.close();
  ctx = undefined;
});

/**
 * Guards code/schema drift. A repository column that the migrations never
 * create makes the route throw a Postgres error, which the envelope renders as
 * a bare 500 INTERNAL -- the client then shows a generic "Something went wrong".
 */
describe('migrations', () => {
  it('creates every column the repositories select', async () => {
    ctx = await createTestContext();
    const shard = ctx.topology.shards[0];
    if (!shard) throw new Error('expected a shard');

    for (const [table, columns] of SHARD_TABLES) {
      await expect(
        shard.query(`SELECT ${columns} FROM ${table} LIMIT 0`),
        `${table} is missing a column selected by: ${columns}`,
      ).resolves.toBeDefined();
    }

    for (const [table, columns] of GLOBAL_TABLES) {
      await expect(
        ctx.topology.global.query(`SELECT ${columns} FROM ${table} LIMIT 0`),
        `${table} is missing a column selected by: ${columns}`,
      ).resolves.toBeDefined();
    }
  });

  it('keeps the ledger append-only and its ref unique', async () => {
    ctx = await createTestContext();
    const shard = ctx.topology.shards[0];
    if (!shard) throw new Error('expected a shard');

    const insert = `INSERT INTO ledger_entries (team_id, kind, amount_cents, ref, reason)
      VALUES ($1, 'charge', 4999, $2, 'seed') RETURNING id`;
    const ref = `ledger-immutability-${Date.now()}`;
    const rows = await shard.query<{ id: string }>(insert, [newId(), ref]);
    const id = rows[0]?.id;
    if (!id) throw new Error('ledger insert returned no id');

    // The `ledger_no_update` trigger makes both write paths impossible, so a
    // balance can never be rewritten after the fact (Rule 02).
    await expect(shard.query('UPDATE ledger_entries SET amount_cents = 1 WHERE id = $1', [id])).rejects.toThrow(
      /ledger is append-only/,
    );
    await expect(shard.query('DELETE FROM ledger_entries WHERE id = $1', [id])).rejects.toThrow(/ledger is append-only/);
    const after = await shard.query<{ amount_cents: number }>('SELECT amount_cents FROM ledger_entries WHERE id = $1', [
      id,
    ]);
    expect(after[0]?.amount_cents).toBe(4999);

    // `ref` is unique so a retried webhook/job cannot double-record a charge.
    await expect(shard.query(insert, [newId(), ref])).rejects.toThrow(/duplicate key/);
  });
});
