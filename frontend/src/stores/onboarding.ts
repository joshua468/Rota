import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

const ONBOARDING_KEY = 'rota.onboardingSeen';

export type OnboardingStatus = 'loading' | 'fresh' | 'seen';

type OnboardingState = {
  status: OnboardingStatus;
  load: () => Promise<void>;
  finish: () => Promise<void>;
};

export const useOnboardingStore = create<OnboardingState>()((set) => ({
  status: 'loading',

  load: async () => {
    const value = await SecureStore.getItemAsync(ONBOARDING_KEY).catch(() => null);
    set({ status: value === '1' ? 'seen' : 'fresh' });
  },

  finish: async () => {
    set({ status: 'seen' });
    await SecureStore.setItemAsync(ONBOARDING_KEY, '1').catch(() => undefined);
  },
}));
