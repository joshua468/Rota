import { describe, expect, it } from 'vitest';
import { needsTeamSetup, sessionDestination } from './teamSetup';

const TEAM = { id: '11111111-1111-4111-8111-111111111111', name: 'Northwind Cafe', role: 'owner' } as const;

describe('team setup', () => {
  it('sends a user without a team to the team step', () => {
    expect(needsTeamSetup(null)).toBe(true);
    expect(sessionDestination(null)).toBe('/(auth)/setup-team');
  });

  it('lets a user with a team straight into the app', () => {
    expect(needsTeamSetup(TEAM)).toBe(false);
    expect(sessionDestination(TEAM)).toBe('/(app)');
  });
});
