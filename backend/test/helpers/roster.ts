import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { RequestBodies, SessionPayload, type Role } from '@rota/contract';
import type { DatabaseHandle, TeamScope } from '../../src/db/types';
import type { TestContext } from './app';

/**
 * Roster fixtures for team/shift/swap/feed tests. Signups send a unique
 * `x-forwarded-for` because the auth route rate-limits signup at 5/min/IP
 * (Rule 06) and `resetDatabases` clears counters per test, not per request.
 */

export interface RosterUser {
  id: string;
  email: string;
  name: string;
  token: string;
}

let ipSequence = 1024;

function uniqueForwardedIp(): string {
  ipSequence += 1;
  return `172.16.${Math.floor(ipSequence / 256)}.${ipSequence % 256}`;
}

export const auth = (user: Pick<RosterUser, 'token'>): Record<string, string> => ({ authorization: user.token });

export async function signup(ctx: TestContext, email: string): Promise<RosterUser> {
  const res = await ctx.app.inject({
    method: 'POST',
    url: '/v1/auth/signup',
    headers: { 'x-forwarded-for': uniqueForwardedIp() },
    payload: RequestBodies.signup.parse({
      email,
      password: 'correct-horse-battery',
      name: email.split('@')[0] ?? 'User',
    }),
  });
  if (res.statusCode !== 200) throw new Error(`signup ${email} failed: ${res.statusCode} ${res.body}`);
  const session = SessionPayload.parse(res.json());
  return { id: session.user.id, email, name: session.user.name, token: `Bearer ${session.tokens.accessToken}` };
}

export interface TeamFixture {
  teamId: string;
  owner: RosterUser;
}

export async function createTeam(
  ctx: TestContext,
  name: string,
  ownerEmail = 'owner@roster.test',
): Promise<TeamFixture> {
  const owner = await signup(ctx, ownerEmail);
  const res = await ctx.app.inject({
    method: 'POST',
    url: '/v1/teams',
    headers: auth(owner),
    payload: RequestBodies.createTeam.parse({ name }),
  });
  if (res.statusCode !== 200) throw new Error(`createTeam failed: ${res.statusCode} ${res.body}`);
  const team = res.json() as { id: string };
  return { teamId: team.id, owner };
}

/** Direct SQL membership for roles that would otherwise need an invite flow. */
export async function addMember(ctx: TestContext, teamId: string, userId: string, role: Role): Promise<void> {
  await shardOf(ctx, teamId).query('INSERT INTO team_members (team_id, user_id, role) VALUES ($1, $2, $3)', [
    teamId,
    userId,
    role,
  ]);
}

export function scopeOf(ctx: TestContext, teamId: string): TeamScope {
  return ctx.topology.scopeFor(teamId);
}

export function shardOf(ctx: TestContext, teamId: string): DatabaseHandle {
  return ctx.topology.shardDb(ctx.topology.scopeFor(teamId));
}

/**
 * Last dev-mail token for a recipient of a given kind. The mailbox is a shared
 * append-only file, so drain the queue first and scan newest-to-oldest: the
 * memory driver writes `.mail.jsonl` fire-and-forget, and reading without
 * draining can pick a stale token from a previous run (a token whose row no
 * longer exists → 404).
 */
export async function latestMailToken(
  ctx: TestContext,
  to: string,
  kind: 'magic' | 'reset' | 'invite',
): Promise<string> {
  await ctx.queue.drain();
  const mailbox = join(process.cwd(), '.mail.jsonl');
  const raw = await readFile(mailbox, 'utf8').catch(() => '');
  const lines = raw.split('\n').filter(Boolean);
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index];
    if (!line) continue;
    const entry = JSON.parse(line) as { to: string; kind: string; text: string };
    if (entry.to === to && entry.kind === kind) {
      const match = kind === 'invite'
        ? /\/v1\/i\/([A-Za-z0-9._-]+)/.exec(entry.text)
        : /token=([A-Za-z0-9._-]+)/.exec(entry.text);
      if (match?.[1]) return match[1];
    }
  }
  throw new Error(`no ${kind} mail found for ${to}`);
}

/** Last dev-mail invite for a recipient — the only place tokens are readable. */
export async function latestInviteToken(ctx: TestContext, to: string): Promise<string> {
  return latestMailToken(ctx, to, 'invite');
}

/** Full invite-and-accept loop through the real HTTP surface. */
export async function inviteAndJoin(
  ctx: TestContext,
  teamId: string,
  teamName: string,
  email: string,
  role: Role,
  by: RosterUser,
): Promise<RosterUser> {
  const created = await ctx.app.inject({
    method: 'POST',
    url: `/v1/teams/${teamId}/invites`,
    headers: auth(by),
    payload: RequestBodies.createInvite.parse({ email, role: role === 'owner' ? 'member' : role }),
  });
  if (created.statusCode !== 200) {
    throw new Error(`invite for ${email} to ${teamName} failed: ${created.statusCode} ${created.body}`);
  }
  const user = await signup(ctx, email);
  const token = await latestInviteToken(ctx, email);
  const accepted = await ctx.app.inject({
    method: 'POST',
    url: `/v1/invites/${encodeURIComponent(token)}/accept`,
    headers: auth(user),
    payload: RequestBodies.acceptInvite.parse({ token }),
  });
  if (accepted.statusCode !== 200) {
    throw new Error(`accept invite for ${email} failed: ${accepted.statusCode} ${accepted.body}`);
  }
  return user;
}