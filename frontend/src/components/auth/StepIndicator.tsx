import { View } from 'react-native';
import { createStyles } from '@/theme';

export type StepIndicatorProps = {
  count: number;
  activeIndex: number;
  accessibilityLabel?: string;
  testID?: string;
};

const useStyles = createStyles((t) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[2],
  },
  segment: {
    flex: 1,
    height: t.space[1],
    borderRadius: t.radius.full,
    backgroundColor: t.color.border,
  },
  segmentActive: {
    backgroundColor: t.color.primary,
  },
}));

/** StepIndicator — a row of segments showing progress through a linear flow. */
export function StepIndicator({
  count,
  activeIndex,
  accessibilityLabel,
  testID,
}: StepIndicatorProps) {
  const styles = useStyles();
  const steps = Array.from({ length: count }, (_, index) => index);

  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      {steps.map((index) => (
        <View
          key={index}
          style={[styles.segment, index <= activeIndex ? styles.segmentActive : null]}
        />
      ))}
    </View>
  );
}
