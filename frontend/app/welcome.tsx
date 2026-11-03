import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  AuthScreen,
  DividerWithText,
  FormBanner,
  PrimaryButton,
  SocialButton,
} from '@/components/auth';
import { t } from '@/i18n';
import { BrandMark } from '@/components';
import { useSessionStore } from '@/stores/session';
import { createStyles, useTheme } from '@/theme';

const useStyles = createStyles((t) => ({
  brandLogo: {
    marginTop: -t.space[3],
  },
  contentPush: {
    marginTop: t.space[4],
  },
  socialButton: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
    width: '100%',
  },
  socialButtonSpacing: {
    marginTop: t.space[2],
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: t.space[1],
    paddingVertical: t.space[2],
  },
  footerText: {
    ...t.type.bodyLarge,
    color: t.color.textSecondary,
  },
  link: {
    ...t.type.labelLarge,
    color: t.color.link,
  },
  tap: {
    minHeight: t.size.touchMin,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: t.space[2],
  },
}));

export default function WelcomeScreen() {
  const styles = useStyles();
  const theme = useTheme();
  const status = useSessionStore((s) => s.status);
  const [socialNotice, setSocialNotice] = useState(false);
  const max = theme.textScale.maxFontSizeMultiplier;

  if (status === 'signedIn') return <Redirect href="/(app)" />;

  return (
    <AuthScreen
      title={t('auth.welcome.title')}
      subtitle={t('auth.welcome.subtitle')}
      illustration={<BrandMark align="center" style={styles.brandLogo} />}
      textBlockStyle={styles.contentPush}
      footer={
        <View style={styles.footerRow}>
          <Text style={styles.footerText} maxFontSizeMultiplier={max}>
            {t('auth.haveAccount')}
          </Text>
          <Pressable
            onPress={() => router.push('/(auth)/sign-in')}
            accessibilityRole="link"
            accessibilityLabel={t('auth.signIn')}
            hitSlop={theme.size.touchMin}
            style={styles.tap}
          >
            <Text style={styles.link} maxFontSizeMultiplier={max}>
              {t('auth.signIn')}
            </Text>
          </Pressable>
        </View>
      }
    >
      <PrimaryButton
        label={t('auth.welcome.getStarted')}
        onPress={() => router.push('/(auth)/sign-up')}
        testID="welcome-get-started"
      />
      <DividerWithText text={t('auth.or')} />
      <SocialButton
        provider="google"
        label={t('auth.social.google')}
        onPress={() => setSocialNotice(true)}
        testID="welcome-google"
        style={styles.socialButton}
      />
      <SocialButton
        provider="apple"
        label={t('auth.social.apple')}
        onPress={() => setSocialNotice(true)}
        testID="welcome-apple"
        style={[styles.socialButton, styles.socialButtonSpacing]}
      />
      {socialNotice ? (
        <FormBanner
          tone="info"
          message={t('auth.social.unavailable')}
          onDismiss={() => setSocialNotice(false)}
          testID="welcome-social-notice"
        />
      ) : null}
    </AuthScreen>
  );
}
