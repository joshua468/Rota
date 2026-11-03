import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createTestContext, type TestContext } from './helpers/app';

let ctx: TestContext;

beforeAll(async () => {
  ctx = await createTestContext();
});

afterAll(async () => {
  await ctx.close();
});

describe('health and readiness', () => {
  it('serves liveness without touching the database', async () => {
    const res = await ctx.app.inject({ method: 'GET', url: '/healthz' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: 'ok' });
  });

  it('reports every readiness check', async () => {
    const res = await ctx.app.inject({ method: 'GET', url: '/readyz' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({
      status: 'ok',
      checks: {
        database: 'ok',
        shards: 'ok',
        redis: 'ok',
        queue: 'ok',
        mail: 'ok',
        payments: 'ok',
      },
    });
  });

  it('exports Prometheus metrics including readiness and webhook gauges', async () => {
    await ctx.app.inject({ method: 'GET', url: '/healthz' });
    const res = await ctx.app.inject({ method: 'GET', url: '/metrics' });
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/plain');
    expect(res.body).toContain('rota_ready 1');
    expect(res.body).toContain('rota_http_requests_total');
    expect(res.body).toContain('rota_webhook_events');
  });
});
