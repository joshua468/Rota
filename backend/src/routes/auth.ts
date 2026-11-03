import { RequestBodies, type AuthTokens, type SelfUser, type SessionPayload } from '@rota/contract';
import type { FastifyInstance } from 'fastify';
import type { AppDeps } from '../app';
import {
  ACCESS_TTL_SECONDS,
  consumeOneTime,
  createSession,
  issueAccessToken,
  issueOneTime,
  revokeAllForUser,
  revokeFamily,
  rotateRefresh,
} from '../auth/tokens';
import { enqueueMail, magicLinkMail, resetMail } from '../jobs/mail';
import { clientIp, requireUser } from '../http/auth';
import { RATE_RULES, hashKey } from '../http/rate-limit';
import { hashPassword, sha256, verifyPassword } from '../lib/crypto';
import { conflict, unauthorized } from '../lib/errors';
import { randomToken } from '../lib/ids';
import { membershipsForUser } from '../repos/members';
import { acceptInvite } from '../repos/invites';
import { createUser, findUserByEmail, findUserById, setUserPassword, type UserRow } from '../repos/users';
import { avatarPath, findAvatar } from '../repos/avatars';

/**
 * `signup` has no deviceId in the contract, so the first session is recorded
 * against a synthetic device id; the real device id appears on the first
 * refresh rotation.
 */
const SIGNUP_DEVICE_ID = 'signup';

let dummyHash: Promise<string> | null = null;
/** Same-shape work for unknown emails so login timing does not enumerate (SECURITY.md). */
function dummyPasswordHash(): Promise<string> {
  dummyHash ??= hashPassword(randomToken(16));
  return dummyHash;
}

async function toSelf(deps: AppDeps, user: UserRow): Promise<SelfUser> {
  const avatar = await findAvatar(deps.topology.global, user.id);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    tokenVersion: user.token_version,
    timezone: user.timezone,
    avatarUrl: avatar ? avatarPath(user.id, avatar.updated_at) : null,
  };
}

async function buildSession(deps: AppDeps, user: UserRow, deviceId: string): Promise<SessionPayload> {
  const accessToken = await issueAccessToken(deps.env.JWT_SECRET, user.id, user.token_version);
  const refresh = await createSession(deps.topology.global, user.id, deviceId);
  const memberships = await membershipsForUser(deps.topology.shards, user.id);
  const first = memberships[0];
  return {
    user: await toSelf(deps, user),
    tokens: { accessToken, refreshToken: refresh.refreshToken, expiresIn: ACCESS_TTL_SECONDS },
    team: first ? { id: first.team_id, name: first.teamName, role: first.role } : null,
  };
}

/**
 * Signup may carry a pending invite token. A valid invite is consumed here;
 * an expired/used/seat-blocked one is left for the client's explicit accept
 * call, which surfaces the real error — the account is still created.
 */
async function consumeInviteAtSignup(deps: AppDeps, token: string, user: { id: string; email: string }): Promise<void> {
  const teamId = token.split('.')[0];
  if (!teamId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(teamId)) return;
  try {
    const scope = deps.topology.scopeFor(teamId);
    await acceptInvite(deps.topology.shardDb(scope), scope, token, user);
  } catch {
    /* seat limit or shard hiccup: accept again from the client for the real error */
  }
}

