import type { ReactNode } from 'react';
import {
  RefreshControl,
  ScrollView,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStyles, useTheme } from '@/theme';
import { TAB_BAR_CLEARANCE } from './home/AppTabBar';

export type ScreenProps = {
  eyebrow?: string;
  title?: string;
  titleVariant?: 'display' | 'title';
  subtitle?: string;
  headerLeft?: ReactNode;
  headerRight?: ReactNode;
  children: ReactNode;
  scroll?: boolean;
  footer?: ReactNode;
  overlay?: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  style?: StyleProp<ViewStyle>;
};

const useStyles = createStyles((t) => ({
  root: {
    flex: 1,
    backgroundColor: t.color.background,
  },
  header: {
    paddingHorizontal: t.space[5],
    paddingTop: t.space[3],
    paddingBottom: t.space[3],
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: t.space[2],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: t.space[3],
  },
  headerText: {
    flex: 1,
    gap: t.space[1],
  },
  headerSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: t.space[1],
  },
  eyebrow: {
    ...t.type.labelMedium,
    color: t.color.textMuted,
  },
  title: {
    ...t.type.displaySmall,
    color: t.color.textPrimary,
  },
  titleDisplay: {
    ...t.type.displayLarge,
    color: t.color.textPrimary,
  },
  subtitle: {
    ...t.type.bodyLarge,
    color: t.color.textSecondary,
  },
  body: {
    flex: 1,
    paddingHorizontal: t.space[5],
    gap: t.space[4],
    paddingTop: t.space[1],
    paddingBottom: t.space[4],
  },
  scroll: {
    flex: 1,
  },
  scrollBody: {
    paddingHorizontal: t.space[5],
    gap: t.space[4],
    paddingTop: t.space[1],
    paddingBottom: t.space[4] + TAB_BAR_CLEARANCE,
  },
  footer: {
    paddingHorizontal: t.space[5],
    paddingTop: t.space[2],
    paddingBottom: t.space[4],
    gap: t.space[2],
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    pointerEvents: 'box-none',
  },
}));

export function Screen({
  eyebrow,
  title,
  titleVariant = 'title',
  subtitle,
  headerLeft,
  headerRight,
  children,
  scroll = false,
  footer,
  overlay,
  refreshing,
  onRefresh,
  style,
}: ScreenProps) {
  const styles = useStyles();
  const theme = useTheme();

  const header =
    title || subtitle || eyebrow || headerLeft || headerRight ? (
      <View style={styles.header}>
        {headerLeft ? <View style={styles.backRow}>{headerLeft}</View> : null}
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            {eyebrow ? (
              <Text
                style={styles.eyebrow}
                maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
              >
                {eyebrow}
              </Text>
            ) : null}
            {title ? (
              <Text
                style={titleVariant === 'display' ? styles.titleDisplay : styles.title}
                maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
                accessibilityRole="header"
              >
                {title}
              </Text>
            ) : null}
            {subtitle ? (
              <Text
                style={styles.subtitle}
                maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
              >
                {subtitle}
              </Text>
            ) : null}
          </View>
          {headerRight ? <View style={styles.headerSlot}>{headerRight}</View> : null}
        </View>
      </View>
    ) : null;

  const refreshControl = onRefresh ? (
    <RefreshControl
      refreshing={!!refreshing}
      onRefresh={onRefresh}
      tintColor={theme.color.primary}
      colors={[theme.color.primary]}
      progressBackgroundColor={theme.color.surface}
    />
  ) : undefined;

  return (
    <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={[styles.root, style]}>
      {header}
      {scroll ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollBody}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={styles.body}>{children}</View>
      )}
      {footer ? <View style={styles.footer}>{footer}</View> : null}
      {overlay ? (
        <View style={styles.overlay}>
          {overlay}
        </View>
      ) : null}
    </SafeAreaView>
  );
}
