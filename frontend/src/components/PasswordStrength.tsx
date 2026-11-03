import { Text, View } from 'react-native';
import { t, type TranslationKey } from '@/i18n';
import { passwordStrength, type PasswordStrength } from '@/lib/auth/validators';
import { createStyles, useTheme } from '@/theme';

const useStyles = createStyles((t) => ({
  wrap: {
    gap: t.space[1],
  },
  segments: {
    flexDirection: 'row',
    gap: t.space[1],
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: t.radius.full,
    backgroundColor: t.color.border,
  },
  label: {
    ...t.type.bodySmall,
    color: t.color.textSecondary,
  },
}));

const SEVERITY: Record<
  PasswordStrength,
  { label: TranslationKey | ''; active: 'error' | 'warning' | 'success' }
> = {
  0: { label: '', active: 'error' },
  1: { label: 'auth.strength.weak', active: 'error' },
  2: { label: 'auth.strength.fair', active: 'warning' },
  3: { label: 'auth.strength.good', active: 'success' },
  4: { label: 'auth.strength.strong', active: 'success' },
};

export function PasswordStrengthMeter({ value }: { value: string }) {
  const styles = useStyles();
  const theme = useTheme();
  const { score } = passwordStrength(value);
  const severity = SEVERITY[score];
  const activeColor =
    severity.active === 'error'
      ? theme.color.error
      : severity.active === 'warning'
        ? theme.color.warning
        : theme.color.success;

  return (
    <View
      style={styles.wrap}
      accessibilityLiveRegion="polite"
      accessibilityLabel={severity.label ? t(severity.label) : undefined}
    >
      <View style={styles.segments}>
        {[1, 2, 3, 4].map((index) => (
          <View
            key={index}
            style={[
              styles.segment,
              index <= score ? { backgroundColor: activeColor } : undefined,
            ]}
          />
        ))}
      </View>
      {severity.label ? (
        <Text style={styles.label} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
          {t(severity.label)}
        </Text>
      ) : null}
    </View>
  );
}