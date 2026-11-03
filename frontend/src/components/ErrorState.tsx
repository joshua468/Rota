import { t } from '@/i18n';
import { errorMessage, isNetworkError } from '@/lib/errorCopy';
import { Button } from './Button';
import { EmptyState } from './EmptyState';
import { createStyles, useTheme } from '@/theme';
import { Text, View } from 'react-native';

export { errorMessage, isNetworkError };

const useStyles = createStyles((t) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space[2],
    paddingVertical: t.space[8],
    paddingHorizontal: t.space[4],
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

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const styles = useStyles();
  const theme = useTheme();
  const message = errorMessage(error);

  if (isNetworkError(error)) {
    return (
      <EmptyState
        title={t('offline.empty.title')}
        body={t('offline.empty.body')}
        action={onRetry ? <Button label={t('common.retry')} variant="secondary" onPress={onRetry} /> : undefined}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
        {t('error.title')}
      </Text>
      <Text style={styles.body} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
        {message}
      </Text>
      {onRetry ? (
        <View style={styles.action}>
          <Button label={t('common.retry')} variant="secondary" onPress={onRetry} />
        </View>
      ) : null}
    </View>
  );
}
