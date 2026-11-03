import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { createStyles, useTheme } from '@/theme';

export type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
};

const useStyles = createStyles((t) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space[2],
    paddingVertical: t.space[8],
    paddingHorizontal: t.space[4],
  },
  iconWrap: {
    width: t.size.iconLg * 3,
    height: t.size.iconLg * 3,
    borderRadius: t.radius.full,
    backgroundColor: t.color.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: t.space[1],
  },
  title: {
    ...t.type.titleMedium,
    color: t.color.textPrimary,
    textAlign: 'center',
  },
  body: {
    ...t.type.bodyLarge,
    color: t.color.textSecondary,
    textAlign: 'center',
  },
  action: {
    marginTop: t.space[2],
    alignSelf: 'stretch',
  },
}));

export function EmptyState({ icon, title, body, action }: EmptyStateProps) {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
      <Text style={styles.title} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
        {title}
      </Text>
      {body ? (
        <Text style={styles.body} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
          {body}
        </Text>
      ) : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}
