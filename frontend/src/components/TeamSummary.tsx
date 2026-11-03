import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { t } from '@/i18n';
import { placeIcon } from '@/lib/shifts/place';
import { createStyles, useTheme } from '@/theme';
import type { CardData } from './home/cardData';
import type { Summary } from './home/summary';

const useStyles = createStyles((t) => ({
  wrap: {
    gap: t.space[2],
  },
  card: {
    padding: t.space[3],
    gap: t.space[2],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: t.space[2],
  },
  label: {
    ...t.type.labelLarge,
    color: t.color.textSecondary,
    flexShrink: 1,
  },
  value: {
    ...t.type.headlineSmall,
    color: t.color.textPrimary,
  },
  valueAlert: {
    ...t.type.headlineSmall,
    color: t.color.error,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[2],
    flexShrink: 1,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[1],
    height: t.space[6],
    paddingHorizontal: t.space[2],
    borderRadius: t.radius.chip,
    backgroundColor: t.color.surfaceMuted,
    flexShrink: 0,
  },
  pillText: {
    ...t.type.labelMedium,
    color: t.color.textSecondary,
  },
  title: {
    ...t.type.bodySmall,
    color: t.color.textPrimary,
    flexShrink: 1,
  },
  overdue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[2],
    marginTop: t.space[1],
    padding: t.space[2],
    borderRadius: t.radius.container,
    backgroundColor: t.color.errorContainer,
  },
  overdueText: {
    ...t.type.labelMedium,
    color: t.color.onErrorContainer,
    flexShrink: 1,
  },
}));

function SummaryRow({
  label,
  value,
  alert,
  shift,
  testID,
}: {
  label: string;
  value: string;
  alert?: boolean;
  shift: CardData | null;
  testID: string;
}) {
  const styles = useStyles();
  const theme = useTheme();
  const scale = theme.textScale.maxFontSizeMultiplier;
  return (
    <Card style={styles.card} testID={testID}>
      <View style={styles.topRow}>
        <Text style={styles.label} maxFontSizeMultiplier={scale}>
          {label}
        </Text>
        <Text style={alert ? styles.valueAlert : styles.value} maxFontSizeMultiplier={scale}>
          {value}
        </Text>
      </View>
      {shift ? (
        <View style={styles.metaRow}>
          {shift.location ? (
            <View style={styles.pill} testID={`${testID}-place`}>
              <Feather name={placeIcon(shift.location)} size={14} color={theme.color.primary} />
              <Text numberOfLines={1} style={styles.pillText} maxFontSizeMultiplier={scale}>
                {shift.location.label}
              </Text>
            </View>
          ) : null}
          <Text numberOfLines={1} style={styles.title} maxFontSizeMultiplier={scale}>
            {shift.title}
          </Text>
        </View>
      ) : null}
    </Card>
  );
}

/** Three cards: who is on duty, what is up next, and what still needs cover. */
export function TeamSummary({ summary }: { summary: Summary }) {
  const styles = useStyles();
  const theme = useTheme();
  const scale = theme.textScale.maxFontSizeMultiplier;
  return (
    <View style={styles.wrap} testID="activity-summary">
      <SummaryRow
        testID="activity-summary-duty"
        label={t('activity.summary.onDuty')}
        value={String(summary.duty.count)}
        shift={summary.duty.shift}
      />
      <SummaryRow
        testID="activity-summary-next"
        label={t('activity.summary.upNext')}
        value={summary.next.shift ? summary.next.shift.time : '—'}
        shift={summary.next.shift}
      />
      <SummaryRow
        testID="activity-summary-unassigned"
        label={t('activity.summary.unassigned')}
        value={String(summary.open.count)}
        alert={summary.open.count > 0}
        shift={summary.open.shift}
      />
      {summary.overdue > 0 ? (
        <View style={styles.overdue} testID="activity-summary-overdue">
          <Feather name="alert-triangle" size={14} color={theme.color.error} />
          <Text style={styles.overdueText} maxFontSizeMultiplier={scale}>
            {summary.overdue === 1
              ? t('activity.summary.overdueOne')
              : t('activity.summary.overdueMany', { n: summary.overdue })}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
