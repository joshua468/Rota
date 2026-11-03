import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SelfUser } from '@rota/contract';
import { useSessionStore } from './session';

vi.mock('expo-secure-store', () => ({
  getItemAsync: vi.fn(async () => null),
  setItemAsync: vi.fn(async () => undefined),
  deleteItemAsync: vi.fn(async () => undefined),
}));

const USER: SelfUser = {
  id: 'c058f7ad-1050-49b2-9b96-d032ecb23786',
  name: 'Ada Okafor',
  email: 'ada@rota.demo',
  tokenVersion: 0,
  timezone: 'Europe/London',
  avatarUrl: null,
};

const TEAM = { id: '11111111-1111-4111-8111-111111111111', name: 'Northwind Cafe', role: 'owner' as const };

describe('session identity', () => {
  beforeEach(() => {
    useSessionStore.setState({
      status: 'signedOut',
      user: null,
      team: null,
      identityResolved: false,
      accessToken: null,
    });
  });

  it('marks the identity as resolved once the server confirmed it', () => {
    useSessionStore.getState().setIdentity(USER, TEAM);
    expect(useSessionStore.getState().identityResolved).toBe(true);
    expect(useSessionStore.getState().team?.role).toBe('owner');
  });

  it('never claims the identity is known for a response that only came from the cache', () => {
    useSessionStore.getState().setIdentity(USER, TEAM, false);
    expect(useSessionStore.getState().identityResolved).toBe(false);
  });

  it('does not downgrade a resolved identity when a cached response arrives', () => {
    useSessionStore.getState().setIdentity(USER, TEAM);
    useSessionStore.getState().setIdentity(USER, TEAM, false);
    expect(useSessionStore.getState().identityResolved).toBe(true);
    expect(useSessionStore.getState().team?.id).toBe(TEAM.id);
  });

  it('forgets the identity on sign out', () => {
    useSessionStore.getState().setIdentity(USER, TEAM);
    useSessionStore.getState().clear();
    expect(useSessionStore.getState().identityResolved).toBe(false);
    expect(useSessionStore.getState().team).toBeNull();
    expect(useSessionStore.getState().status).toBe('signedOut');
  });
});
