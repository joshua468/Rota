import { Text, View } from 'react-native';
import { createStyles, useTheme } from '@/theme';
import { Avatar, type AvatarSize } from './Avatar';

export type AvatarStackProps = {
  names: readonly string[];
  max?: number;
  size?: AvatarSize;
  ringColor?: string;
  testID?: string;
};

const useStyles = createStyles((t) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ring: {
    borderRadius: t.radius.full,
  },
  overlap: {
    marginLeft: -t.space[3],
  },
  overflow: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.color.surfaceSunken,
  },
  overflowSm: {
    width: t.size.avatarSm,
    height: t.size.avatarSm,
  },
  overflowMd: {
    width: t.size.avatarMd,
    height: t.size.avatarMd,
  },
  overflowLg: {
    width: t.size.avatarLg,
    height: t.size.avatarLg,
  },
  overflowLabel: {
    ...t.type.labelMedium,
    color: t.color.textSecondary,
  },
}));

export function AvatarStack({
  names,
  max = 3,
  size = 'sm',
  ringColor,
  testID,
}: AvatarStackProps) {
  const styles = useStyles();
  const theme = useTheme();
  const ring = ringColor ?? theme.color.surface;

  const visible = names.length > max ? names.slice(0, max - 1) : names.slice(0, max);
  const overflow = names.length - visible.length;

  const overflowSize =
    size === 'lg' ? styles.overflowLg : size === 'md' ? styles.overflowMd : styles.overflowSm;

  return (
    <View style={styles.row} testID={testID}>
      {visible.map((name, index) => (
        <View
          key={`${name}-${index}`}
          style={[styles.ring, { backgroundColor: ring, padding: theme.size.ring }, index > 0 && styles.overlap]}
        >
          <Avatar name={name} size={size} />
        </View>
      ))}
      {overflow > 0 ? (
        <View style={[styles.ring, { backgroundColor: ring, padding: theme.size.ring }, styles.overlap]}>
          <View style={[styles.overflow, overflowSize, { borderRadius: theme.radius.full }]}>
            <Text
              style={styles.overflowLabel}
              maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
            >
              {`+${overflow}`}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}
