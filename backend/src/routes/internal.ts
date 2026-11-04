import type { FastifyInstance } from 'fastify';
import type { Logger } from 'pino';
import type { AppDeps } from '../app';
import { cleanupExpiredIdempotency } from '../repos/idempotency';
import { reconcileWebhookEvents, runRenewals } from '../jobs/billing';
import { safeEqual } from '../lib/crypto';
import { notFound, unauthorized } from '../lib/errors';

/**
 * Platform scheduler entry (Vercel Cron). One authenticated call runs the work
 * that a container worker would run on its own timer: the renewal sweep, the
 * webhook inbox reconciliation, and idempotency expiry. The route is inert
 * unless `CRON_SECRET` is configured, and Vercel sends it automatically as
 * `Authorization: Bearer <CRON_SECRET>` when the variable exists.
 */
export function registerInternalRoutes(app: FastifyInstance, deps: AppDeps): void {
  const run = async (authorization: string | undefined): Promise<Record<string, unknown>> => {
    if (!deps.env.CRON_SECRET) throw notFound();
    const expected = `Bearer ${deps.env.CRON_SECRET}`;
    if (!authorization || !safeEqual(expected, authorization)) throw unauthorized('Invalid cron secret');

    const log = app.log as unknown as Logger;
    await runRenewals(deps, log);
    const reconciled = await reconcileWebhookEvents(deps, log);
    const cleaned = await cleanupExpiredIdempotency(deps.topology.global);
    // Serverless invocations freeze after the response, so finish the jobs the
    // sweep just enqueued before returning (a no-op for the BullMQ container).
    await deps.queue.drain(25_000);
    return { ok: true, reconciled, cleaned };
  };

  app.get('/v1/internal/cron', async (req) => run(req.headers.authorization));
  app.post('/v1/internal/cron', async (req) => run(req.headers.authorization));
}
