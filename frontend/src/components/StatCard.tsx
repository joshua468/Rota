import { Animated, Pressable, Text, View } from 'react-native';
import { usePressScale } from '@/lib/usePressScale';
import { createStyles, useTheme } from '@/theme';

export type StatCardProps = {
  label: string;
  value: string | number;
  emphasis?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  testID?: string;
};

const useStyles = createStyles((t) => ({
  card: {
    flex: 1,
    backgroundColor: t.color.surface,
    borderRadius: t.radius.xl,
    padding: t.space[4],
    gap: t.space[1],
    ...t.shadow.soft,
  },
  value: {
    ...t.type.displaySmall,
    color: t.color.textPrimary,
  },
  valueEmphasis: {
    color: t.color.primary,
  },
  label: {
    ...t.type.bodySmall,
    color: t.color.textMuted,
  },
}));

export function StatCard({
  label,
  value,
  emphasis = false,
  onPress,
  accessibilityLabel,
  testID,
}: StatCardProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { scale, onPressIn, onPressOut } = usePressScale();

  const content = (
    <>
      <Text
        style={[styles.value, emphasis && styles.valueEmphasis]}
        maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
      >
        {value}
      </Text>
      <Text style={styles.label} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
        {label}
      </Text>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? `${value} ${label}`}
        testID={testID}
      >
        <Animated.View style={[styles.card, { transform: [{ scale }] }]}>{content}</Animated.View>
      </Pressable>
    );
  }

  return (
    <View style={styles.card} testID={testID}>
      {content}
    </View>
  );
}
