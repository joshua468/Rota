import { Platform, Text, TextInput, View, type TextInputProps } from 'react-native';
import { useState } from 'react';
import { hasKey, t } from '@/i18n';
import { createStyles, useTheme } from '@/theme';

export type TextFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  hint?: string;
  testID?: string;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'style' | 'placeholderTextColor'>;

const useStyles = createStyles((t) => ({
  field: {
    gap: t.space[1],
  },
  label: {
    ...t.type.labelLarge,
    color: t.color.textPrimary,
  },
  input: {
    ...t.type.bodyLarge,
    color: t.color.textPrimary,
    backgroundColor: t.color.surface,
    borderWidth: t.size.hairline,
    borderColor: t.color.border,
    borderRadius: t.radius.md,
    paddingHorizontal: t.space[3],
    paddingVertical: t.space[2],
    minHeight: t.size.controlMin,
  },
  inputFocus: {
    borderColor: t.color.focus,
  },
  inputError: {
    borderColor: t.color.error,
  },
  inputDisabled: {
    backgroundColor: t.color.disabled,
    color: t.color.onDisabled,
  },
  message: {
    ...t.type.bodySmall,
    color: t.color.textSecondary,
  },
  error: {
    ...t.type.bodySmall,
    color: t.color.error,
  },
}));

export function TextField({
  label,
  value,
  onChangeText,
  error,
  hint,
  testID,
  editable = true,
  secureTextEntry,
  onFocus,
  onBlur,
  ...rest
}: TextFieldProps) {
  const styles = useStyles();
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const displayError = error && hasKey(error) ? t(error) : error;

  return (
    <View style={styles.field}>
      <Text
        style={styles.label}
        maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        secureTextEntry={secureTextEntry}
        accessibilityLabel={label}
        accessibilityHint={hint}
        accessibilityState={{ disabled: !editable }}
        aria-invalid={!!displayError}
        testID={testID}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          styles.input,
          focused && !displayError && styles.inputFocus,
          displayError && styles.inputError,
          !editable && styles.inputDisabled,
          Platform.select({
            web: {
              outlineWidth: 0,
              outlineStyle: 'none',
              boxShadow: 'none',
              WebkitTapHighlightColor: 'transparent',
            } as any,
          }),
        ]}
        maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
        {...rest}
      />
      {displayError ? (
        <Text
          style={styles.error}
          accessibilityLiveRegion="polite"
          maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
        >
          {displayError}
        </Text>
      ) : hint ? (
        <Text style={styles.message} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
