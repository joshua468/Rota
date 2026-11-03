import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  PanResponder,
  Platform,
  Pressable,
  Text,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { t, type TranslationKey } from '@/i18n';
import { go } from '@/lib/nav';
import { pushUnavailable } from '@/lib/pushEnv';
import { USE_NATIVE_DRIVER, usePressScale, useReducedMotion } from '@/lib/usePressScale';
import { useOnboardingStore } from '@/stores/onboarding';
import { createStyles, useTheme } from '@/theme';
import type { AppTheme } from '@/theme/ThemeProvider';

type Step = {
  image: ImageSourcePropType;
  labelKey: TranslationKey;
  titleKey: TranslationKey;
  bodyKey: TranslationKey;
};

const STEPS: Step[] = [
  {
    image: require('../assets/onboarding/onboarding-step-1.png'),
    labelKey: 'onboarding.step1.imageAlt',
    titleKey: 'onboarding.step1.title',
    bodyKey: 'onboarding.step1.body',
  },
  {
    image: require('../assets/onboarding/onboarding-step-2.png'),
    labelKey: 'onboarding.step2.imageAlt',
    titleKey: 'onboarding.step2.title',
    bodyKey: 'onboarding.step2.body',
  },
  {
    image: require('../assets/onboarding/onboarding-step-3.png'),
    labelKey: 'onboarding.step3.imageAlt',
    titleKey: 'onboarding.step3.title',
    bodyKey: 'onboarding.step3.body',
  },
];

const MAX_CONTENT_WIDTH = 480;
const ILLUSTRATION_RATIO = 0.46;
const ILLUSTRATION_RATIO_SHORT = 0.38;
const SHORT_SCREEN_HEIGHT = 700;
const STEP_TRANSITION_MS = 250;
const STEP_SLIDE_PX = 24;
const DOT_TRANSITION_MS = 200;
const FLOAT_DURATION_MS = 1500;
const FLOAT_OFFSET = -6;
const SWIPE_THRESHOLD = 48;
const BASE_DOT_WIDTH = 8;
const ACTIVE_DOT_WIDTH = 24;
const DOT_HEIGHT = 8;

