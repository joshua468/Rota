import { Animated, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePressScale } from '@/lib/usePressScale';
import { createStyles, useTheme, type Theme } from '@/theme';
import { AvatarStack } from './AvatarStack';

export type ShiftCardVariant = 'mine' | 'team' | 'open' | 'neutral';

export type ShiftCardProps = {
  timeLabel: string;
  durationLabel?: string;
  title: string;
  subtitle?: string;
  location?: string | null;
  personName?: string | null;
  variant: ShiftCardVariant;
  onPress?: () => void;
  onMenu?: () => void;
  menuAccessibilityLabel?: string;
  starAccessibilityLabel?: string;
  accessibilityLabel?: string;
  testID?: string;
};

const darkBorder = (t: Theme): boolean => t.mode === 'dark';

const useStyles = createStyles((t) => ({
  card: {
    borderRadius: t.radius.cardLarge,
    padding: t.space[4],
    gap: t.space[3],
  },
  cardMine: {
    backgroundColor: t.color.primary,
  },
  cardTeam: {
    backgroundColor: t.color.primaryContainer,
    borderWidth: darkBorder(t) ? t.size.hairline : 0,
    borderColor: t.color.divider,
  },
  cardNeutral: {
    backgroundColor: t.color.surface,
    borderWidth: t.size.hairline,
    borderColor: t.color.divider,
  },
  cardOpen: {
    backgroundColor: t.color.surface,
    borderWidth: t.size.hairline,
    borderStyle: 'dashed',
    borderColor: t.color.accent,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[2],
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.space[2],
    borderRadius: t.radius.full,
    paddingHorizontal: t.space[3],
    paddingVertical: t.space[1],
  },
  chipMine: {
    backgroundColor: t.color.pillOnPrimary,
  },
  chipTeam: {
    backgroundColor: t.color.surface,
  },
  chipNeutral: {
    backgroundColor: t.color.surfaceMuted,
  },
  chipOpen: {
    backgroundColor: t.color.accentTint,
  },
  chipText: {
    ...t.type.labelLarge,
  },
  chipTextMine: {
    color: t.color.onPillOnPrimary,
  },
  chipTextTeam: {
    color: t.color.onPrimaryContainer,
  },
  chipTextNeutral: {
    color: t.color.textSecondary,
  },
  chipTextOpen: {
    color: t.color.accentText,
  },
  duration: {
    ...t.type.labelSmall,
    flex: 1,
  },
  durationMine: {
    color: t.color.onPillOnPrimary,
  },
  durationTeam: {
    color: t.color.onPrimaryContainer,
  },
  durationNeutral: {
    color: t.color.textMuted,
  },
  durationOpen: {
    color: t.color.textMuted,
  },
  corner: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: t.size.touchMin,
    minHeight: t.size.touchMin,
  },
  title: {
    ...t.type.titleLarge,
  },
  titleMine: {
    color: t.color.onPrimary,
  },
  titleTeam: {
    color: t.color.onPrimaryContainer,
  },
  titleNeutral: {
    color: t.color.textPrimary,
  },
  titleOpen: {
    color: t.color.textPrimary,
  },
  subtitle: {
    ...t.type.bodyLarge,
  },
  subtitleMine: {
    color: t.color.onPrimary,
  },
  subtitleTeam: {
    color: t.color.onPrimaryContainer,
  },
  subtitleNeutral: {
    color: t.color.textSecondary,
  },
  subtitleOpen: {
    color: t.color.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: t.space[2],
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[1],
    borderRadius: t.radius.full,
    paddingHorizontal: t.space[2],
    paddingVertical: t.space[1],
  },
  pillMine: {
    backgroundColor: t.color.pillOnPrimary,
  },
  pillTeam: {
    backgroundColor: t.color.surface,
  },
  pillNeutral: {
    backgroundColor: t.color.surfaceMuted,
  },
  pillOpen: {
    backgroundColor: t.color.accentTint,
  },
  pillLabel: {
    ...t.type.labelSmall,
  },
  pillLabelMine: {
    color: t.color.onPillOnPrimary,
  },
  pillLabelTeam: {
    color: t.color.onPrimaryContainer,
  },
  pillLabelNeutral: {
    color: t.color.textSecondary,
  },
  pillLabelOpen: {
    color: t.color.accentText,
  },
}));

