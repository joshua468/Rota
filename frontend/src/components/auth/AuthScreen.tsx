import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { t } from '@/i18n';
import { authTokens } from '@/theme/tokens';
import { useTheme } from '@/theme';
import { AnimatedEntrance } from './AnimatedEntrance';

export type AuthScreenProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backTestID?: string;
  headerLeft?: ReactNode;
  illustration?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  testID?: string;
  textBlockStyle?: StyleProp<ViewStyle>;
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: authTokens.color.bg,
  },
  keyboard: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: authTokens.space.screenPaddingHorizontal,
  },
  column: {
    flexGrow: 1,
    width: '100%',
    maxWidth: authTokens.size.maxWebWidth,
    alignSelf: 'center',
  },
  backButtonWrap: {
    paddingTop: authTokens.space.backTop,
    alignItems: 'flex-start',
  },
  backButton: {
    width: authTokens.size.backButton,
    height: authTokens.size.backButton,
    borderRadius: authTokens.radius.circle,
    backgroundColor: authTokens.color.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginTop: authTokens.space.titleGap,
    marginBottom: authTokens.space.formGap,
  },
  title: {
    ...authTokens.type.title,
    color: authTokens.color.text,
    textAlign: 'left',
  },
  subtitle: {
    ...authTokens.type.subtitle,
    color: authTokens.color.textSecondary,
    marginTop: authTokens.space.subtitleGap,
    textAlign: 'left',
  },
  form: {
    width: '100%',
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: authTokens.size.touchMin,
    paddingTop: authTokens.space.titleGap,
  },
});

/**
 * Shared AuthScreen scaffold.
 * Full-bleed, bg = #FDFAF6, horizontal padding 24, SafeAreaView.
 * On web (>520px wide) centered 440px max-width column with no border or shadow.
 * KeyboardAvoidingView > ScrollView { flexGrow: 1 }.
 * Footer sits at bottom (marginTop: 'auto'), paddingBottom = safe-area bottom + 16.
 * Header: 44x44 circle back button, 24px below Title, 8px below Subtitle, 32px gap to form.
 * Entrance polish: fade+translateY(12) 250ms, 40ms stagger.
 */
export function AuthScreen({
  title,
  subtitle,
  onBack,
  backTestID,
  headerLeft,
  children,
  footer,
  testID,
}: AuthScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const max = theme.textScale.maxFontSizeMultiplier;

  const handleBack = onBack ?? (() => router.back());

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.root} testID={testID}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + authTokens.space.footerBottom },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.column}>
            <AnimatedEntrance delay={0}>
              <View style={styles.backButtonWrap}>
                {headerLeft ? (
                  headerLeft
                ) : (
                  <Pressable
                    onPress={handleBack}
                    accessibilityRole="button"
                    accessibilityLabel={t('common.back')}
                    hitSlop={authTokens.space.backTop}
                    style={styles.backButton}
                    testID={backTestID}
                  >
                    <Ionicons
                      name="chevron-back"
                      size={authTokens.size.backIcon}
                      color={authTokens.color.text}
                    />
                  </Pressable>
                )}
              </View>

              <View style={styles.header}>
                <Text style={styles.title} accessibilityRole="header" maxFontSizeMultiplier={max}>
                  {title}
                </Text>
                {subtitle ? (
                  <Text style={styles.subtitle} maxFontSizeMultiplier={max}>
                    {subtitle}
                  </Text>
                ) : null}
              </View>
            </AnimatedEntrance>

            <AnimatedEntrance delay={40} style={styles.form}>
              {children}
            </AnimatedEntrance>

            {footer ? (
              <AnimatedEntrance delay={80} style={styles.footer}>
                {footer}
              </AnimatedEntrance>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
