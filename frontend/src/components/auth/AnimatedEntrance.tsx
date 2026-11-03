import { useEffect } from 'react';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useReducedMotion } from '@/lib/usePressScale';

export type AnimatedEntranceProps = {
  children: ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * AnimatedEntrance — subtle entrance animation.
 * Fade + translateY(12) in 250ms, with 40ms stagger per block.
 * Respects reduce-motion (instant display if enabled).
 */
export function AnimatedEntrance({ children, delay = 0, style }: AnimatedEntranceProps) {
  const reduced = useReducedMotion();
  const opacity = useSharedValue(reduced ? 1 : 0);
  const translateY = useSharedValue(reduced ? 0 : 12);

  useEffect(() => {
    if (reduced) {
      opacity.value = 1;
      translateY.value = 0;
      return;
    }
    const timingConfig = { duration: 250, easing: Easing.out(Easing.cubic) };
    if (delay > 0) {
      const timer = setTimeout(() => {
        opacity.value = withTiming(1, timingConfig);
        translateY.value = withTiming(0, timingConfig);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      opacity.value = withTiming(1, timingConfig);
      translateY.value = withTiming(0, timingConfig);
    }
  }, [reduced, delay, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
}
