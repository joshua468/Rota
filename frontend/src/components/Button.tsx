import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { usePressScale } from '@/lib/usePressScale';
import { createStyles, useTheme } from '@/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  /** layout of the touch target itself (e.g. `flex: 1` inside a button row) */
  containerStyle?: StyleProp<ViewStyle>;
  testID?: string;
};

const useStyles = createStyles((t) => ({
  base: {
    minHeight: t.size.controlMin,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space[2],
    paddingHorizontal: t.space[5],
    paddingVertical: t.space[2],
    borderRadius: t.radius.full,
  },
  primary: {
    backgroundColor: t.color.primary,
  },
  secondary: {
    backgroundColor: t.color.secondaryContainer,
  },
  ghost: {
    backgroundColor: t.color.surface,
    borderWidth: t.size.hairline,
    borderColor: t.color.border,
  },
  danger: {
    backgroundColor: t.color.errorContainer,
  },
  disabled: {
    backgroundColor: t.color.disabled,
    borderColor: t.color.disabled,
  },
  label: {
    ...t.type.labelLarge,
    color: t.color.onPrimary,
  },
  labelSecondary: {
    ...t.type.labelLarge,
    color: t.color.onSecondaryContainer,
  },
  labelGhost: {
    ...t.type.labelLarge,
    color: t.color.link,
  },
  labelDanger: {
    ...t.type.labelLarge,
    color: t.color.onErrorContainer,
  },
  labelDisabled: {
    ...t.type.labelLarge,
    color: t.color.onDisabled,
  },
}));

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  accessibilityLabel,
  style,
  containerStyle,
  testID,
}: ButtonProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { scale, onPressIn, onPressOut } = usePressScale();
  const isDisabled = disabled || loading;

  const container =
    variant === 'secondary'
      ? styles.secondary
      : variant === 'ghost'
        ? styles.ghost
        : variant === 'danger'
          ? styles.danger
          : styles.primary;

  const labelStyle =
    variant === 'secondary'
      ? styles.labelSecondary
      : variant === 'ghost'
        ? styles.labelGhost
        : variant === 'danger'
          ? styles.labelDanger
          : styles.label;

  const spinnerColor = isDisabled
    ? theme.color.onDisabled
    : variant === 'secondary'
      ? theme.color.onSecondaryContainer
      : variant === 'ghost'
        ? theme.color.link
        : variant === 'danger'
          ? theme.color.onErrorContainer
          : theme.color.onPrimary;

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      onPressIn={isDisabled ? undefined : onPressIn}
      onPressOut={isDisabled ? undefined : onPressOut}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={containerStyle}
      testID={testID}
    >
      <Animated.View
        style={[styles.base, container, isDisabled && styles.disabled, style, { transform: [{ scale }] }]}
      >
        {loading ? <ActivityIndicator color={spinnerColor} /> : icon}
        <Text
          style={[labelStyle, isDisabled && styles.labelDisabled]}
          maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
