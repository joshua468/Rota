/**
 * A signed-in user without a team has no role, and the role is what the whole
 * app gates on: shifts, swaps, billing and the settings screens all read it
 * from the session. The team step is therefore not optional (Rule 01: the
 * server owns the role, the client only picks the path).
 */
export type SessionDestination = '/(app)' | '/(auth)/setup-team';

export function needsTeamSetup(team: { id: string } | null): boolean {
  return !team;
}

export function sessionDestination(team: { id: string } | null): SessionDestination {
  return needsTeamSetup(team) ? '/(auth)/setup-team' : '/(app)';
}
