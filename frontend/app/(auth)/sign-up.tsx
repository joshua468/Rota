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
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from '@/lib/auth/validators';
import { useSignup } from '@/api/queries';
import { useSessionStore } from '@/stores/session';
import { authTokens } from '@/theme/tokens';
import { useTheme } from '@/theme';

const styles = StyleSheet.create({
  termsWrapper: {
    marginTop: -authTokens.space.xxs,
    marginBottom: authTokens.space.xl,
  },
  termsText: {
    ...authTokens.type.body,
    color: authTokens.color.textSecondary,
    flexShrink: 1,
  },
  termsLink: {
    ...authTokens.type.bodySemibold,
    color: authTokens.color.brand,
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

export default function SignUpScreen() {
  const theme = useTheme();
  const status = useSessionStore((s) => s.status);
  const team = useSessionStore((s) => s.team);
  const identityResolved = useSessionStore((s) => s.identityResolved);
  const signup = useSignup();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | undefined>(undefined);
  const [socialNotice, setSocialNotice] = useState(false);
  const max = theme.textScale.maxFontSizeMultiplier;

  // A new account has no team yet, so it has no access level either. The team
  // step is what tells the app (and the server) what this user may do. Wait for
  // the server to confirm the identity first: a restored session has no team
  // until `/v1/me` answers.
  if (status === 'signedIn') {
    if (!identityResolved) return null;
    return <Redirect href={sessionDestination(team)} />;
  }

  const submit = () => {
    const nextNameError = validateName(name);
    const nextEmailError = validateEmail(email);
    const nextPasswordError = validatePassword(password);
    const nextConfirmPasswordError = validateConfirmPassword(password, confirmPassword);
    setNameError(nextNameError);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setConfirmPasswordError(nextConfirmPasswordError);
    if (nextNameError || nextEmailError || nextPasswordError || nextConfirmPasswordError || !agreed) {
      return;
    }
    signup.mutate({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
  };

  return (
    <AuthScreen
      title={t('auth.signUpTitle')}
      subtitle={t('auth.signUpSubtitle')}
      backTestID="signup-back"
      onBack={() => router.back()}
      footer={
        <View style={styles.footerRow}>
          <Text style={styles.footerText} maxFontSizeMultiplier={max}>
            {t('auth.haveAccount')}{' '}
          </Text>
          <Pressable
            onPress={() => go('/(auth)/sign-in')}
            accessibilityRole="link"
            accessibilityLabel={t('auth.signIn')}
            hitSlop={authTokens.space.backTop}
            style={styles.linkTap}
          >
            <Text style={styles.link} maxFontSizeMultiplier={max}>
              {t('auth.signIn')}
            </Text>
          </Pressable>
        </View>
      }
    >
      {signup.isError ? (
        <FormBanner
          tone="error"
          message={errorMessage(signup.error)}
          onDismiss={() => signup.reset()}
          testID="signup-error"
        />
      ) : null}

      <TextField
        label={t('auth.name')}
        value={name}
        onChangeText={setName}
        error={nameError}
        leadingIcon="person-outline"
        autoComplete="name"
        textContentType="name"
        editable={!signup.isPending}
        testID="signup-name"
      />

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
        editable={!signup.isPending}
        testID="signup-email"
      />

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
        editable={!signup.isPending}
        testID="signup-password"
      />

      <PasswordField
        label={t('auth.confirmPassword')}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        error={confirmPasswordError}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        textContentType="newPassword"
        editable={!signup.isPending}
        testID="signup-confirm-password"
      />

      <View style={styles.termsWrapper}>
        <AuthCheckbox
          checked={agreed}
          onToggle={() => setAgreed((prev) => !prev)}
          label={
            <Text style={styles.termsText} maxFontSizeMultiplier={max}>
              {t('auth.terms.prefix')}
              <Text style={styles.termsLink}>{t('auth.terms.terms')}</Text>
              {t('auth.terms.and')}
              <Text style={styles.termsLink}>{t('auth.terms.privacy')}</Text>
            </Text>
          }
          accessibilityLabel={t('auth.terms.label')}
          testID="signup-terms"
        />
      </View>

      <PrimaryButton
        label={signup.isPending ? t('auth.signingUp') : t('auth.signUp')}
        onPress={submit}
        loading={signup.isPending}
        disabled={!agreed}
        testID="signup-submit"
      />

      <DividerWithText text={t('auth.orSignUpWith')} />

      <View style={styles.socialRow}>
        <SocialButton
          provider="google"
          label={t('auth.social.googleLabel')}
          onPress={() => setSocialNotice(true)}
          disabled={signup.isPending}
          testID="signup-google"
          style={styles.socialFirst}
        />
        <SocialButton
          provider="apple"
          label={t('auth.social.appleLabel')}
          onPress={() => setSocialNotice(true)}
          disabled={signup.isPending}
          testID="signup-apple"
        />
      </View>

      {socialNotice ? (
        <FormBanner
          tone="info"
          message={t('auth.social.unavailable')}
          onDismiss={() => setSocialNotice(false)}
          testID="signup-social-notice"
        />
      ) : null}
    </AuthScreen>
  );
}
