import { describe, expect, it, vi } from 'vitest';

const { platform, constants } = vi.hoisted(() => ({
  platform: { OS: 'web' as string },
  constants: { executionEnvironment: 'standalone' as string },
}));

vi.mock('react-native', () => ({ Platform: platform }));
vi.mock('expo-constants', () => ({
  default: constants,
  ExecutionEnvironment: {
    Bare: 'bare',
    Standalone: 'standalone',
    StoreClient: 'storeClient',
  },
}));

import { pushUnavailable } from './pushEnv';

/**
 * `expo-constants` exposes `ExecutionEnvironment` as a named export only, so
 * `Constants.ExecutionEnvironment` is `undefined` at runtime. Reading
 * `.StoreClient` off it threw on every Android build and killed push
 * registration; the check must never throw, whatever the environment.
 */
describe('pushUnavailable', () => {
  it('never throws and reports web as unavailable', () => {
    platform.OS = 'web';
    expect(() => pushUnavailable()).not.toThrow();
    expect(pushUnavailable()).toBe(true);
  });

  it('reports Expo Go on Android as unavailable', () => {
    platform.OS = 'android';
    constants.executionEnvironment = 'storeClient';
    expect(() => pushUnavailable()).not.toThrow();
    expect(pushUnavailable()).toBe(true);
  });

  it('allows push in a standalone Android build', () => {
    platform.OS = 'android';
    constants.executionEnvironment = 'standalone';
    expect(pushUnavailable()).toBe(false);
  });

  it('allows push in a standalone iOS build', () => {
    platform.OS = 'ios';
    constants.executionEnvironment = 'standalone';
    expect(pushUnavailable()).toBe(false);
  });
});
