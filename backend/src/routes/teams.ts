import { z } from 'zod';
import { Id, RequestBodies } from '@rota/contract';
import type { FastifyInstance } from 'fastify';
import type { AppDeps } from '../app';
import { assertSeatAvailable, assertTeamWritable } from '../billing/entitlements';
import { cached, invalidate } from '../cache/cache';
import { ROSTER_TTL_MS, rosterKey } from '../cache/keys';
import type { TeamScope } from '../db/types';
import { assertCan, requireMembership, requireUser } from '../http/auth';
import { parseWith, NoQuery } from '../http/validate';
import { conflict, notFound } from '../lib/errors';
import { newId } from '../lib/ids';
import { enqueueMail, inviteMail } from '../jobs/mail';
import { logActivity } from '../repos/activity';
import { acceptInvite, createInvite, findInviteByToken, inviteStatus, type InviteRow } from '../repos/invites';
import { isoStamp, loadUsersByIds, maskEmail, toPublicUser } from '../repos/public';
import {
  countActiveOwners,
  createTeam,
  deactivateMember,
  findMember,
  getTeam,
  listActiveMembers,
} from '../repos/teams';

const TeamParams = z.object({ teamId: Id }).strict();
const MemberParams = z.object({ teamId: Id, userId: Id }).strict();
const TokenParams = z.object({ token: z.string().min(1).max(300) }).strict();

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Invite tokens are `teamId.secret` (docs/SHARDING.md), so the shard is known
 * from the token prefix before any lookup. A malformed token is simply 404 —
 * no oracle for which teams/tokens exist.
 */
function scopeFromToken(deps: AppDeps, token: string): TeamScope {
  const teamId = token.split('.')[0] ?? '';
  if (!UUID_RE.test(teamId)) throw notFound('This invite is no longer valid.');
  return deps.topology.scopeFor(teamId);
}

async function findInviteRow(deps: AppDeps, token: string): Promise<InviteRow | undefined> {
  const scope = scopeFromToken(deps, token);
  const invite = await findInviteByToken(deps.topology.shardDb(scope), token);
  if (!invite || invite.team_id !== scope.teamId) return undefined;
  return invite;
}

/**
 * Team surface (Rule 01/06): roles and roster come from the database, invites
 * are hashed at rest and seat-guarded inside one transaction, and the deep
 * link (`/v1/i/:token`) only confirms existence, never leaks details.
 */
