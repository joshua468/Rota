import type { Role } from '@rota/contract';
import { Redirect, router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  useCreateInvite,
  useMembers,
  usePlans,
  useRemoveMember,
  useSubscription,
} from '@/api/queries';
import {
  Avatar,
  Badge,
  Banner,
  BackButton,
  BottomSheet,
  Button,
  Card,
  EmptyState,
  ErrorState,
  ListRow,
  ListSection,
  Screen,
  Skeleton,
  TextField,
  Toast,
} from '@/components';
import { errorMessage } from '@/components/ErrorState';
import { t } from '@/i18n';
import { ROLE_KEYS, isAdmin } from '@/lib/rota';
import { useNetStore } from '@/stores/net';
import { useSessionStore } from '@/stores/session';
import { createStyles, useTheme } from '@/theme';

const ROLE_ORDER: Role[] = ['owner', 'admin', 'manager', 'member'];

const useStyles = createStyles((t) => ({
  stack: {
    gap: t.space[4],
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[1],
    flexShrink: 1,
  },
  label: {
    ...t.type.bodySmall,
    color: t.color.textSecondary,
  },
  seats: {
    ...t.type.titleSmall,
    color: t.color.textPrimary,
  },
  teamName: {
    ...t.type.titleMedium,
    color: t.color.textPrimary,
  },
  sheetBody: {
    ...t.type.bodyLarge,
    color: t.color.textSecondary,
  },
  sheetActions: {
    gap: t.space[2],
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: t.space[2],
  },
  chip: {
    paddingHorizontal: t.space[3],
    paddingVertical: t.space[2],
    borderRadius: t.radius.full,
    borderWidth: t.size.ring,
    borderColor: t.color.border,
    backgroundColor: t.color.surface,
  },
  chipActive: {
    borderColor: t.color.primary,
    backgroundColor: t.color.primaryContainer,
  },
  chipLabel: {
    ...t.type.labelMedium,
    color: t.color.textSecondary,
  },
  chipLabelActive: {
    ...t.type.labelMedium,
    color: t.color.onPrimaryContainer,
  },
}));

