import type { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import { MemoryCache, type Cache } from '../../src/cache/cache';
import { runMigrations } from '../../src/db/migrate';
import { createTopology, type Topology } from '../../src/db/topology';
import type { Env } from '../../src/env';
import { loadEnv, resetEnv } from '../../src/env';
import { RateLimiter, MemoryRateStore } from '../../src/http/rate-limit';
import { registerMailJobs } from '../../src/jobs/mail';
import { MemoryQueue, type Queue } from '../../src/jobs/queue';
import { MemoryLock, type Lock } from '../../src/locks/locks';
import { createLogger } from '../../src/lib/logger';

export interface TestContext {
  app: FastifyInstance;
  env: Env;
  topology: Topology;
  queue: Queue;
  cache: Cache;
  rateLimiter: RateLimiter;
  lock: Lock;
  close(): Promise<void>;
}

const GLOBAL_TABLES =
  'TRUNCATE TABLE users, refresh_tokens, one_time_tokens, devices, user_settings, idempotency_keys, webhook_events, user_avatars CASCADE';
const SHARD_TABLES =
  'TRUNCATE TABLE teams, team_members, invites, shifts, swap_requests, activity, subscriptions, ledger_entries, payment_intents, outbox CASCADE';

/**
 * Empties every table except `plans` (reference data) and clears rate-limit
 * counters, so each test starts from a clean database without paying for a
 * fresh PGlite instance.
 */
export async function resetDatabases(ctx: TestContext): Promise<void> {
  await ctx.topology.global.exec(GLOBAL_TABLES);
  for (const shard of ctx.topology.shards) await shard.exec(SHARD_TABLES);
  ctx.rateLimiter.clearLimits();
  await ctx.cache.close();
  await ctx.queue.close();
}

/**
 * Hermetic harness (docs/decisions/0006): PGlite databases, an in-process
 * queue and an in-process rate-limit store. No Redis, no network, no ports.
 *
 * `overrides` replaces individual env entries (e.g. `SHARD_COUNT: '2'` for the
 * sharding tests); everything not overridden keeps its hermetic default.
 */
export async function createTestContext(overrides: Record<string, string> = {}): Promise<TestContext> {
  resetEnv();
  const env = loadEnv({
    NODE_ENV: 'test',
    DATABASE_URL: 'pglite://global',
    SHARD_DATABASE_URLS: 'pglite://shard0',
    SHARD_COUNT: '1',
    DB_DRIVER: 'pglite',
    JWT_SECRET: 'test-jwt-secret-that-is-long-enough-32',
    PUBLIC_BASE_URL: 'http://localhost:4000',
    MAIL_DRIVER: 'dev',
    REDIS_URL: '',
    FLUTTERWAVE_SECRET_HASH: 'test-verif-hash',
    // Tests send distinct X-Forwarded-For values to isolate rate-limit
    // buckets; production only trusts the header when TRUST_PROXY is set.
    TRUST_PROXY: 'true',
    ...overrides,
  });
  const log = createLogger('silent');
  const topology = await createTopology(env);
  await runMigrations(topology);
  const queue = new MemoryQueue(log);
  registerMailJobs(queue, env, log);
  const cache = new MemoryCache();
  const rateLimiter = new RateLimiter(new MemoryRateStore(), log);
  const lock = new MemoryLock();
  const app = await buildApp({ env, topology, queue, cache, rateLimiter, lock, log });
  await app.ready();

  return {
    app,
    env,
    topology,
    queue,
    cache,
    rateLimiter,
    lock,
    async close() {
      await queue.drain(2_000);
      await app.close();
      await rateLimiter.close();
      await cache.close();
      await lock.close();
      await topology.close();
      resetEnv();
    },
  };
}
