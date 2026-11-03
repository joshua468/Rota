import { describe, expect, it, vi } from 'vitest';
import { adoptIdentity, MeResponse } from './queries';

vi.mock('expo-secure-store', () => ({
  getItemAsync: vi.fn(async () => null),
  setItemAsync: vi.fn(async () => undefined),
  deleteItemAsync: vi.fn(async () => undefined),
}));

const TEAM_ID = '11111111-1111-4111-8111-111111111111';

function me(team: { id: string; name: string; role: string } | null) {
  return MeResponse.parse({
    user: {
      id: 'c058f7ad-1050-49b2-9b96-d032ecb23786',
      name: 'Ada Okafor',
      email: 'ada@rota.demo',
      avatarUrl: null,
      tokenVersion: 0,
      timezone: 'Europe/London',
    },
    team,
  });
}

describe('adoptIdentity', () => {
  it('adopts both user and team from a live response', () => {
    const identity = adoptIdentity(me({ id: TEAM_ID, name: 'Northwind Cafe', role: 'owner' }), true);
    expect(identity?.user.email).toBe('ada@rota.demo');
    expect(identity?.team?.id).toBe(TEAM_ID);
  });

  it('withholds the team when the data only came from the persisted cache', () => {
    const identity = adoptIdentity(me({ id: TEAM_ID, name: 'Northwind Cafe', role: 'owner' }), false);
    expect(identity?.user.email).toBe('ada@rota.demo');
    expect(identity?.team).toBeNull();
  });

  it('keeps the team the session already knows when the data only came from the cache', () => {
    const known = { id: TEAM_ID, name: 'Northwind Cafe', role: 'owner' as const };
    const identity = adoptIdentity(me(known), false, known);
    expect(identity?.team?.id).toBe(TEAM_ID);
  });

  it('lets a live response clear a team the session still holds', () => {
    const known = { id: TEAM_ID, name: 'Northwind Cafe', role: 'owner' as const };
    const identity = adoptIdentity(me(null), true, known);
    expect(identity?.team).toBeNull();
  });

  it('adopts a null team from a live response for a user with no membership', () => {
    const identity = adoptIdentity(me(null), true);
    expect(identity?.user.email).toBe('ada@rota.demo');
    expect(identity?.team).toBeNull();
  });

  it('produces no identity when there is no data yet', () => {
    expect(adoptIdentity(undefined, true)).toBeNull();
    expect(adoptIdentity(undefined, false)).toBeNull();
  });
});
