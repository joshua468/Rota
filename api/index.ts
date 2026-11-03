import type { IncomingMessage, ServerResponse } from 'node:http';
import { buildApp, type AppDeps } from '../backend/src/app';
import { createCache } from '../backend/src/cache/cache';
import { createTopology } from '../backend/src/db/topology';
import { loadEnv } from '../backend/src/env';
import { createRateLimiter } from '../backend/src/http/rate-limit';
import { registerBillingJobs } from '../backend/src/jobs/billing';
import { registerMailJobs } from '../backend/src/jobs/mail';
import { createQueue } from '../backend/src/jobs/queue';
import { createLock } from '../backend/src/locks/locks';
import { createLogger } from '../backend/src/lib/logger';

/**
 * Vercel serverless entry. Builds the same Fastify app as the container, but
 * without `listen()`: Fastify's documented `routing(req, res)` seam lets the
 * platform hand a Node request straight to the router.
 *
 * Serverless caveat: the in-process queue driver is used and the renewal
 * schedule is disabled, because a function instance is frozen after the
 * response. Webhook and mail jobs accepted during a request are drained before
 * the invocation returns; recurring renewals need the container deployment in
 * docs/DEPLOYMENT.md.
 */
export const config = { maxDuration: 60 };

interface Runtime {
  app: Awaited<ReturnType<typeof buildApp>>;
  queue: Awaited<ReturnType<typeof createQueue>>;
}

let runtime: Promise<Runtime> | null = null;

function boot(): Promise<Runtime> {
  if (runtime) return runtime;
  runtime = (async () => {
    const env = loadEnv();
    const log = createLogger(env.NODE_ENV === 'test' ? 'silent' : 'info');
    const topology = await createTopology(env);
    const queue = await createQueue(env.REDIS_URL, log, false);
    registerMailJobs(queue, env, log);
    const cache = await createCache(env.REDIS_URL, log);
    const rateLimiter = await createRateLimiter(env, log);
    const lock = await createLock(env.REDIS_URL, log, false);
    const deps: AppDeps = { env, topology, queue, cache, rateLimiter, lock };
    registerBillingJobs(queue, deps, { scheduleRenewals: false });
    const app = await buildApp({ ...deps, log });
    await app.ready();
    return { app, queue };
  })();
  return runtime;
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const { app, queue } = await boot();
  await new Promise<void>((resolve, reject) => {
    res.on('finish', resolve);
    res.on('close', resolve);
    try {
      app.routing(req, res);
    } catch (error) {
      reject(error);
    }
  });
  await queue.drain(8_000).catch(() => undefined);
}
