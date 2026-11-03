import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { t } from '@/i18n';
import { createStyles, useTheme } from '@/theme';

export type FormBannerTone = 'info' | 'success' | 'warning' | 'error';

export type FormBannerProps = {
  tone?: FormBannerTone;
  message: string;
  onDismiss?: () => void;
  testID?: string;
};

const ICONS: Record<FormBannerTone, keyof typeof Ionicons.glyphMap> = {
  info: 'information-circle',
  success: 'checkmark-circle',
  warning: 'warning',
  error: 'alert-circle',
};

const useStyles = createStyles((t) => ({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[3],
    padding: t.space[3],
    borderRadius: t.radius.md,
    borderWidth: t.size.hairline,
  },
  info: {
    backgroundColor: t.color.primaryContainer,
    borderColor: t.color.onPrimaryContainer,
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
  dismiss: {
    minHeight: t.size.touchMin,
    minWidth: t.size.touchMin,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

/** FormBanner — an inline, dismissible form message with a tone-specific icon. */
export function FormBanner({ tone = 'info', message, onDismiss, testID }: FormBannerProps) {
  const styles = useStyles();
  const theme = useTheme();

  const container =
    tone === 'success'
      ? styles.success
      : tone === 'warning'
        ? styles.warning
        : tone === 'error'
          ? styles.error
          : styles.info;

  const iconColor =
    tone === 'success'
      ? theme.color.onSuccessContainer
      : tone === 'warning'
        ? theme.color.onWarningContainer
        : tone === 'error'
          ? theme.color.onErrorContainer
          : theme.color.onPrimaryContainer;

  return (
    <View style={[styles.banner, container]} accessibilityRole="alert" testID={testID}>
      <Ionicons name={ICONS[tone]} size={theme.size.iconMd} color={iconColor} />
      <Text style={styles.message} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
        {message}
      </Text>
      {onDismiss ? (
        <Pressable
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
          hitSlop={theme.size.touchMin}
          style={styles.dismiss}
        >
          <Ionicons name="close" size={theme.size.iconMd} color={theme.color.textSecondary} />
        </Pressable>
      ) : null}
    </View>
  );
}