export function registerAuthRoutes(app: FastifyInstance, deps: AppDeps): void {
  const { topology, rateLimiter, env, queue } = deps;

  app.post('/v1/auth/signup', async (req) => {
    const body = RequestBodies.signup.parse(req.body);
    await rateLimiter.enforce(RATE_RULES.signup, `ip:${clientIp(req)}`);
    const existing = await findUserByEmail(topology.global, body.email);
    if (existing) throw conflict('An account with that email is already registered.');
    let user: UserRow;
    try {
      user = await createUser(topology.global, { email: body.email, name: body.name, password: body.password });
    } catch (error) {
      if (error instanceof Error && /users_email_key|duplicate key/.test(error.message)) {
        throw conflict('An account with that email is already registered.');
      }
      throw error;
    }
    if (body.inviteToken) await consumeInviteAtSignup(deps, body.inviteToken, user);
    return buildSession(deps, user, SIGNUP_DEVICE_ID);
  });

  app.post('/v1/auth/login', async (req) => {
    const body = RequestBodies.login.parse(req.body);
    const identity = `ip:${clientIp(req)}|email:${hashKey(body.email.toLowerCase())}`;
    await rateLimiter.enforce(RATE_RULES.login, identity);
    const user = await findUserByEmail(topology.global, body.email);
    const ok = user?.password_hash
      ? await verifyPassword(user.password_hash, body.password)
      : await verifyPassword(await dummyPasswordHash(), body.password);
    if (!user || !user.password_hash || !ok) throw unauthorized('Email or password is incorrect.');
    return buildSession(deps, user, body.deviceId);
  });

  app.post('/v1/auth/magic', async (req) => {
    const body = RequestBodies.magicStart.parse(req.body);
    const identity = `ip:${clientIp(req)}|email:${hashKey(body.email.toLowerCase())}`;
    await rateLimiter.enforce(RATE_RULES.magic, identity);
    const user = await findUserByEmail(topology.global, body.email);
    if (user) {
      const issued = await issueOneTime(topology.global, user.id, 'magic');
      await enqueueMail(queue, magicLinkMail(user.email, env.PUBLIC_BASE_URL, issued.token, issued.expiresAt));
    }
    return { sent: true };
  });

  app.post('/v1/auth/magic/consume', async (req) => {
    const body = RequestBodies.magicConsume.parse(req.body);
    await rateLimiter.enforce(RATE_RULES.magic, `ip:${clientIp(req)}`);
    const userId = await consumeOneTime(topology.global, body.token, 'magic');
    if (!userId) throw unauthorized('That link is invalid or has expired.');
    const user = await findUserById(topology.global, userId);
    if (!user) throw unauthorized('That link is invalid or has expired.');
    return buildSession(deps, user, body.deviceId);
  });

  app.post('/v1/auth/refresh', async (req): Promise<AuthTokens> => {
    const body = RequestBodies.refresh.parse(req.body);
    await rateLimiter.enforce(RATE_RULES.refresh, `device:${hashKey(body.deviceId)}|ip:${clientIp(req)}`);
    const rotated = await rotateRefresh(topology.global, body.refreshToken, body.deviceId);
    if (!rotated.ok) {
      throw unauthorized(rotated.reason === 'reused' ? 'Session revoked. Sign in again.' : 'Session expired.');
    }
    const user = await findUserById(topology.global, rotated.userId);
    if (!user) throw unauthorized('Session expired.');
    const accessToken = await issueAccessToken(env.JWT_SECRET, user.id, user.token_version);
    return { accessToken, refreshToken: rotated.refreshToken, expiresIn: ACCESS_TTL_SECONDS };
  });

  app.post('/v1/auth/logout', async (req, reply) => {
    const body = RequestBodies.logout.parse(req.body);
    const row = await topology.global.one<{ family_id: string }>(
      'SELECT family_id FROM refresh_tokens WHERE token_hash = $1',
      [sha256(body.refreshToken)],
    );
    if (row) await revokeFamily(topology.global, row.family_id);
    reply.status(204);
    return null;
  });

  app.post('/v1/auth/logout-all', async (req, reply) => {
    const user = await requireUser(env, topology, req);
    await revokeAllForUser(topology.global, user.id);
    reply.status(204);
    return null;
  });

  app.post('/v1/auth/forgot', async (req) => {
    const body = RequestBodies.forgot.parse(req.body);
    const identity = `ip:${clientIp(req)}|email:${hashKey(body.email.toLowerCase())}`;
    await rateLimiter.enforce(RATE_RULES.forgot, identity);
    const user = await findUserByEmail(topology.global, body.email);
    if (user?.password_hash) {
      const issued = await issueOneTime(topology.global, user.id, 'reset');
      await enqueueMail(queue, resetMail(user.email, issued.token, issued.expiresAt));
    }
    return { sent: true };
  });

  app.post('/v1/auth/reset', async (req) => {
    const body = RequestBodies.reset.parse(req.body);
    await rateLimiter.enforce(RATE_RULES.reset, `ip:${clientIp(req)}`);
    const userId = await consumeOneTime(topology.global, body.token, 'reset');
    if (!userId) throw unauthorized('That link is invalid or has expired.');
    await setUserPassword(topology.global, userId, body.password);
    await revokeAllForUser(topology.global, userId);
    return { ok: true };
  });
}
