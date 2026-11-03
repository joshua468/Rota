import { useState } from 'react';
import { View } from 'react-native';
import { PasswordStrengthMeter } from '@/components/PasswordStrength';
import { t } from '@/i18n';
import { TextField, type AuthTextFieldProps } from './TextField';

export type PasswordFieldProps = Omit<
  AuthTextFieldProps,
  'trailingIcon' | 'trailingIconLabel' | 'onTrailingPress' | 'secureTextEntry'
> & {
  /** Show the strength meter under the field while the user types. */
  showStrength?: boolean;
};

/**
 * PasswordField — TextField with eye toggle in a 44x44 hitSlop area,
 * accessibilityLabel "Show password" / "Hide password".
 */
export function PasswordField({
  showStrength = false,
  error,
  value,
  leadingIcon = 'lock-closed-outline',
  ...rest
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <TextField
        {...rest}
        value={value}
        error={error}
        leadingIcon={leadingIcon}
        secureTextEntry={!visible}
        trailingIcon={visible ? 'eye-off-outline' : 'eye-outline'}
        trailingIconLabel={visible ? t('auth.hidePassword') : t('auth.showPassword')}
        onTrailingPress={() => setVisible((current) => !current)}
      />
      {showStrength && value.length > 0 && !error ? (
        <PasswordStrengthMeter value={value} />
      ) : null}
    </View>
  );
}
