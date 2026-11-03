import { StyleSheet, Text, View } from 'react-native';
import { authTokens } from '@/theme/tokens';
import { useTheme } from '@/theme';

export type DividerWithTextProps = {
  text: string;
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: authTokens.space.dividerMargin,
    gap: authTokens.space.socialGap,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: authTokens.color.border,
  },
  text: {
    ...authTokens.type.body,
    color: authTokens.color.textSecondary,
  },
});

/**
 * DividerWithText — 1px border lines either side of text (24px margin).
 */
export function DividerWithText({ text }: DividerWithTextProps) {
  const theme = useTheme();

  return (
    <View style={styles.row} accessibilityRole="text">
      <View style={styles.line} />
      <Text style={styles.text} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
        {text}
      </Text>
      <View style={styles.line} />
    </View>
  );
}
