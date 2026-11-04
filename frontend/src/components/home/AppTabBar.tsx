import { Feather } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { font } from '@/theme/tokens';
import { blurActive } from '@/lib/nav';

const TABS = [
  { name: 'index', label: 'Home', icon: 'home' },
  { name: 'swap/index', label: 'Swaps', icon: 'repeat' },
  { name: 'activity', label: 'Activity', icon: 'activity' },
  { name: 'settings', label: 'Settings', icon: 'settings' },
] as const;

export const TAB_BAR_HEIGHT = 64;
/** Floating pill: inset from the screen edges on every side. */
export const TAB_BAR_SIDE = 16;
export const TAB_BAR_BOTTOM = 12;
/** Detail screens keep their last row clear of the floating bar. */
export const TAB_BAR_CLEARANCE = TAB_BAR_BOTTOM + TAB_BAR_HEIGHT + 24;

const INACTIVE_ICON = '#A59B96';
const BAR_RADIUS = 28;

type TabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigateToTab: (routeKey: string) => void;
  pendingSwaps?: number;
};

export function AppTabBar({ state, navigateToTab, pendingSwaps = 0 }: TabBarProps) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const activeName = state.routes[state.index]?.name;
  const dark = t.mode === 'dark';
  const glass = dark ? 'rgba(22,28,48,0.55)' : 'rgba(255,255,255,0.6)';
  const glassBorder = dark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.7)';

  return (
    /**
     * The bar is absolutely positioned against the full-screen tab container,
     * which on Android rides underneath the transparent system navigation bar
     * (edge-to-edge). React Navigation does not pad a custom tab bar, so the
     * pill has to clear that inset itself: `TAB_BAR_BOTTOM` above the bottom
     * safe-area edge. With the inset at 0 the pill's lower half is painted
     * under the system bar and the labels look cut off.
     */
    <View
      testID="tab-bar"
      style={{
        position: 'absolute',
        left: TAB_BAR_SIDE,
        right: TAB_BAR_SIDE,
        bottom: TAB_BAR_BOTTOM + insets.bottom,
        height: TAB_BAR_HEIGHT,
        borderRadius: BAR_RADIUS,
        overflow: 'hidden',
        pointerEvents: 'box-none',
        boxShadow: dark
          ? '0px 12px 40px rgba(0,0,0,0.5)'
          : '0px 12px 32px rgba(47,36,32,0.18)',
      }}
    >
      {/*
        The frosted surface must fill the pill. It is a background layer, so it
        is absolutely positioned on every platform; as a `flex: 1` sibling of
        the tabs row it would claim half the height and clip the labels.

        On Android the dimezis blur methods need an explicit `blurTarget` view
        to sample. This bar floats over content that lives outside its subtree,
        so there is nothing to target: selecting a method only logs a warning
        and falls back to "none". Android therefore paints the translucent
        glass directly. iOS keeps the real blur.
      */}
      {Platform.OS === 'android' ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: glass,
              borderWidth: 1,
              borderColor: glassBorder,
              borderRadius: BAR_RADIUS,
              overflow: 'hidden',
            },
          ]}
        />
      ) : (
        <BlurView
          intensity={dark ? 40 : 70}
          tint={dark ? 'dark' : 'light'}
          style={[StyleSheet.absoluteFill, { borderRadius: BAR_RADIUS, overflow: 'hidden' }]}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: glass,
              borderWidth: 1,
              borderColor: glassBorder,
              borderRadius: BAR_RADIUS,
              overflow: 'hidden',
            }}
          />
        </BlurView>
      )}

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          paddingHorizontal: 6,
          borderRadius: BAR_RADIUS,
          overflow: 'hidden',
        }}
      >
        {TABS.map((tab) => {
          const active = activeName === tab.name;
          return (
            <Pressable
              key={tab.name}
              onPress={() => {
                blurActive();
                const route = state.routes.find((entry) => entry.name === tab.name);
                if (route) navigateToTab(route.key);
              }}
              accessibilityLabel={tab.label}
              accessibilityRole="button"
              testID={`tab-${tab.name.replace('/', '-')}`}
              style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                borderRadius: BAR_RADIUS,
              }}
            >
              <View
                style={{
                  width: 42,
                  height: 30,
                  borderRadius: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: active ? t.primaryTint : 'transparent',
                  overflow: 'hidden',
                }}
              >
                <Feather name={tab.icon} size={22} color={active ? t.primaryText : INACTIVE_ICON} />
                {tab.name === 'swap/index' && pendingSwaps > 0 ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: -6,
                      right: -3,
                      minWidth: 17,
                      height: 17,
                      borderRadius: 9,
                      paddingHorizontal: 4,
                      backgroundColor: t.primaryText,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontFamily: font.bold, fontSize: 12, color: '#FFFFFF' }}>
                      {pendingSwaps > 9 ? '9+' : pendingSwaps}
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: active ? font.bold : font.semi,
                  fontSize: 12,
                  color: active ? t.primaryText : t.muted,
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
