import { useEffect, useRef } from 'react';
import { Animated, type DimensionValue } from 'react-native';
import { USE_NATIVE_DRIVER, useReducedMotion } from '@/lib/usePressScale';
import { createStyles, useTheme } from '@/theme';

export type SkeletonProps = {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  testID?: string;
};

const useStyles = createStyles((t) => ({
  block: {
    backgroundColor: t.color.skeleton,
    borderRadius: t.radius.sm,
  },
}));

export function Skeleton({ width = '100%', height = 20, radius, testID }: SkeletonProps) {
  const styles = useStyles();
  const theme = useTheme();
  const reduced = useReducedMotion();
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (reduced) return undefined;
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: theme.motion.duration.base,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: theme.motion.duration.base,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
      ]),
    );
    pulse.start();
    return () => {
      pulse.stop();
    };
  }, [opacity, reduced, theme.motion.duration.base]);

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      testID={testID}
      style={[
        styles.block,
        radius === undefined ? undefined : { borderRadius: radius },
        { width, height, opacity },
      ]}
    />
  );
}
