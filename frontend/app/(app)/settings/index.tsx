import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import {
  useLogout,
  useLogoutAll,
  useMe,
  useRemoveAvatar,
  useSettings,
  useUploadAvatar,
} from '@/api/queries';
import {
  Avatar,
  BackButton,
  Badge,
  Banner,
  BottomSheet,
  Button,
  Card,
  ListRow,
  ListSection,
  Screen,
  SectionLabel,
  Skeleton,
  Toast,
} from '@/components';
import { errorMessage } from '@/components/ErrorState';
import { t } from '@/i18n';
import { SEED } from '@/lib/demo';
import { useSeedDemoShifts } from '@/lib/devSeedShifts';
import { pickAvatar } from '@/lib/avatarUpload';
import { ROLE_KEYS, isAdmin } from '@/lib/rota';
import { resolveProfileZone } from '@/lib/timezone';
import { useSessionStore } from '@/stores/session';
import { createStyles, useTheme } from '@/theme';

const useStyles = createStyles((t) => ({
  stack: {
    gap: t.space[4],
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[4],
  },
  profileText: {
    flex: 1,
    gap: t.space[1],
  },
  name: {
    ...t.type.titleMedium,
    color: t.color.textPrimary,
  },
  email: {
    ...t.type.bodySmall,
    color: t.color.textMuted,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[2],
  },
  teamName: {
    ...t.type.bodySmall,
    color: t.color.textSecondary,
    flexShrink: 1,
  },
  divider: {
    height: t.size.hairline,
    backgroundColor: t.color.divider,
  },
  photoActions: {
    flexDirection: 'row',
    gap: t.space[2],
  },
  grow: {
    flex: 1,
  },
  icon: {
    width: t.space[6],
    alignItems: 'center',
  },
}));

