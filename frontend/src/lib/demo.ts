import type { PublicUser, SelfUser } from '@rota/contract';

/**
 * `EXPO_PUBLIC_SEED_DEMO=1` builds a self-contained demo: the Home screen renders
 * sample shifts, the app skips auth/onboarding, and the Assign sheet works without
 * a backend (a seeded scheduler identity and staff list).
 */
const env: Record<string, string | undefined> = typeof process !== 'undefined' ? (process.env as any) : {};
/**
 * Demo mode is a development tool only. Metro inlines NODE_ENV=production into
 * release bundles, so this evaluates false there even if an env var survives.
 */
export const IS_DEV = env.NODE_ENV !== 'production';
export const SEED =
  IS_DEV &&
  (env.EXPO_PUBLIC_SEED_DEMO === '1' ||
    env.SEED_DEMO === '1' ||
    (typeof globalThis !== 'undefined' &&
      (((globalThis as any).EXPO_PUBLIC_SEED_DEMO === '1') || ((globalThis as any).SEED === true))));

export const DEMO_TEAM = { id: 'demo-team', name: 'Demo Team', role: 'owner' as const };

/** The signed-in identity the seed pretends to be, so one card renders as "mine". */
export const DEMO_ME = { id: 'demo-me', name: 'You' };

/**
 * The identity the seeded demo signs in as. The seed runs without a backend, so
 * the session is faked instead of restored from a refresh token; without it every
 * screen that gates on a session (the shift form, settings) bounces to sign-in.
 */
export const DEMO_SELF: SelfUser = {
  id: DEMO_ME.id,
  name: DEMO_ME.name,
  email: 'you@example.com',
  tokenVersion: 0,
  timezone: 'UTC',
  avatarUrl: null,
};

export type SeedTheme = 'light' | 'dark' | 'sage';

/**
 * Dev-only theme override for the seeded demo: `?theme=dark` / `?theme=sage`
 * lets the audit (and anyone eyeballing the build) pick a palette without a
 * backend, because sage has no `useColorScheme()` equivalent.
 */
export const SEED_THEME: SeedTheme | null = (() => {
  if (!SEED) return null;
  const search = (globalThis as { location?: { search?: string } }).location?.search;
  if (!search) return null;
  const value = new URLSearchParams(search).get('theme');
  return value === 'light' || value === 'dark' || value === 'sage' ? value : null;
})();

export const DEMO_MEMBERS: PublicUser[] = [
  { id: 'demo-1', name: 'Ada Lovelace', emailMasked: 'a•••@example.com', role: 'admin', active: true, avatarUrl: null },
  { id: 'demo-2', name: 'Grace Hopper', emailMasked: 'g•••@example.com', role: 'manager', active: true, avatarUrl: null },
  { id: 'demo-3', name: 'Alan Turing', emailMasked: 'a•••@example.com', role: 'member', active: true, avatarUrl: null },
  { id: 'demo-4', name: 'Katherine Johnson', emailMasked: 'k•••@example.com', role: 'member', active: true, avatarUrl: null },
  { id: 'demo-5', name: 'Margaret Hamilton', emailMasked: 'm•••@example.com', role: 'member', active: true, avatarUrl: null },
];
