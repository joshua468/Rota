import { Pressable, ScrollView, Text } from 'react-native';
import { formatDayNumber, formatWeekday } from '@/lib/format';
import { addDays, dayKey, startOfWeek } from '@/lib/rota';
import { createStyles, useTheme } from '@/theme';

export type WeekStripProps = {
  selected: Date;
  onSelect: (date: Date) => void;
  accessibilityLabel?: string;
  testID?: string;
};

const useStyles = createStyles((t) => ({
  strip: {
    flexGrow: 0,
  },
  content: {
    gap: t.space[1],
    paddingVertical: t.space[1],
  },
  chip: {
    width: t.size.dayChip,
    height: t.size.dayCard,
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space[1],
    borderRadius: t.radius.chipLg,
  },
  chipSelected: {
    backgroundColor: t.color.accent,
    ...t.shadow.soft,
    shadowColor: t.color.shadowFill,
  },
  pressed: {
    opacity: 0.85,
  },
  weekday: {
    ...t.type.labelMedium,
    color: t.color.textMuted,
    textTransform: 'uppercase',
  },
  weekdaySelected: {
    color: t.color.onPrimary,
  },
  day: {
    ...t.type.headlineMedium,
    color: t.color.textPrimary,
  },
  daySelected: {
    color: t.color.onPrimary,
  },
}));

const WEEK_LENGTH = 7;

export function WeekStrip({ selected, onSelect, accessibilityLabel, testID }: WeekStripProps) {
  const styles = useStyles();
  const theme = useTheme();

  const selectedKey = dayKey(selected);
  const weekStart = startOfWeek(selected);
  const days = Array.from({ length: WEEK_LENGTH }, (_, index) => addDays(weekStart, index));

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      style={styles.strip}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      {days.map((day) => {
        const isSelected = dayKey(day) === selectedKey;
        return (
          <Pressable
            key={dayKey(day)}
            onPress={() => onSelect(day)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${formatWeekday(day)} ${formatDayNumber(day)}`}
            testID={isSelected ? 'day-selected' : undefined}
            style={({ pressed }) => [
              styles.chip,
              isSelected && styles.chipSelected,
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[styles.weekday, isSelected && styles.weekdaySelected]}
              maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
            >
              {formatWeekday(day)}
            </Text>
            <Text
              style={[styles.day, isSelected && styles.daySelected]}
              maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
            >
              {formatDayNumber(day)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
