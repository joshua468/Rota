const FALLBACK_TIME_ZONE = 'Africa/Lagos';

/**
 * Best-effort IANA time zone from the device. Expo has no first-party API for
 * this without `expo-localization`, so we read it from `Intl`; unknown or
 * unsupported environments fall back to the product default.
 */
export function detectTimeZone(): string {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return zone && zone.length > 0 ? zone : FALLBACK_TIME_ZONE;
  } catch {
    return FALLBACK_TIME_ZONE;
  }
}

/**
 * The zone every screen formats in: the profile's configured IANA zone.
 *
 * A profile still sitting on the server's `UTC` default follows the device
 * zone instead, so a first-run user never sees clock times shifted by a zone
 * they never chose. Everything that formats a time must read the zone from
 * here rather than from the raw settings value.
 */
export function resolveProfileZone(configured?: string | null): string {
  const device = detectTimeZone();
  if (configured && configured !== 'UTC') return configured;
  if (configured === 'UTC' && device !== 'UTC') return device;
  return configured || device;
}

/**
 * Accepts either a raw invite token or a link that contains one
 * (`rota://invite/<token>`, `/v1/i/<token>`, `.../invites/<token>`).
 */
export function inviteTokenFromInput(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) return '';
  if (!trimmed.includes('/') && !trimmed.includes(':')) return trimmed;
  const match = trimmed.match(/\/(?:i|invite|invites)\/([^/?#\s]+)/i);
  return match?.[1] ?? trimmed;
}
