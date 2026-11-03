import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';
import { create } from 'zustand';

type NetState = {
  isOnline: boolean;
  setOnline: (isOnline: boolean) => void;
};

/**
 * NetInfo-backed connectivity store. Screens read `isOnline` for the offline
 * banner and to disable swap/billing actions (they need a connection) while
 * queued settings edits wait for reconnect.
 */
export const useNetStore = create<NetState>()((set) => ({
  isOnline: true,
  setOnline: (isOnline) => set({ isOnline }),
}));

let listener: (() => void) | null = null;

export function startNetListener(): () => void {
  if (listener) return listener;
  const unsubscribe = NetInfo.addEventListener((state) => {
    // Link-level connectivity ("is there a network at all") gates whether a
    // request is attempted. `isInternetReachable` runs a probe against a fixed
    // host and can report a false negative on networks that block it; keying
    // `onlineManager` off it pauses every `networkMode: 'online'` mutation
    // (including sign-in) indefinitely instead of letting it fire and surface
    // a NETWORK error.
    //
    // TanStack Query only listens to `window` online/offline events by default,
    // which React Native never emits, so without this it always believes it is
    // online: `networkMode: 'online'` mutations would fire while offline, fail
    // with NETWORK, and surface the offline error instead of pausing to retry
    // when the connection returns.
    const online = state.isConnected !== false;
    useNetStore.getState().setOnline(online);
    onlineManager.setOnline(online);
  });
  listener = () => {
    unsubscribe();
    listener = null;
  };
  return listener;
}

export function isOffline(): boolean {
  return !useNetStore.getState().isOnline;
}
