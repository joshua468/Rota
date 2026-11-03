import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Platform, Pressable, Text, View } from 'react-native';
import {
  useCreateShift,
  useMembers,
  useShift,
  useUpdateShift,
} from '@/api/queries';
import {
  Avatar,
  BackButton,
  Badge,
  Banner,
  Button,
  Card,
  Screen,
  Skeleton,
  TextField,
} from '@/components';
import { errorMessage } from '@/components/ErrorState';
import { t, type TranslationKey } from '@/i18n';
import { fmtTime, formatLongDate } from '@/lib/format';
import { ROLE_KEYS, dayKey, isScheduler, localIsoFromDayAndTime } from '@/lib/rota';
import { usePressScale } from '@/lib/usePressScale';
import { useNetStore } from '@/stores/net';
import { useSessionStore } from '@/stores/session';
import { createStyles, useTheme } from '@/theme';

const useStyles = createStyles((t) => ({
  stack: {
    gap: t.space[4],
  },
  sectionHeader: {
    ...t.type.titleMedium,
    color: t.color.textPrimary,
    marginBottom: t.space[2],
  },
  memberList: {
    gap: t.space[1],
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[3],
    minHeight: t.size.touchMin,
    paddingHorizontal: t.space[3],
    paddingVertical: t.space[2],
    borderRadius: t.radius.lg,
  },
  memberRowSelected: {
    backgroundColor: t.color.primaryContainer,
  },
  memberName: {
    ...t.type.bodyLarge,
    color: t.color.textPrimary,
    flex: 1,
  },
  checkSlot: {
    width: t.size.iconLg,
    height: t.size.iconLg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    width: t.size.iconLg,
    height: t.size.iconLg,
    borderRadius: t.radius.full,
    backgroundColor: t.color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerError: {
    ...t.type.bodySmall,
    color: t.color.error,
  },
  fieldCard: {
    gap: t.space[2],
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: t.space[3],
    minHeight: t.size.touchMin,
  },
  fieldLabel: {
    ...t.type.bodyLarge,
    color: t.color.textPrimary,
    flex: 1,
  },
  fieldValue: {
    ...t.type.bodyLarge,
    color: t.color.textSecondary,
  },
  headerAction: {
    paddingHorizontal: t.space[4],
  },
}));

type FieldErrors = {
  userId?: string;
  time?: string;
  end?: string;
};

/** Day + wall-clock time the pickers edit, in device-local terms. */
function dateFromDayTime(day: string, time: string): Date {
  const [hour = 0, minute = 0] = time.split(':').map((part) => Number(part) || 0);
  const [year = 1970, month = 1, date = 1] = day.split('-').map((part) => Number(part) || 0);
  return new Date(year, month - 1, date, hour, minute);
}

function dayTimeFromDate(value: Date): { day: string; time: string } {
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    day: dayKey(value),
    time: `${pad(value.getHours())}:${pad(value.getMinutes())}`,
  };
}

