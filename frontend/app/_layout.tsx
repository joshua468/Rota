import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import { focusManager, onlineManager } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState, Image, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import { useMe, useSettings } from '@/api/queries';
import { usePushNotifications } from '@/lib/push';
import { useAppStateFocusRefetch } from '@/lib/appState';
import {
  PERSIST_BUSTER,
  PERSIST_MAX_AGE,
  createCachePersister,
  shouldDehydrateQuery,
} from '@/offline/persister';
import { queryClient } from '@/offline/queryClient';
import { startNetListener } from '@/stores/net';
import { installEdgeGestureGuard } from '@/lib/edgeGesture';
import { loadPersistedSession, useSessionStore } from '@/stores/session';
import { useOnboardingStore } from '@/stores/onboarding';
import { SEED, SEED_THEME, DEMO_SELF, DEMO_TEAM } from '@/lib/demo';
import { ThemeProvider, themes, type ThemePreference } from '@/theme';

void SplashScreen.preventAutoHideAsync();

const splashStyles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: themes.light.color.surface,
  },
  logo: {
    width: '60%',
    aspectRatio: 2752 / 1536,
  },
});

function SplashFallback() {
  return (
    <View style={splashStyles.root}>
      <Image
        source={require('../assets/rota-logo.jpg')}
        style={splashStyles.logo}
        resizeMode="contain"
        accessibilityLabel="Rota"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

/** Upper bound for the splash screen: after this the UI is shown regardless. */
const SPLASH_FAILSAFE_MS = 4000;

const persister = createCachePersister();

const persistOptions = {
  persister,
  maxAge: PERSIST_MAX_AGE,
  buster: PERSIST_BUSTER,
  dehydrateOptions: {
    shouldDehydrateQuery,
    shouldDehydrateMutation: () => false,
  },
};

function AppShell() {
  const settings = useSettings();
  useMe();
  usePushNotifications();
  useAppStateFocusRefetch();
  const preference: ThemePreference = SEED_THEME ?? settings.data?.values.theme ?? 'system';

  return (
    <ThemeProvider preference={preference}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        {/* The tabs are the app's root: a swipe from the screen edge must not
            pop the app away, it belongs to the day strip. */}
        <Stack.Screen name="(app)" options={{ gestureEnabled: false }} />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });
  const sessionStatus = useSessionStore((state) => state.status);
  const onboardingStatus = useOnboardingStore((state) => state.status);

  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    startNetListener();
    onlineManager.setEventListener((setOnline) => {
      return NetInfo.addEventListener((state) => {
        setOnline(!!state.isConnected);
      });
    });
    const appStateSubscription = AppState.addEventListener('change', (status) => {
      if (status === 'active') {
        focusManager.setFocused(true);
      }
    });
    return () => {
      appStateSubscription.remove();
    };
  }, []);
  useEffect(() => {
    if (SEED) {
      useSessionStore.setState({ status: 'signedIn', user: DEMO_SELF, team: DEMO_TEAM, identityResolved: true, accessToken: 'seed' });
      useOnboardingStore.setState({ status: 'done' } as any);
    }
    void loadPersistedSession();
    void useOnboardingStore.getState().load();
  }, []);
  useEffect(() => installEdgeGestureGuard(), []);

  const ready = (fontsLoaded || !!fontError) && sessionStatus !== 'loading' && onboardingStatus !== 'loading';

  /**
   * The native splash is held back by `preventAutoHideAsync` above, so this
   * component owns hiding it. Without this the splash never goes away: on iOS
   * `preventAutoHideCalled` stops the auto-hide and expo-router's internal
   * hide is disabled too (`userControlledAutoHideEnabled`), so the app sits on
   * the splash screen forever and looks like it is still loading.
   */
  useEffect(() => {
    if (ready) {
      void SplashScreen.hideAsync();
    }
  }, [ready]);

  /**
   * Failsafe: a blocking read that never settles (secure store, font load)
   * must not hold the splash on screen forever. Once the failsafe fires the
   * splash is gone and the router renders whatever it can.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      void SplashScreen.hideAsync();
    }, SPLASH_FAILSAFE_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) return <SplashFallback />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
        {/*
          `initialWindowMetrics` gives the provider the real insets on the
          first frame instead of waiting for the native measurement, so the
          bottom navigation starts above the system navigation bar instead of
          being drawn under it for a frame.
        */}
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <AppShell />
        </SafeAreaProvider>
      </PersistQueryClientProvider>
    </GestureHandlerRootView>
  );
}
