import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { USE_NATIVE_DRIVER, useReducedMotion } from '@/lib/usePressScale';
import { createStyles, useTheme } from '@/theme';

export type SegmentedOption = {
  value: string;
  label: string;
};

export type SegmentedControlProps = {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  accessibilityLabel?: string;
  testID?: string;
};

const useStyles = createStyles((t) => ({
  track: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: t.color.surfaceSunken,
    borderRadius: t.radius.full,
    padding: t.space[1],
  },
  thumb: {
    position: 'absolute',
    top: t.space[1],
    bottom: t.space[1],
    left: t.space[1],
    backgroundColor: t.color.primary,
    borderRadius: t.radius.full,
    pointerEvents: 'none',
  },
  option: {
    flex: 1,
    minHeight: t.size.controlMin,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: t.space[2],
    borderRadius: t.radius.full,
  },
  label: {
    ...t.type.labelMedium,
    color: t.color.textSecondary,
    textAlign: 'center',
  },
  labelSelected: {
    color: t.color.onPrimary,
  },
}));

export function SegmentedControl({
  options,
  value,
  onChange,
  accessibilityLabel,
  testID,
}: SegmentedControlProps) {
  const styles = useStyles();
  const theme = useTheme();
  const reduced = useReducedMotion();
  const [trackWidth, setTrackWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const count = Math.max(options.length, 1);
  const innerWidth = trackWidth - theme.space[1] * 2;
  const thumbWidth = innerWidth > 0 ? innerWidth / count : 0;
  const selectedIndex = Math.max(
    options.findIndex((option) => option.value === value),
    0,
  );

  useEffect(() => {
    if (thumbWidth <= 0) return;
    Animated.timing(translateX, {
      toValue: selectedIndex * thumbWidth,
      duration: reduced ? 0 : theme.motion.duration.base,
      easing: Easing.bezier(0.2, 0, 0, 1),
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  }, [reduced, selectedIndex, thumbWidth, theme.motion.duration.base, translateX]);

  return (
    <View
      style={styles.track}
      onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      {thumbWidth > 0 ? (
        <Animated.View
          style={[styles.thumb, { width: thumbWidth, transform: [{ translateX }] }]}
        />
      ) : null}
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityLabel={option.label}
            accessibilityState={{ selected }}
            style={styles.option}
          >
            <Text
              style={[styles.label, selected && styles.labelSelected]}
              maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
