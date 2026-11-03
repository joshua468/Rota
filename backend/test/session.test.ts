import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { RequestBodies, SessionPayload } from '@rota/contract';
import { createTestContext, resetDatabases, type TestContext } from './helpers/app';
import { auth, createTeam } from './helpers/roster';

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

/**
 * Regression: `membershipsForUser` aliased the team name `AS team_name`, but the
 * code read `first.teamName`, so `team.name` came back `undefined`. A member's
 * session payload then failed `SessionPayload.parse` on the client and every
 * sign-in showed "Please try again." Teamless users never hit it.
 */
describe('session payload team name', () => {
  it('includes the team name after a member signs in', async () => {
    const { owner } = await createTeam(ctx, 'Northwind Cafe', 'owner@session.test');

    const res = await ctx.app.inject({
      method: 'POST',
      url: '/v1/auth/login',
      payload: RequestBodies.login.parse({
        email: owner.email,
        password: 'correct-horse-battery',
        deviceId: 'device-session-test',
      }),
    });

    expect(res.statusCode).toBe(200);
    const session = SessionPayload.parse(res.json());
    expect(session.team).toMatchObject({ name: 'Northwind Cafe', role: 'owner' });
  });

  it('includes the team name on /v1/me', async () => {
    const { owner } = await createTeam(ctx, 'Northwind Cafe', 'owner@session.test');

    const res = await ctx.app.inject({ method: 'GET', url: '/v1/me', headers: auth(owner) });

    expect(res.statusCode).toBe(200);
    const me = res.json() as { team: { name: string; role: string } | null };
    expect(me.team).toMatchObject({ name: 'Northwind Cafe', role: 'owner' });
  });
});
