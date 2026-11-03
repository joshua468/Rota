import { AVATAR_MAX_BASE64, PathParams, QueryParams, RequestBodies } from '@rota/contract';
import type { FastifyInstance } from 'fastify';
import type { AppDeps } from '../app';
import { requireUser } from '../http/auth';
import { parseWith } from '../http/validate';
import { badRequest, notFound } from '../lib/errors';
import { decodeAvatarBase64, sniffImageType } from '../lib/avatar';
import { avatarPath, deleteAvatar, findAvatar, upsertAvatar } from '../repos/avatars';
import { membershipsForUser } from '../repos/members';

/**
 * The JSON body is base64, so the route needs more than the app-wide 256 KB
 * limit — but only this route gets the bigger limit.
 */
const AVATAR_BODY_LIMIT = AVATAR_MAX_BASE64 + 4 * 1024;

/**
 * A profile photo is a user resource, not a team resource, but it is still
 * team-scoped: only somebody who shares a team with the owner may read it
 * (SECURITY.md threat 2 — cross-team access answers 404, never 403).
 */
async function sharesTeam(deps: AppDeps, viewerId: string, ownerId: string): Promise<boolean> {
  if (viewerId === ownerId) return true;
  const memberships = await membershipsForUser(deps.topology.shards, viewerId);
  for (const membership of memberships) {
    const scope = deps.topology.scopeFor(membership.team_id);
    const member = await deps.topology.shardDb(scope).one<{ user_id: string }>(
      'SELECT user_id FROM team_members WHERE team_id = $1 AND user_id = $2 AND active = true',
      [membership.team_id, ownerId],
    );
    if (member) return true;
  }
  return false;
}

export function registerAvatarRoutes(app: FastifyInstance, deps: AppDeps): void {
  app.put('/v1/me/avatar', { bodyLimit: AVATAR_BODY_LIMIT }, async (req) => {
    const user = await requireUser(deps.env, deps.topology, req);
    const body = RequestBodies.putAvatar.parse(req.body);
    const bytes = decodeAvatarBase64(body.dataBase64);
    const sniffed = sniffImageType(bytes);
    if (!sniffed) {
      throw badRequest('That image could not be read. Use a JPEG, PNG or WebP file.');
    }
    if (sniffed !== body.contentType) {
      throw badRequest('That image does not match the file type. Upload it again.');
    }
    const stored = await upsertAvatar(deps.topology.global, {
      userId: user.id,
      contentType: sniffed,
      bytes,
    });
    return { avatarUrl: avatarPath(user.id, stored.updated_at), updatedAt: stored.updated_at.toISOString() };
  });

  app.delete('/v1/me/avatar', async (req, reply) => {
    const user = await requireUser(deps.env, deps.topology, req);
    await deleteAvatar(deps.topology.global, user.id);
    reply.status(204);
    return null;
  });

  app.get<{ Params: { userId: string } }>('/v1/users/:userId/avatar', async (req, reply) => {
    const { userId } = parseWith(PathParams.userId, req.params, 'params');
    parseWith(QueryParams.avatar, req.query, 'query');
    const viewer = await requireUser(deps.env, deps.topology, req);
    if (!(await sharesTeam(deps, viewer.id, userId))) {
      throw notFound('No photo found.');
    }
    const avatar = await findAvatar(deps.topology.global, userId);
    if (!avatar) throw notFound('No photo found.');
    reply.header('content-type', avatar.content_type);
    reply.header('cache-control', 'private, max-age=300');
    reply.header('content-length', String(avatar.bytes.length));
    return reply.status(200).send(avatar.bytes);
  });
}
