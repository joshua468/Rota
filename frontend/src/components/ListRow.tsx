import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStyles, useTheme } from '@/theme';

export type ListRowProps = {
  title: string;
  subtitle?: string;
  value?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
  destructive?: boolean;
  centerTitle?: boolean;
  showChevron?: boolean;
  accessibilityLabel?: string;
  testID?: string;
};

const useStyles = createStyles((t) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[3],
    minHeight: t.size.touchMin,
    paddingHorizontal: t.space[4],
    paddingVertical: t.space[3],
  },
  pressed: {
    backgroundColor: t.color.surfaceSunken,
  },
  text: {
    flex: 1,
    gap: t.space[1],
  },
  title: {
    ...t.type.bodyLarge,
    color: t.color.textPrimary,
  },
  titleCentered: {
    textAlign: 'center',
  },
  titleDestructive: {
    color: t.color.error,
  },
  subtitle: {
    ...t.type.bodySmall,
    color: t.color.textMuted,
  },
  value: {
    ...t.type.bodyLarge,
    color: t.color.textSecondary,
  },
}));

export function ListRow({
  title,
  subtitle,
  value,
  leading,
  trailing,
  onPress,
  destructive = false,
  centerTitle = false,
  showChevron = false,
  accessibilityLabel,
  testID,
}: ListRowProps) {
  const styles = useStyles();
  const theme = useTheme();

  const body = (
    <>
      {leading}
      <View style={styles.text}>
        <Text
          style={[styles.title, destructive && styles.titleDestructive, centerTitle && styles.titleCentered]}
          maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {value ? (
        <Text style={styles.value} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
          {value}
        </Text>
      ) : null}
      {trailing}
      {showChevron ? (
        <Ionicons name="chevron-forward" size={theme.size.iconMd} color={theme.color.textMuted} />
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        testID={testID}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      >
        {body}
      </Pressable>
    );
  }

  return (
    <View style={styles.row} testID={testID}>
      {body}
    </View>
  );
}

export type ListSectionProps = {
  children: ReactNode;
  testID?: string;
};

export function ListSection({ children, testID }: ListSectionProps) {
  const styles = useSectionStyles();
  const items = Array.isArray(children) ? children.filter(Boolean) : [children].filter(Boolean);

  return (
    <View style={styles.section} testID={testID}>
      {items.map((child, index) => (
        <View key={index}>
          {index > 0 ? <View style={styles.divider} /> : null}
          {child}
        </View>
      ))}
    </View>
  );
}

const useSectionStyles = createStyles((t) => ({
  section: {
    backgroundColor: t.color.surface,
    borderRadius: t.radius.xl,
    overflow: 'hidden',
    ...t.shadow.soft,
  },
  divider: {
    height: t.size.hairline,
    backgroundColor: t.color.divider,
    marginLeft: t.space[4],
  },
}));
