import * as SecureStore from 'expo-secure-store';
import { randomUUID } from '@/lib/randomUUID';
import type { Role, SelfUser, SessionPayload } from '@rota/contract';
import { create } from 'zustand';
import { DEMO_SELF, DEMO_TEAM, SEED } from '@/lib/demo';

export type TeamIdentity = { id: string; name: string; role: Role };
export type SessionStatus = 'loading' | 'signedOut' | 'signedIn';

const REFRESH_TOKEN_KEY = 'rota.refreshToken';
const DEVICE_ID_KEY = 'rota.deviceId';
const PENDING_INVITE_KEY = 'rota.pendingInvite';

type SessionState = {
  status: SessionStatus;
  user: SelfUser | null;
  team: TeamIdentity | null;
  /**
   * True once the server confirmed the identity of the current session. A cold
   * start only knows the refresh token, so the team (and with it the role) is
   * unknown until `/v1/me` answers. Screens that gate on a team have to wait
   * for this flag instead of treating "no team yet" as "no team".
   */
  identityResolved: boolean;
  accessToken: string | null;
  setSession: (payload: SessionPayload) => Promise<void>;
  setIdentity: (user: SelfUser, team: TeamIdentity | null, resolved?: boolean) => void;
  setAccessToken: (accessToken: string | null) => void;
  clear: () => void;
};

/**
 * The session store holds identity in memory; only the refresh token, device id
 * and pending invite token ever touch expo-secure-store (Rule 03). The access
 * token lives here (memory only) and is renewed by the single-flight refresh in
 * `@/api/client`.
 */
export const useSessionStore = create<SessionState>()((set) => ({
  status: 'loading',
  user: null,
  team: SEED ? DEMO_TEAM : null,
  identityResolved: SEED,
  accessToken: null,

  setSession: async (payload) => {
    await saveRefreshToken(payload.tokens.refreshToken);
    set({
      status: 'signedIn',
      user: payload.user,
      team: payload.team,
      identityResolved: true,
      accessToken: payload.tokens.accessToken,
    });
  },

  setIdentity: (user, team, resolved = true) =>
    set((state) => ({
      status: 'signedIn',
      user,
      team,
      // A response that only came from the persisted cache must not claim the
      // identity is known, and it must not drop a team the session already has.
      identityResolved: resolved ? true : state.identityResolved,
    })),

  setAccessToken: (accessToken) => set({ accessToken }),

  clear: () => {
    void SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY).catch(() => undefined);
    void SecureStore.deleteItemAsync(PENDING_INVITE_KEY).catch(() => undefined);
    set({
      status: 'signedOut',
      user: null,
      team: null,
      identityResolved: false,
      accessToken: null,
    });
  },
}));

export async function getRefreshToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function saveRefreshToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  } catch {
    return;
  }
}

let deviceIdPromise: Promise<string> | null = null;

export function getDeviceId(): Promise<string> {
  if (!deviceIdPromise) {
    deviceIdPromise = (async () => {
      try {
        const existing = await SecureStore.getItemAsync(DEVICE_ID_KEY);
        if (existing) return existing;
        const created = randomUUID();
        await SecureStore.setItemAsync(DEVICE_ID_KEY, created);
        return created;
      } catch {
        return randomUUID();
      }
    })();
  }
  return deviceIdPromise;
}

export async function getPendingInviteToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(PENDING_INVITE_KEY);
  } catch {
    return null;
  }
}

export async function savePendingInviteToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(PENDING_INVITE_KEY, token);
  } catch {
    return;
  }
}

export async function consumePendingInviteToken(): Promise<string | null> {
  const token = await getPendingInviteToken();
  try {
    await SecureStore.deleteItemAsync(PENDING_INVITE_KEY);
  } catch {
    return token;
  }
  return token;
}

/**
 * Cold start: a stored refresh token means we can try to restore the session;
 * `useMe()` then revalidates against `/v1/me` (which refreshes the access token
 * first) and either fills in the identity or signs the user out on 401.
 */
export async function loadPersistedSession(): Promise<void> {
  if (SEED) {
    // The seeded demo has no backend to restore from: sign in as the demo owner
    // so screens that require a session (the shift form, settings) stay reachable.
    useSessionStore.setState({
      status: 'signedIn',
      user: DEMO_SELF,
      team: DEMO_TEAM,
      identityResolved: true,
    });
    return;
  }
  const refreshToken = await getRefreshToken();
  useSessionStore.setState({
    status: refreshToken ? 'signedIn' : 'signedOut',
    // The team (and role) is unknown until `/v1/me` answers.
    identityResolved: false,
  });
}
