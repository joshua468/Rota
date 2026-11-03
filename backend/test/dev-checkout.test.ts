import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app';
import { loadEnv, resetEnv } from '../src/env';
import { createLogger } from '../src/lib/logger';
import { registerBillingJobs } from '../src/jobs/billing';
import { createTestContext, resetDatabases, type TestContext } from './helpers/app';
import { checkout, createTeamWithOwner, depsOf, shardOf } from './helpers/billing';

/**
 * The fake payment driver (ADR-0008) hands the app a hosted-checkout URL that
 * `Linking.openURL` opens in a browser. Until this route existed nothing served
 * it, so picking a plan 404'd. The page must let the charge complete through the
 * ordinary `webhooks` job, and it must not exist once the real driver is on.
 */

let ctx: TestContext;

beforeAll(async () => {
  ctx = await createTestContext();
  registerBillingJobs(ctx.queue, depsOf(ctx));
});

beforeEach(async () => {
  await resetDatabases(ctx);
});

afterAll(async () => {
  await ctx.queue.close();
  await ctx.close();
});

async function subscription(teamId: string) {
  return shardOf(ctx, teamId).one<{ plan_key: string; seats: number; status: string }>(
    'SELECT plan_key, seats, status FROM subscriptions WHERE team_id = $1',
    [teamId],
  );
}

describe('dev hosted-checkout page', () => {
  it('serves the fake authorize URL and completes the charge through the webhook job', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    const created = await checkout(ctx, {
      token: owner.token,
      teamId,
      body: { planKey: 'starter', seats: 5, callbackUrl: 'rota://billing' },
      key: 'dev-checkout',
    });
    expect(created.statusCode).toBe(200);

    const url = new URL(created.json().url as string);
    expect(url.pathname).toBe('/flutterwave/authorize');
    // The return deep link travels to the hosted page so paying can hand the
    // browser back to the app automatically.
    expect(url.searchParams.get('callback')).toBe('rota://billing');

    const page = await ctx.app.inject({ method: 'GET', url: `${url.pathname}${url.search}` });
    expect(page.statusCode).toBe(200);
    expect(page.headers['content-type']).toContain('text/html');
    expect(page.body).toContain(url.searchParams.get('tx_ref'));
    expect(page.body).toContain('var callback = "rota://billing";');

    const done = await ctx.app.inject({
      method: 'POST',
      url: url.pathname,
      headers: { 'content-type': 'application/json' },
      payload: { tx_ref: url.searchParams.get('tx_ref'), amount: url.searchParams.get('amount') },
    });
    expect(done.statusCode).toBe(200);
    expect(done.json()).toMatchObject({ ok: true });

    await ctx.queue.drain(10_000);
    expect(await subscription(teamId)).toMatchObject({ plan_key: 'starter', seats: 5, status: 'active' });
  });

  it('drops a web (http) callback so the fake page cannot become an open redirect', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    const created = await checkout(ctx, {
      token: owner.token,
      teamId,
      body: { planKey: 'starter', seats: 5, callbackUrl: 'https://evil.example/return' },
      key: 'dev-checkout-http-callback',
    });

    const url = new URL(created.json().url as string);
    const page = await ctx.app.inject({ method: 'GET', url: `${url.pathname}${url.search}` });
    expect(page.statusCode).toBe(200);
    expect(page.body).toContain('var callback = "";');
  });

  it('does not exist when the real Flutterwave driver is configured', async () => {
    resetEnv();
    const keyedEnv = loadEnv({
      NODE_ENV: 'development',
      DATABASE_URL: 'pglite://global',
      SHARD_DATABASE_URLS: 'pglite://shard0',
      SHARD_COUNT: '1',
      DB_DRIVER: 'pglite',
      JWT_SECRET: 'test-jwt-secret-that-is-long-enough-32',
      PUBLIC_BASE_URL: 'http://localhost:4000',
      MAIL_DRIVER: 'dev',
      REDIS_URL: '',
      FLUTTERWAVE_SECRET_KEY: 'sk_test_not_a_real_key',
    });
    const keyedApp = await buildApp({
      env: keyedEnv,
      topology: ctx.topology,
      queue: ctx.queue,
      cache: ctx.cache,
      rateLimiter: ctx.rateLimiter,
      lock: ctx.lock,
      log: createLogger('silent'),
    });
    await keyedApp.ready();
    try {
      const res = await keyedApp.inject({ method: 'GET', url: '/flutterwave/authorize?tx_ref=x&amount=2000' });
      expect(res.statusCode).toBe(404);
    } finally {
      await keyedApp.close();
      resetEnv();
    }
  });
});
