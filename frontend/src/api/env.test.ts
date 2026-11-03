import { afterEach, describe, expect, it, vi } from 'vitest';
import { getEnv, resetEnv } from './env';

describe('getEnv', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    resetEnv();
  });

  it('reads the three allowlisted EXPO_PUBLIC_* values', () => {
    expect(getEnv()).toEqual({
      apiUrl: 'http://localhost:4000',
      sentryDsn: '',
      appScheme: 'rota',
    });
  });

  it('ignores EXPO_PUBLIC_PROJECT_ROOT injected by the Expo dev server', () => {
    vi.stubEnv('EXPO_PUBLIC_PROJECT_ROOT', 'C:/Users/dev/Rota/frontend');

    expect(getEnv().apiUrl).toBe('http://localhost:4000');
  });

  it('still rejects an unexpected EXPO_PUBLIC_* variable', () => {
    vi.stubEnv('EXPO_PUBLIC_API_SECRET', 'leak');

    expect(() => getEnv()).toThrow(/EXPO_PUBLIC_API_SECRET/);
  });
});
