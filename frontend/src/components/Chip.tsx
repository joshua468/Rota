import type { ReactNode } from 'react';
import { Animated, Pressable, Text } from 'react-native';
import { usePressScale } from '@/lib/usePressScale';
import { createStyles, useTheme } from '@/theme';

export type ChipProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  icon?: ReactNode;
  accessibilityLabel?: string;
  testID?: string;
};

const useStyles = createStyles((t) => ({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space[1],
    minHeight: t.size.controlMin,
    paddingHorizontal: t.space[4],
    borderRadius: t.radius.chip,
    borderWidth: t.size.hairline,
    borderColor: t.color.border,
    backgroundColor: t.color.surface,
  },
  selected: {
    backgroundColor: t.color.primary,
    borderColor: t.color.primary,
  },
  label: {
    ...t.type.labelMedium,
    color: t.color.textSecondary,
  },
  labelSelected: {
    color: t.color.onPrimary,
  },
}));

export function Chip({ label, selected = false, onPress, icon, accessibilityLabel, testID }: ChipProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { scale, onPressIn, onPressOut } = usePressScale();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}
      testID={testID}
    >
      <Animated.View style={[styles.chip, selected && styles.selected, { transform: [{ scale }] }]}>
        {icon}
        <Text
          style={[styles.label, selected && styles.labelSelected]}
          maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
