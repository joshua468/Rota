import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { AuthScreen, FormBanner, PrimaryButton } from '@/components/auth';
import { errorMessage } from '@/components/ErrorState';
import { t } from '@/i18n';
import { Illustration } from '@/illustrations';
import { useMagicStart } from '@/api/queries';
import { useSessionStore } from '@/stores/session';
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

export default function VerifyEmailScreen() {
  const styles = useStyles();
  const theme = useTheme();
  const email = useSessionStore((s) => s.user?.email) ?? '';
  const magic = useMagicStart();
  const [cooldown, setCooldown] = useState(0);
  const max = theme.textScale.maxFontSizeMultiplier;

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const resend = () => {
    if (!email || cooldown > 0) return;
    magic.mutate(
      { email },
      { onSuccess: () => setCooldown(RESEND_SECONDS) },
    );
  };

  return (
    <AuthScreen
      title={t('auth.verify.title')}
      subtitle={t('auth.verify.subtitle')}
      illustration={<Illustration variant="email" size="md" />}
      footer={
        <View style={styles.linkRow}>
          <Pressable
            onPress={() => router.replace('/(auth)/sign-in')}
            accessibilityRole="link"
            accessibilityLabel={t('auth.verify.differentEmail')}
            hitSlop={theme.size.touchMin}
            style={styles.tap}
            testID="verify-different"
          >
            <Text style={styles.link} maxFontSizeMultiplier={max}>
              {t('auth.verify.differentEmail')}
            </Text>
          </Pressable>
        </View>
      }
    >
      {magic.isError ? (
        <FormBanner
          tone="error"
          message={errorMessage(magic.error)}
          onDismiss={() => magic.reset()}
        />
      ) : null}
      {magic.isSuccess ? (
        <FormBanner tone="success" message={t('auth.verify.resent')} />
      ) : null}
      {email ? (
        <Text style={styles.sentTo} maxFontSizeMultiplier={max}>
          {t('auth.verify.sentTo', { email })}
        </Text>
      ) : null}
      <PrimaryButton
        label={t('auth.verify.openMail')}
        icon={
          <Ionicons name="mail-open-outline" size={theme.size.iconMd} color={theme.color.onPrimary} />
        }
        onPress={() => void Linking.openURL('mailto:')}
        testID="verify-open-mail"
      />
      <View style={styles.linkRow}>
        <Pressable
          onPress={resend}
          disabled={cooldown > 0 || magic.isPending || !email}
          accessibilityRole="button"
          accessibilityState={{ disabled: cooldown > 0 || magic.isPending, busy: magic.isPending }}
          accessibilityLabel={t('auth.verify.resend')}
          hitSlop={theme.size.touchMin}
          style={styles.tap}
          testID="verify-resend"
        >
          <Text style={cooldown > 0 ? styles.linkMuted : styles.link} maxFontSizeMultiplier={max}>
            {cooldown > 0 ? t('auth.verify.resendIn', { n: cooldown }) : t('auth.verify.resend')}
          </Text>
        </Pressable>
      </View>
    </AuthScreen>
  );
}
