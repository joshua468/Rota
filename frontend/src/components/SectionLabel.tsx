import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { createStyles, useTheme } from '@/theme';

export type SectionLabelProps = {
  label: string;
  icon?: ReactNode;
  trailing?: ReactNode;
};

const useStyles = createStyles((t) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[2],
    minHeight: t.space[6],
  },
  text: {
    ...t.type.titleSmall,
    color: t.color.textPrimary,
    flex: 1,
  },
}));

export function SectionLabel({ label, icon, trailing }: SectionLabelProps) {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <View style={styles.row}>
      {icon}
      <Text style={styles.text} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
        {label}
      </Text>
      {trailing}
    </View>
  );
}
