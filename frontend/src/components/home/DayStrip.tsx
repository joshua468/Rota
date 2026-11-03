import { useRef } from 'react';
import { Animated, Easing, PanResponder, Pressable, Text, View } from 'react-native';
import { useTheme } from '@/theme';
import { font, shadow } from '@/theme/tokens';
import { USE_NATIVE_DRIVER, useReducedMotion } from '@/lib/usePressScale';
import { addDays, sameDay, weekdayShort } from './dates';

export function DayStrip({ selected, onSelect, hasShift }:
 { selected: Date; onSelect: (d: Date) => void; hasShift: (d: Date) => boolean }) {
  const t = useTheme();
  const dark = t.mode === 'dark';
  const reduced = useReducedMotion();
  const slide = useRef(new Animated.Value(0)).current;
  const days = [-2, -1, 0, 1, 2].map((n) => addDays(selected, n));

  const shiftWindow = (delta: number) => {
    const next = addDays(selected, delta);
    if (reduced) {
      onSelect(next);
      return;
    }
    Animated.timing(slide, {
      toValue: delta * 72,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start(() => {
      onSelect(next);
      slide.setValue(-delta * 72);
      Animated.timing(slide, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start();
    });
  };

  const handler = useRef(shiftWindow);
  handler.current = shiftWindow;
  const pan = useRef(PanResponder.create({
    // Claim the gesture in the capture phase as soon as it looks horizontal, so
    // the scroll view (and the browser's own back gesture) never wins it.
    onMoveShouldSetPanResponderCapture: (_, g) => Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy),
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 12 && Math.abs(g.dy) < 20,
    onPanResponderRelease: (_, g) => {
      if (g.dx < -30) handler.current(1);
      else if (g.dx > 30) handler.current(-1);
    },
  })).current;

  return (
    <View testID="day-strip" {...pan.panHandlers} style={{ marginTop: 24, height: 76, borderRadius: 20, overflow: 'hidden' }}>
      <Animated.View style={{ flexDirection: 'row', height: 76, transform: [{ translateX: slide }], borderRadius: 20, overflow: 'hidden' }}>
        {days.map((d) => {
          const sel = sameDay(d, selected);
          const has = hasShift(d);
          return (
            <Pressable key={d.toISOString()} onPress={() => onSelect(d)}
              accessibilityLabel={weekdayShort(d)}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 20, overflow: 'hidden' }}>
              {dark ? (
                <View style={{ alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 20, overflow: 'hidden' }}>
                  <Text
                    style={{ fontFamily: font.bold, fontSize: 12, letterSpacing: 0.5, color: t.primary }}>
                    {weekdayShort(d)}
                  </Text>
                  <View style={[{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
                    backgroundColor: sel ? t.primary : 'transparent', overflow: 'hidden' }]}>
                    <Text style={{ fontFamily: font.black, fontSize: 20, color: sel ? '#FFFFFF' : t.muted }}>
                      {d.getDate()}
                    </Text>
                  </View>
                </View>
              ) : (
                <View
                  style={[{ width: 56, height: 76, borderRadius: 20, alignItems: 'center', justifyContent: 'center', gap: 8,
                    backgroundColor: sel ? t.primary : 'transparent', overflow: 'hidden' }]}>
                  <Text style={{ fontFamily: font.bold, fontSize: 12, letterSpacing: 0.5, color: sel ? '#FFFFFF' : t.muted }}>
                    {weekdayShort(d)}
                  </Text>
                  <Text style={{ fontFamily: font.black, fontSize: sel ? 22 : 20, color: sel ? '#FFFFFF' : t.muted }}>
                    {d.getDate()}
                  </Text>
                </View>
              )}
              {has && (
                <View style={{ position: 'absolute', bottom: 8, width: 4, height: 4, borderRadius: 2,
                  backgroundColor: sel ? '#FFFFFF' : t.primary }} />
              )}
            </Pressable>
          );
        })}
      </Animated.View>
    </View>
  );
}
