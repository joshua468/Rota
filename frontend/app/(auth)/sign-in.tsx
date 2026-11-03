import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  AuthCheckbox,
  AuthScreen,
  DividerWithText,
  FormBanner,
  PasswordField,
  PrimaryButton,
  SocialButton,
  TextField,
} from '@/components/auth';
import { errorMessage } from '@/components/ErrorState';
import { t } from '@/i18n';
import { go } from '@/lib/nav';
import { sessionDestination } from '@/lib/teamSetup';
import { validateEmail, validatePassword } from '@/lib/auth/validators';
import { useLogin } from '@/api/queries';
import { useSessionStore } from '@/stores/session';
import { authTokens } from '@/theme/tokens';
import { useTheme } from '@/theme';

const styles = StyleSheet.create({
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: authTokens.size.touchMin,
    marginTop: -authTokens.space.xs,
    marginBottom: authTokens.space.md,
  },
  forgotLink: {
    ...authTokens.type.linkSemibold,
    color: authTokens.color.brand,
  },
  forgotTap: {
    minHeight: authTokens.size.touchMin,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: authTokens.space.backTop,
  },
  secondaryGap: {
    marginTop: authTokens.space.socialGap,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialFirst: {
    marginRight: authTokens.space.socialGap,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  footerText: {
    ...authTokens.type.footer,
    color: authTokens.color.textSecondary,
  },
  link: {
    ...authTokens.type.footerLink,
    color: authTokens.color.brand,
  },
  linkTap: {
    minHeight: authTokens.size.touchMin,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: authTokens.space.backTop,
  },
});

export default function SignInScreen() {
  const theme = useTheme();
  const status = useSessionStore((s) => s.status);
  const team = useSessionStore((s) => s.team);
  const identityResolved = useSessionStore((s) => s.identityResolved);
  const login = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true); // TODO: wire to optional ephemeral session persistence
  const [socialNotice, setSocialNotice] = useState(false);
  const max = theme.textScale.maxFontSizeMultiplier;

  // Signed in but without a team means without a role: the team step decides
  // whether this user becomes an owner or joins with an invited role. Wait for
  // the server to confirm the identity first.
  if (status === 'signedIn') {
    if (!identityResolved) return null;
    return <Redirect href={sessionDestination(team)} />;
  }

  const submit = () => {
    const nextEmailError = validateEmail(email);
    const nextPasswordError = validatePassword(password);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    if (nextEmailError || nextPasswordError) return;
    login.mutate({ email: email.trim().toLowerCase(), password });
  };

  return (
    <AuthScreen
      title={t('auth.welcomeBack')}
      subtitle={t('auth.signInSubtitle')}
      backTestID="signin-back"
      onBack={() => router.back()}
      footer={
        <View style={styles.footerRow}>
          <Text style={styles.footerText} maxFontSizeMultiplier={max}>
            {t('auth.newToRota')}{' '}
          </Text>
          <Pressable
            onPress={() => go('/(auth)/sign-up')}
            accessibilityRole="link"
            accessibilityLabel={t('auth.signUp')}
            hitSlop={authTokens.space.backTop}
            style={styles.linkTap}
          >
            <Text style={styles.link} maxFontSizeMultiplier={max}>
              {t('auth.signUp')}
            </Text>
          </Pressable>
        </View>
      }
    >
      {login.isError ? (
        <FormBanner
          tone="error"
          message={errorMessage(login.error)}
          onDismiss={() => login.reset()}
          testID="signin-error"
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
        editable={!login.isPending}
        testID="signin-email"
      />

      <PasswordField
        label={t('auth.password')}
        value={password}
        onChangeText={setPassword}
        error={passwordError}
        showStrength={false}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="password"
        textContentType="password"
        editable={!login.isPending}
        returnKeyType="done"
        onSubmitEditing={submit}
        testID="signin-password"
      />

      <View style={styles.optionsRow}>
        <AuthCheckbox
          checked={keepLoggedIn}
          onToggle={() => setKeepLoggedIn((prev) => !prev)}
          label={t('auth.keepLoggedIn')}
          accessibilityLabel={t('auth.keepLoggedIn')}
          testID="signin-keep-logged"
        />
        <Pressable
          onPress={() => go('/(auth)/forgot-password')}
          accessibilityRole="link"
          accessibilityLabel={t('auth.forgot.title')}
          hitSlop={authTokens.space.backTop}
          style={styles.forgotTap}
        >
          <Text style={styles.forgotLink} maxFontSizeMultiplier={max}>
            {t('auth.forgot.title')}
          </Text>
        </Pressable>
      </View>

      <PrimaryButton
        label={login.isPending ? t('auth.signingIn') : t('auth.signIn')}
        onPress={submit}
        loading={login.isPending}
        testID="signin-submit"
      />

      <View style={styles.secondaryGap}>
        <PrimaryButton
          variant="secondary"
          label={t('auth.magicLink')}
          icon={
            <Ionicons
              name="mail-outline"
              size={authTokens.size.icon}
              color={authTokens.color.text}
            />
          }
          onPress={() => go('/(auth)/magic-link')}
          disabled={login.isPending}
          testID="signin-magic"
        />
      </View>

      <DividerWithText text={t('auth.orSignInWith')} />

      <View style={styles.socialRow}>
        <SocialButton
          provider="google"
          label={t('auth.social.googleLabel')}
          onPress={() => setSocialNotice(true)}
          disabled={login.isPending}
          testID="signin-google"
          style={styles.socialFirst}
        />
        <SocialButton
          provider="apple"
          label={t('auth.social.appleLabel')}
          onPress={() => setSocialNotice(true)}
          disabled={login.isPending}
          testID="signin-apple"
        />
      </View>

      {socialNotice ? (
        <FormBanner
          tone="info"
          message={t('auth.social.unavailable')}
          onDismiss={() => setSocialNotice(false)}
          testID="signin-social-notice"
        />
      ) : null}
    </AuthScreen>
  );
}
