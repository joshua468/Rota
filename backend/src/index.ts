import { buildApp } from './app';
import { createCache } from './cache/cache';
import { runMigrations } from './db/migrate';
import { createTopology } from './db/topology';
import { loadEnv } from './env';
import { createRateLimiter } from './http/rate-limit';
import { registerBillingJobs } from './jobs/billing';
import { registerMailJobs } from './jobs/mail';
import { createQueue } from './jobs/queue';
import { createLock } from './locks/locks';
import { loadDotEnv } from './lib/dotenv';
import { createLogger } from './lib/logger';

async function main(): Promise<void> {
  loadDotEnv();
  const env = loadEnv();
  const log = createLogger(env.NODE_ENV === 'test' ? 'silent' : 'info');
  const topology = await createTopology(env);

  if (env.DB_DRIVER === 'pglite' || env.NODE_ENV !== 'production') {
    const applied = await runMigrations(topology);
    log.info({ applied: applied.length }, 'migrations applied');
  }

  const durable = env.NODE_ENV === 'production';
  const queue = await createQueue(env.REDIS_URL, log, durable);
  registerMailJobs(queue, env, log);
  const cache = await createCache(env.REDIS_URL, log);
  const rateLimiter = await createRateLimiter(env, log);
  const lock = await createLock(env.REDIS_URL, log, durable);
  const deps = { env, topology, queue, cache, rateLimiter, lock };
  registerBillingJobs(queue, deps);
  const app = await buildApp({ ...deps, log });

  await app.listen({ port: env.PORT, host: '0.0.0.0' });
  log.info({ port: env.PORT, driver: env.DB_DRIVER, queue: env.REDIS_URL ? 'bullmq' : 'in-process' }, 'api listening');

  let closing = false;
  const shutdown = async (signal: string): Promise<void> => {
    if (closing) return;
    closing = true;
    log.info({ signal }, 'shutting down');
    await app.close();
    await queue.close();
    await cache.close();
    await rateLimiter.close();
    await lock.close();
    await topology.close();
    process.exit(0);
  };
  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
