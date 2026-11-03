import { focusManager, onlineManager } from '@tanstack/react-query';
import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import { AppState, type AppStateStatus } from 'react-native';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { handleAppStateChange, setupOnlineManager } from './appState';

vi.mock('@tanstack/react-query', () => ({
  focusManager: { setFocused: vi.fn() },
  onlineManager: { setOnline: vi.fn() },
}));

vi.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: {
    addEventListener: vi.fn(),
  },
  addEventListener: vi.fn(),
}));

vi.mock('react-native', () => ({
  AppState: {
    addEventListener: vi.fn(),
  },
}));

const mockedNetInfo = vi.mocked(NetInfo);
const mockedFocus = vi.mocked(focusManager);
const mockedOnline = vi.mocked(onlineManager);

describe('appState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sets online true when connected', () => {
    let listener: ((state: NetInfoState) => void) | undefined;
    mockedNetInfo.addEventListener.mockImplementation((cb: any) => {
      listener = cb;
      return () => {};
    });
    const setOnline = vi.fn();
    setupOnlineManager(setOnline);
    expect(listener).toBeDefined();
    listener?.({ isConnected: true } as NetInfoState);
    expect(setOnline).toHaveBeenCalledWith(true);
  });

  it('sets online false when disconnected', () => {
    let listener: ((state: NetInfoState) => void) | undefined;
    mockedNetInfo.addEventListener.mockImplementation((cb: any) => {
      listener = cb;
      return () => {};
    });
    const setOnline = vi.fn();
    setupOnlineManager(setOnline);
    listener?.({ isConnected: false } as NetInfoState);
    expect(setOnline).toHaveBeenCalledWith(false);
  });

  it('focuses when app becomes active', () => {
    handleAppStateChange('active' as AppStateStatus);
    expect(mockedFocus.setFocused).toHaveBeenCalledWith(true);
  });

  it('does not focus when app is background', () => {
    handleAppStateChange('background' as AppStateStatus);
    expect(mockedFocus.setFocused).not.toHaveBeenCalled();
  });
});
