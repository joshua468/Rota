import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { authTokens } from '@/theme/tokens';
import { useTheme } from '@/theme';

export type AuthCheckboxProps = {
  checked: boolean;
  onToggle: () => void;
  label?: ReactNode;
  accessibilityLabel?: string;
  testID?: string;
};

const styles = StyleSheet.create({
  row: {
    minHeight: authTokens.size.touchMin,
    flexDirection: 'row',
    alignItems: 'center',
    gap: authTokens.space.socialGap,
  },
  box: {
    width: authTokens.size.checkbox,
    height: authTokens.size.checkbox,
    borderRadius: authTokens.radius.checkbox,
    borderWidth: 1,
    borderColor: authTokens.color.border,
    backgroundColor: authTokens.color.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    backgroundColor: authTokens.color.brand,
    borderColor: authTokens.color.brand,
  },
  label: {
    ...authTokens.type.body,
    color: authTokens.color.textSecondary,
    flexShrink: 1,
  },
});

/**
 * Shared 22x22 checkbox component with radius 6 and min-height 44 tappable row.
 * Used for Terms agreement on sign-up and "Keep me logged in" on sign-in.
 */
export function AuthCheckbox({
  checked,
  onToggle,
  label,
  accessibilityLabel,
  testID,
}: AuthCheckboxProps) {
  const theme = useTheme();
  const max = theme.textScale.maxFontSizeMultiplier;

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={accessibilityLabel}
      style={styles.row}
      hitSlop={authTokens.space.backTop}
      testID={testID}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? (
          <Ionicons name="checkmark" size={14} color={authTokens.color.surface} />
        ) : null}
      </View>
      {typeof label === 'string' ? (
        <Text style={styles.label} maxFontSizeMultiplier={max}>
          {label}
        </Text>
      ) : (
        label
      )}
    </Pressable>
  );
}
