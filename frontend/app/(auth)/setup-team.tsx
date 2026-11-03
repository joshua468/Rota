import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { AuthScreen, FormBanner, PrimaryButton, TextField } from '@/components/auth';
import { errorMessage } from '@/components/ErrorState';
import { t } from '@/i18n';
import { detectTimeZone, inviteTokenFromInput } from '@/lib/timezone';
import { useAcceptInvite, useCreateTeam, usePatchSettings } from '@/api/queries';
import { useSessionStore } from '@/stores/session';
import { createStyles, useTheme } from '@/theme';

type Mode = 'create' | 'join' | null;

const useStyles = createStyles((t) => ({
  content: {
    gap: t.space[6],
  },
  options: {
    gap: t.space[6],
  },
  card: {
    borderWidth: t.size.hairline,
    borderColor: t.color.border,
    borderRadius: t.radius.container,
    backgroundColor: t.color.surface,
    overflow: 'hidden',
  },
  cardSelected: {
    borderWidth: t.size.ring,
    borderColor: t.color.primary,
    backgroundColor: t.color.surfaceMuted,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[4],
    padding: t.space[5],
    minHeight: t.size.touchMin,
  },
  cardIcon: {
    width: t.space[8],
    height: t.space[8],
    borderRadius: t.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.color.primaryContainer,
  },
  cardText: {
    flex: 1,
    gap: t.space[1],
  },
  cardTitle: {
    ...t.type.titleMedium,
    color: t.color.textPrimary,
  },
  cardBody: {
    ...t.type.bodySmall,
    color: t.color.textSecondary,
  },
  radio: {
    width: t.space[5],
    height: t.space[5],
    borderRadius: t.radius.full,
    borderWidth: t.size.ring,
    borderColor: t.color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    borderColor: t.color.primary,
  },
  radioDot: {
    width: t.space[2],
    height: t.space[2],
    borderRadius: t.radius.full,
    backgroundColor: t.color.primary,
  },
  cardFields: {
    gap: t.space[4],
    paddingHorizontal: t.space[5],
    paddingBottom: t.space[5],
  },
  tzRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[3],
    minHeight: t.size.touchMin,
    paddingHorizontal: t.space[4],
    borderRadius: t.radius.md,
    backgroundColor: t.color.surfaceSunken,
  },
  tzText: {
    flex: 1,
  },
  tzLabel: {
    ...t.type.labelSmall,
    color: t.color.textSecondary,
  },
  tzValue: {
    ...t.type.bodySmall,
    color: t.color.textPrimary,
  },
}));