export default function ShiftFormScreen() {
  const styles = useStyles();
  const theme = useTheme();
  const { scale, onPressIn, onPressOut } = usePressScale();
  const params = useLocalSearchParams<{ editId?: string }>();
  const editId = typeof params.editId === 'string' ? params.editId : undefined;
  const existing = useShift(editId);
  const members = useMembers();
  const team = useSessionStore((state) => state.team);
  const isOnline = useNetStore((state) => state.isOnline);
  const createShift = useCreateShift();
  const updateShift = useUpdateShift();

  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [day, setDay] = useState(() => dayKey(new Date()));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const status = useSessionStore((state) => state.status);
  useEffect(() => {
    const shift = existing.data;
    if (!shift) return;
    setUserId(shift.userId ?? undefined);
    setDay(dayKey(new Date(shift.startsAt)));
    const start = dayTimeFromDate(new Date(shift.startsAt));
    const end = dayTimeFromDate(new Date(shift.endsAt));
    setStartTime(start.time);
    setEndTime(end.time);
    setRole(shift.role ?? '');
    setLocation(shift.location ?? '');
    setNotes(shift.notes ?? '');
  }, [existing.data]);

  if (status !== 'signedIn') {
    return <Redirect href="/(auth)/sign-in" />;
  }

  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(app)');
  };

  const isEdit = !!editId;
  const titleKey: TranslationKey = isEdit ? 'shift.edit' : 'shift.create';
  const canSchedule = isScheduler(team?.role);

  const header = <BackButton label={t('common.back')} onPress={back} testID="shift-form-back" />;

  if (isEdit && existing.isLoading && !existing.data) {
    return (
      <Screen title={t(titleKey)} headerLeft={header}>
        <Skeleton height={240} />
      </Screen>
    );
  }

  if (isEdit && (existing.isError || !existing.data)) {
    return (
      <Screen title={t(titleKey)} headerLeft={header}>
        <Banner
          tone="error"
          message={existing.isError ? errorMessage(existing.error) : t('shift.notFound')}
          onDismiss={back}
        />
      </Screen>
    );
  }

  if (!canSchedule) {
    return (
      <Screen title={t(titleKey)} headerLeft={header}>
        <Banner tone="error" message={t('error.forbidden')} onDismiss={back} />
      </Screen>
    );
  }

  const mutation = isEdit ? updateShift : createShift;
  const mutationError = mutation.error;

  const submit = () => {
    const next: FieldErrors = {};
    if (!userId) next.userId = t('shift.error.member');
    setErrors(next);
    if (next.userId) return;

    const startsAt = localIsoFromDayAndTime(day, startTime);
    const endsAt = localIsoFromDayAndTime(day, endTime);
    if (!startsAt || !endsAt) {
      setErrors({ time: t('shift.error.time') });
      return;
    }
    if (new Date(endsAt).getTime() <= new Date(startsAt).getTime()) {
      setErrors({ end: t('shift.error.endsAfterStarts') });
      return;
    }

    if (isEdit && existing.data) {
      updateShift.mutate(
        {
          shiftId: existing.data.id,
          userId: userId !== existing.data.userId ? userId : undefined,
          startsAt,
          endsAt,
          role: role.trim() || null,
          location: location.trim() || null,
          notes: notes.trim() || null,
        },
        { onSuccess: back },
      );
      return;
    }

    createShift.mutate(
      {
        userId: userId ?? '',
        startsAt,
        endsAt,
        role: role.trim() || undefined,
        location: location.trim() || undefined,
        notes: notes.trim() || undefined,
      },
      { onSuccess: back },
    );
  };

  const onPickDate = (event: DateTimePickerEvent, value?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (event.type === 'dismissed' || !value) return;
    setDay(dayKey(value));
  };

  const onPickStart = (event: DateTimePickerEvent, value?: Date) => {
    if (Platform.OS === 'android') setShowStartPicker(false);
    if (event.type === 'dismissed' || !value) return;
    setStartTime(dayTimeFromDate(value).time);
  };

  const onPickEnd = (event: DateTimePickerEvent, value?: Date) => {
    if (Platform.OS === 'android') setShowEndPicker(false);
    if (event.type === 'dismissed' || !value) return;
    setEndTime(dayTimeFromDate(value).time);
  };

  const dateValue = dateFromDayTime(day, '12:00');
  const startValue = dateFromDayTime(day, startTime);
  const endValue = dateFromDayTime(day, endTime);

  return (
    <Screen
      title={t(titleKey)}
      headerLeft={header}
      headerRight={
        <Button
          label={t('common.save')}
          loading={mutation.isPending}
          disabled={!isOnline}
          onPress={submit}
          style={styles.headerAction}
          testID="shift-form-save"
        />
      }
      scroll
    >
      <View style={styles.stack}>
        {!isOnline ? <Banner tone="offline" message={t('offline.banner')} /> : null}
        {mutationError ? (
          <Banner tone="error" message={errorMessage(mutationError)} onDismiss={() => mutation.reset()} />
        ) : null}

        <Card>
          <Text
            style={styles.sectionHeader}
            maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
            accessibilityRole="header"
          >
            {t('shift.assignedTo')}
          </Text>
          <View style={styles.memberList}>
            {(members.data ?? []).map((member) => {
              const selected = userId === member.id;
              return (
                <Pressable
                  key={member.id}
                  onPress={() => setUserId(member.id)}
                  onPressIn={onPressIn}
                  onPressOut={onPressOut}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  aria-checked={selected}
                  accessibilityLabel={member.name}
                  testID={`shift-member-${member.id}`}
                >
                  <Animated.View
                    style={[
                      styles.memberRow,
                      selected && styles.memberRowSelected,
                      { transform: [{ scale }] },
                    ]}
                  >
                    <Avatar name={member.name} size="sm" />
                    <Text
                      style={styles.memberName}
                      maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
                    >
                      {member.name}
                    </Text>
                    <Badge label={t(ROLE_KEYS[member.role])} tone="neutral" />
                    <View style={styles.checkSlot}>
                      {selected ? (
                        <View style={styles.check}>
                          <Ionicons
                            name="checkmark"
                            size={theme.size.iconSm}
                            color={theme.color.onPrimary}
                          />
                        </View>
                      ) : null}
                    </View>
                  </Animated.View>
                </Pressable>
              );
            })}
          </View>
          {errors.userId ? (
            <Text style={styles.pickerError} accessibilityLiveRegion="polite">
              {errors.userId}
            </Text>
          ) : null}
        </Card>

        <Card style={styles.fieldCard}>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            accessibilityRole="button"
            accessibilityLabel={t('shift.date')}
            testID="shift-form-day"
            style={styles.fieldRow}
          >
            <Text style={styles.fieldLabel} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
              {t('shift.date')}
            </Text>
            <Text style={styles.fieldValue} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
              {formatLongDate(dateValue)}
            </Text>
          </Pressable>
          {showDatePicker ? (
            <DateTimePicker
              value={dateValue}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={onPickDate}
            />
          ) : null}
          {Platform.OS === 'ios' && showDatePicker ? (
            <Button label={t('common.done')} variant="ghost" onPress={() => setShowDatePicker(false)} />
          ) : null}
          {errors.time ? (
            <Text style={styles.pickerError} accessibilityLiveRegion="polite">
              {errors.time}
            </Text>
          ) : null}
        </Card>

        <Card style={styles.fieldCard}>
          <Pressable
            onPress={() => setShowStartPicker(true)}
            accessibilityRole="button"
            accessibilityLabel={t('shift.startTime')}
            testID="shift-form-start"
            style={styles.fieldRow}
          >
            <Text style={styles.fieldLabel} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
              {t('shift.startTime')}
            </Text>
            <Text style={styles.fieldValue} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
              {fmtTime(startValue)}
            </Text>
          </Pressable>
          {showStartPicker ? (
            <DateTimePicker
              value={startValue}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              is24Hour={false}
              onChange={onPickStart}
            />
          ) : null}
          {Platform.OS === 'ios' && showStartPicker ? (
            <Button label={t('common.done')} variant="ghost" onPress={() => setShowStartPicker(false)} />
          ) : null}
          <Pressable
            onPress={() => setShowEndPicker(true)}
            accessibilityRole="button"
            accessibilityLabel={t('shift.endTime')}
            testID="shift-form-end"
            style={styles.fieldRow}
          >
            <Text style={styles.fieldLabel} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
              {t('shift.endTime')}
            </Text>
            <Text style={styles.fieldValue} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
              {fmtTime(endValue)}
            </Text>
          </Pressable>
          {showEndPicker ? (
            <DateTimePicker
              value={endValue}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              is24Hour={false}
              onChange={onPickEnd}
            />
          ) : null}
          {Platform.OS === 'ios' && showEndPicker ? (
            <Button label={t('common.done')} variant="ghost" onPress={() => setShowEndPicker(false)} />
          ) : null}
          {errors.end ? (
            <Text style={styles.pickerError} accessibilityLiveRegion="polite">
              {errors.end}
            </Text>
          ) : null}
        </Card>

        <Card style={styles.fieldCard}>
          <Text
            style={styles.sectionHeader}
            maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
            accessibilityRole="header"
          >
            {t('shift.sectionDetails')}
          </Text>
          <TextField
            label={t('shift.role')}
            value={role}
            onChangeText={setRole}
            maxLength={60}
            editable={!mutation.isPending}
            testID="shift-form-role"
          />
          <TextField
            label={t('shift.location')}
            value={location}
            onChangeText={setLocation}
            maxLength={60}
            editable={!mutation.isPending}
            testID="shift-form-location"
          />
          <TextField
            label={t('shift.notes')}
            value={notes}
            onChangeText={setNotes}
            maxLength={280}
            multiline
            editable={!mutation.isPending}
            testID="shift-form-notes"
          />
        </Card>
      </View>
    </Screen>
  );
}
