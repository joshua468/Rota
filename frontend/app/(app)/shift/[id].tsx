import { Ionicons } from '@expo/vector-icons';
import type { PublicUser, Shift } from '@rota/contract';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { useCreateSwap, useDeleteShift, useMembers, useSettings, useShift } from '@/api/queries';
import {
  Avatar,
  BackButton,
  Banner,
  BottomSheet,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Screen,
  Skeleton,
  TextField,
  Toast,
} from '@/components';
import { errorMessage } from '@/components/ErrorState';
import { t } from '@/i18n';
import { formatDate, formatTimeRange } from '@/lib/format';
import { resolveProfileZone } from '@/lib/timezone';
import { isScheduler } from '@/lib/rota';
import { useNetStore } from '@/stores/net';
import { useSessionStore } from '@/stores/session';
import { createStyles, useTheme } from '@/theme';

const useStyles = createStyles((t) => ({
  stack: {
    gap: t.space[5],
  },
  section: {
    gap: t.space[2],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[2],
  },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: t.space[3],
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[3],
  },
  heroText: {
    flex: 1,
    gap: t.space[1],
  },
  heroName: {
    ...t.type.titleMedium,
    color: t.color.textPrimary,
  },
  heroMeta: {
    ...t.type.bodySmall,
    color: t.color.textSecondary,
  },
  divider: {
    height: t.size.hairline,
    backgroundColor: t.color.divider,
  },
  whenDate: {
    ...t.type.bodyLarge,
    color: t.color.textPrimary,
  },
  whenTime: {
    ...t.type.titleMedium,
    color: t.color.textPrimary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: t.space[2],
  },
  grow: {
    flex: 1,
  },
  fieldLabel: {
    ...t.type.bodySmall,
    color: t.color.textSecondary,
  },
  fieldValue: {
    ...t.type.bodyLarge,
    color: t.color.textPrimary,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[2],
    minHeight: t.size.touchMin,
    paddingHorizontal: t.space[2],
    borderRadius: t.radius.md,
  },
  pickerButton: {
    flex: 1,
  },
  pickerButtonInner: {
    justifyContent: 'flex-start',
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  pickerSelected: {
    backgroundColor: t.color.primaryContainer,
  },
  sheetBody: {
    ...t.type.bodyLarge,
    color: t.color.textSecondary,
  },
  sheetActions: {
    gap: t.space[2],
  },
}));

function DetailField({ label, value }: { label: string; value: string }) {
  const styles = useStyles();
  const theme = useTheme();
  return (
    <View>
      <Text style={styles.fieldLabel} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
        {label}
      </Text>
      <Text style={styles.fieldValue} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
        {value}
      </Text>
    </View>
  );
}

