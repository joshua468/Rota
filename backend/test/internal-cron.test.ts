import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createTestContext, type TestContext } from './helpers/app';

const CRON_SECRET = 'test-cron-secret-that-is-long-enough';

let ctx: TestContext;

beforeAll(async () => {
  ctx = await createTestContext({ CRON_SECRET });
});

afterAll(async () => {
  await ctx.close();
});

describe('internal cron entry', () => {
  it('is inert without a configured secret', async () => {
    const other = await createTestContext();
    try {
      const res = await other.app.inject({ method: 'GET', url: '/v1/internal/cron' });
      expect(res.statusCode).toBe(404);
    } finally {
      await other.close();
    }
  });

  it('rejects a missing or wrong bearer secret', async () => {
    const missing = await ctx.app.inject({ method: 'GET', url: '/v1/internal/cron' });
    expect(missing.statusCode).toBe(401);

    const wrong = await ctx.app.inject({
      method: 'GET',
      url: '/v1/internal/cron',
      headers: { authorization: 'Bearer not-the-secret' },
    });
    expect(wrong.statusCode).toBe(401);
  });

  it('runs the renewal, reconciliation and cleanup sweep', async () => {
    const res = await ctx.app.inject({
      method: 'GET',
      url: '/v1/internal/cron',
      headers: { authorization: `Bearer ${CRON_SECRET}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ ok: true, reconciled: 0, cleaned: 0 });
  });
});
