import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { RequestBodies } from '@rota/contract';
import { createTestContext, resetDatabases, type TestContext } from './helpers/app';
import { sha256 } from '../src/lib/crypto';
import { newId } from '../src/lib/ids';
import { auth, createTeam, inviteAndJoin, latestInviteToken } from './helpers/roster';

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

describe('invites', () => {
  it('serves masked invite info publicly for a pending invite', async () => {
    const { teamId, owner } = await createTeam(ctx, 'Cooks');
    const created = await ctx.app.inject({
      method: 'POST',
      url: `/v1/teams/${teamId}/invites`,
      headers: auth(owner),
      payload: RequestBodies.createInvite.parse({ email: 'erin@invite.test', role: 'manager' }),
    });
    expect(created.statusCode).toBe(200);
    const token = await latestInviteToken(ctx, 'erin@invite.test');

    const res = await ctx.app.inject({ method: 'GET', url: `/v1/invites/${encodeURIComponent(token)}` });
    expect(res.statusCode).toBe(200);
    const info = res.json() as { teamName: string; role: string; emailMasked: string; expiresAt: string };
    expect(info.teamName).toBe('Cooks');
    expect(info.role).toBe('manager');
    expect(info.emailMasked).toMatch(/^e•••@invite\.test$/);
    expect(new Date(info.expiresAt).getTime()).toBeGreaterThan(Date.now());
  });

  it('deep link redirects into the app without leaking details', async () => {
    const { teamId, owner } = await createTeam(ctx, 'Cooks');
    await ctx.app.inject({
      method: 'POST',
      url: `/v1/teams/${teamId}/invites`,
      headers: auth(owner),
      payload: RequestBodies.createInvite.parse({ email: 'erin@invite.test', role: 'member' }),
    });
    const token = await latestInviteToken(ctx, 'erin@invite.test');
    const res = await ctx.app.inject({ method: 'GET', url: `/v1/i/${encodeURIComponent(token)}` });
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe(`rota://invite/${token}`);
  });

  it('accepting an invite makes the user a member; the token is single-use', async () => {
    const { teamId, owner } = await createTeam(ctx, 'Cooks');
    const user = await inviteAndJoin(ctx, teamId, 'Cooks', 'frank@invite.test', 'member', owner);

    const team = await ctx.app.inject({ method: 'GET', url: `/v1/teams/${teamId}`, headers: auth(user) });
    expect(team.statusCode).toBe(200);
    expect(team.json()).toMatchObject({ id: teamId, role: 'member' });

    const token = await latestInviteToken(ctx, 'frank@invite.test');
    const replay = await ctx.app.inject({
      method: 'POST',
      url: `/v1/invites/${encodeURIComponent(token)}/accept`,
      headers: auth(user),
      payload: RequestBodies.acceptInvite.parse({ token }),
    });
    expect(replay.statusCode).toBe(404);
    expect(errorCodeOf(replay)).toBe('NOT_FOUND');
  });

  it('refuses to accept as the wrong account (404)', async () => {
    const { teamId, owner } = await createTeam(ctx, 'Cooks');
    await ctx.app.inject({
      method: 'POST',
      url: `/v1/teams/${teamId}/invites`,
      headers: auth(owner),
      payload: RequestBodies.createInvite.parse({ email: 'grace@invite.test', role: 'member' }),
    });
    const token = await latestInviteToken(ctx, 'grace@invite.test');

    // The caller signs up as someone else; the invite is address-bound.
    const wrong = await ctx.app.inject({
      method: 'POST',
      url: '/v1/auth/signup',
      headers: { 'x-forwarded-for': '172.16.9.9' },
      payload: RequestBodies.signup.parse({ email: 'impostor@invite.test', password: 'correct-horse-battery', name: 'Impostor' }),
    });
    const session = wrong.json() as { tokens: { accessToken: string } };
    const accept = await ctx.app.inject({
      method: 'POST',
      url: `/v1/invites/${encodeURIComponent(token)}/accept`,
      headers: { authorization: `Bearer ${session.tokens.accessToken}` },
      payload: RequestBodies.acceptInvite.parse({ token }),
    });
    expect(accept.statusCode).toBe(404);
  });

  it('expired and unknown invite tokens are indistinguishable 404s', async () => {
    const { teamId, owner } = await createTeam(ctx, 'Cooks');
    const fakeToken = `${teamId}.deadbeef`;
    await ctx.topology.shardDb(ctx.topology.scopeFor(teamId)).query(
      `INSERT INTO invites (id, team_id, email, role, token_hash, invited_by, expires_at)
       VALUES ($1, $2, $3, 'member', $4, $5, now() - interval '1 day')`,
      [newId(), teamId, 'expired@invite.test', sha256(fakeToken), owner.id],
    );

    const expired = await ctx.app.inject({ method: 'GET', url: `/v1/invites/${fakeToken}` });
    expect(expired.statusCode).toBe(404);
    const unknown = await ctx.app.inject({ method: 'GET', url: '/v1/invites/00000000-0000-4000-8000-000000000000.nope' });
    expect(unknown.statusCode).toBe(404);
    expect(errorCodeOf(expired)).toBe('NOT_FOUND');
    expect(errorCodeOf(unknown)).toBe('NOT_FOUND');
  });

  it('joining appears in the activity feed', async () => {
    const { teamId, owner } = await createTeam(ctx, 'Cooks');
    await inviteAndJoin(ctx, teamId, 'Cooks', 'henry@invite.test', 'member', owner);
    const feed = await ctx.app.inject({ method: 'GET', url: `/v1/teams/${teamId}/activity?limit=10`, headers: auth(owner) });
    expect(feed.statusCode).toBe(200);
    const items = (feed.json() as { items: Array<{ type: string }> }).items;
    expect(items.some((item) => item.type === 'member.joined')).toBe(true);
  });
});