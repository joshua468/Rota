import { Linking, Pressable, Text, View, type ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { font } from '@/theme/tokens';
import { progressOf, type CardData } from './cardData';
import { Avatar } from '@/components/Avatar';
import { placeIcon, type Place } from '@/lib/shifts/place';

const SAGE_ZOOM_PILL_BG = '#DCEBFA';
const SAGE_ZOOM_PILL_FG = '#2F6FB5';
const SAGE_PLACE_PILL_BG = '#EBDDFB';
const SAGE_PLACE_PILL_FG = '#7B3FC4';
const DARK_PILL_BG = '#1F2638';
const DARK_PILL_ICON = '#A78BFA';

const sh = (y: number, blur: number, color: string): ViewStyle => ({ boxShadow: `0px ${y}px ${blur}px ${color}` });

/** Relative luminance of a #rrggbb colour (WCAG). */
function luminance(hex: string): number {
  const h = hex.replace('#', '');
  const channel = (value: number) => {
    const c = value / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const r = channel(parseInt(h.slice(0, 2), 16));
  const g = channel(parseInt(h.slice(2, 4), 16));
  const b = channel(parseInt(h.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** The label colour that stays readable on `fill`. */
function inkOn(fill: string, dark: string, light: string): string {
  return luminance(fill) > 0.4 ? dark : light;
}

/** The same colour, see-through. */
function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

type AvatarPerson = { name: string; photo?: string | null };

function PeopleRow({
  people,
  ring,
  mine,
  ink,
}: {
  people: AvatarPerson[];
  ring: string;
  mine: boolean;
  ink: string;
}) {
  const t = useTheme();
  if (people.length === 0) {
    return (
      <Text numberOfLines={1} style={{ flexShrink: 1, fontFamily: font.semi, fontSize: 13, color: mine ? withAlpha(ink, 0.8) : t.muted }}>
        Unassigned
      </Text>
    );
  }
  const names = people.map((p) => p.name);
  const label =
    names.length <= 2 ? names.join(' & ') : `${names[0]}, ${names[1]} +${names.length - 2}`;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 }}>
      <View style={{ flexDirection: 'row' }}>
        {people.slice(0, 3).map((p, i) => (
          <View
            key={p.name + i}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: ring,
              marginLeft: i === 0 ? 0 : -10,
              overflow: 'hidden',
            }}
          >
            <Avatar
              name={p.name}
              photo={p.photo}
              size="sm"
              style={{ width: 32, height: 32, borderRadius: 16 }}
            />
          </View>
        ))}
      </View>
      <Text numberOfLines={1} style={{ flexShrink: 1, fontFamily: font.semi, fontSize: 13, color: mine ? ink : t.ink }}>
        {label}
      </Text>
    </View>
  );
}