export function ShiftCard({
  timeLabel,
  durationLabel,
  title,
  subtitle,
  location,
  personName,
  variant,
  onPress,
  onMenu,
  menuAccessibilityLabel,
  starAccessibilityLabel,
  accessibilityLabel,
  testID,
}: ShiftCardProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { scale, onPressIn, onPressOut } = usePressScale();

  const mine = variant === 'mine';
  const team = variant === 'team';
  const open = variant === 'open';

  const chipStyle = mine
    ? styles.chipMine
    : team
      ? styles.chipTeam
      : open
        ? styles.chipOpen
        : styles.chipNeutral;
  const chipTextStyle = mine
    ? styles.chipTextMine
    : team
      ? styles.chipTextTeam
      : open
        ? styles.chipTextOpen
        : styles.chipTextNeutral;
  const titleStyle = mine
    ? styles.titleMine
    : team
      ? styles.titleTeam
      : open
        ? styles.titleOpen
        : styles.titleNeutral;
  const subtitleStyle = mine
    ? styles.subtitleMine
    : team
      ? styles.subtitleTeam
      : open
        ? styles.subtitleOpen
        : styles.subtitleNeutral;
  const durationStyle = mine
    ? styles.durationMine
    : team
      ? styles.durationTeam
      : open
        ? styles.durationOpen
        : styles.durationNeutral;
  const pillStyle = mine
    ? styles.pillMine
    : team
      ? styles.pillTeam
      : open
        ? styles.pillOpen
        : styles.pillNeutral;
  const pillLabelStyle = mine
    ? styles.pillLabelMine
    : team
      ? styles.pillLabelTeam
      : open
        ? styles.pillLabelOpen
        : styles.pillLabelNeutral;
  const cornerColor = mine
    ? theme.color.onPrimary
    : team
      ? theme.color.onPrimaryContainer
      : theme.color.textMuted;
  const ringColor = mine ? theme.color.primary : theme.color.surface;
  const cardStyle = mine
    ? styles.cardMine
    : team
      ? styles.cardTeam
      : open
        ? styles.cardOpen
        : styles.cardNeutral;

  const content = (
    <>
      <View style={styles.topRow}>
        <View style={[styles.chip, chipStyle]}>
          <Text
            style={[styles.chipText, chipTextStyle]}
            maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
          >
            {timeLabel}
          </Text>
          {mine && durationLabel ? (
            <Text
              style={[styles.duration, styles.durationMine]}
              maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
            >
              {durationLabel}
            </Text>
          ) : null}
        </View>
        {!mine && durationLabel ? (
          <Text
            style={[styles.duration, durationStyle]}
            maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
          >
            {durationLabel}
          </Text>
        ) : null}
        {!mine ? (
          onMenu ? (
            <Pressable
              onPress={onMenu}
              accessibilityRole="button"
              accessibilityLabel={menuAccessibilityLabel}
              style={styles.corner}
              testID={testID ? `${testID}-menu` : undefined}
            >
              <Ionicons name="ellipsis-horizontal" size={theme.size.iconMd} color={cornerColor} />
            </Pressable>
          ) : (
            <View style={styles.corner} />
          )
        ) : (
          <Pressable
            onPress={onPress}
            disabled={!onPress}
            accessibilityRole="button"
            accessibilityLabel={starAccessibilityLabel ?? accessibilityLabel ?? title}
            style={styles.corner}
            testID={testID ? `${testID}-star` : undefined}
          >
            <Ionicons name="star" size={theme.size.iconMd} color={theme.color.onPrimary} />
          </Pressable>
        )}
      </View>
      <Text
        style={[styles.title, titleStyle]}
        maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={[styles.subtitle, subtitleStyle]}
          numberOfLines={1}
          maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
        >
          {subtitle}
        </Text>
      ) : null}
      <View style={styles.footer}>
        {personName ? (
          <AvatarStack names={[personName]} size="sm" ringColor={ringColor} />
        ) : (
          <View />
        )}
        {location ? (
          <View style={[styles.pill, pillStyle]}>
            <Ionicons name="location-outline" size={theme.size.iconSm} color={pillLabelStyle.color} />
            <Text
              style={[styles.pillLabel, pillLabelStyle]}
              numberOfLines={1}
              maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
            >
              {location}
            </Text>
          </View>
        ) : null}
      </View>
    </>
  );

  const cardUIStyle = [
    styles.card,
    cardStyle,
    { transform: [{ scale }] },
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        testID={testID}
      >
        <Animated.View style={cardUIStyle}>{content}</Animated.View>
      </Pressable>
    );
  }

  return (
    <Animated.View style={cardUIStyle} testID={testID}>
      {content}
    </Animated.View>
  );
}