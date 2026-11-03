import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Platform } from 'react-native';

/**
 * Respect the system Reduce Motion setting so we never animate for users who
 * asked not to be. Falls back to `false` while the setting loads.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduced(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return reduced;
}

/**
 * Web has no native animated module: animating transforms/opacity with
 * `useNativeDriver: true` prints a dev warning. Anything that animates must
 * opt in with this flag instead of hardcoding `true`.
 */
export const USE_NATIVE_DRIVER = Platform.OS !== 'web';

const DRIVER = USE_NATIVE_DRIVER;

/**
 * 0.98 press-scale + release spring. Returns the animated value and handlers
 * to wire into any Pressable; skip everything when Reduce Motion is on.
 */
export function usePressScale(pressedScale = 0.98): {
  scale: Animated.Value;
  onPressIn: () => void;
  onPressOut: () => void;
} {
  const scale = useRef(new Animated.Value(1)).current;
  const reduced = useReducedMotion();

  const onPressIn = useCallback(() => {
    if (reduced) return;
    Animated.timing(scale, {
      toValue: pressedScale,
      duration: 90,
      useNativeDriver: DRIVER,
    }).start();
  }, [reduced, pressedScale, scale]);

  const onPressOut = useCallback(() => {
    if (reduced) return;
    Animated.spring(scale, {
      toValue: 1,
      speed: 40,
      bounciness: 0,
      useNativeDriver: DRIVER,
    }).start();
  }, [reduced, scale]);

  return { scale, onPressIn, onPressOut };
}