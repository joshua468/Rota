import type { ReactNode } from 'react';
import { Animated, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { usePressScale } from '@/lib/usePressScale';
import { createStyles } from '@/theme';

export type CardProps = {
  children: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  /**
   * `flush` removes the card padding so the content can own its padding and a
   * footer can sit on the card edge (a divider that runs the full width reads
   * as a footer, not as a button floating inside a frame).
   */
  flush?: boolean;
  testID?: string;
};

const useStyles = createStyles((t) => ({
  card: {
    backgroundColor: t.color.surface,
    borderRadius: t.radius.xl,
    padding: t.space[5],
    gap: t.space[2],
    ...t.shadow.soft,
  },
  flush: {
    padding: 0,
    gap: 0,
  },
}));

export function Card({ children, onPress, accessibilityLabel, style, flush = false, testID }: CardProps) {
  const styles = useStyles();
  const { scale, onPressIn, onPressOut } = usePressScale();
  const cardStyle = [styles.card, flush && styles.flush, style];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        testID={testID}
      >
        <Animated.View style={[cardStyle, { transform: [{ scale }] }]}>{children}</Animated.View>
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}
