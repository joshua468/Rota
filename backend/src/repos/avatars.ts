import type { Queryable } from '../db/types';

/**
 * Profile photos live in the global (identity) database next to the account:
 * one row per user, so re-uploading replaces the image and deleting the row
 * falls back to the initials avatar the client draws when `avatarUrl` is null.
 *
 * Every value is bound as a parameter (Rule 05) — the image bytes travel as a
 * `bytea` parameter, never spliced into SQL.
 */
export interface AvatarRow {
  user_id: string;
  content_type: string;
  bytes: Buffer;
  created_at: Date;
  updated_at: Date;
}

const SELECT = 'SELECT user_id, content_type, bytes, created_at, updated_at FROM user_avatars';

export async function findAvatar(db: Queryable, userId: string): Promise<AvatarRow | undefined> {
  return db.one<AvatarRow>(`${SELECT} WHERE user_id = $1`, [userId]);
}

/**
 * Stores the photo, replacing any previous one. The row is written with bound
 * parameters only (Rule 05) — the image bytes travel as a `bytea` parameter.
 */
export async function upsertAvatar(
  db: Queryable,
  input: { userId: string; contentType: string; bytes: Buffer },
): Promise<AvatarRow> {
  const row = await db.one<AvatarRow>(
    `INSERT INTO user_avatars (user_id, content_type, bytes)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id) DO UPDATE
       SET content_type = EXCLUDED.content_type,
           bytes = EXCLUDED.bytes,
           updated_at = now()
     RETURNING user_id, content_type, bytes, created_at, updated_at`,
    [input.userId, input.contentType, input.bytes],
  );
  if (!row) throw new Error('failed to store avatar');
  return row;
}

export async function deleteAvatar(db: Queryable, userId: string): Promise<boolean> {
  const row = await db.one<{ user_id: string }>(
    'DELETE FROM user_avatars WHERE user_id = $1 RETURNING user_id',
    [userId],
  );
  return Boolean(row);
}

/**
 * The API path of a user's photo. The client prefixes the API base URL, so the
 * path is stored relative — the server never has to know its public origin.
 *
 * The version (`?v=`) is the upload timestamp: a new photo gets a new URL, so
 * the image loader fetches it again instead of showing the cached one.
 */
export function avatarPath(userId: string, version?: Date | string | null): string {
  const path = `/v1/users/${userId}/avatar`;
  if (!version) return path;
  const stamp = typeof version === 'string' ? version : version.toISOString();
  return `${path}?v=${encodeURIComponent(stamp)}`;
}
