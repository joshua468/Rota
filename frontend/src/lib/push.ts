import Constants from 'expo-constants';
import { router, type Href } from 'expo-router';
import { useEffect } from 'react';
import { Linking, Platform } from 'react-native';
import { apiRequest } from '@/api/client';
import { queryClient } from '@/offline/queryClient';
import { getDeviceId, useSessionStore } from '@/stores/session';
import { hrefForNotification } from './deepLink';
import { pushUnavailable } from './pushEnv';

export { hrefForNotification } from './deepLink';
export { pushUnavailable } from './pushEnv';

/**
 * Client push wiring (push-notifications skill). Permission is asked in
 * onboarding; this module registers the device's Expo token against the
 * authenticated user and turns a notification tap into an in-app route.
 *
 * `expo-notifications` is imported lazily inside each function so web and test
 * bundles never pull a native module, and every step is best-effort: a device
 * that cannot get a token (Expo Go, simulator, denied permission) simply does
 * not register, and the rest of the app is unaffected.
 */

function projectId(): string | undefined {
  const extra = Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined;
  const eas = Constants as unknown as { easConfig?: { projectId?: string } };
  return extra?.eas?.projectId ?? eas.easConfig?.projectId;
}

/** Foreground presentation + Android channel, so a tap while open still routes. */
export async function configureNotifications(): Promise<void> {
  if (pushUnavailable()) return;
  try {
    const Notifications = await import('expo-notifications');
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
  } catch {
    // expo-notifications unavailable (web/Expo Go): nothing to configure.
  }
}

/** Best-effort: fetch the Expo token and store it on the user's device row. */
export async function syncPushToken(): Promise<void> {
  if (pushUnavailable()) return;
  if (useSessionStore.getState().status !== 'signedIn') return;

  let token: string | undefined;
  try {
    const Notifications = await import('expo-notifications');
    const current = await Notifications.getPermissionsAsync();
    let status = current.status;
    if (status !== 'granted') {
      status = (await Notifications.requestPermissionsAsync()).status;
    }
    if (status !== 'granted') return;
    const id = projectId();
    const result = id
      ? await Notifications.getExpoPushTokenAsync({ projectId: id })
      : await Notifications.getExpoPushTokenAsync();
    token = result.data;
  } catch {
    return;
  }
  if (!token) return;

  try {
    const deviceId = await getDeviceId();
    await apiRequest(`/v1/me/devices/${encodeURIComponent(deviceId)}/push-token`, {
      method: 'PUT',
      auth: true,
      body: { pushToken: token },
    });
  } catch {
    // Registration is retried on the next foreground; never block the app.
  }
}

/** Subscribes to taps (warm start) and the launch payload (cold start). */
export function subscribeToNotificationTaps(): () => void {
  if (pushUnavailable()) return () => {};
  let cancelled = false;
  let subscription: { remove: () => void } | undefined;

  void (async () => {
    try {
      const Notifications = await import('expo-notifications');
      if (cancelled) return;
      subscription = Notifications.addNotificationResponseReceivedListener((response) => {
        const href = hrefForNotification(response.notification.request.content.data?.url);
        if (href) router.push(href as Href);
      });
      const launch = await Notifications.getLastNotificationResponseAsync();
      if (!cancelled && launch) {
        const href = hrefForNotification(launch.notification.request.content.data?.url);
        if (href) router.push(href as Href);
      }
    } catch {
      // No native module: leave routing to normal deep links.
    }
  })();

  return () => {
    cancelled = true;
    subscription?.remove();
  };
}

/**
 * Routes an app deep link to its in-app screen. Payment return links
 * (`rota://billing`) also refresh the subscription so the screen reflects the
 * webhook as soon as it lands.
 */
function routeDeepLink(url: string | null): void {
  const href = hrefForNotification(url);
  if (!href) return;
  if (href === '/settings/billing') {
    void queryClient.invalidateQueries({ queryKey: ['subscription'] });
  }
  router.push(href as Href);
}

/**
 * Subscribes to URLs the OS hands back to the app (warm start) and the launch
 * URL (cold start) — this is how the browser returns after a Flutterwave
 * checkout redirects to `rota://billing`.
 */
export function subscribeToAppLinks(): () => void {
  let cancelled = false;
  const subscription = Linking.addEventListener('url', ({ url }) => routeDeepLink(url));
  void Linking.getInitialURL()
    .then((url) => {
      if (!cancelled) routeDeepLink(url ?? null);
    })
    .catch(() => {
      // No initial URL available: nothing to route.
    });

  return () => {
    cancelled = true;
    subscription.remove();
  };
}

/**
 * Wires push into the app shell: configure presentation once, listen for taps
 * for the lifetime of the shell, and (re)register the token whenever the user
 * becomes signed in.
 */
export function usePushNotifications(): void {
  const status = useSessionStore((state) => state.status);

  useEffect(() => {
    void configureNotifications().catch(() => undefined);
  }, []);

  useEffect(() => subscribeToNotificationTaps(), []);

  useEffect(() => subscribeToAppLinks(), []);

  useEffect(() => {
    if (status === 'signedIn') void syncPushToken().catch(() => undefined);
  }, [status]);
}
