import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Animated, Easing, Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { USE_NATIVE_DRIVER, useReducedMotion } from '@/lib/usePressScale';
import { createStyles, useTheme } from '@/theme';

export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  closeLabel: string;
  children: ReactNode;
  testID?: string;
};

const useStyles = createStyles((t) => ({
  backdrop: {
    flex: 1,
    backgroundColor: t.color.overlay,
    justifyContent: 'flex-end',
  },
  backdropTouch: {
    flex: 1,
  },
  sheet: {
    backgroundColor: t.color.surface,
    borderTopLeftRadius: t.radius.container,
    borderTopRightRadius: t.radius.container,
    paddingHorizontal: t.space[5],
    paddingTop: t.space[3],
    gap: t.space[4],
  },
  handleRow: {
    alignItems: 'center',
    paddingBottom: t.space[2],
  },
  handle: {
    width: t.space[8],
    height: t.size.sheetGrab,
    borderRadius: t.radius.full,
    backgroundColor: t.color.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[3],
  },
  title: {
    ...t.type.titleLarge,
    color: t.color.textPrimary,
    flex: 1,
  },
}));

const HIDDEN_OFFSET = 400;

export function BottomSheet({
  visible,
  onClose,
  title,
  closeLabel,
  children,
  testID,
}: BottomSheetProps) {
  const styles = useStyles();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const reduced = useReducedMotion();
  const translateY = useRef(new Animated.Value(HIDDEN_OFFSET)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 1,
          duration: reduced ? 0 : theme.motion.duration.fast,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          speed: 16,
          bounciness: 6,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 0,
          duration: reduced ? 0 : theme.motion.duration.fast,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(translateY, {
          toValue: HIDDEN_OFFSET,
          duration: reduced ? 0 : theme.motion.duration.fast,
          easing: Easing.bezier(0.2, 0, 0, 1),
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
      ]).start();
    }
  }, [backdrop, reduced, theme.motion.duration.fast, translateY, visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.backdrop, { opacity: backdrop }]}>
        <Pressable
          style={styles.backdropTouch}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={closeLabel}
        />
        <Animated.View
          testID={testID}
          style={[
            styles.sheet,
            { paddingBottom: theme.space[5] + insets.bottom, transform: [{ translateY }] },
          ]}
        >
          <View style={styles.handleRow}>
            <View style={styles.handle} />
          </View>
          {title ? (
            <View style={styles.headerRow}>
              <Text
                style={styles.title}
                maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
                accessibilityRole="header"
              >
                {title}
              </Text>
            </View>
          ) : null}
          {children}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
