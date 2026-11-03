import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { BackButton } from '@/components';
import { AuthScreen, FormBanner, PrimaryButton, TextField } from '@/components/auth';
import { errorMessage } from '@/components/ErrorState';
import { t } from '@/i18n';
import { Illustration } from '@/illustrations';
import { validateEmail } from '@/lib/auth/validators';
import { useForgot } from '@/api/queries';
import { createStyles, useTheme } from '@/theme';

const RESEND_SECONDS = 30;

const useStyles = createStyles((t) => ({
  linkRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: t.space[2],
  },
  link: {
    ...t.type.labelLarge,
    color: t.color.link,
  },
  linkMuted: {
    ...t.type.labelLarge,
    color: t.color.textMuted,
  },
  tap: {
    minHeight: t.size.touchMin,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: t.space[2],
  },
  sentTo: {
    ...t.type.bodyLarge,
    color: t.color.textPrimary,
    textAlign: 'center',
  },
}));

export default function ForgotPasswordScreen() {
  const styles = useStyles();
  const theme = useTheme();
  const forgot = useForgot();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [cooldown, setCooldown] = useState(0);
  const max = theme.textScale.maxFontSizeMultiplier;
  const sent = forgot.isSuccess;

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const send = () => {
    const nextError = validateEmail(email);
    setEmailError(nextError);
    if (nextError) return;
    forgot.mutate({ email: email.trim().toLowerCase() }, { onSuccess: () => setCooldown(RESEND_SECONDS) });
  };

  const backToSignIn = (
    <View style={styles.linkRow}>
      <Pressable
        onPress={() => router.replace('/(auth)/sign-in')}
        accessibilityRole="link"
        accessibilityLabel={t('auth.forgot.back')}
        hitSlop={theme.size.touchMin}
        style={styles.tap}
      >
        <Text style={styles.link} maxFontSizeMultiplier={max}>
          {t('auth.forgot.back')}
        </Text>
      </Pressable>
    </View>
  );

  if (sent) {
    return (
      <AuthScreen
        title={t('auth.forgot.checkTitle')}
        subtitle={t('auth.forgot.checkBody', { email: email.trim().toLowerCase() })}
        illustration={<Illustration variant="email" size="sm" />}
        footer={backToSignIn}
      >
        <Text style={styles.sentTo} maxFontSizeMultiplier={max}>
          {email.trim().toLowerCase()}
        </Text>
        <View style={styles.linkRow}>
          <Pressable
            onPress={send}
            disabled={cooldown > 0 || forgot.isPending}
            accessibilityRole="button"
            accessibilityState={{ disabled: cooldown > 0 || forgot.isPending, busy: forgot.isPending }}
            accessibilityLabel={t('auth.forgot.resend')}
            hitSlop={theme.size.touchMin}
            style={styles.tap}
            testID="forgot-resend"
          >
            <Text
              style={cooldown > 0 ? styles.linkMuted : styles.link}
              maxFontSizeMultiplier={max}
            >
              {cooldown > 0 ? t('auth.forgot.resendIn', { n: cooldown }) : t('auth.forgot.resend')}
            </Text>
          </Pressable>
        </View>
      </AuthScreen>
    );
  }

  return (
    <AuthScreen
      title={t('auth.forgot.title')}
      subtitle={t('auth.forgot.subtitle')}
      illustration={<Illustration variant="email" size="sm" />}
      headerLeft={<BackButton label={t('common.back')} onPress={() => router.back()} />}
      footer={backToSignIn}
    >
      {forgot.isError ? (
        <FormBanner
          tone="error"
          message={errorMessage(forgot.error)}
          onDismiss={() => forgot.reset()}
        />
      ) : null}
      <TextField
        label={t('auth.email')}
        value={email}
        onChangeText={setEmail}
        error={emailError}
        leadingIcon="mail-outline"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        editable={!forgot.isPending}
        returnKeyType="done"
        onSubmitEditing={send}
        testID="forgot-email"
      />
      <PrimaryButton
        label={t('auth.forgot.send')}
        onPress={send}
        loading={forgot.isPending}
        testID="forgot-submit"
      />
    </AuthScreen>
  );
}
