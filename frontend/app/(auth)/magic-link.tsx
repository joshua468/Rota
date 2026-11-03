import { Email } from '@rota/contract';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useMagicConsume, useMagicStart } from '@/api/queries';
import { BackButton } from '@/components';
import { AuthScreen, FormBanner, PrimaryButton, TextField } from '@/components/auth';
import { errorMessage } from '@/components/ErrorState';
import { t } from '@/i18n';
import { Illustration } from '@/illustrations';
import { createStyles, useTheme } from '@/theme';

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
  tap: {
    minHeight: t.size.touchMin,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: t.space[2],
  },
}));

export default function MagicLinkScreen() {
  const styles = useStyles();
  const theme = useTheme();
  const start = useMagicStart();
  const consume = useMagicConsume();
  const params = useLocalSearchParams<{ token?: string }>();
  const deepLinkToken = typeof params.token === 'string' ? params.token : '';
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(deepLinkToken);
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [sent, setSent] = useState(false);

  const sendLink = () => {
    if (!Email.safeParse(email.trim()).success) {
      setEmailError(t('auth.error.email'));
      return;
    }
    setEmailError(undefined);
    start.mutate({ email: email.trim() }, { onSuccess: () => setSent(true) });
  };

  const signInWithCode = () => {
    consume.mutate({ token: code.trim() }, { onSuccess: () => router.replace('/(app)') });
  };

  return (
    <AuthScreen
      title={t('auth.magic.title')}
      subtitle={t('auth.magic.subtitle')}
      illustration={<Illustration variant="email" size="sm" />}
      headerLeft={<BackButton label={t('common.back')} onPress={() => router.back()} />}
      footer={
        <View style={styles.linkRow}>
          <Pressable
            onPress={() => router.replace('/(auth)/sign-in')}
            accessibilityRole="link"
            accessibilityLabel={t('common.back')}
            hitSlop={theme.size.touchMin}
            style={styles.tap}
          >
            <Text style={styles.link} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
              {t('common.back')}
            </Text>
          </Pressable>
        </View>
      }
    >
      {start.isError ? (
        <FormBanner
          tone="error"
          message={errorMessage(start.error)}
          onDismiss={() => start.reset()}
        />
      ) : null}
      {consume.isError ? (
        <FormBanner
          tone="error"
          message={errorMessage(consume.error)}
          onDismiss={() => consume.reset()}
        />
      ) : null}
      {sent ? <FormBanner tone="success" message={t('auth.magic.sent')} /> : null}
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
        editable={!start.isPending}
        testID="magic-email"
      />
      <PrimaryButton
        label={start.isPending ? t('common.pending') : t('auth.magic.send')}
        onPress={sendLink}
        loading={start.isPending}
      />
      {sent || deepLinkToken ? (
        <>
          <TextField
            label={t('auth.magic.code')}
            value={code}
            onChangeText={setCode}
            leadingIcon="key-outline"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!consume.isPending}
            returnKeyType="done"
            onSubmitEditing={signInWithCode}
            testID="magic-code"
          />
          <PrimaryButton
            label={consume.isPending ? t('auth.signingIn') : t('auth.magic.consume')}
            onPress={signInWithCode}
            loading={consume.isPending}
          />
        </>
      ) : null}
    </AuthScreen>
  );
}
