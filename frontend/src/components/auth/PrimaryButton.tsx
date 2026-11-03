import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text } from 'react-native';
import { usePressScale } from '@/lib/usePressScale';
import { authTokens } from '@/theme/tokens';
import { useTheme } from '@/theme';

export type PrimaryButtonVariant = 'primary' | 'secondary' | 'outline';

export type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: PrimaryButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  accessibilityLabel?: string;
  testID?: string;
};

const styles = StyleSheet.create({
  base: {
    height: authTokens.size.buttonHeight,
    borderRadius: authTokens.radius.pill,
    backgroundColor: authTokens.color.brand,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: authTokens.space.backTop,
    paddingHorizontal: authTokens.space.screenPaddingHorizontal,
  },
  secondary: {
    height: authTokens.size.socialButtonHeight,
    backgroundColor: authTokens.color.surface,
    borderWidth: 1,
    borderColor: authTokens.color.border,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    ...authTokens.type.button,
    color: authTokens.color.surface,
  },
  labelSecondary: {
    ...authTokens.type.socialLabel,
    color: authTokens.color.text,
  },
});

/**
 * PrimaryButton — pill button for auth actions.
 * Primary: height 56, pill, bg brand (#C4512D), white text 17 semibold.
 * Disabled: brand at 40% opacity.
 * Loading: spinner replaces text.
 * Press: scale 0.98 + light haptic.
 * Secondary: height 52, pill, 1px border, bg surface.
 */
export function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  accessibilityLabel,
  testID,
}: PrimaryButtonProps) {
  const theme = useTheme();
  const { scale, onPressIn, onPressOut } = usePressScale(0.98);
  const isDisabled = disabled || loading;
  const isSecondary = variant === 'secondary' || variant === 'outline';

  const handlePressIn = () => {
    if (isDisabled) return;
    onPressIn();
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  };

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={onPressOut}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      testID={testID}
    >
      <Animated.View
        style={[
          styles.base,
          isSecondary && styles.secondary,
          isDisabled && styles.disabled,
          { transform: [{ scale }] },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={isSecondary ? authTokens.color.text : authTokens.color.surface} />
        ) : (
          <>
            {icon}
            <Text
              style={isSecondary ? styles.labelSecondary : styles.label}
              maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
            >
              {label}
            </Text>
          </>
        )}
      </Animated.View>
    </Pressable>
  );
}
