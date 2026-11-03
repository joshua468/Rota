import { getEnv } from '@/api/env';

/**
 * Avatars are the user's own picture. The app never downloads a stock photo of
 * a stranger: until a person uploads an image, the avatar falls back to their
 * initials on a token colour — which also keeps the screen working offline and
 * avoids a third-party request on every roster row.
 */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return `${first}${last}`.toUpperCase() || '?';
}

/**
 * The server hands out an API path (`/v1/users/<id>/avatar`); the image loader
 * needs an absolute URL, so the API base is prepended here.
 */
export function avatarSource(avatarUrl: string | null | undefined): string | undefined {
  if (!avatarUrl) return undefined;
  if (/^https?:\/\//i.test(avatarUrl)) return avatarUrl;
  try {
    const base = getEnv().apiUrl;
    return `${base}${avatarUrl.startsWith('/') ? '' : '/'}${avatarUrl}`;
  } catch {
    return undefined;
  }
}

/**
 * Avatars served from the API require the session's Bearer token; third-party
 * absolute URLs must not receive it.
 */
export function avatarNeedsAuth(avatarUrl: string | null | undefined): boolean {
  return Boolean(avatarUrl) && !/^https?:\/\//i.test(avatarUrl ?? '');
}
