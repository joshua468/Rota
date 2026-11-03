import type { FastifyRequest } from 'fastify';
import type { Role } from '@rota/contract';
import type { Topology } from '../db/topology';
import type { TeamScope } from '../db/types';
import { notFound, unauthorized } from '../lib/errors';
import { can, type Action } from '../lib/policy';
import { forbidden } from '../lib/errors';
import { verifyAccessToken } from '../auth/tokens';
import type { Env } from '../env';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  token_version: number;
  timezone: string;
}

export interface Authed {
  user: AuthUser;
}

export interface TeamAuthed extends Authed {
  scope: TeamScope;
  role: Role;
}

function bearer(req: FastifyRequest): string | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length).trim();
}

/**
 * Verifies the access token and reloads the user from the primary (fresh
 * auth read — Rules 01/05). A token minted for an older `token_version` is
 * rejected, which is how logout-everywhere takes effect immediately.
 */
export async function requireUser(env: Env, topology: Topology, req: FastifyRequest): Promise<AuthUser> {
  if (req.authz) return req.authz.user;
  const token = bearer(req);
  if (!token) throw unauthorized();
  const claims = await verifyAccessToken(env.JWT_SECRET, token);
  if (!claims) throw unauthorized();
  const user = await topology.global.one<AuthUser>(
    'SELECT id, email, name, token_version, timezone FROM users WHERE id = $1',
    [claims.sub],
  );
  if (!user || user.token_version !== claims.tv) throw unauthorized();
  req.authz = { userId: user.id, user };
  return user;
}

/**
 * Membership is derived from the database for the team in the path — never
 * from the body. No row (or inactive) means the team does not exist for this
 * caller: 404, never 403 (Rule 01, SECURITY.md threat 2).
 */
export async function requireMembership(
  env: Env,
  topology: Topology,
  req: FastifyRequest,
  teamId: string,
): Promise<TeamAuthed> {
  const user = await requireUser(env, topology, req);
  const scope = topology.scopeFor(teamId);
  const member = await topology.shardDb(scope).one<{ role: Role; active: boolean }>(
    'SELECT role, active FROM team_members WHERE team_id = $1 AND user_id = $2',
    [teamId, user.id],
  );
  if (!member || !member.active) throw notFound();
  req.team = { scope, role: member.role };
  return { user, scope, role: member.role };
}

/** Role → action gate that every route calls before its handler (Rule 01). */
export function assertCan(role: Role, action: Action): void {
  if (!can(role, action)) throw forbidden();
}

/**
 * The caller's address. `X-Forwarded-For` is honoured only through Fastify's
 * `trustProxy` setting, which is off unless the deployment sets `TRUST_PROXY`.
 * Reading the header directly would let anyone choose their own rate-limit
 * bucket.
 */
export function clientIp(req: FastifyRequest): string {
  return req.ip;
}
