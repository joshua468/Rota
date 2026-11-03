import type { FastifyInstance } from 'fastify';
import type { AppDeps } from '../app';

interface Readiness {
  ok: boolean;
  checks: Record<string, 'ok' | 'fail'>;
}

async function readiness(deps: AppDeps): Promise<Readiness> {
  const checks: Record<string, 'ok' | 'fail'> = {};

  checks.database = deps.topology.global ? 'ok' : 'fail';
  try {
    await deps.topology.global.query('SELECT 1');
  } catch {
    checks.database = 'fail';
  }

  const shardResults = await Promise.all(
    deps.topology.shards.map((shard) => shard.query('SELECT 1').then(() => true).catch(() => false)),
  );
  checks.shards = shardResults.every(Boolean) ? 'ok' : 'fail';

  checks.redis = deps.rateLimiter.healthy() ? 'ok' : 'fail';
  if (deps.queue.healthy) {
    checks.queue = (await deps.queue.healthy().catch(() => false)) ? 'ok' : 'fail';
  } else {
    checks.queue = 'ok';
  }

  const production = deps.env.NODE_ENV === 'production';
  checks.mail =
    deps.env.MAIL_DRIVER === 'resend' && deps.env.RESEND_API_KEY && deps.env.MAIL_FROM
      ? 'ok'
      : production
        ? 'fail'
        : 'ok';
  checks.payments =
    deps.env.FLUTTERWAVE_SECRET_KEY && deps.env.FLUTTERWAVE_SECRET_HASH
      ? 'ok'
      : production
        ? 'fail'
        : 'ok';

  return { ok: Object.values(checks).every((value) => value === 'ok'), checks };
}

export function registerHealthRoutes(app: FastifyInstance, deps: AppDeps): void {
  // Liveness: the process is up. Never touches dependencies, so a slow
  // database cannot cause the orchestrator to kill an otherwise healthy pod.
  app.get('/healthz', async () => ({ status: 'ok' as const }));

  // Readiness: every dependency the request path or background work needs.
  app.get('/readyz', async (_req, reply) => {
    const result = await readiness(deps);
    reply.status(result.ok ? 200 : 503);
    return { status: result.ok ? ('ok' as const) : ('degraded' as const), checks: result.checks };
  });

  // Prometheus text exposition (no dependency). Scrape aggressively; the
  // queries are cheap and the webhook gauges make stuck events visible.
  app.get('/metrics', async (_req, reply) => {
    const metrics = deps.metrics;
    const ready = await readiness(deps);
    let webhookCounts: { status: string; count: string }[] = [];
    try {
      webhookCounts = await deps.topology.global.query<{ status: string; count: string }>(
        'SELECT status, count(*)::text AS count FROM webhook_events GROUP BY status',
      );
    } catch {
      webhookCounts = [];
    }

    const lines = [
      '# HELP rota_uptime_seconds Process uptime in seconds.',
      '# TYPE rota_uptime_seconds gauge',
      `rota_uptime_seconds ${metrics ? Math.floor((Date.now() - metrics.startedAt) / 1000) : 0}`,
      '# HELP rota_ready Whether every readiness check passed.',
      '# TYPE rota_ready gauge',
      `rota_ready ${ready.ok ? 1 : 0}`,
      '# HELP rota_http_requests_total HTTP requests served.',
      '# TYPE rota_http_requests_total counter',
      `rota_http_requests_total ${metrics?.requests ?? 0}`,
      '# HELP rota_http_errors_total HTTP responses with status >= 500.',
      '# TYPE rota_http_errors_total counter',
      `rota_http_errors_total ${metrics?.errors ?? 0}`,
      '# HELP rota_http_responses_total HTTP responses by status code.',
      '# TYPE rota_http_responses_total counter',
      ...Object.entries(metrics?.byStatus ?? {}).map(
        ([status, count]) => `rota_http_responses_total{status="${status}"} ${count}`,
      ),
      '# HELP rota_webhook_events Webhook inbox rows by status.',
      '# TYPE rota_webhook_events gauge',
      ...webhookCounts.map((row) => `rota_webhook_events{status="${row.status}"} ${row.count}`),
      '',
    ];
    reply.type('text/plain; version=0.0.4');
    return lines.join('\n');
  });
}
