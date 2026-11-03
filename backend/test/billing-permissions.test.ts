import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import type { Role } from '@rota/contract';
import { POLICY } from '../src/lib/policy';
import { createTestContext, resetDatabases, type TestContext } from './helpers/app';
import {
  addMember,
  checkout,
  createTeam,
  createTeamWithOwner,
  errorCode,
  signUp,
  type TestUser,
} from './helpers/billing';

/**
 * Permission matrix for the billing surface, generated from `POLICY`
 * (Rule 01): the test reads the same table the server enforces, so a policy
 * change without a route change (or the reverse) fails here.
 */

const ROLES: Role[] = ['owner', 'admin', 'manager', 'member'];
const BILLING_ACTIONS = ['plans.read', 'billing.read', 'billing.ledger', 'billing.checkout'] as const;
type BillingAction = (typeof BILLING_ACTIONS)[number];

interface RouteResponse {
  statusCode: number;
  body: string;
  json(): unknown;
}

let ctx: TestContext;

beforeAll(async () => {
  ctx = await createTestContext();
});

beforeEach(async () => {
  await resetDatabases(ctx);
});

afterAll(async () => {
  await ctx.close();
});

async function callRoute(action: BillingAction, user: TestUser, teamId: string, call: number): Promise<RouteResponse> {
  const headers = { authorization: user.token };
  switch (action) {
    case 'plans.read':
      return ctx.app.inject({ method: 'GET', url: '/v1/plans', headers });
    case 'billing.read':
      return ctx.app.inject({ method: 'GET', url: `/v1/teams/${teamId}/billing/subscription`, headers });
    case 'billing.ledger':
      return ctx.app.inject({ method: 'GET', url: `/v1/teams/${teamId}/billing/ledger`, headers });
    case 'billing.checkout':
      return checkout(ctx, {
        token: user.token,
        teamId,
        body: { planKey: 'starter', seats: 5 },
        key: `perm-${call}`,
      });
  }
}

describe('billing permissions match POLICY', () => {
  it('allows exactly the roles POLICY names for every billing action', async () => {
    const users = new Map<Role, TestUser>();
    for (const role of ROLES) users.set(role, await signUp(ctx, `${role}@rota.test`));
    const teamId = await createTeam(ctx);
    for (const role of ROLES) await addMember(ctx, teamId, users.get(role)!.id, role);

    let call = 0;
    for (const action of BILLING_ACTIONS) {
      for (const role of ROLES) {
        const allowed = POLICY[action].includes(role);
        const user = users.get(role)!;
        const res = await callRoute(action, user, teamId, call);
        call += 1;
        const label = `${role} → ${action}`;
        if (allowed) {
          expect(res.statusCode, `${label} expected success, got ${res.statusCode}: ${res.body}`).toBe(200);
        } else {
          expect(res.statusCode, `${label} expected 403, got ${res.statusCode}: ${res.body}`).toBe(403);
          expect(errorCode(res.json()), label).toBe('FORBIDDEN');
        }
      }
    }
  });

  it('is 404 for a non-member on every team billing route — never 403', async () => {
    const { teamId } = await createTeamWithOwner(ctx);
    const outsider = await signUp(ctx, 'outsider@rota.test');
    const headers = { authorization: outsider.token };

    const subscription = await ctx.app.inject({
      method: 'GET',
      url: `/v1/teams/${teamId}/billing/subscription`,
      headers,
    });
    expect(subscription.statusCode).toBe(404);

    const ledger = await ctx.app.inject({ method: 'GET', url: `/v1/teams/${teamId}/billing/ledger`, headers });
    expect(ledger.statusCode).toBe(404);

    const pay = await checkout(ctx, {
      token: outsider.token,
      teamId,
      body: { planKey: 'starter', seats: 5 },
      key: 'outsider-checkout',
    });
    expect(pay.statusCode).toBe(404);
    expect(errorCode(pay.json())).toBe('NOT_FOUND');
  });

  it('is 401 without a token on every billing route', async () => {
    const { teamId } = await createTeamWithOwner(ctx);

    const plans = await ctx.app.inject({ method: 'GET', url: '/v1/plans' });
    expect(plans.statusCode).toBe(401);

    const subscription = await ctx.app.inject({
      method: 'GET',
      url: `/v1/teams/${teamId}/billing/subscription`,
    });
    expect(subscription.statusCode).toBe(401);

    const ledger = await ctx.app.inject({ method: 'GET', url: `/v1/teams/${teamId}/billing/ledger` });
    expect(ledger.statusCode).toBe(401);

    const pay = await checkout(ctx, { teamId, body: { planKey: 'starter', seats: 5 }, key: 'anon-checkout' });
    expect(pay.statusCode).toBe(401);
  });
});
