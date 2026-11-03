import { Image, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { t } from '@/i18n';
import { createStyles, useTheme } from '@/theme';

const logo = require('../../assets/logo.png');

const LOGO_ASPECT = 902 / 1089;

export type BrandMarkProps = {
  showTagline?: boolean;
  align?: 'center' | 'start';
  style?: StyleProp<ViewStyle>;
};

const useStyles = createStyles((t) => ({
  root: {
    gap: t.space[2],
  },
  center: {
    alignItems: 'center',
  },
  start: {
    alignItems: 'flex-start',
  },
  logo: {
    height: t.size.avatarXl,
    aspectRatio: LOGO_ASPECT,
  },
  tagline: {
    ...t.type.bodyLarge,
    color: t.color.textSecondary,
    textAlign: 'center',
  },
}));

export function BrandMark({ showTagline = false, align = 'start', style }: BrandMarkProps) {
  const styles = useStyles();
  const theme = useTheme();
  const alignment = align === 'center' ? styles.center : styles.start;

  return (
    <View
      style={[styles.root, alignment, style]}
      accessible
      accessibilityRole="header"
      accessibilityLabel={t('app.name')}
    >
      <Image source={logo} style={styles.logo} resizeMode="contain" accessibilityIgnoresInvertColors />
      {showTagline ? (
        <Text style={styles.tagline} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
          {t('app.tagline')}
        </Text>
      ) : null}
    </View>
  );
}
