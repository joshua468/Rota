import type { ReactNode } from 'react';
import { Animated, Pressable } from 'react-native';
import { usePressScale } from '@/lib/usePressScale';
import { createStyles, useTheme } from '@/theme';

export type FabProps = {
  icon: ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  offsetBottom?: number;
  testID?: string;
};

const useStyles = createStyles((t) => ({
  wrap: {
    position: 'absolute',
    right: t.space[5],
    bottom: t.space[6],
  },
  fab: {
    width: t.size.fab,
    height: t.size.fab,
    borderRadius: t.radius.full,
    backgroundColor: t.color.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...t.shadow.hard,
    shadowColor: t.color.shadowFill,
  },
}));

export function Fab({ icon, onPress, accessibilityLabel, offsetBottom, testID }: FabProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { scale, onPressIn, onPressOut } = usePressScale(0.94);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={[styles.wrap, offsetBottom === undefined ? undefined : { bottom: offsetBottom }]}
    >
      <Animated.View style={[styles.fab, { transform: [{ scale }] }]}>{icon}</Animated.View>
    </Pressable>
  );
}
