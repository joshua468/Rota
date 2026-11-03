import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { AuthScreen, FormBanner, PasswordField, PrimaryButton, TextField } from '@/components/auth';
import { errorMessage } from '@/components/ErrorState';
import { t } from '@/i18n';
import { Illustration } from '@/illustrations';
import { validatePassword } from '@/lib/auth/validators';
import { useReset } from '@/api/queries';

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ token?: string }>();
  const [token, setToken] = useState((params.token as string) ?? '');
  const reset = useReset();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  const [mismatchError, setMismatchError] = useState<string | undefined>(undefined);

  const invalidToken = token.length === 0;

  if (reset.isSuccess) {
    return (
      <AuthScreen
        title={t('auth.reset.successTitle')}
        subtitle={t('auth.reset.done')}
        illustration={<Illustration variant="check" size="sm" />}
      >
        <PrimaryButton
          label={t('auth.reset.signIn')}
          onPress={() => router.replace('/(auth)/sign-in')}
          testID="reset-signin"
        />
      </AuthScreen>
    );
  }

  const submit = () => {
    const nextError = validatePassword(password);
    setPasswordError(nextError);
    const nextMismatch = password !== confirm ? t('auth.reset.mismatch') : undefined;
    setMismatchError(nextMismatch);
    if (nextError || nextMismatch || invalidToken) return;
    reset.mutate({ token, password });
  };

  return (
    <AuthScreen title={t('auth.reset.title')} subtitle={t('auth.reset.subtitle')}>
      {invalidToken || reset.isError ? (
        <FormBanner
          tone="error"
          message={invalidToken ? t('auth.reset.invalidToken') : errorMessage(reset.error)}
          onDismiss={invalidToken ? undefined : () => reset.reset()}
        />
      ) : null}
      <PasswordField
        label={t('auth.password')}
        value={password}
        onChangeText={setPassword}
        error={passwordError}
        hint={t('auth.passwordHint')}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        textContentType="newPassword"
        editable={!reset.isPending}
        testID="reset-password"
      />
      <PasswordField
        label={t('auth.reset.confirm')}
        value={confirm}
        onChangeText={setConfirm}
        error={mismatchError}
        showStrength={false}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        textContentType="newPassword"
        editable={!reset.isPending}
        returnKeyType="go"
        onSubmitEditing={submit}
        testID="reset-confirm"
      />
      <TextField
        label="Reset code (optional)"
        value={token}
        onChangeText={setToken}
        leadingIcon="key-outline"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!reset.isPending}
        testID="reset-token-code"
      />
      <PrimaryButton
        label={t('auth.reset.submit')}
        onPress={submit}
        loading={reset.isPending}
        disabled={invalidToken}
        testID="reset-submit"
      />
    </AuthScreen>
  );
}
