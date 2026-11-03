import { Redirect, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';
import { usePatchSettings, useSettings } from '@/api/queries';
import { Banner, BackButton, Button, Card, Screen, Skeleton, TextField, Toast } from '@/components';
import { errorMessage } from '@/components/ErrorState';
import { t, type TranslationKey } from '@/i18n';
import { isTimeHHMM } from '@/lib/rota';
import { useNetStore } from '@/stores/net';
import { useSessionStore } from '@/stores/session';
import { createStyles, useTheme } from '@/theme';
import type { Settings } from '@rota/contract';

const useStyles = createStyles((t) => ({
  stack: {
    gap: t.space[4],
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: t.space[3],
    minHeight: t.size.touchMin,
  },
  toggleLabel: {
    ...t.type.bodyLarge,
    color: t.color.textPrimary,
    flex: 1,
  },
  hint: {
    ...t.type.bodySmall,
    color: t.color.textSecondary,
  },
  quietRow: {
    flexDirection: 'row',
    gap: t.space[3],
  },
  quietField: {
    flex: 1,
  },
  periodRow: {
    flexDirection: 'row',
    gap: t.space[1],
    marginTop: t.space[1],
  },
  period: {
    flex: 1,
    minHeight: t.size.touchMin,
    borderRadius: t.radius.md,
    borderWidth: t.size.hairline,
    borderColor: t.color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodActive: {
    backgroundColor: t.color.primaryContainer,
    borderColor: t.color.primary,
  },
  periodLabel: {
    ...t.type.labelMedium,
    color: t.color.textSecondary,
  },
  periodLabelActive: {
    color: t.color.onPrimaryContainer,
  },
  actions: {
    flexDirection: 'row',
    gap: t.space[2],
  },
}));

type ToggleKey = 'notif_shifts' | 'notif_swaps' | 'notif_billing';

const TOGGLES: { key: ToggleKey; labelKey: TranslationKey }[] = [
  { key: 'notif_shifts', labelKey: 'settings.notif.shifts' },
  { key: 'notif_swaps', labelKey: 'settings.notif.swaps' },
  { key: 'notif_billing', labelKey: 'settings.notif.billing' },
];

function periodOf(hhmm: string): 'AM' | 'PM' {
  const hour = Number.parseInt(hhmm.slice(0, 2), 10);
  return hour >= 12 && hour < 24 ? 'PM' : 'AM';
}

function withPeriod(hhmm: string, period: 'AM' | 'PM'): string {
  if (!isTimeHHMM(hhmm)) return hhmm;
  let hour = Number.parseInt(hhmm.slice(0, 2), 10);
  const rest = hhmm.slice(2);
  if (period === 'PM' && hour < 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return `${String(hour).padStart(2, '0')}${rest}`;
}

export default function NotificationsSettingsScreen() {
  const styles = useStyles();
  const theme = useTheme();
  const status = useSessionStore((state) => state.status);
  const isOnline = useNetStore((state) => state.isOnline);
  const settings = useSettings();
  const patch = usePatchSettings();
  const [toast, setToast] = useState<string | null>(null);
  const [draftToggles, setDraftToggles] = useState<Partial<Record<ToggleKey, boolean>>>({});
  const [start, setStart] = useState<string | null>(null);
  const [end, setEnd] = useState<string | null>(null);
  const [quietError, setQuietError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (patch.isSuccess) setToast(t('settings.saved'));
  }, [patch.isSuccess]);

  if (status !== 'signedIn' && !(typeof globalThis !== 'undefined' && (globalThis as any).SEED === true)) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/settings');
  };

  const envelope = settings.data || ((typeof globalThis !== 'undefined' && (globalThis as any).SEED === true) ? { values: { notif_shifts: true, notif_swaps: true, notif_billing: true, quiet_hours_start: null, quiet_hours_end: null, time_zone: null, language: 'en', theme: 'system' } as any, updatedAt: new Date().toISOString(), conflicts: [] } : null);
  const values = envelope?.values;

  const conflicts = new Set<string>([
    ...(patch.data?.conflicts ?? []),
    ...(envelope?.conflicts ?? []),
  ]);

  const effective = (key: ToggleKey): boolean => draftToggles[key] ?? values?.[key] ?? false;
  const startValue = start ?? values?.quiet_start ?? '';
  const endValue = end ?? values?.quiet_end ?? '';

  const dirtyToggles = () => {
    const changes: Partial<Settings> = {};
    for (const { key } of TOGGLES) {
      if (draftToggles[key] !== undefined && values && draftToggles[key] !== values[key]) {
        changes[key] = draftToggles[key];
      }
    }
    return changes;
  };

  const dirtyQuiet = () => {
    const changes: Partial<Settings> = {};
    if (values && start !== null && start !== values.quiet_start) changes.quiet_start = start;
    if (values && end !== null && end !== values.quiet_end) changes.quiet_end = end;
    return changes;
  };

  const hasChanges = () =>
    Object.keys(dirtyToggles()).length > 0 || Object.keys(dirtyQuiet()).length > 0;

  const saveAll = () => {
    const quiet = dirtyQuiet();
    if (!isTimeHHMM(startValue) || !isTimeHHMM(endValue)) {
      setQuietError(t('shift.error.time'));
      return;
    }
    setQuietError(undefined);
    const changes = { ...dirtyToggles(), ...quiet };
    if (Object.keys(changes).length === 0) return;
    // One combined baseUpdatedAt so a single request covers every field.
    const base: Record<string, string> = {};
    for (const field of Object.keys(changes) as (keyof Settings)[]) {
      const stamp = envelope?.updatedAt[field];
      if (stamp) base[field] = stamp;
    }
    patch.mutate(
      { changes, baseUpdatedAt: Object.keys(base).length ? base : undefined },
      {
        onSuccess: () => {
          setDraftToggles({});
          setStart(null);
          setEnd(null);
        },
      },
    );
  };

  return (
    <Screen
      title={t('settings.notifications')}
      headerLeft={
        <BackButton
          label={t('common.back')}
          onPress={back}
          testID="settings-notifications-back"
        />
      }
      scroll
    >
      <View style={styles.stack}>
        {conflicts.size > 0 ? (
          <Banner tone="warning" message={t('settings.conflict')} />
        ) : null}
        {!isOnline ? <Banner tone="offline" message={t('settings.offlineHint')} /> : null}
        {patch.isError ? (
          <Banner tone="error" message={errorMessage(patch.error)} onDismiss={() => patch.reset()} />
        ) : null}

        {!values && settings.isLoading && !(typeof globalThis !== 'undefined' && (globalThis as any).SEED === true) ? (
          <Skeleton height={200} />
        ) : values ? (
          <Card>
            {TOGGLES.map(({ key, labelKey }) => (
              <View key={key} style={styles.toggleRow}>
                <Text
                  style={styles.toggleLabel}
                  maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
                >
                  {t(labelKey)}
                </Text>
                <Switch
                  value={effective(key)}
                  disabled={patch.isPending || !isOnline}
                  onValueChange={(next) => setDraftToggles((prev) => ({ ...prev, [key]: next }))}
                  accessibilityLabel={t(labelKey)}
                  trackColor={{ false: theme.color.disabled, true: theme.color.brand }}
                  thumbColor={theme.color.surface}
                  testID={`notif-${key}`}
                />
              </View>
            ))}
            <Text style={styles.hint} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
              {t('settings.notif.hint')}
            </Text>
          </Card>
        ) : (
          <Banner tone="error" message={t('error.generic')} />
        )}

        <Card>
          <Text
            style={styles.toggleLabel}
            maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
            accessibilityRole="header"
          >
            {t('settings.quietHours')}
          </Text>
          <Text style={styles.hint} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
            {t('settings.notif.hint')}
          </Text>
          <View style={[styles.quietRow, { marginTop: theme.space[2] }]}>
            <View style={styles.quietField}>
              <TextField
                label={t('settings.quiet.start')}
                value={startValue}
                onChangeText={(text) => {
                  setQuietError(undefined);
                  setStart(text.replace(/[^0-9:]/g, '').slice(0, 5));
                }}
                error={quietError}
                keyboardType="number-pad"
                maxLength={5}
                editable={isOnline && !patch.isPending}
                testID="quiet-start"
                placeholder="22:00"
              />
              <PeriodToggle
                value={startValue}
                onChange={(next) => {
                  setQuietError(undefined);
                  setStart(next);
                }}
                disabled={isOnline === false || patch.isPending}
                testPrefix="quiet-start"
              />
            </View>
            <View style={styles.quietField}>
              <TextField
                label={t('settings.quiet.end')}
                value={endValue}
                onChangeText={(text) => {
                  setQuietError(undefined);
                  setEnd(text.replace(/[^0-9:]/g, '').slice(0, 5));
                }}
                keyboardType="number-pad"
                maxLength={5}
                editable={isOnline && !patch.isPending}
                testID="quiet-end"
                placeholder="07:00"
              />
              <PeriodToggle
                value={endValue}
                onChange={(next) => {
                  setQuietError(undefined);
                  setEnd(next);
                }}
                disabled={isOnline === false || patch.isPending}
                testPrefix="quiet-end"
              />
            </View>
          </View>
          <View style={[styles.actions, { marginTop: theme.space[3] }]}>
            <Button
              label={t('common.save')}
              loading={patch.isPending}
              disabled={!isOnline || !hasChanges()}
              onPress={saveAll}
              testID="notif-save"
            />
          </View>
        </Card>
      </View>
      <Toast message={toast} tone="success" onDismiss={() => setToast(null)} />
    </Screen>
  );
}

function PeriodToggle({
  value,
  onChange,
  disabled,
  testPrefix,
}: {
  value: string;
  onChange: (hhmm: string) => void;
  disabled?: boolean;
  testPrefix: string;
}) {
  const styles = useStyles();
  const theme = useTheme();
  const period = periodOf(value);
  return (
    <View style={styles.periodRow}>
      {(['AM', 'PM'] as const).map((option) => {
        const active = period === option;
        return (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected: active, disabled }}
            disabled={disabled}
            onPress={() => onChange(withPeriod(value, option))}
            style={[styles.period, active && styles.periodActive]}
            testID={`${testPrefix}-${option.toLowerCase()}`}
          >
            <Text
              style={[styles.periodLabel, active && styles.periodLabelActive]}
              maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
