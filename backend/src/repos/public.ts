import type { PublicUser } from '@rota/contract';
import type { Queryable } from '../db/types';
import { avatarPath } from './avatars';

/** The directory columns the API is allowed to expose (global DB). */
export interface DirectoryUser {
  id: string;
  name: string;
  email: string;
  /** API path of the user's own photo, null when they have not uploaded one */
  avatarUrl: string | null;
}

/**
 * `users` is a global table while rosters are sharded (docs/SHARDING.md), so
 * hydration is a second query against the global database — never a
 * cross-database join. Ids always come from database rows and stay bound as
 * parameters (Rule 05).
 */
export async function loadUsersByIds(
  db: Queryable,
  ids: readonly (string | null | undefined)[],
): Promise<Map<string, DirectoryUser>> {
  const unique = [...new Set(ids.filter((id): id is string => typeof id === 'string' && id.length > 0))];
  const found = new Map<string, DirectoryUser>();
  if (unique.length === 0) return found;
  const placeholders = unique.map((_, index) => `$${index + 1}`).join(', ');
  const rows = await db.query<{
    id: string;
    name: string;
    email: string;
    has_avatar: boolean;
    avatar_updated_at: Date | null;
  }>(
    `SELECT u.id, u.name, u.email,
            (a.user_id IS NOT NULL) AS has_avatar,
            a.updated_at AS avatar_updated_at
       FROM users u
       LEFT JOIN user_avatars a ON a.user_id = u.id
      WHERE u.id IN (${placeholders})`,
    unique,
  );
  for (const row of rows) {
    found.set(row.id, {
      id: row.id,
      name: row.name,
      email: row.email,
      avatarUrl: row.has_avatar ? avatarPath(row.id, row.avatar_updated_at) : null,
    });
  }
  return found;
}

/**
 * Recipient time zones for the wall-clock text inside notifications
 * (docs: "format every displayed time in the reader's zone"). `users.timezone`
 * is the same value `PATCH /v1/me/settings` keeps in sync with `time_zone`.
 */
export async function loadUserZones(
  db: Queryable,
  ids: readonly (string | null | undefined)[],
): Promise<Map<string, string>> {
  const unique = [...new Set(ids.filter((id): id is string => typeof id === 'string' && id.length > 0))];
  const zones = new Map<string, string>();
  if (unique.length === 0) return zones;
  const placeholders = unique.map((_, index) => `$${index + 1}`).join(', ');
  const rows = await db.query<{ id: string; timezone: string | null }>(
    `SELECT id, timezone FROM users WHERE id IN (${placeholders})`,
    unique,
  );
  for (const row of rows) zones.set(row.id, row.timezone ?? 'UTC');
  return zones;
}

/** `josh@example.com` → `j•••@example.com` (contract PublicUser.emailMasked). */export function maskEmail(email: string): string {
  const at = email.indexOf('@');
  if (at < 1) return '•••';
  const local = email.slice(0, at);
  const domain = email.slice(at);
  const hidden = Math.min(3, local.length - 1);
  return `${local[0] ?? ''}${'•'.repeat(hidden)}${domain}`;
}

export function toPublicUser(
  user: DirectoryUser | undefined,
  role: PublicUser['role'],
  active: boolean,
  id: string,
): PublicUser {
  const entry = user ?? { id, name: 'Unknown user', email: '', avatarUrl: null };
  return {
    id: entry.id,
    name: entry.name,
    emailMasked: maskEmail(entry.email),
    role,
    active,
    avatarUrl: entry.avatarUrl,
  };
}

/**
 * `{ id, name, avatarUrl }` projection used by Shift.user and ActivityItem.actor.
 * Returns `null` for an empty id so an open (unassigned) shift serialises as
 * `user: null` instead of a made-up "Unknown user".
 */
export function briefUser(
  directory: Map<string, DirectoryUser>,
  id: string | null | undefined,
): { id: string; name: string; avatarUrl: string | null } | null {
  if (!id) return null;
  const entry = directory.get(id);
  return { id, name: entry?.name ?? 'Unknown user', avatarUrl: entry?.avatarUrl ?? null };
}

/**
 * Canonical API timestamp: second precision when the milliseconds are zero
 * (`2026-10-15T10:00:00Z`, matching the contract's `z.iso.datetime()`), but
 * sub-second precision is preserved when non-zero. Applied to every date field
 * the roster routes serialize so payloads are consistent across endpoints.
 */
export function isoStamp(date: Date): string {
  const iso = date.toISOString();
  return iso.endsWith('.000Z') ? `${iso.slice(0, -5)}Z` : iso;
}
