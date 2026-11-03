import { Pressable, Text, View } from 'react-native';
import { t } from '@/i18n';
import { createStyles, useTheme } from '@/theme';

export type BannerTone = 'info' | 'offline' | 'success' | 'warning' | 'error';

export type BannerProps = {
  tone?: BannerTone;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  testID?: string;
};

const useStyles = createStyles((t) => ({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: t.space[2],
    padding: t.space[3],
    borderRadius: t.radius.md,
    borderWidth: t.size.hairline,
  },
  info: {
    backgroundColor: t.color.primaryContainer,
    borderColor: t.color.onPrimaryContainer,
  },
  offline: {
    backgroundColor: t.color.surfaceMuted,
    borderColor: t.color.border,
  },
  success: {
    backgroundColor: t.color.successContainer,
    borderColor: t.color.onSuccessContainer,
  },
  warning: {
    backgroundColor: t.color.warningContainer,
    borderColor: t.color.onWarningContainer,
  },
  error: {
    backgroundColor: t.color.errorContainer,
    borderColor: t.color.onErrorContainer,
  },
  message: {
    ...t.type.bodySmall,
    color: t.color.textPrimary,
    flexShrink: 1,
  },
  messageInfo: {
    color: t.color.onPrimaryContainer,
  },
  messageSuccess: {
    color: t.color.onSuccessContainer,
  },
  messageWarning: {
    color: t.color.onWarningContainer,
  },
  messageError: {
    color: t.color.onErrorContainer,
  },
  action: {
    ...t.type.labelLarge,
    color: t.color.link,
    textDecorationLine: 'underline',
    minHeight: t.size.touchMin,
    textAlignVertical: 'center',
  },
  dismiss: {
    minHeight: t.size.touchMin,
    minWidth: t.size.touchMin,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: t.space[1],
  },
}));

export function Banner({ tone = 'info', message, actionLabel, onAction, onDismiss, testID }: BannerProps) {
  const styles = useStyles();
  const theme = useTheme();

  const container =
    tone === 'offline'
      ? styles.offline
      : tone === 'success'
        ? styles.success
        : tone === 'warning'
          ? styles.warning
          : tone === 'error'
            ? styles.error
            : styles.info;

  const messageStyle =
    tone === 'success'
      ? styles.messageSuccess
      : tone === 'warning'
        ? styles.messageWarning
        : tone === 'error'
          ? styles.messageError
          : tone === 'info'
            ? styles.messageInfo
            : undefined;

  return (
    <View
      style={[styles.banner, container]}
      accessibilityRole="alert"
      testID={testID}
    >
      <Text style={[styles.message, messageStyle]} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
        {message}
      </Text>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          hitSlop={theme.size.touchMin}
        >
          <Text style={styles.action} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
      {onDismiss ? (
        <Pressable
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
          hitSlop={theme.size.touchMin}
          style={styles.dismiss}
        >
          <Text style={styles.message} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
            {t('common.close')}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