function MemberOption({
  member,
  selected,
  onSelect,
}: {
  member: Pick<PublicUser, 'id' | 'name'>;
  selected: boolean;
  onSelect: () => void;
}) {
  const styles = useStyles();
  const theme = useTheme();
  return (
    <View
      style={[styles.pickerOption, selected && styles.pickerSelected]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <Button
        label={member.name}
        variant="ghost"
        onPress={onSelect}
        containerStyle={styles.pickerButton}
        style={styles.pickerButtonInner}
      />
      {selected ? (
        <Ionicons name="checkmark-circle" size={theme.size.iconMd} color={theme.color.onPrimaryContainer} />
      ) : null}
    </View>
  );
}

export default function ShiftDetailScreen() {
  const styles = useStyles();
  const theme = useTheme();
  const params = useLocalSearchParams<{ id: string; swap?: string }>();
  const shiftId = typeof params.id === 'string' ? params.id : undefined;
  const query = useShift(shiftId);
  const settings = useSettings();
  const timeZone = resolveProfileZone(settings.data?.values.time_zone);
  const meId = useSessionStore((state) => state.user?.id);
  const team = useSessionStore((state) => state.team);
  const isOnline = useNetStore((state) => state.isOnline);
  const members = useMembers();
  const deleteShift = useDeleteShift();
  const createSwap = useCreateSwap();

  const [swapOpen, setSwapOpen] = useState(params.swap === '1');
  const [targetId, setTargetId] = useState<string | undefined>(undefined);
  const [note, setNote] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const status = useSessionStore((state) => state.status);
  if (status !== 'signedIn') {
    return <Redirect href="/(auth)/sign-in" />;
  }

  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(app)');
  };

  const header = <BackButton label={t('common.back')} onPress={back} testID="shift-back" />;

  if (query.isLoading && !query.data) {
    return (
      <Screen title={t('shift.title')} headerLeft={header}>
        <View style={styles.stack}>
          <Skeleton height={120} />
          <Skeleton height={80} />
        </View>
      </Screen>
    );
  }

  if (query.isError && !query.data) {
    return (
      <Screen title={t('shift.title')} headerLeft={header}>
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      </Screen>
    );
  }

  const shift: Shift | undefined = query.data;
  if (!shift) {
    return (
      <Screen title={t('shift.title')} headerLeft={header}>
        <EmptyState title={t('shift.notFound')} />
      </Screen>
    );
  }

  const mine = shift.userId === meId;
  const canSchedule = isScheduler(team?.role);
  const shiftMeta = [shift.role, shift.location].filter(Boolean).join(' · ');

  const swapTargets = (members.data ?? []).filter((member) => member.id !== meId);

  return (
    <Screen
      title={t('shift.title')}
      subtitle={formatDate(shift.startsAt, timeZone)}
      headerLeft={header}
      scroll
    >
      <View style={styles.stack}>
        {!isOnline ? <Banner tone="offline" message={t('offline.swapBlocked')} /> : null}
        {deleteShift.isError ? (
          <Banner tone="error" message={errorMessage(deleteShift.error)} onDismiss={() => deleteShift.reset()} />
        ) : null}
        {createSwap.isError ? (
          <Banner tone="error" message={errorMessage(createSwap.error)} onDismiss={() => createSwap.reset()} />
        ) : null}

        <Card>
          <View style={styles.hero}>
            {shift.user ? (
              <>
                <Avatar name={shift.user.name} photo={shift.user.avatarUrl} size="lg" />
                <View style={styles.heroText}>
                  <Text
                    style={styles.heroName}
                    numberOfLines={1}
                    maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
                  >
                    {shift.user.name}
                  </Text>
                  {shiftMeta ? (
                    <Text
                      style={styles.heroMeta}
                      numberOfLines={1}
                      maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
                    >
                      {shiftMeta}
                    </Text>
                  ) : null}
                </View>
              </>
            ) : (
              <Text style={styles.heroName} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
                {t('shift.open')}
              </Text>
            )}
          </View>

          <View style={styles.divider} />

          <View>
            <Text style={styles.whenDate} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
              {formatDate(shift.startsAt, timeZone)}
            </Text>
            <Text style={styles.whenTime} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
              {formatTimeRange(shift.startsAt, shift.endsAt, timeZone)}
            </Text>
          </View>
        </Card>

        {shift.meetingUrl || shift.notes ? (
          <Card>
            {shift.meetingUrl ? (
              <DetailField label={t('shift.meetingLink')} value={shift.meetingUrl} />
            ) : null}
            {shift.notes ? (
              <DetailField label={t('shift.sectionNotes')} value={shift.notes} />
            ) : null}
          </Card>
        ) : null}

        {mine ? (
          <Card>
            <View style={styles.between}>
              <View style={styles.row}>
                {shift.user ? <Avatar name={shift.user.name} photo={shift.user.avatarUrl} size="sm" /> : null}
                <Text style={styles.fieldValue} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
                  {t('shift.assignedTo')}
                </Text>
              </View>
              <Button
                label={t('shift.swapCta')}
                variant="ghost"
                disabled={!isOnline}
                onPress={() => setSwapOpen(true)}
                testID="shift-request-swap"
              />
            </View>
          </Card>
        ) : null}

        {canSchedule ? (
          <Card>
            <View style={styles.buttonRow}>
              <Button
                label={t('shift.edit')}
                variant="secondary"
                containerStyle={styles.grow}
                onPress={() => router.push({ pathname: '/shift/new', params: { editId: shift.id } })}
                testID="shift-edit"
              />
              <Button
                label={t('shift.delete')}
                variant="ghost"
                containerStyle={styles.grow}
                loading={deleteShift.isPending}
                onPress={() => setDeleteOpen(true)}
                testID="shift-delete"
              />
            </View>
          </Card>
        ) : null}
      </View>

      <Toast message={toast} tone="success" onDismiss={() => setToast(null)} />

      <BottomSheet
        visible={swapOpen}
        onClose={() => setSwapOpen(false)}
        title={t('shift.sectionSwap')}
        closeLabel={t('common.close')}
        testID="shift-swap-sheet"
      >
        <View style={styles.sheetActions}>
          <Text style={styles.fieldLabel} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
            {t('shift.swapWith')}
          </Text>
          <MemberOption
            member={{ id: '', name: t('shift.swapAnyone') }}
            selected={targetId === undefined}
            onSelect={() => setTargetId(undefined)}
          />
          {swapTargets.map((member) => (
            <MemberOption
              key={member.id}
              member={member}
              selected={targetId === member.id}
              onSelect={() => setTargetId(member.id)}
            />
          ))}
          <TextField
            label={t('shift.swapNote')}
            value={note}
            onChangeText={setNote}
            maxLength={280}
            multiline
            editable={isOnline && !createSwap.isPending}
          />
          <Button
            label={t('shift.swapSubmit')}
            loading={createSwap.isPending}
            disabled={!isOnline}
            onPress={() =>
              createSwap.mutate(
                { shiftId: shift.id, toUserId: targetId, note: note.trim() || undefined },
                {
                  onSuccess: () => {
                    setToast(t('shift.swapCreated'));
                    setSwapOpen(false);
                    setTargetId(undefined);
                    setNote('');
                  },
                },
              )
            }
            testID="shift-swap-submit"
          />
        </View>
      </BottomSheet>

      <BottomSheet
        visible={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title={t('shift.deleteConfirm.title')}
        closeLabel={t('common.close')}
        testID="shift-delete-sheet"
      >
        <Text style={styles.sheetBody} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
          {t('shift.deleteConfirm.body')}
        </Text>
        <View style={styles.sheetActions}>
          <Button
            label={t('shift.deleteConfirm.ok')}
            variant="danger"
            loading={deleteShift.isPending}
            onPress={() => {
              setDeleteOpen(false);
              deleteShift.mutate(shift.id, {
                onSuccess: () => {
                  setToast(t('shift.deleted'));
                  router.back();
                },
              });
            }}
            testID="shift-delete-confirm"
          />
          <Button label={t('common.cancel')} variant="ghost" onPress={() => setDeleteOpen(false)} />
        </View>
      </BottomSheet>
    </Screen>
  );
}
