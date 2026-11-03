import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { USE_NATIVE_DRIVER, useReducedMotion } from '@/lib/usePressScale';
import { createStyles, useTheme } from '@/theme';

export type IllustrationVariant =
  | 'welcome'
  | 'schedule'
  | 'swap'
  | 'notify'
  | 'email'
  | 'check';
export type IllustrationSize = 'sm' | 'md' | 'lg';

export type IllustrationProps = {
  variant: IllustrationVariant;
  size?: IllustrationSize;
  testID?: string;
};

/** Illustration sizes are fixed graphic dimensions (not layout spacing). */
const SIZE: Record<IllustrationSize, number> = { sm: 72, md: 160, lg: 260 };
const CARD_RATIO = 0.62;
const BARS_AT: IllustrationSize[] = ['md', 'lg'];

const MAIN_ICON: Record<IllustrationVariant, keyof typeof Ionicons.glyphMap> = {
  welcome: 'sparkles',
  schedule: 'calendar-outline',
  swap: 'swap-horizontal',
  notify: 'notifications-outline',
  email: 'mail-outline',
  check: 'shield-checkmark-outline',
};

const ACCENT_ICON: Record<IllustrationVariant, keyof typeof Ionicons.glyphMap> = {
  welcome: 'flash',
  schedule: 'time-outline',
  swap: 'checkmark',
  notify: 'checkmark',
  email: 'checkmark',
  check: 'checkmark',
};

const useStyles = createStyles((t) => ({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    position: 'absolute',
    backgroundColor: t.color.primaryContainer,
    borderRadius: t.radius.full,
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space[3],
    backgroundColor: t.color.surface,
    borderRadius: t.radius.card,
    ...t.shadow.soft,
  },
  bars: {
    gap: t.space[2],
    alignItems: 'center',
  },
  bar: {
    height: t.space[1],
    borderRadius: t.radius.full,
    backgroundColor: t.color.surfaceMuted,
  },
  accent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.color.primary,
    borderRadius: t.radius.full,
  },
}));

/**
 * Illustration — decorative, theme-aware art built from Views and Ionicons (no
 * image assets, no react-native-svg dependency). It gently floats unless the
 * user has Reduce Motion enabled, in which case it renders static.
 */
export function Illustration({ variant, size = 'md', testID }: IllustrationProps) {
  const styles = useStyles();
  const theme = useTheme();
  const reduced = useReducedMotion();
  const dimension = SIZE[size];
  const card = dimension * CARD_RATIO;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduced) return;
    const duration = theme.motion.duration.slow;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduced, float, theme.motion.duration.slow]);

  const translateY = float.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -theme.space[2]],
  });

  return (
    <View
      style={[styles.root, { width: dimension, height: dimension }]}
      accessible={false}
      testID={testID}
    >
      <View style={[styles.backdrop, { width: dimension, height: dimension }]} />
      <Animated.View
        style={[styles.card, { width: card, height: card, transform: [{ translateY }] }]}
      >
        <Ionicons
          name={MAIN_ICON[variant]}
          size={card / 2}
          color={theme.color.primary}
        />
        {BARS_AT.includes(size) ? (
          <View style={styles.bars}>
            <View style={[styles.bar, { width: card / 2 }]} />
            <View style={[styles.bar, { width: card / 3 }]} />
          </View>
        ) : null}
      </Animated.View>
      <View
        style={[
          styles.accent,
          { width: card / 4, height: card / 4, top: dimension * 0.1, right: dimension * 0.08 },
        ]}
      >
        <Ionicons name={ACCENT_ICON[variant]} size={card / 7} color={theme.color.onPrimary} />
      </View>
    </View>
  );
}
