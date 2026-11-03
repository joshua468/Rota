import { createPgDatabase, type PgOptions } from './pg';
import { createPgliteDatabase } from './pglite';
import { shardFor, type DatabaseHandle, type TeamScope } from './types';
import type { Env } from '../env';

/**
 * Database topology: one global (identity) database plus SHARD_COUNT shards.
 * Teams are placed with `fnv1a(teamId) % SHARD_COUNT` and never move
 * (docs/SHARDING.md). There is no cross-shard SQL: a request picks exactly one
 * shard from the TeamScope it authenticated, plus the global database.
 */
export interface Topology {
  global: DatabaseHandle;
  shards: readonly DatabaseHandle[];
  shardCount: number;
  scopeFor(teamId: string): TeamScope;
  shardDb(scope: TeamScope): DatabaseHandle;
  close(): Promise<void>;
}

export function buildTopology(global: DatabaseHandle, shards: DatabaseHandle[]): Topology {
  if (shards.length === 0) throw new Error('At least one shard is required');
  return {
    global,
    shards,
    shardCount: shards.length,
    scopeFor(teamId: string): TeamScope {
      return { teamId, shard: shardFor(teamId, shards.length) };
    },
    shardDb(scope: TeamScope): DatabaseHandle {
      const db = shards[scope.shard];
      if (!db) throw new Error(`No shard ${scope.shard}`);
      return db;
    },
    async close(): Promise<void> {
      await Promise.all([global.close(), ...shards.map((s) => s.close())]);
    },
  };
}

export async function createTopology(env: Env): Promise<Topology> {
  if (env.DB_DRIVER === 'pglite') {
    const global = createPgliteDatabase(new (await import('@electric-sql/pglite')).PGlite());
    const shards = await Promise.all(
      Array.from({ length: env.SHARD_COUNT }, async () =>
        createPgliteDatabase(new (await import('@electric-sql/pglite')).PGlite()),
      ),
    );
    return buildTopology(global, shards);
  }

  const options: PgOptions = {
    ssl: env.DB_SSL,
    connectionTimeoutMs: env.DB_CONNECTION_TIMEOUT_MS,
    statementTimeoutMs: env.DB_STATEMENT_TIMEOUT_MS,
    applicationName: 'rota-api',
  };
  const global = createPgDatabase(env.DATABASE_URL, options);
  const shards = env.SHARD_DATABASE_URLS.map((url) => createPgDatabase(url, options));
  if (shards.length !== env.SHARD_COUNT) {
    throw new Error(
      `SHARD_COUNT is ${env.SHARD_COUNT} but SHARD_DATABASE_URLS lists ${shards.length} URL(s)`,
    );
  }
  return buildTopology(global, shards);
}
