import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { createStyles, useTheme } from '@/theme';

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'error';

export type BadgeProps = {
  label: string;
  tone?: BadgeTone;
  icon?: ReactNode;
  testID?: string;
};

const useStyles = createStyles((t) => ({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[1],
    paddingHorizontal: t.space[2],
    paddingVertical: t.space[1],
    borderRadius: t.radius.full,
    /* The pill hugs its content; the wrapper around it takes the parent's
       cross-axis alignment so a badge in a row stays vertically centred
       instead of sticking to the top of the row. */
    alignSelf: 'flex-start',
  },
  neutral: {
    backgroundColor: t.color.surfaceMuted,
  },
  brand: {
    backgroundColor: t.color.primaryContainer,
  },
  success: {
    backgroundColor: t.color.successContainer,
  },
  warning: {
    backgroundColor: t.color.warningContainer,
  },
  error: {
    backgroundColor: t.color.errorContainer,
  },
  label: {
    ...t.type.labelSmall,
    color: t.color.textSecondary,
  },
  labelBrand: {
    ...t.type.labelSmall,
    color: t.color.onPrimaryContainer,
  },
  labelSuccess: {
    ...t.type.labelSmall,
    color: t.color.onSuccessContainer,
  },
  labelWarning: {
    ...t.type.labelSmall,
    color: t.color.onWarningContainer,
  },
  labelError: {
    ...t.type.labelSmall,
    color: t.color.onErrorContainer,
  },
}));

export function Badge({ label, tone = 'neutral', icon, testID }: BadgeProps) {
  const styles = useStyles();
  const theme = useTheme();

  const container =
    tone === 'brand'
      ? styles.brand
      : tone === 'success'
        ? styles.success
        : tone === 'warning'
          ? styles.warning
          : tone === 'error'
            ? styles.error
            : styles.neutral;

  const labelStyle =
    tone === 'brand'
      ? styles.labelBrand
      : tone === 'success'
        ? styles.labelSuccess
        : tone === 'warning'
          ? styles.labelWarning
          : tone === 'error'
            ? styles.labelError
            : styles.label;

  return (
    <View>
      <View style={[styles.badge, container]} testID={testID} accessibilityRole="text">
        {icon}
        <Text style={labelStyle} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
          {label}
        </Text>
      </View>
    </View>
  );
}
