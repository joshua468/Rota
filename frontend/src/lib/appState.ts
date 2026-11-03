import { focusManager, onlineManager } from '@tanstack/react-query';
import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import { useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

export function setupOnlineManager(setOnline: (online: boolean) => void) {
  return NetInfo.addEventListener((state: NetInfoState) => {
    setOnline(!!state.isConnected);
  });
}

export function handleAppStateChange(status: AppStateStatus) {
  if (status === 'active') {
    focusManager.setFocused(true);
  }
}

export function useAppStateFocusRefetch() {
  useEffect(() => {
    const unsubscribeOnline = setupOnlineManager((online) => onlineManager.setOnline(online));
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      unsubscribeOnline();
      appStateSubscription.remove();
    };
  }, []);
}