export default function TeamSettingsScreen() {
  const styles = useStyles();
  const theme = useTheme();
  const status = useSessionStore((state) => state.status);
  const team = useSessionStore((state) => state.team);
  const isOnline = useNetStore((state) => state.isOnline);
  const members = useMembers();
  const subscription = useSubscription();
  const plans = usePlans();
  const removeMember = useRemoveMember();
  const createInvite = useCreateInvite();

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteError, setInviteError] = useState<string | undefined>(undefined);
  const [toast, setToast] = useState<string | null>(null);
  const [removeTarget, setRemoveTarget] = useState<{ id: string; name: string } | null>(null);
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');

  const list = members.data ?? [];
  const rolesPresent = useMemo(
    () => ROLE_ORDER.filter((role) => list.some((member) => member.role === role)),
    [list],
  );

  useFocusEffect(
    useCallback(() => {
      void members.refetch();
    }, [members.refetch]),
  );

  if (status !== 'signedIn') {
    return <Redirect href="/(auth)/sign-in" />;
  }

  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/settings');
  };

  const canManage = isAdmin(team?.role);
  const visible =
    roleFilter === 'all' ? list : list.filter((member) => member.role === roleFilter);
  const sub = subscription.data;
  const plan = plans.data?.find((item) => item.key === sub?.planKey);
  const seatMax = sub?.seats ?? plan?.maxSeats;

  const invite = () => {
    const email = inviteEmail.trim();
    if (!email || !email.includes('@')) {
      setInviteError(t('error.validation'));
      return;
    }
    setInviteError(undefined);
    createInvite.mutate(
      { email, role: 'member' },
      {
        onSuccess: () => {
          setToast(t('team.invite.sent'));
          setInviteEmail('');
        },
      },
    );
  };

  const header = (
    <BackButton
      label={t('common.back')}
      onPress={back}
      testID="team-back"
    />
  );

  if (members.isLoading && !members.data) {
    return (
      <Screen title={t('team.title')} headerLeft={header}>
        <View style={styles.stack}>
          <Skeleton height={72} />
          <Skeleton height={72} />
          <Skeleton height={72} />
        </View>
      </Screen>
    );
  }

  if (members.isError && !members.data) {
    return (
      <Screen title={t('team.title')} headerLeft={header}>
        <ErrorState error={members.error} onRetry={() => void members.refetch()} />
      </Screen>
    );
  }

  return (
    <Screen title={t('team.title')} headerLeft={header} scroll>
      <View style={styles.stack}>
        {!isOnline ? <Banner tone="offline" message={t('offline.banner')} /> : null}
        {removeMember.isError ? (
          <Banner tone="error" message={errorMessage(removeMember.error)} onDismiss={() => removeMember.reset()} />
        ) : null}
        {createInvite.isError ? (
          <Banner tone="error" message={errorMessage(createInvite.error)} onDismiss={() => createInvite.reset()} />
        ) : null}

        <Card>
          <Text style={styles.label} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
            {t('settings.team')}
          </Text>
          {team?.name ? (
            <Text style={styles.teamName} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier} testID="team-name">
              {team.name}
            </Text>
          ) : null}
          <Text style={styles.seats} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier} testID="team-seats">
            {t('team.seats', { used: list.length, max: seatMax ?? list.length })}
          </Text>
          {plan ? (
            <Text style={styles.label} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
              {t('team.seatLimit', { max: plan.maxSeats })}
            </Text>
          ) : null}
        </Card>

        <View style={styles.stack}>
          <Text style={styles.label} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier} accessibilityRole="header">
            {t('team.members')}
          </Text>
          {rolesPresent.length > 1 ? (
            <View style={styles.filters} accessibilityRole="tablist">
              <Pressable
                onPress={() => setRoleFilter('all')}
                accessibilityRole="tab"
                accessibilityState={{ selected: roleFilter === 'all' }}
                accessibilityLabel={t('team.filter.all')}
                style={[styles.chip, roleFilter === 'all' ? styles.chipActive : null]}
                testID="team-filter-all"
              >
                <Text style={roleFilter === 'all' ? styles.chipLabelActive : styles.chipLabel}>
                  {t('team.filter.all')}
                </Text>
              </Pressable>
              {rolesPresent.map((role) => (
                <Pressable
                  key={role}
                  onPress={() => setRoleFilter(role)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: roleFilter === role }}
                  accessibilityLabel={t(ROLE_KEYS[role])}
                  style={[styles.chip, roleFilter === role ? styles.chipActive : null]}
                  testID={`team-filter-${role}`}
                >
                  <Text style={roleFilter === role ? styles.chipLabelActive : styles.chipLabel}>
                    {t(ROLE_KEYS[role])}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}
          {visible.length === 0 ? (
          <EmptyState title={t('team.empty')} />
        ) : (
          visible.map((member) => (
            <ListSection key={member.id}>
              <ListRow
                leading={<Avatar name={member.name} photo={member.avatarUrl} size="sm" />}
                title={member.name}
                subtitle={member.emailMasked}
                trailing={
                  <View style={styles.trailing}>
                    {!member.active ? (
                      <Badge label={t('team.inactive')} tone="warning" />
                    ) : null}
                    <Badge
                      label={t(ROLE_KEYS[member.role])}
                      tone={member.role === 'owner' ? 'brand' : 'neutral'}
                    />
                  </View>
                }
              />
              {canManage && member.role !== 'owner' ? (
                <ListRow
                  title={t('team.remove')}
                  destructive
                  onPress={isOnline ? () => setRemoveTarget({ id: member.id, name: member.name }) : undefined}
                  testID={`team-remove-${member.id}`}
                />
              ) : null}
            </ListSection>
          ))
        )}
        </View>

        {canManage ? (
          <Card>
            <Text style={styles.label} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier} accessibilityRole="header">
              {t('team.invite')}
            </Text>
            <TextField
              label={t('settings.profile.email')}
              value={inviteEmail}
              onChangeText={setInviteEmail}
              error={inviteError}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={isOnline && !createInvite.isPending}
              testID="team-invite-email"
            />
            <Button
              label={t('team.invite.send')}
              loading={createInvite.isPending}
              disabled={!isOnline}
              onPress={invite}
              testID="team-invite-send"
            />
          </Card>
        ) : null}
      </View>
      <Toast message={toast} tone="success" onDismiss={() => setToast(null)} />
      <BottomSheet
        visible={removeTarget !== null}
        onClose={() => setRemoveTarget(null)}
        title={removeTarget ? t('team.removeConfirm.title', { name: removeTarget.name }) : ''}
        closeLabel={t('common.close')}
        testID="team-remove-sheet"
      >
        {removeTarget ? (
          <>
            <Text
              style={styles.sheetBody}
              maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
            >
              {t('team.removeConfirm.body')}
            </Text>
            <View style={styles.sheetActions}>
              <Button
                label={t('team.removeConfirm.ok')}
                variant="danger"
                loading={removeMember.isPending}
                onPress={() => {
                  const target = removeTarget;
                  setRemoveTarget(null);
                  removeMember.mutate(target.id, {
                    onSuccess: () => setToast(t('team.removed')),
                  });
                }}
                testID="team-remove-confirm"
              />
              <Button
                label={t('common.cancel')}
                variant="ghost"
                onPress={() => setRemoveTarget(null)}
              />
            </View>
          </>
        ) : null}
      </BottomSheet>
    </Screen>
  );
}
