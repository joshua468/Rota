import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { hasKey, t } from '@/i18n';
import { authTokens } from '@/theme/tokens';
import { useTheme } from '@/theme';

export type AuthTextFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  hint?: string;
  leadingIcon?: keyof typeof Ionicons.glyphMap;
  trailingIcon?: keyof typeof Ionicons.glyphMap;
  trailingIconLabel?: string;
  onTrailingPress?: () => void;
  testID?: string;
} & Omit<
  TextInputProps,
  'value' | 'onChangeText' | 'style' | 'placeholder' | 'placeholderTextColor'
>;

const styles = StyleSheet.create({
  field: {
    marginBottom: authTokens.space.fieldGap,
  },
  label: {
    ...authTokens.type.label,
    color: authTokens.color.text,
    marginBottom: authTokens.space.labelGap,
  },
  inputWrap: {
    height: authTokens.size.inputHeight,
    borderRadius: authTokens.radius.input,
    borderWidth: 1,
    borderColor: authTokens.color.border,
    backgroundColor: authTokens.color.surface,
    paddingHorizontal: authTokens.space.inputPaddingX,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapFocus: {
    borderColor: authTokens.color.brand,
    borderWidth: 1.5,
  },
  inputWrapError: {
    borderColor: authTokens.color.error,
    borderWidth: 1,
  },
  inputWrapDisabled: {
    opacity: 0.5,
  },
  leadingIcon: {
    marginRight: authTokens.space.iconGap,
  },
  input: {
    flex: 1,
    height: '100%',
    ...authTokens.type.input,
    color: authTokens.color.text,
    paddingVertical: 0,
  },
  trailingButton: {
    width: authTokens.size.touchMin,
    height: authTokens.size.touchMin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    ...authTokens.type.caption,
    color: authTokens.color.error,
    marginTop: authTokens.space.errorGap,
  },
  helper: {
    ...authTokens.type.caption,
    color: authTokens.color.textSecondary,
    marginTop: authTokens.space.helperGap,
  },
});

/**
 * Shared Input component for Auth flows.
 * Height 56, radius 14, 1px border, surface bg, 16px padding, 20px leading icon (textSecondary) with 12px gap.
 * Focus: border brand 1.5px. Error: border error 1px + caption error message below (4px gap).
 * Helper text: caption style, textSecondary, 6px below the field.
 */
export function TextField({
  label,
  value,
  onChangeText,
  error,
  hint,
  leadingIcon,
  trailingIcon,
  trailingIconLabel,
  onTrailingPress,
  testID,
  editable = true,
  onFocus,
  onBlur,
  ...rest
}: AuthTextFieldProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const displayError = error && hasKey(error) ? t(error) : error;
  const max = theme.textScale.maxFontSizeMultiplier;

  return (
    <View style={styles.field}>
      <Text style={styles.label} maxFontSizeMultiplier={max} accessibilityRole="text">
        {label}
      </Text>
      <View
        style={[
          styles.inputWrap,
          focused && !displayError && styles.inputWrapFocus,
          displayError && styles.inputWrapError,
          !editable && styles.inputWrapDisabled,
        ]}
      >
        {leadingIcon ? (
          <Ionicons
            name={leadingIcon}
            size={authTokens.size.icon}
            color={authTokens.color.textSecondary}
            style={styles.leadingIcon}
          />
        ) : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          accessibilityLabel={label}
          accessibilityHint={hint}
          accessibilityState={{ disabled: !editable }}
          aria-invalid={!!displayError}
          testID={testID}
          placeholderTextColor={authTokens.color.textSecondary}
          style={[
            styles.input,
            Platform.select({
              web: {
                outlineWidth: 0,
                outlineStyle: 'none',
                boxShadow: 'none',
                WebkitTapHighlightColor: 'transparent',
              } as any,
            }),
          ]}
          maxFontSizeMultiplier={max}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...rest}
        />
        {trailingIcon ? (
          <Pressable
            onPress={onTrailingPress}
            accessibilityRole="button"
            accessibilityLabel={trailingIconLabel}
            hitSlop={authTokens.space.backTop}
            style={styles.trailingButton}
          >
            <Ionicons
              name={trailingIcon}
              size={authTokens.size.icon}
              color={authTokens.color.textSecondary}
            />
          </Pressable>
        ) : null}
      </View>
      {displayError ? (
        <Text style={styles.error} accessibilityLiveRegion="polite" maxFontSizeMultiplier={max}>
          {displayError}
        </Text>
      ) : hint ? (
        <Text style={styles.helper} maxFontSizeMultiplier={max} accessibilityRole="text">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
