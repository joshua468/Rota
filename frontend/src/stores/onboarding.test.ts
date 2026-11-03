import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const memory = new Map<string, string>();

vi.mock('expo-secure-store', () => ({
  getItemAsync: vi.fn(async (key: string) => memory.get(key) ?? null),
  setItemAsync: vi.fn(async (key: string, value: string) => {
    memory.set(key, value);
  }),
  deleteItemAsync: vi.fn(async (key: string) => {
    memory.delete(key);
  }),
}));

import { useOnboardingStore } from './onboarding';

describe('useOnboardingStore', () => {
  beforeEach(() => {
    memory.clear();
    useOnboardingStore.setState({ status: 'loading' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('loads fresh status when no record exists', async () => {
    await useOnboardingStore.getState().load();
    expect(useOnboardingStore.getState().status).toBe('fresh');
  });

  it('loads seen status when previously saved', async () => {
    memory.set('rota.onboardingSeen', '1');
    await useOnboardingStore.getState().load();
    expect(useOnboardingStore.getState().status).toBe('seen');
  });

  it('finish() sets seen status and stores flag', async () => {
    await useOnboardingStore.getState().finish();
    expect(useOnboardingStore.getState().status).toBe('seen');
    expect(memory.get('rota.onboardingSeen')).toBe('1');
  });
});
