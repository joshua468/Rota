import { useEffect, useMemo, useRef } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
} from 'react-native';
import { addDays, dayKey, startOfWeek, weekStrip } from '@/lib/rota';
import { formatDayNumber, formatWeekday } from '@/lib/format';
import { createStyles, useTheme } from '@/theme';

export type DayStripProps = {
  selected: Date;
  onSelect: (date: Date) => void;
  accessibilityLabel?: string;
  testID?: string;
};

const WEEK_RANGE = 52;

const useStyles = createStyles((t) => ({
  container: {
    backgroundColor: t.color.surface,
    borderRadius: t.radius.container,
    padding: t.space[2],
    ...t.shadow.soft,
  },
  page: {
    flexDirection: 'row',
  },
  chip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space[1],
    minHeight: t.size.dayChip,
    borderRadius: t.radius.chip,
  },
  chipSelected: {
    backgroundColor: t.color.primary,
    ...t.shadow.soft,
    shadowColor: t.color.shadowFill,
  },
  pressed: {
    opacity: 0.85,
  },
  weekday: {
    ...t.type.labelSmall,
    color: t.color.textMuted,
    textTransform: 'uppercase',
  },
  weekdaySelected: {
    color: t.color.onPrimary,
  },
  day: {
    ...t.type.titleMedium,
    color: t.color.textPrimary,
  },
  daySelected: {
    color: t.color.onPrimary,
  },
}));

export function DayStrip({ selected, onSelect, accessibilityLabel, testID }: DayStripProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const pageWidth = Math.max(width - theme.space[5] * 2, theme.space[9]);

  const baseWeekStart = useRef(startOfWeek(new Date())).current;
  const centerIndex = WEEK_RANGE;
  const selectedKey = dayKey(selected);

  const pages = useMemo(
    () =>
      Array.from({ length: WEEK_RANGE * 2 + 1 }, (_, index) =>
        weekStrip(addDays(baseWeekStart, (index - centerIndex) * 7)),
      ),
    [baseWeekStart, centerIndex],
  );

  const weekIndexOf = (date: Date): number => {
    const diffDays = Math.round((startOfWeek(date).getTime() - baseWeekStart.getTime()) / 86_400_000);
    const weeks = Math.round(diffDays / 7);
    return Math.min(Math.max(centerIndex + weeks, 0), pages.length - 1);
  };

  const initialWeekIndex = useRef(weekIndexOf(selected)).current;
  const scrollRef = useRef<ScrollViewInstance>(null);
  const weekIndexRef = useRef(initialWeekIndex);

  useEffect(() => {
    const next = weekIndexOf(selected);
    if (next !== weekIndexRef.current) {
      weekIndexRef.current = next;
      scrollRef.current?.scrollTo({ x: next * pageWidth, animated: true });
    }
    // weekIndexOf is derived from stable refs; only `selected` should trigger a sync.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, pageWidth]);

  const onMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    weekIndexRef.current = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
  };

  return (
    <View style={styles.container} testID={testID}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentOffset={{ x: initialWeekIndex * pageWidth, y: 0 }}
        onMomentumScrollEnd={onMomentumEnd}
        accessibilityLabel={accessibilityLabel}
      >
        {pages.map((week, pageIndex) => (
          <View key={pageIndex} style={[styles.page, { width: pageWidth }]}>
            {week.map((day) => {
              const isSelected = dayKey(day) === selectedKey;
              return (
                <Pressable
                  key={dayKey(day)}
                  onPress={() => onSelect(day)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`${formatWeekday(day)} ${formatDayNumber(day)}`}
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
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
