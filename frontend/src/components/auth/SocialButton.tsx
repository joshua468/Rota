import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { usePressScale } from '@/lib/usePressScale';
import { authTokens } from '@/theme/tokens';
import { useTheme } from '@/theme';

export const SOCIAL_PROVIDERS = {
  google: 'logo-google',
  apple: 'logo-apple',
  gmail: 'mail',
} as const satisfies Record<string, keyof typeof Ionicons.glyphMap>;

export type SocialProvider = keyof typeof SOCIAL_PROVIDERS;
export type SocialButtonShape = 'pill' | 'circle';

export type SocialButtonProps = {
  provider: SocialProvider;
  shape?: SocialButtonShape;
  label?: string;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

const styles = StyleSheet.create({
  pressable: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
  },
  pill: {
    width: '100%',
    height: authTokens.size.socialButtonHeight,
    backgroundColor: authTokens.color.surface,
    borderWidth: 1,
    borderColor: authTokens.color.border,
    borderRadius: authTokens.radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: authTokens.space.inputPaddingX,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...authTokens.type.socialLabel,
    color: authTokens.color.text,
    marginLeft: authTokens.space.labelGap,
  },
});

/**
 * SocialButton — pill social provider button (height 52, 1px border, surface bg).
 * Side-by-side Google and Apple buttons on auth screens.
 */
export function SocialButton({
  provider,
  label,
  onPress,
  disabled = false,
  testID,
  style,
}: SocialButtonProps) {
  const theme = useTheme();
  const { scale, onPressIn, onPressOut } = usePressScale(0.98);

  const handlePressIn = () => {
    if (disabled) return;
    onPressIn();
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch { }
  };

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={[styles.pressable, style]}
      testID={testID}
    >
      <Animated.View
        style={[
          styles.pill,
          disabled && styles.disabled,
          { transform: [{ scale }] },
        ]}
      >
        <Ionicons
          name={SOCIAL_PROVIDERS[provider]}
          size={authTokens.size.icon}
          color={authTokens.color.text}
        />
        {label ? (
          <Text
            style={styles.label}
            maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
          >
            {label}
          </Text>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}