const useStyles = createStyles((t) => {
  const p = t as AppTheme;
  return {
    root: {
      flex: 1,
      backgroundColor: p.bg,
    },
    content: {
      flex: 1,
      width: '100%',
      maxWidth: MAX_CONTENT_WIDTH,
      alignSelf: 'center',
      paddingHorizontal: t.space[6],
      backgroundColor: p.bg,
    },
    topRow: {
      height: t.size.touchMin,
      marginTop: t.space[2],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    skip: {
      minWidth: t.size.touchMin,
      minHeight: t.size.touchMin,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: t.space[2],
    },
    skipLabel: {
      ...t.type.titleSmall,
      color: p.primaryText,
    },
    illustrationZone: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    illustrationFrame: {
      width: '100%',
    },
    illustrationImage: {
      width: '100%',
      height: '100%',
    },
    textBlock: {
      marginTop: t.space[6],
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    headline: {
      ...t.type.displayLarge,
      color: p.ink,
      textAlign: 'center',
      maxWidth: 320,
    },
    headlineShort: {
      ...t.type.displaySmall,
      color: p.ink,
      textAlign: 'center',
      maxWidth: 320,
    },
    description: {
      ...t.type.bodyMedium,
      color: p.muted,
      textAlign: 'center',
      maxWidth: 320,
      marginTop: t.space[3],
    },
    dots: {
      marginTop: t.space[6],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: t.space[2],
    },
    dot: {
      height: DOT_HEIGHT,
      borderRadius: t.radius.full,
      backgroundColor: p.dotInactive,
    },
    dotActive: {
      backgroundColor: p.primary,
    },
    button: {
      marginTop: t.space[6],
      height: t.size.controlLg,
      borderRadius: t.radius.bar,
      backgroundColor: p.primary,
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0px 10px 20px ${p.primary}4D`,
    },
    buttonLabel: {
      ...t.type.titleMedium,
      fontSize: t.type.titleMedium.fontSize - 1,
      color: p.card,
    },
  };
});

function imageUri(image: ImageSourcePropType): string {
  if (typeof image === 'object' && image !== null && 'uri' in image) {
    return (image as { uri: string }).uri;
  }
  if (Platform.OS === 'web') return String(image);
  return Image.resolveAssetSource(image)?.uri ?? '';
}

function IllustrationImage({ image, label }: { image: ImageSourcePropType; label: string }) {
  const styles = useStyles();

  if (Platform.OS === 'web') {
    const uri = imageUri(image);

    return (
      <img
        src={uri}
        alt={label}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    );
  }

  return (
    <Image
      source={image}
      style={styles.illustrationImage}
      resizeMode="contain"
      accessibilityLabel={label}
      accessible
      accessibilityIgnoresInvertColors
    />
  );
}

export default function OnboardingScreen() {
  const styles = useStyles();
  const theme = useTheme();
  const reduced = useReducedMotion();
  const insets = useSafeAreaInsets();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [zoneHeight, setZoneHeight] = useState(0);
  const finish = useOnboardingStore((state) => state.finish);
  const pressScale = usePressScale(0.98);

  const step = STEPS[index] as Step;
  const isLast = index === STEPS.length - 1;
  const isShort = windowHeight < SHORT_SCREEN_HEIGHT;
  const contentWidth = Math.min(windowWidth - insets.left - insets.right, MAX_CONTENT_WIDTH);
  const targetIllustrationHeight =
    windowHeight * (isShort ? ILLUSTRATION_RATIO_SHORT : ILLUSTRATION_RATIO);
  const illustrationHeight = Math.min(
    targetIllustrationHeight,
    zoneHeight > 0 ? zoneHeight : targetIllustrationHeight,
  );
  const textBlockMinHeight =
    (isShort ? theme.type.displaySmall.lineHeight : theme.type.displayLarge.lineHeight) * 2 +
    theme.space[3] +
    theme.type.bodyMedium.lineHeight * 2;

  const direction = useRef(1);
  const transition = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;
  const dotValues = useRef(
    STEPS.map((_, i) => new Animated.Value(i === 0 ? 1 : 0)),
  ).current;

  useEffect(() => {
    if (reduced) {
      transition.setValue(1);
      return;
    }
    transition.setValue(0);
    Animated.timing(transition, {
      toValue: 1,
      duration: STEP_TRANSITION_MS,
      easing: Easing.out(Easing.ease),
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  }, [index, reduced, transition]);

  useEffect(() => {
    STEPS.forEach(({ image }) => {
      const uri = imageUri(image);
      if (!uri) return;
      if (Platform.OS === 'web') {
        const preload = new window.Image();
        preload.src = uri;
      } else {
        void Image.prefetch(uri).catch(() => {});
      }
    });
  }, []);

  useEffect(() => {
    if (reduced) {
      float.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: FLOAT_DURATION_MS,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: FLOAT_DURATION_MS,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduced, float]);

  useEffect(() => {
    STEPS.forEach((_, i) => {
      const value = dotValues[i];
      if (!value) return;
      const target = i === index ? 1 : 0;
      if (reduced) {
        value.setValue(target);
        return;
      }
      Animated.timing(value, {
        toValue: target,
        duration: DOT_TRANSITION_MS,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    });
  }, [index, reduced, dotValues]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const headline = document.getElementById('onboarding-headline');
    if (headline) headline.style.textWrap = 'balance';
  }, [index]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const previousHtml = document.documentElement.style.backgroundColor;
    const previousBody = document.body.style.backgroundColor;
    document.documentElement.style.backgroundColor = theme.bg;
    document.body.style.backgroundColor = theme.bg;
    return () => {
      document.documentElement.style.backgroundColor = previousHtml;
      document.body.style.backgroundColor = previousBody;
    };
  }, [theme.bg]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const root = document.querySelector('[data-testid="onboarding-root"]');
    const changed: { node: HTMLElement; previous: string }[] = [];
    let node = root?.parentElement ?? null;
    while (node) {
      const current = getComputedStyle(node).backgroundColor;
      if (current !== theme.bg) {
        changed.push({ node, previous: node.style.backgroundColor });
        node.style.backgroundColor = theme.bg;
      }
      node = node.parentElement;
    }
    return () => {
      changed.forEach(({ node: target, previous }) => {
        target.style.backgroundColor = previous;
      });
    };
  }, [theme.bg]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 16 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx <= -SWIPE_THRESHOLD) {
          direction.current = 1;
          transition.setValue(0);
          setIndex((current) => Math.min(current + 1, STEPS.length - 1));
        } else if (gesture.dx >= SWIPE_THRESHOLD) {
          direction.current = -1;
          transition.setValue(0);
          setIndex((current) => Math.max(current - 1, 0));
        }
      },
    }),
  ).current;

  const slideX = transition.interpolate({
    inputRange: [0, 1],
    outputRange: [STEP_SLIDE_PX * direction.current, 0],
  });
  const floatY = float.interpolate({
    inputRange: [0, 1],
    outputRange: [0, FLOAT_OFFSET],
  });

  const complete = async () => {
    await finish();
    go('/(auth)/sign-up', 'replace');
  };

  const enableNotifications = async () => {
    setBusy(true);
    try {
      if (!pushUnavailable() && Platform.OS !== 'web') {
        const Notifications = await import('expo-notifications');
        await Notifications.requestPermissionsAsync();
      }
    } catch {
      // Push is unavailable in Expo Go (SDK 53+); continue onboarding regardless.
    }
    await complete();
  };

  const press = () => {
    if (busy) return;
    if (isLast) {
      void enableNotifications();
      return;
    }
    direction.current = 1;
    transition.setValue(0);
    setIndex(index + 1);
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={styles.root}
      testID="onboarding-root"
    >
      <View style={styles.content} {...panResponder.panHandlers}>
        <View style={styles.topRow}>
          {isLast ? null : (
            <Pressable
              onPress={() => void complete()}
              style={styles.skip}
              accessibilityRole="button"
              accessibilityLabel={t('onboarding.skip')}
              testID="onboarding-skip"
            >
              <Text
                style={styles.skipLabel}
                maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
                testID="onboarding-skip-label"
              >
                {t('onboarding.skip')}
              </Text>
            </Pressable>
          )}
        </View>

        <View
          style={[
            styles.illustrationZone,
            isLast && contentWidth > 0
              ? { width: contentWidth, marginHorizontal: -theme.space[6] }
              : null,
          ]}
          onLayout={(event) => setZoneHeight(event.nativeEvent.layout.height)}
        >
          <Animated.View
            style={[
              styles.illustrationFrame,
              {
                height: illustrationHeight,
                opacity: transition,
                transform: [{ translateX: slideX }, { translateY: floatY }],
              },
            ]}
            testID="onboarding-illustration"
          >
            <IllustrationImage image={step.image} label={t(step.labelKey)} />
          </Animated.View>
        </View>

        <View style={[styles.textBlock, { minHeight: textBlockMinHeight }]}>
          <Text
            nativeID="onboarding-headline"
            style={isShort ? styles.headlineShort : styles.headline}
            maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
            accessibilityRole="header"
            testID="onboarding-headline"
          >
            {t(step.titleKey)}
          </Text>
          <Text
            style={styles.description}
            maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
            testID="onboarding-description"
          >
            {t(step.bodyKey)}
          </Text>
        </View>

        <View
          style={styles.dots}
          accessible
          accessibilityRole="progressbar"
          accessibilityLabel={t('onboarding.progress')}
        >
          {STEPS.map((item, i) => {
            const value = dotValues[i];
            return (
              <Animated.View
                key={item.titleKey}
                testID={`onboarding-dot-${i}`}
                style={[
                  styles.dot,
                  i === index ? styles.dotActive : null,
                  value
                    ? {
                        width: value.interpolate({
                          inputRange: [0, 1],
                          outputRange: [BASE_DOT_WIDTH, ACTIVE_DOT_WIDTH],
                        }),
                      }
                    : { width: BASE_DOT_WIDTH },
                ]}
              />
            );
          })}
        </View>

        <Animated.View style={{ marginBottom: insets.bottom + theme.space[6] }}>
          <Animated.View style={{ transform: [{ scale: pressScale.scale }] }}>
            <Pressable
              onPress={press}
              onPressIn={pressScale.onPressIn}
              onPressOut={pressScale.onPressOut}
              disabled={busy}
              accessibilityRole="button"
              accessibilityLabel={isLast ? t('onboarding.getStarted') : t('onboarding.next')}
              testID="onboarding-forward"
              style={styles.button}
            >
              <Text
                style={styles.buttonLabel}
                maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
                numberOfLines={1}
                testID="onboarding-forward-label"
              >
                {isLast ? t('onboarding.getStarted') : t('onboarding.next')}
              </Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
