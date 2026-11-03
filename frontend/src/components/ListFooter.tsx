import { ActivityIndicator, Text, View } from 'react-native';
import { t } from '@/i18n';
import { createStyles, useTheme } from '@/theme';
import { Button } from './Button';

export type ListFooterState = 'hidden' | 'loading' | 'end' | 'error';

export type ListFooterProps = {
  state: ListFooterState;
  onRetry?: () => void;
};

const useStyles = createStyles((t) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space[2],
    paddingVertical: t.space[4],
  },
  label: {
    ...t.type.bodySmall,
    color: t.color.textSecondary,
    textAlign: 'center',
  },
}));

export function ListFooter({ state, onRetry }: ListFooterProps) {
  const styles = useStyles();
  const theme = useTheme();

  if (state === 'hidden') return null;

  if (state === 'loading') {
    return (
      <View style={styles.container} accessibilityRole="progressbar">
        <ActivityIndicator color={theme.color.primary} />
        <Text style={styles.label} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
          {t('list.loadingMore')}
        </Text>
      </View>
    );
  }

  if (state === 'error') {
    return (
      <View style={styles.container}>
        <Button label={t('common.retry')} variant="ghost" onPress={onRetry} />
      </View>
    );
  }

  return null;
}
