import { Platform } from 'react-native';
import { router } from 'expo-router';

/**
 * Drop DOM focus before navigating or opening an overlay. On web the trigger
 * keeps focus while its screen is hidden, which makes the framework warn that a
 * focused node is `aria-hidden`. No-op on native. We never set `aria-hidden`.
 */
export const blurActive = (): void => {
  if (Platform.OS !== 'web') return;
  if (typeof document === 'undefined') return;
  (document.activeElement as HTMLElement | null)?.blur?.();
};

/** Navigate after clearing focus, so the press target is not hidden mid-focus. */
export const go = (href: string, mode: 'push' | 'replace' | 'navigate' = 'push'): void => {
  blurActive();
  requestAnimationFrame(() => router[mode](href as never));
};