function PlacePill({
  place,
  mine,
  dark,
  sage,
  joinLive,
  ink,
}: {
  place: Place;
  mine: boolean;
  dark: boolean;
  sage: boolean;
  joinLive: boolean;
  ink: string;
}) {
  const t = useTheme();

  let bg: string;
  let fg: string;
  let icon: string;
  let label = place.label;
  let external = false;

  if (joinLive) {
    bg = t.primaryText;
    fg = '#FFFFFF';
    icon = '#FFFFFF';
    label = `Join ${place.label}`;
  } else if (mine) {
    bg = withAlpha('#FFFFFF', 0.55);
    fg = ink;
    icon = ink;
    external = !!place.url;
  } else if (sage) {
    const isPlace = place.kind === 'place';
    bg = isPlace ? SAGE_PLACE_PILL_BG : SAGE_ZOOM_PILL_BG;
    fg = isPlace ? SAGE_PLACE_PILL_FG : SAGE_ZOOM_PILL_FG;
    icon = fg;
    external = !!place.url;
  } else if (dark) {
    bg = DARK_PILL_BG;
    fg = t.ink;
    icon = DARK_PILL_ICON;
    external = !!place.url;
  } else {
    bg = '#FFFFFF';
    fg = t.ink;
    icon = t.primaryText;
    external = !!place.url;
  }

  const content = (
    <>
      <Feather name={placeIcon(place)} size={14} color={icon} />
      <Text numberOfLines={1} style={{ flexShrink: 1, fontFamily: font.semi, fontSize: 12, color: fg }}>
        {label}
      </Text>
      {external ? <Feather name="external-link" size={12} color={fg} /> : null}
    </>
  );

  const base: ViewStyle = {
    height: 28,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: bg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: '55%',
  };

  if (place.url) {
    return (
      <Pressable
        onPress={(e) => {
          e.stopPropagation?.();
          void Linking.openURL(place.url as string);
        }}
        accessibilityLabel={`Join ${place.label} call`}
        accessibilityRole="button"
        testID="shift-pill"
        hitSlop={8}
        style={base}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View testID="shift-pill" style={base}>
      {content}
    </View>
  );
}

export function ShiftCard({
  c,
  onPress,
  onMenu,
  onClaim,
}: {
  c: CardData;
  onPress: () => void;
  onMenu: () => void;
  onClaim: () => void;
}) {
  const t = useTheme();
  const mine = c.variant === 'mine';
  const team = c.variant === 'team';
  const open = c.variant === 'open';
  const dark = t.name === 'dark';
  const sage = t.name === 'sage';
  const twoCol = dark || sage;

  const bg = mine ? t.primarySoft : team ? t.primaryTint : t.card;
  /* The label colour follows the card fill: the light "mine" card needs dark
     ink, the deep dark/sage cards keep white. */
  const mineInk = inkOn(t.primarySoft, t.ink, '#FFFFFF');
  const titleColor = mine ? mineInk : t.ink;
  const subColor = mine ? withAlpha(mineInk, 0.78) : t.muted;
  const chipBg = mine ? '#FFFFFF' : team ? (dark ? t.more : '#FFFFFF') : t.chip;
  const chipFg = mine ? t.primaryText : team ? (dark ? t.ink : t.primaryText) : t.muted;

  const joinLive = !!c.now && !!c.location?.url;

  const border: ViewStyle | null = dark ? { borderWidth: 1, borderColor: t.border } : null;
  const shadowStyle = mine
    ? sh(12, 24, withAlpha(t.primarySoft, 0.35))
    : dark
      ? null
      : sh(6, 18, 'rgba(47,36,32,0.06)');

  const container: ViewStyle[] = [
    {
      backgroundColor: bg,
      borderRadius: sage ? 20 : 24,
      padding: 16,
      minHeight: sage ? 132 : 160,
      marginBottom: 12,
    },
    ...(shadowStyle ? [shadowStyle] : []),
    ...(border ? [border] : []),
  ];

  const progress = progressOf(c.start, c.end, Date.now());
  const { hour: hh, minute: mm, meridiem: ap } = c.timeParts;

  const openMenu = (e: { stopPropagation?: () => void }) => {
    e.stopPropagation?.();
    onMenu();
  };

  const menuButton = (
    <Pressable
      onPress={openMenu}
      accessibilityLabel="Shift options"
      testID="shift-menu"
      style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginRight: -12 }}
    >
      <Feather name="more-horizontal" size={20} color={mine ? mineInk : t.muted} />
    </Pressable>
  );

  const star = (
    <Pressable
      onPress={openMenu}
      accessibilityLabel="Shift options"
      testID="shift-menu"
      style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginRight: -12 }}
    >
      <Feather name="star" size={20} color={mineInk} />
    </Pressable>
  );

  const bottomRow = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'auto',
        paddingTop: 12,
      }}
    >
      <PeopleRow people={c.people} ring={bg} mine={mine} ink={mineInk} />
      {open ? (
        <Pressable
          onPress={(e) => { e.stopPropagation?.(); onClaim(); }}
          accessibilityLabel="Claim shift"
          testID="shift-claim"
          style={{
            height: 28,
            paddingHorizontal: 14,
            borderRadius: 14,
            backgroundColor: t.primaryText,
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontFamily: font.bold, fontSize: 12, color: '#FFFFFF' }}>Claim shift</Text>
        </Pressable>
      ) : c.location ? (
        <PlacePill place={c.location} mine={mine} dark={dark} sage={sage} joinLive={joinLive} ink={mineInk} />
      ) : null}
    </View>
  );

  const badges = (
    <>
      {c.conflict ? (
        <View style={{ height: 24, paddingHorizontal: 8, borderRadius: 12, backgroundColor: t.dangerTint, justifyContent: 'center' }}>
          <Text style={{ fontFamily: font.bold, fontSize: 12, color: t.danger }}>Conflict</Text>
        </View>
      ) : null}
      {c.swapPending ? (
        <View style={{ height: 24, paddingHorizontal: 8, borderRadius: 12, backgroundColor: t.amberTint, justifyContent: 'center' }}>
          <Text style={{ fontFamily: font.bold, fontSize: 12, color: t.amber }}>Swap pending</Text>
        </View>
      ) : null}
    </>
  );

  return (
    <View style={container} testID={`shift-card-${c.variant}`}>
      {open ? (
        <View
          testID="shift-open-border"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderWidth: 1.5,
            borderStyle: 'dashed',
            borderColor: t.primaryText,
            borderRadius: sage ? 20 : 24,
            pointerEvents: 'none',
          }}
        />
      ) : null}
      <Pressable
        onPress={onPress}
        accessibilityLabel={[
          c.title,
          c.time,
          c.people.length ? c.people.map((p) => p.name).join(', ') : 'Unassigned',
        ].join('. ')}
        style={{ flex: 1 }}
      >
        {twoCol ? (
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View
              testID="shift-time-col"
              style={{
                alignItems: 'center',
                paddingRight: 14,
                marginRight: 14,
                borderRightWidth: sage ? 1 : 0,
                borderRightColor: t.hairline,
              }}
            >
              <Text style={{ fontFamily: font.black, fontSize: 20, color: titleColor }}>{hh}</Text>
              <Text style={{ fontFamily: font.semi, fontSize: 12, color: subColor }}>{`${mm} ${ap}`}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Text numberOfLines={1} style={{ flexShrink: 1, fontFamily: font.black, fontSize: 18, lineHeight: 24, color: titleColor }}>
                  {c.title}
                </Text>
                {mine ? star : menuButton}
              </View>
              {c.subtitle ? (
                <Text numberOfLines={1} style={{ fontFamily: font.regular, fontSize: 13, lineHeight: 18, color: subColor, marginTop: 4 }}>
                  {c.subtitle}
                </Text>
              ) : null}
              {badges}
              {bottomRow}
            </View>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 }}>
                <View style={{ height: 28, paddingHorizontal: 12, borderRadius: 14, backgroundColor: chipBg, justifyContent: 'center' }}>
                  <Text style={{ fontFamily: font.bold, fontSize: 12, color: chipFg }}>{c.time}</Text>
                </View>
                {mine && !!c.duration ? (
                  <Text style={{ fontFamily: font.semi, fontSize: 12, color: subColor }}>{c.duration}</Text>
                ) : null}
                {c.past ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }} testID="shift-ended">
                    <Feather name="check" size={12} color={mine ? subColor : t.muted} />
                    <Text style={{ fontFamily: font.semi, fontSize: 12, color: mine ? subColor : t.muted }}>
                      Ended
                    </Text>
                  </View>
                ) : null}
                {c.now ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: t.green }} />
                    <Text style={{ fontFamily: font.bold, fontSize: 12, color: mine ? mineInk : t.green }}>Now</Text>
                  </View>
                ) : null}
                {badges}
              </View>
              {mine ? star : menuButton}
            </View>

            <Text numberOfLines={1} style={{ fontFamily: font.black, fontSize: 18, lineHeight: 24, color: titleColor, marginTop: 12 }}>
              {c.title}
            </Text>
            {c.subtitle ? (
              <Text numberOfLines={1} style={{ fontFamily: font.regular, fontSize: 13, lineHeight: 18, color: subColor, marginTop: 4 }}>
                {c.subtitle}
              </Text>
            ) : null}

            {bottomRow}
          </View>
        )}
      </Pressable>

      {c.now ? (
        <View style={{ position: 'absolute', left: 16, right: 16, bottom: 0, height: 3, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.08)' }}>
          <View style={{ width: `${progress * 100}%`, height: 3, borderRadius: 2, backgroundColor: mine ? mineInk : t.primaryText }} />
        </View>
      ) : null}
    </View>
  );
}
