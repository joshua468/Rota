import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { createStyles, useTheme } from '@/theme';

export type QuickAction = {
  key: string;
  label: string;
  icon: ReactNode;
  onPress: () => void;
  testID?: string;
};

export type QuickActionsProps = {
  actions: QuickAction[];
  accessibilityLabel?: string;
};

const useStyles = createStyles((t) => ({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: t.space[2],
  },
  item: {
    flexGrow: 1,
    flexBasis: '30%',
    minHeight: t.size.controlMin,
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space[1],
    paddingVertical: t.space[3],
    paddingHorizontal: t.space[2],
    borderRadius: t.radius.md,
    backgroundColor: t.color.surface,
    borderWidth: t.size.hairline,
    borderColor: t.color.border,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    ...t.type.labelMedium,
    color: t.color.textPrimary,
    textAlign: 'center',
  },
}));

export function QuickActions({ actions, accessibilityLabel }: QuickActionsProps) {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <View style={styles.grid} accessibilityLabel={accessibilityLabel}>
      {actions.map((action) => (
        <Pressable
          key={action.key}
          onPress={action.onPress}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          testID={action.testID}
          style={({ pressed }) => [styles.item, pressed && styles.pressed]}
        >
          {action.icon}
          <Text
            style={styles.label}
            maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
            numberOfLines={1}
          >
            {action.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
