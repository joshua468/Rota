import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { ErrorEnvelope, RequestBodies } from '@rota/contract';
import { createTestContext, resetDatabases, type TestContext } from './helpers/app';
import { addMember, auth, createTeam, inviteAndJoin, signup } from './helpers/roster';

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

function errorCodeOf(res: { json(): unknown }): string {
  return ((res.json() as { error?: { code?: string } }).error?.code) ?? 'NO_ERROR';
}

describe('teams', () => {
  it('creates a team and reads it back as owner', async () => {
    const { teamId, owner } = await createTeam(ctx, 'Cooks');
    const res = await ctx.app.inject({ method: 'GET', url: `/v1/teams/${teamId}`, headers: auth(owner) });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ id: teamId, name: 'Cooks', role: 'owner' });
  });

  it('lists members with masked emails and server-derived roles', async () => {
    const { teamId, owner } = await createTeam(ctx, 'Cooks');
    const res = await ctx.app.inject({ method: 'GET', url: `/v1/teams/${teamId}/members`, headers: auth(owner) });
    expect(res.statusCode).toBe(200);
    const members = res.json() as Array<{ id: string; name: string; emailMasked: string; role: string; active: boolean }>;
    expect(members).toHaveLength(1);
    expect(members[0]).toMatchObject({ id: owner.id, name: 'owner', role: 'owner', active: true });
    expect(members[0]?.emailMasked).toMatch(/.+•+@.+\.test/);
  });

  it('enforces the starter seat cap at 402 SEAT_LIMIT', async () => {
    const { teamId, owner } = await createTeam(ctx, 'Seat Test');
    for (let index = 1; index <= 4; index += 1) {
      const ok = await ctx.app.inject({
        method: 'POST',
        url: `/v1/teams/${teamId}/invites`,
        headers: auth(owner),
        payload: RequestBodies.createInvite.parse({ email: `team${index}@seat.test`, role: 'member' }),
      });
      expect(ok.statusCode).toBe(200);
    }
    const over = await ctx.app.inject({
      method: 'POST',
      url: `/v1/teams/${teamId}/invites`,
      headers: auth(owner),
      payload: RequestBodies.createInvite.parse({ email: 'sixth@seat.test', role: 'member' }),
    });
    expect(over.statusCode).toBe(402);
    expect(errorCodeOf(over)).toBe('SEAT_LIMIT');
  });

  it('removes a member who then loses access (404, not 403)', async () => {
    const { teamId, owner } = await createTeam(ctx, 'Cooks');
    const member = await inviteAndJoin(ctx, teamId, 'Cooks', 'line@roster.test', 'member', owner);

    const gone = await ctx.app.inject({
      method: 'DELETE',
      url: `/v1/teams/${teamId}/members/${member.id}`,
      headers: auth(owner),
    });
    expect(gone.statusCode).toBe(204);

    const after = await ctx.app.inject({ method: 'GET', url: `/v1/teams/${teamId}`, headers: auth(member) });
    expect(after.statusCode).toBe(404);
    expect(errorCodeOf(after)).toBe('NOT_FOUND');
  });

  it('refuses to remove the last active owner', async () => {
    const { teamId, owner } = await createTeam(ctx, 'Cooks');
    const res = await ctx.app.inject({
      method: 'DELETE',
      url: `/v1/teams/${teamId}/members/${owner.id}`,
      headers: auth(owner),
    });
    expect(res.statusCode).toBe(409);
    expect(errorCodeOf(res)).toBe('CONFLICT');
  });

  it('lets an owner leave when another owner remains', async () => {
    const { teamId, owner } = await createTeam(ctx, 'Cooks');
    const second = await signup(ctx, 'other-owner@roster.test');
    await addMember(ctx, teamId, second.id, 'owner');

    const leave = await ctx.app.inject({
      method: 'DELETE',
      url: `/v1/teams/${teamId}/members/${owner.id}`,
      headers: auth(owner),
    });
    expect(leave.statusCode).toBe(204);

    const access = await ctx.app.inject({ method: 'GET', url: `/v1/teams/${teamId}`, headers: auth(owner) });
    expect(access.statusCode).toBe(404);
    const roster = await ctx.app.inject({ method: 'GET', url: `/v1/teams/${teamId}/members`, headers: auth(second) });
    expect((roster.json() as unknown[])).toHaveLength(1);
  });

  it('rejects a non-admin invite attempt with a clean error envelope', async () => {
    const { teamId, owner } = await createTeam(ctx, 'Cooks');
    const member = await inviteAndJoin(ctx, teamId, 'Cooks', 'plain@roster.test', 'member', owner);
    const res = await ctx.app.inject({
      method: 'POST',
      url: `/v1/teams/${teamId}/invites`,
      headers: auth(member),
      payload: RequestBodies.createInvite.parse({ email: 'nope@roster.test', role: 'member' }),
    });
    expect(res.statusCode).toBe(403);
    expect(ErrorEnvelope.parse(res.json()).error.code).toBe('FORBIDDEN');
  });
});