export default function SetupTeamScreen() {
  const styles = useStyles();
  const theme = useTheme();
  const createTeam = useCreateTeam();
  const acceptInvite = useAcceptInvite();
  const patchSettings = usePatchSettings();
  const status = useSessionStore((s) => s.status);
  const team = useSessionStore((s) => s.team);
  const identityResolved = useSessionStore((s) => s.identityResolved);
  const [mode, setMode] = useState<Mode>(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [codeError, setCodeError] = useState<string | undefined>(undefined);
  const max = theme.textScale.maxFontSizeMultiplier;
  const pending = createTeam.isPending || acceptInvite.isPending;
  const failed = createTeam.isError ? createTeam.error : acceptInvite.isError ? acceptInvite.error : null;

  // Already part of a team (for example a sign-in that restored a membership):
  // the access level is known, so there is nothing left to ask.
  if (status === 'signedIn' && team) return <Redirect href="/(app)" />;
  // Creating or joining a team needs a session; an expired one starts over.
  if (status === 'signedOut') return <Redirect href="/(auth)/sign-in" />;
  // Wait for the server to confirm the identity: a restored session may still
  // turn out to belong to a team, and then this question is not needed.
  if (status === 'signedIn' && !identityResolved) return null;

  const submitCreate = () => {
    const nextError = name.trim().length >= 1 ? undefined : t('auth.setup.error.name');
    setNameError(nextError);
    if (nextError) return;
    createTeam.mutate(
      { name: name.trim() },
      {
        onSuccess: () => {
          patchSettings.mutate({ changes: { time_zone: detectTimeZone() } });
          router.replace('/(app)');
        },
      },
    );
  };

  const submitJoin = () => {
    const token = inviteTokenFromInput(code);
    const nextError = token.length >= 1 ? undefined : t('auth.setup.error.code');
    setCodeError(nextError);
    if (nextError) return;
    acceptInvite.mutate(token, {
      onSuccess: () => router.replace('/(app)'),
      onError: () => setCodeError(t('auth.setup.error.code')),
    });
  };

  const submit = () => {
    if (mode === 'create') submitCreate();
    else if (mode === 'join') submitJoin();
  };

  return (
    <AuthScreen title={t('auth.setup.title')} subtitle={t('auth.setup.subtitle')}>
      <View style={styles.content}>
        {failed ? (
          <FormBanner
            tone="error"
            message={errorMessage(failed)}
            onDismiss={() => {
              createTeam.reset();
              acceptInvite.reset();
            }}
            testID="setup-error"
          />
        ) : null}
        <View style={styles.options}>
          <Pressable
            onPress={() => setMode('create')}
            accessibilityRole="radio"
            accessibilityState={{ selected: mode === 'create' }}
            accessibilityLabel={`${t('auth.setup.create.title')}. ${t('auth.setup.create.body')}`}
            style={[styles.card, mode === 'create' && styles.cardSelected]}
            testID="setup-create"
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <Ionicons name="add-outline" size={theme.size.iconMd} color={theme.color.primary} />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle} maxFontSizeMultiplier={max}>
                  {t('auth.setup.create.title')}
                </Text>
                <Text style={styles.cardBody} maxFontSizeMultiplier={max}>
                  {t('auth.setup.create.body')}
                </Text>
              </View>
              <View style={[styles.radio, mode === 'create' && styles.radioOn]}>
                {mode === 'create' ? <View style={styles.radioDot} /> : null}
              </View>
            </View>
            {mode === 'create' ? (
              <View style={styles.cardFields}>
                <TextField
                  label={t('auth.setup.teamName')}
                  value={name}
                  onChangeText={setName}
                  error={nameError}
                  leadingIcon="people-outline"
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!createTeam.isPending}
                  returnKeyType="done"
                  testID="setup-name"
                />
                <View style={styles.tzRow}>
                  <Ionicons
                    name="globe-outline"
                    size={theme.size.iconMd}
                    color={theme.color.textSecondary}
                  />
                  <View style={styles.tzText}>
                    <Text style={styles.tzLabel} maxFontSizeMultiplier={max}>
                      {t('auth.setup.timezone')}
                    </Text>
                    <Text style={styles.tzValue} maxFontSizeMultiplier={max}>
                      {detectTimeZone()}
                    </Text>
                  </View>
                </View>
              </View>
            ) : null}
          </Pressable>
          <Pressable
            onPress={() => setMode('join')}
            accessibilityRole="radio"
            accessibilityState={{ selected: mode === 'join' }}
            accessibilityLabel={`${t('auth.setup.join.title')}. ${t('auth.setup.join.body')}`}
            style={[styles.card, mode === 'join' && styles.cardSelected]}
            testID="setup-join"
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <Ionicons
                  name="enter-outline"
                  size={theme.size.iconMd}
                  color={theme.color.primary}
                />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle} maxFontSizeMultiplier={max}>
                  {t('auth.setup.join.title')}
                </Text>
                <Text style={styles.cardBody} maxFontSizeMultiplier={max}>
                  {t('auth.setup.join.body')}
                </Text>
              </View>
              <View style={[styles.radio, mode === 'join' && styles.radioOn]}>
                {mode === 'join' ? <View style={styles.radioDot} /> : null}
              </View>
            </View>
            {mode === 'join' ? (
              <View style={styles.cardFields}>
                <TextField
                  label={t('auth.setup.code')}
                  value={code}
                  onChangeText={setCode}
                  error={codeError}
                  hint={t('auth.setup.codeHint')}
                  leadingIcon="link-outline"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!acceptInvite.isPending}
                  returnKeyType="go"
                  onSubmitEditing={submit}
                  testID="setup-code"
                />
              </View>
            ) : null}
          </Pressable>
        </View>
        <PrimaryButton
          label={
            createTeam.isPending
              ? t('auth.setup.creating')
              : acceptInvite.isPending
                ? t('auth.setup.joining')
                : t('auth.setup.cta')
          }
          onPress={submit}
          loading={pending}
          disabled={mode === null}
          testID="setup-submit"
        />
      </View>
    </AuthScreen>
  );
}
