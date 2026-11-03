import { onlineManager } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { startNetListener, useNetStore } from './net';

type NetInfoState = { isConnected: boolean | null; isInternetReachable: boolean | null };

const netInfo = vi.hoisted(() => ({
  handlers: [] as Array<(state: NetInfoState) => void>,
}));

vi.mock('@react-native-community/netinfo', () => ({
  default: {
    addEventListener: (handler: (state: NetInfoState) => void) => {
      netInfo.handlers.push(handler);
      return () => {
        const index = netInfo.handlers.indexOf(handler);
        if (index >= 0) netInfo.handlers.splice(index, 1);
      };
    },
  },
}));

function emit(state: NetInfoState) {
  for (const handler of [...netInfo.handlers]) handler(state);
}

let stop: (() => void) | undefined;

beforeEach(() => {
  netInfo.handlers.length = 0;
  useNetStore.getState().setOnline(true);
  onlineManager.setOnline(true);
});

afterEach(() => {
  stop?.();
  stop = undefined;
});

describe('startNetListener', () => {
  it('mirrors NetInfo connectivity into the store and TanStack onlineManager', () => {
    stop = startNetListener();
    expect(netInfo.handlers).toHaveLength(1);

    emit({ isConnected: false, isInternetReachable: false });
    expect(useNetStore.getState().isOnline).toBe(false);
    expect(onlineManager.isOnline()).toBe(false);

    emit({ isConnected: true, isInternetReachable: true });
    expect(useNetStore.getState().isOnline).toBe(true);
    expect(onlineManager.isOnline()).toBe(true);
  });

  it('treats unknown reachability as online', () => {
    stop = startNetListener();
    emit({ isConnected: true, isInternetReachable: null });
    expect(useNetStore.getState().isOnline).toBe(true);
    expect(onlineManager.isOnline()).toBe(true);
  });

  it('stays online when the link is up but the reachability probe fails', () => {
    // Regression: keying `onlineManager` off `isInternetReachable` paused every
    // mutation (including sign-in) whenever the probe host was unreachable on an
    // otherwise connected device, leaving the button spinning forever.
    stop = startNetListener();
    emit({ isConnected: true, isInternetReachable: false });
    expect(useNetStore.getState().isOnline).toBe(true);
    expect(onlineManager.isOnline()).toBe(true);
  });

  it('keeps a single subscription while active', () => {
    stop = startNetListener();
    startNetListener();
    expect(netInfo.handlers).toHaveLength(1);
  });
});
