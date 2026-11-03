import type { ReactNode } from 'react';
import { Pressable, Text, type StyleProp, type ViewStyle } from 'react-native';
import { createStyles, useTheme } from '@/theme';

export type IconButtonProps = {
  icon: ReactNode;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const useStyles = createStyles((t) => ({
  base: {
    minWidth: t.size.touchMin,
    minHeight: t.size.touchMin,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: t.space[2],
    borderRadius: t.radius.md,
    backgroundColor: t.color.surfaceMuted,
  },
  selected: {
    backgroundColor: t.color.primaryContainer,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
}));

export function IconButton({
  icon,
  label,
  onPress,
  disabled = false,
  selected = false,
  style,
  testID,
}: IconButtonProps) {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled, selected }}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        selected && styles.selected,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon}
    </Pressable>
  );
}
