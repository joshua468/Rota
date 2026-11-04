import cors from '@fastify/cors';
import Fastify, { type FastifyBaseLogger, type FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import type { Env } from './env';
import type { Topology } from './db/topology';
import type { Queue } from './jobs/queue';
import type { Cache } from './cache/cache';
import type { RateLimiter } from './http/rate-limit';
import type { Lock } from './locks/locks';
import { ApiError, internal, statusFor } from './lib/errors';
import type { Logger } from 'pino';
import { newId } from './lib/ids';
import { createErrorReporter, type ErrorReporter } from './lib/telemetry';
import { registerHealthRoutes } from './routes/health';
import { registerAuthRoutes } from './routes/auth';
import { registerMeRoutes } from './routes/me';
import { registerAvatarRoutes } from './routes/avatars';
import { registerTeamRoutes } from './routes/teams';
import { registerShiftRoutes } from './routes/shifts';
import { registerSwapRoutes } from './routes/swaps';
import { registerFeedRoutes } from './routes/feed';
import { registerBillingRoutes } from './routes/billing';
import { registerWebhookRoutes } from './routes/webhooks';
import { registerDevCheckoutRoutes } from './routes/dev-checkout';
import { registerInternalRoutes } from './routes/internal';

export interface Metrics {
  startedAt: number;
  requests: number;
  errors: number;
  byStatus: Record<string, number>;
}

export function createMetrics(): Metrics {
  return { startedAt: Date.now(), requests: 0, errors: 0, byStatus: {} };
}

/** Everything a route module is allowed to reach. */
export interface AppDeps {
  env: Env;
  topology: Topology;
  queue: Queue;
  cache: Cache;
  rateLimiter: RateLimiter;
  lock: Lock;
  metrics?: Metrics;
  reporter?: ErrorReporter;
}

export interface BuildOptions {
  env: Env;
  topology: Topology;
  queue: Queue;
  cache: Cache;
  rateLimiter: RateLimiter;
  lock: Lock;
  log: Logger;
  metrics?: Metrics;
}

export async function buildApp(options: BuildOptions): Promise<FastifyInstance> {
  const { env, topology, queue, cache, rateLimiter, lock, log } = options;
  const metrics = options.metrics ?? createMetrics();
  const reporter = createErrorReporter(env, log);
  const deps: AppDeps = { env, topology, queue, cache, rateLimiter, lock, metrics, reporter };

  // Typed as FastifyBaseLogger so every route module sees the default
  // FastifyInstance generics (pino still provides the implementation).
  const baseLogger: FastifyBaseLogger = log;
  const app = Fastify({
    loggerInstance: baseLogger,
    bodyLimit: 256 * 1024,
    disableRequestLogging: true,
    genReqId: () => newId(),
    // Only trust X-Forwarded-For when the deployment explicitly opts in. With
    // this off, Fastify uses the socket address and an attacker cannot choose
    // the rate-limit identity by spoofing a header.
    trustProxy: env.TRUST_PROXY,
  });

  const corsOrigin =
    env.CORS_ORIGINS.length > 0
      ? env.CORS_ORIGINS.includes('*')
        ? true
        : env.CORS_ORIGINS
      : env.NODE_ENV === 'production'
        ? false
        : true;
  await app.register(cors, {
    origin: corsOrigin,
    allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key', 'X-Request-Id'],
  });

  app.decorateRequest('reqId', '');
  app.decorateRequest('startedAt', 0);
  app.decorateRequest('authz', undefined);
  app.decorateRequest('team', undefined);

  app.addHook('onRequest', async (req, reply) => {
    const incoming = req.headers['x-request-id'];
    req.reqId = typeof incoming === 'string' && incoming.length > 0 && incoming.length < 128 ? incoming : req.id;
    req.startedAt = Date.now();
    reply.header('x-request-id', req.reqId);
  });

  // One structured line per request (Rule 06): reqId, userId, teamId, route, status, ms.
  app.addHook('onResponse', async (req, reply) => {
    metrics.requests += 1;
    const status = String(reply.statusCode);
    metrics.byStatus[status] = (metrics.byStatus[status] ?? 0) + 1;
    if (reply.statusCode >= 500) metrics.errors += 1;
    log.info(
      {
        reqId: req.reqId,
        userId: req.authz?.userId ?? null,
        teamId: req.team?.scope.teamId ?? null,
        route: `${req.method} ${req.routeOptions?.url ?? req.url}`,
        status: reply.statusCode,
        ms: Date.now() - req.startedAt,
      },
      'request',
    );
  });

  app.setErrorHandler((error: unknown, req, reply) => {
    if (error instanceof ApiError) {
      reply.status(error.status).send(error.envelope(req.reqId));
      return;
    }
    if (error instanceof ZodError) {
      const issue = error.issues[0];
      const where = issue && issue.path.length > 0 ? `${issue.path.join('.')}: ` : '';
      const api = new ApiError('VALIDATION_FAILED', 400, `${where}${issue?.message ?? 'invalid'}`, req.reqId);
      reply.status(400).send(api.envelope(req.reqId));
      return;
    }
    const fastifyError = error as { validation?: unknown; statusCode?: number };
    if (fastifyError.validation) {
      const api = new ApiError('VALIDATION_FAILED', 400, 'Request failed validation', req.reqId);
      reply.status(400).send(api.envelope(req.reqId));
      return;
    }
    if (fastifyError.statusCode === 413) {
      const api = new ApiError('PAYLOAD_TOO_LARGE', 413, 'Payload too large', req.reqId);
      reply.status(413).send(api.envelope(req.reqId));
      return;
    }
    // Fastify itself rejects some requests (415, 406, body limits…) before our
    // Zod handlers run. Keep the status and the error envelope — never a 500.
    if (typeof fastifyError.statusCode === 'number' && fastifyError.statusCode >= 400 && fastifyError.statusCode < 500) {
      const api = new ApiError(
        'VALIDATION_FAILED',
        fastifyError.statusCode,
        (fastifyError as { message?: string }).message ?? 'Request failed validation',
        req.reqId,
      );
      reply.status(fastifyError.statusCode).send(api.envelope(req.reqId));
      return;
    }
    log.error({ reqId: req.reqId, err: error }, 'unhandled error');
    reporter.capture(error, { reqId: req.reqId, route: `${req.method} ${req.url}` });
    const api = internal();
    reply.status(500).send(api.envelope(req.reqId));
  });

  app.setNotFoundHandler((req, reply) => {
    const api = new ApiError('NOT_FOUND', 404, 'Not found', req.reqId);
    reply.status(404).send(api.envelope(req.reqId));
  });

  registerHealthRoutes(app, deps);
  registerAuthRoutes(app, deps);
  registerMeRoutes(app, deps);
  registerAvatarRoutes(app, deps);
  registerTeamRoutes(app, deps);
  registerShiftRoutes(app, deps);
  registerSwapRoutes(app, deps);
  registerFeedRoutes(app, deps);
  registerBillingRoutes(app, deps);
  registerWebhookRoutes(app, deps);
  registerDevCheckoutRoutes(app, deps);
  registerInternalRoutes(app, deps);

  return app;
}

export { statusFor };