export default function SettingsScreen() {
  const styles = useStyles();
  const theme = useTheme();
  const renderIcon = (name: keyof typeof Ionicons.glyphMap, color: string) => (
    <Ionicons name={name} size={theme.size.iconMd} color={color} />
  );
  const status = useSessionStore((state) => state.status);
  const user = useSessionStore((state) => state.user);
  const team = useSessionStore((state) => state.team);
  const me = useMe();
  const settings = useSettings();
  const logout = useLogout();
  const logoutAll = useLogoutAll();

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [logoutAllConfirmVisible, setLogoutAllConfirmVisible] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [toastTone, setToastTone] = useState<'success' | 'error'>('success');
  const devSeed = useSeedDemoShifts();
  const uploadAvatar = useUploadAvatar();
  const removeAvatar = useRemoveAvatar();
  const showDeveloper =
    !process.env.EXPO_PUBLIC_IS_PRODUCTION && (__DEV__ || SEED);

  if (status !== 'signedIn') {
    return <Redirect href="/(auth)/sign-in" />;
  }

  /** Auto-detected on first run; a profile still on the server's `UTC`
   *  default follows the device zone instead (see `resolveProfileZone`). */
  const timeZone = resolveProfileZone(settings.data?.values.time_zone ?? user?.timezone);
  const version = Constants.expoConfig?.version ?? '0.1.0';
  // Team-scoped billing reads are owner/admin only (server `billing.read`);
  // managers and members must not reach a screen that would only error.
  const canSeeBilling = isAdmin(team?.role);

  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(app)');
  };

  const avatarUrl = user?.avatarUrl ?? me.data?.user.avatarUrl ?? null;

  const onChangePhoto = () => {
    void (async () => {
      try {
        const picked = await pickAvatar();
        if (!picked) return;
        uploadAvatar.mutate(picked, {
          onSuccess: () => {
            setToastTone('success');
            setToast(t('settings.photo.updated'));
          },
          onError: (error) => {
            setToastTone('error');
            setToast(errorMessage(error));
          },
        });
      } catch (error) {
        setToastTone('error');
        setToast(error instanceof Error ? error.message : t('settings.photo.error'));
      }
    })();
  };

  const onRemovePhoto = () => {
    removeAvatar.mutate(undefined, {
      onSuccess: () => {
        setToastTone('success');
        setToast(t('settings.photo.removed'));
      },
      onError: (error) => {
        setToastTone('error');
        setToast(errorMessage(error));
      },
    });
  };

  return (
    <Screen
      title={t('settings.title')}
      headerLeft={<BackButton label={t('common.back')} onPress={back} testID="settings-back" />}
      scroll
    >
      <View style={styles.stack}>
        {logout.isError ? (
          <Banner tone="error" message={errorMessage(logout.error)} onDismiss={() => logout.reset()} />
        ) : null}

        <Card>
          {me.isLoading && !user ? (
            <Skeleton height={72} />
          ) : (
            <>
              <View style={styles.profile}>
                <Avatar
                  name={user?.name ?? t('settings.profile')}
                  photo={avatarUrl}
                  size="xl"
                />
                <View style={styles.profileText}>
                  <Text style={styles.name} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
                    {user?.name ?? t('settings.profile')}
                  </Text>
                  {user?.email ? (
                    <Text style={styles.email} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
                      {user.email}
                    </Text>
                  ) : null}
                  {team ? (
                    <View style={styles.badgeRow}>
                      <Text
                        style={styles.teamName}
                        numberOfLines={1}
                        maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
                        testID="settings-team-name"
                      >
                        {team.name}
                      </Text>
                      <Badge label={t(ROLE_KEYS[team.role])} tone="brand" />
                    </View>
                  ) : null}
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.photoActions}>
                <Button
                  label={t('settings.photo.change')}
                  variant="secondary"
                  containerStyle={styles.grow}
                  loading={uploadAvatar.isPending}
                  onPress={onChangePhoto}
                  testID="settings-change-photo"
                />
                {avatarUrl ? (
                  <Button
                    label={t('settings.photo.remove')}
                    variant="ghost"
                    containerStyle={styles.grow}
                    loading={removeAvatar.isPending}
                    onPress={onRemovePhoto}
                    testID="settings-remove-photo"
                  />
                ) : null}
              </View>
            </>
          )}
        </Card>

        <SectionLabel label={t('settings.section.account')} />
        <ListSection>
          <ListRow
            title={t('settings.notifications')}
            leading={<View style={styles.icon}>{renderIcon('notifications-outline', theme.color.primary)}</View>}
            onPress={() => router.push('/settings/notifications')}
            showChevron
            testID="settings-notifications"
          />
          <ListRow
            title={t('settings.appearance')}
            leading={<View style={styles.icon}>{renderIcon('color-palette-outline', theme.color.primary)}</View>}
            onPress={() => router.push('/settings/appearance')}
            showChevron
            testID="settings-appearance"
          />
          <ListRow
            title={t('settings.language')}
            leading={<View style={styles.icon}>{renderIcon('language-outline', theme.color.primary)}</View>}
            value={t('settings.language.en')}
            testID="settings-language"
          />
          <ListRow
            title={t('settings.timezone')}
            subtitle={t('settings.timezone.helper')}
            leading={<View style={styles.icon}>{renderIcon('globe-outline', theme.color.primary)}</View>}
            value={timeZone}
            testID="settings-timezone"
          />
        </ListSection>

        <SectionLabel label={t('settings.section.workspace')} />
        <ListSection>
          <ListRow
            title={t('settings.team')}
            leading={<View style={styles.icon}>{renderIcon('people-outline', theme.color.primary)}</View>}
            onPress={() => router.push('/settings/team')}
            showChevron
            testID="settings-team"
          />
          {canSeeBilling ? (
            <ListRow
              title={t('settings.billing')}
              leading={<View style={styles.icon}>{renderIcon('card-outline', theme.color.primary)}</View>}
              onPress={() => router.push('/settings/billing')}
              showChevron
              testID="settings-billing"
            />
          ) : null}
        </ListSection>

        <ListSection>
          <ListRow
            title={t('settings.signOut')}
            destructive
            centerTitle
            onPress={() => setConfirmVisible(true)}
            testID="settings-sign-out"
          />
          <ListRow
            title="Sign out of all devices"
            destructive
            centerTitle
            onPress={() => setLogoutAllConfirmVisible(true)}
            testID="settings-sign-out-all"
          />
        </ListSection>

        {showDeveloper ? (
          <>
            <SectionLabel label="Developer" />
            <ListSection>
              <ListRow
                title={devSeed.seeded ? 'Demo shifts added' : 'Seed demo shifts'}
                subtitle="Create today's demo cards"
                leading={<View style={styles.icon}>{renderIcon('flask-outline', theme.color.primary)}</View>}
                onPress={() => {
                  void devSeed
                    .seed()
                    .then((result) => {
                      setToast(
                        result === 'created'
                          ? 'Demo shifts added'
                          : result === 'already'
                            ? 'Demo shifts already added'
                            : 'Sign in to seed demo shifts',
                      );
                    })
                    .catch(() => setToast('Could not add demo shifts'));
                }}
                showChevron
                testID="settings-seed-shifts"
              />
            </ListSection>
          </>
        ) : null}

        <SectionLabel label={t('settings.section.support')} />
        <ListSection>
          <ListRow
            title={t('settings.version', { version })}
            leading={<View style={styles.icon}>{renderIcon('information-circle-outline', theme.color.textMuted)}</View>}
            testID="settings-version"
          />
        </ListSection>
      </View>

      <Toast message={toast} tone={toastTone} onDismiss={() => setToast(null)} testID="settings-toast" />

      <BottomSheet
        visible={confirmVisible}
        onClose={() => setConfirmVisible(false)}
        title={t('settings.signOutConfirm.title')}
        closeLabel={t('common.close')}
        testID="settings-sign-out-sheet"
      >
        <Text
          style={{ color: theme.color.textSecondary, ...theme.type.bodyLarge }}
          maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
        >
          {t('settings.signOutConfirm.body')}
        </Text>
        <View style={styles.stack}>
          <Button
            label={t('settings.signOutConfirm.ok')}
            variant="danger"
            loading={logout.isPending}
            onPress={() => {
              setConfirmVisible(false);
              logout.mutate();
            }}
            testID="settings-sign-out-confirm"
          />
          <Button
            label={t('common.cancel')}
            variant="ghost"
            onPress={() => setConfirmVisible(false)}
          />
        </View>
      </BottomSheet>

      <BottomSheet
        visible={logoutAllConfirmVisible}
        onClose={() => setLogoutAllConfirmVisible(false)}
        title="Sign out of all devices"
        closeLabel={t('common.close')}
        testID="settings-sign-out-all-sheet"
      >
        <Text
          style={{ color: theme.color.textSecondary, ...theme.type.bodyLarge }}
          maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
        >
          {"You'll be signed out of all devices. Continue?"}
        </Text>
        <View style={styles.stack}>
          <Button
            label="Sign out of all devices"
            variant="danger"
            loading={logoutAll.isPending}
            onPress={() => {
              setLogoutAllConfirmVisible(false);
              logoutAll.mutate();
            }}
            testID="settings-sign-out-all-confirm"
          />
          <Button
            label={t('common.cancel')}
            variant="ghost"
            onPress={() => setLogoutAllConfirmVisible(false)}
          />
        </View>
      </BottomSheet>
    </Screen>
  );
}
