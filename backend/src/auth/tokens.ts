import { jwtVerify, SignJWT } from 'jose';
import type { Queryable } from '../db/types';
import { sha256 } from '../lib/crypto';
import { newId, randomSecret } from '../lib/ids';

/** 15-minute access token (auth-tokens skill). Claims: {sub, tv}. */
export const ACCESS_TTL_SECONDS = 15 * 60;
/** 30-day rotating refresh token, stored only as a SHA-256 hash. */
export const REFRESH_TTL_DAYS = 30;

const encoder = new TextEncoder();

export interface AccessClaims {
  sub: string;
  tv: number;
}

export async function issueAccessToken(secret: string, userId: string, tokenVersion: number): Promise<string> {
  return new SignJWT({ tv: tokenVersion })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TTL_SECONDS}s`)
    .sign(encoder.encode(secret));
}

export async function verifyAccessToken(secret: string, token: string): Promise<AccessClaims | null> {
  try {
    const { payload } = await jwtVerify(token, encoder.encode(secret), { algorithms: ['HS256'] });
    if (typeof payload.sub !== 'string' || typeof payload.tv !== 'number') return null;
    return { sub: payload.sub, tv: payload.tv };
  } catch {
    return null;
  }
}

export interface IssuedRefresh {
  familyId: string;
  refreshToken: string;
  expiresAt: Date;
}

export async function createSession(
  db: Queryable,
  userId: string,
  deviceId: string,
  familyId = newId(),
): Promise<IssuedRefresh> {
  const refreshToken = randomSecret(32);
  const expiresAt = new Date(Date.now() + REFRESH_TTL_DAYS * 86_400_000);
  await db.query(
    `INSERT INTO refresh_tokens (id, family_id, user_id, device_id, token_hash, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [newId(), familyId, userId, deviceId, sha256(refreshToken), expiresAt],
  );
  return { familyId, refreshToken, expiresAt };
}

export type RotationResult =
  | { ok: true; userId: string; familyId: string; refreshToken: string; expiresAt: Date }
  | { ok: false; reason: 'unknown' | 'expired' | 'reused' };

/**
 * Rotation with reuse detection: a refresh token that is already used or
 * revoked means it leaked, so the whole family is revoked and the caller must
 * sign in again (SECURITY.md threat 1).
 */
export async function rotateRefresh(db: Queryable, refreshToken: string, deviceId: string): Promise<RotationResult> {
  const row = await db.one<{
    id: string;
    family_id: string;
    user_id: string;
    device_id: string;
    used_at: Date | null;
    revoked_at: Date | null;
    expires_at: Date;
  }>(
    `SELECT id, family_id, user_id, device_id, used_at, revoked_at, expires_at
       FROM refresh_tokens WHERE token_hash = $1`,
    [sha256(refreshToken)],
  );
  if (!row) return { ok: false, reason: 'unknown' };
  if (row.revoked_at || row.used_at) {
    await revokeFamily(db, row.family_id);
    return { ok: false, reason: 'reused' };
  }
  if (row.expires_at.getTime() <= Date.now()) return { ok: false, reason: 'expired' };

  await db.query('UPDATE refresh_tokens SET used_at = now() WHERE id = $1', [row.id]);
  const next = await createSession(db, row.user_id, deviceId || row.device_id, row.family_id);
  return {
    ok: true,
    userId: row.user_id,
    familyId: row.family_id,
    refreshToken: next.refreshToken,
    expiresAt: next.expiresAt,
  };
}

export async function revokeFamily(db: Queryable, familyId: string): Promise<void> {
  await db.query('UPDATE refresh_tokens SET revoked_at = now() WHERE family_id = $1 AND revoked_at IS NULL', [
    familyId,
  ]);
}

export async function revokeDevice(db: Queryable, userId: string, deviceId: string): Promise<void> {
  await db.query(
    `UPDATE refresh_tokens SET revoked_at = now()
      WHERE user_id = $1 AND device_id = $2 AND revoked_at IS NULL`,
    [userId, deviceId],
  );
}

export async function revokeAllForUser(db: Queryable, userId: string): Promise<void> {
  await db.tx(async (tx) => {
    await tx.query('UPDATE refresh_tokens SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL', [
      userId,
    ]);
    await tx.query('UPDATE users SET token_version = token_version + 1, updated_at = now() WHERE id = $1', [
      userId,
    ]);
  });
}

/* ------------------------------------------------------------------ */
/* one-time tokens (magic link, password reset)                        */
/* ------------------------------------------------------------------ */

export type OneTimePurpose = 'magic' | 'reset';

export const ONE_TIME_TTL: Record<OneTimePurpose, number> = { magic: 15 * 60_000, reset: 30 * 60_000 };

export async function issueOneTime(
  db: Queryable,
  userId: string,
  purpose: OneTimePurpose,
): Promise<{ token: string; expiresAt: Date }> {
  const token = randomSecret(32);
  const expiresAt = new Date(Date.now() + ONE_TIME_TTL[purpose]);
  await db.query(
    `INSERT INTO one_time_tokens (id, user_id, purpose, token_hash, expires_at) VALUES ($1, $2, $3, $4, $5)`,
    [newId(), userId, purpose, sha256(token), expiresAt],
  );
  return { token, expiresAt };
}

/**
 * Consumes a one-time token exactly once: the `used_at` update and the caller's
 * work run in the same transaction (auth-tokens skill).
 */
export async function consumeOneTime(db: Queryable, token: string, purpose: OneTimePurpose): Promise<string | null> {
  return db.tx(async (tx) => {
    const row = await tx.one<{ id: string; user_id: string | null; expires_at: Date; used_at: Date | null }>(
      `SELECT id, user_id, expires_at, used_at FROM one_time_tokens WHERE token_hash = $1 AND purpose = $2`,
      [sha256(token), purpose],
    );
    if (!row || !row.user_id || row.used_at || row.expires_at.getTime() <= Date.now()) return null;
    const updated = await tx.query<{ id: string }>(
      'UPDATE one_time_tokens SET used_at = now() WHERE id = $1 AND used_at IS NULL RETURNING id',
      [row.id],
    );
    if (updated.length === 0) return null;
    return row.user_id;
  });
}
