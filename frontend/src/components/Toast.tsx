import { useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { t } from '@/i18n';
import { createStyles, useTheme } from '@/theme';

export type ToastTone = 'info' | 'success' | 'error';

export type ToastProps = {
  message: string | null;
  tone?: ToastTone;
  onDismiss?: () => void;
  durationMs?: number;
  testID?: string;
};

const ICONS: Record<ToastTone, 'check-circle' | 'alert-circle' | 'info'> = {
  info: 'info',
  success: 'check-circle',
  error: 'alert-circle',
};

const useStyles = createStyles((t) => ({
  overlay: {
    position: 'absolute',
    left: t.space[4],
    right: t.space[4],
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[2],
    paddingVertical: t.space[2],
    paddingLeft: t.space[3],
    paddingRight: t.space[1],
    borderRadius: t.radius.full,
    maxWidth: '100%',
    ...t.shadow.medium,
  },
  info: {
    backgroundColor: t.color.surfaceInverse,
  },
  success: {
    backgroundColor: t.color.successContainer,
  },
  error: {
    backgroundColor: t.color.errorContainer,
  },
  message: {
    ...t.type.labelLarge,
    color: t.color.textPrimary,
    flexShrink: 1,
  },
  messageInfo: {
    color: t.color.textInverse,
  },
  messageError: {
    color: t.color.onErrorContainer,
  },
  dismiss: {
    width: t.size.touchMin,
    height: t.size.touchMin,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export function Toast({
  message,
  tone = 'info',
  onDismiss,
  durationMs = 3000,
  testID,
}: ToastProps) {
  const styles = useStyles();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!message || !onDismiss) return;
    const timer = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(timer);
  }, [message, onDismiss, durationMs]);

  if (!message) return null;

  const container = tone === 'success' ? styles.success : tone === 'error' ? styles.error : styles.info;
  const messageStyle =
    tone === 'error'
      ? styles.messageError
      : tone === 'info'
        ? styles.messageInfo
        : undefined;
  const iconColor =
    tone === 'error'
      ? theme.color.error
      : tone === 'info'
        ? theme.color.textInverse
        : theme.color.success;

  return (
    <View
      style={[styles.overlay, { bottom: insets.bottom + theme.size.tabBar + theme.space[4] }]}
      accessibilityLiveRegion="polite"
      testID={testID}
    >
      <View style={[styles.toast, container]} accessibilityRole="alert">
        <Feather name={ICONS[tone]} size={theme.size.iconSm} color={iconColor} />
        <Text style={[styles.message, messageStyle]} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
          {message}
        </Text>
        {onDismiss ? (
          <Pressable
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel={t('common.dismiss')}
            hitSlop={theme.size.touchMin}
            style={styles.dismiss}
          >
            <Feather
              name="x"
              size={theme.size.iconSm}
              color={tone === 'info' ? theme.color.textInverse : theme.color.textPrimary}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