export function registerTeamRoutes(app: FastifyInstance, deps: AppDeps): void {
  app.post('/v1/teams', async (req) => {
    const body = parseWith(RequestBodies.createTeam, req.body, 'body');
    const user = await requireUser(deps.env, deps.topology, req);
    const teamId = newId();
    const scope = deps.topology.scopeFor(teamId);
    const team = await createTeam(deps.topology.shardDb(scope), scope, {
      name: body.name,
      owner: { id: user.id, name: user.name },
    });
    return { id: team.id, name: team.name, role: 'owner' as const };
  });

  app.get('/v1/teams/:teamId', async (req) => {
    const { teamId } = parseWith(TeamParams, req.params, 'params');
    parseWith(NoQuery, req.query, 'query');
    const membership = await requireMembership(deps.env, deps.topology, req, teamId);
    assertCan(membership.role, 'team.read');
    const team = await getTeam(deps.topology.shardDb(membership.scope), membership.scope);
    if (!team) throw notFound('That team does not exist.');
    return { id: team.id, name: team.name, role: membership.role };
  });

  app.get('/v1/teams/:teamId/members', async (req) => {
    const { teamId } = parseWith(TeamParams, req.params, 'params');
    parseWith(NoQuery, req.query, 'query');
    const membership = await requireMembership(deps.env, deps.topology, req, teamId);
    assertCan(membership.role, 'member.read');
    const db = deps.topology.shardDb(membership.scope);
    return cached(deps.cache, rosterKey(teamId), ROSTER_TTL_MS, async () => {
      const roster = await listActiveMembers(db, membership.scope);
      const directory = await loadUsersByIds(deps.topology.global, roster.map((row) => row.user_id));
      return roster.map((row) => toPublicUser(directory.get(row.user_id), row.role, row.active, row.user_id));
    });
  });

  app.post('/v1/teams/:teamId/invites', async (req) => {
    const { teamId } = parseWith(TeamParams, req.params, 'params');
    const membership = await requireMembership(deps.env, deps.topology, req, teamId);
    assertCan(membership.role, 'team.invite');
    await assertTeamWritable(deps.topology.shardDb(membership.scope), membership.scope.teamId);
    const body = parseWith(RequestBodies.createInvite, req.body, 'body');
    const db = deps.topology.shardDb(membership.scope);

    // Seat guard and invite row share one transaction so two racing invites
    // cannot both take the last seat (seat-billing-ledger skill).
    const { token, row } = await db.tx(async (tx) => {
      await assertSeatAvailable(tx, teamId, 1);
      return createInvite(tx, { teamId, email: body.email, role: body.role, invitedBy: membership.user.id });
    });

    const team = await getTeam(db, membership.scope);
    await enqueueMail(
      deps.queue,
      inviteMail(body.email, {
        teamName: team?.name ?? '',
        role: row.role,
        token,
        expiresAt: row.expires_at,
        baseUrl: deps.env.PUBLIC_BASE_URL,
      }),
    );
    await logActivity(db, membership.scope, {
      type: 'member.invited',
      actorId: membership.user.id,
      summary: `${membership.user.name} invited ${row.email} as ${row.role}`,
      data: { inviteId: row.id, email: row.email, role: row.role },
    });

    return {
      id: row.id,
      email: row.email,
      role: row.role,
      expiresAt: isoStamp(row.expires_at),
    };
  });

  // Public (no auth): enough to render the accept screen, masked email only.
  app.get('/v1/invites/:token', async (req) => {
    const { token } = parseWith(TokenParams, req.params, 'params');
    parseWith(NoQuery, req.query, 'query');
    const invite = await findInviteRow(deps, token);
    if (!invite || inviteStatus(invite) !== 'pending') throw notFound('This invite is no longer valid.');
    const scope = deps.topology.scopeFor(invite.team_id);
    const team = await getTeam(deps.topology.shardDb(scope), scope);
    if (!team) throw notFound('This invite is no longer valid.');
    return {
      teamName: team.name,
      role: invite.role,
      emailMasked: maskEmail(invite.email),
      expiresAt: isoStamp(invite.expires_at),
    };
  });

  app.post('/v1/invites/:token/accept', async (req) => {
    const { token } = parseWith(TokenParams, req.params, 'params');
    parseWith(RequestBodies.acceptInvite, req.body, 'body');
    const user = await requireUser(deps.env, deps.topology, req);
    const scope = scopeFromToken(deps, token);
    const db = deps.topology.shardDb(scope);
    const accepted = await acceptInvite(db, scope, token, { id: user.id, email: user.email });
    if (!accepted) throw notFound('This invite is no longer valid.');
    await logActivity(db, scope, {
      type: 'member.joined',
      actorId: user.id,
      summary: `${user.name} joined the team`,
      data: { teamId: accepted.teamId, role: accepted.role },
    });
    await invalidate(deps.cache, [rosterKey(accepted.teamId)]);
    return accepted;
  });

  // Deep link for the invite email; never reveals invite details, only routes.
  app.get('/v1/i/:token', async (req, reply) => {
    const { token } = parseWith(TokenParams, req.params, 'params');
    parseWith(NoQuery, req.query, 'query');
    const invite = await findInviteRow(deps, token);
    if (!invite || inviteStatus(invite) !== 'pending') throw notFound('This invite is no longer valid.');
    return reply.redirect(`rota://invite/${token}`, 302);
  });

  app.delete('/v1/teams/:teamId/members/:userId', async (req, reply) => {
    const { teamId, userId } = parseWith(MemberParams, req.params, 'params');
    parseWith(NoQuery, req.query, 'query');
    const membership = await requireMembership(deps.env, deps.topology, req, teamId);
    const leaving = userId === membership.user.id;
    if (!leaving) {
      assertCan(membership.role, 'team.removeMember');
      await assertTeamWritable(deps.topology.shardDb(membership.scope), membership.scope.teamId);
    }

    const db = deps.topology.shardDb(membership.scope);
    const target = await findMember(db, membership.scope, userId);
    if (!target || !target.active) throw notFound('That member is not part of this team.');
    if (target.role === 'owner') {
      const owners = await countActiveOwners(db, membership.scope);
      if (owners <= 1) throw conflict('A team must always keep at least one active owner.');
    }

    await deactivateMember(db, membership.scope, userId);
    const directory = await loadUsersByIds(deps.topology.global, [userId]);
    const name = directory.get(userId)?.name ?? 'A member';
    await logActivity(db, membership.scope, {
      type: leaving ? 'member.left' : 'member.removed',
      actorId: membership.user.id,
      summary: leaving ? `${name} left the team` : `${membership.user.name} removed ${name} from the team`,
      data: { userId, role: target.role },
    });
    await invalidate(deps.cache, [rosterKey(teamId)]);
    reply.status(204);
    return null;
  });
}