/**
 * Cache key shapes live in one place so a writer can invalidate exactly what a
 * reader cached without importing route code. Every key is team-scoped: there is
 * no key that can return another team's data.
 */
export function rosterKey(teamId: string): string {
  return `roster:${teamId}`;
}

/** Family prefix for a team's cached calendar windows (all queries/pages). */
export function calendarPrefix(teamId: string): string {
  return `cal:${teamId}:`;
}

export function calendarKey(
  teamId: string,
  query: { from: string; to: string; mine: string; user: string; cursor: string; limit: number },
): string {
  return `${calendarPrefix(teamId)}${query.from}|${query.to}|${query.mine}|${query.user}|${query.cursor}|${query.limit}`;
}

/** Roster reads are cheap but frequent under a spike; calendar reads are heavier. */
export const ROSTER_TTL_MS = 30_000;
export const CALENDAR_TTL_MS = 15_000;
