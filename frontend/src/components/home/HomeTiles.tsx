import { useEffect, useState } from 'react';
import { View, Text, Pressable, Modal, ScrollView, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { AssignmentStatus } from '@rota/contract';
import { useTheme } from '@/theme';
import { font, shadow } from '@/theme/tokens';
import { Avatar } from '@/components';
import { usePressScale } from '@/lib/usePressScale';
import { blurActive } from '@/lib/nav';
import {
  onShiftCaption,
  openShiftsCaption,
  swapsCaption,
  type TileOpenShift,
  type TilePerson,
} from './tileData';

/**
 * HomeTiles — the three live tiles directly under the day strip:
 * who is on shift, what is open to claim, and pending swaps.
 *
 * The row reads real calendar data (`useHome`), never hard-coded people or
 * counts. Colours come from the Home palette (`t.card`, `t.primaryTint`,
 * `t.primary`, `t.border`, `t.ink`, `t.muted`, `t.primaryText`), so light,
 * dark and sage each get their own tile treatment.
 */

const STATUS_LABEL: Record<AssignmentStatus, string> = {
  accepted: 'Accepted',
  pending: 'Pending',
  declined: 'Declined',
};

type SheetKind = 'people' | 'open';

export function HomeTiles({
  people,
  openShifts,
  pendingSwaps,
  dayLabel,
  isAdmin,
  loading,
  onClaim,
  onAssign,
  onOpenSwaps,
}: {
  people: TilePerson[];
  openShifts: TileOpenShift[];
  pendingSwaps: number;
  /** Selected day's short weekday, e.g. "Sun" — the tile copy follows it. */
  dayLabel: string;
  isAdmin: boolean;
  loading: boolean;
  onClaim: (shiftId: string) => void;
  onAssign: () => void;
  onOpenSwaps: () => void;
}) {
  const t = useTheme();
  const [sheet, setSheet] = useState<SheetKind | null>(null);

  if (loading) {
    return (
      <View style={rowStyle} testID="home-tiles">
        <SkeletonTile testID="home-tile-on-shift" />
        <SkeletonTile testID="home-tile-open-shifts" />
        <SkeletonTile testID="home-tile-swaps" />
      </View>
    );
  }

  return (
    <>
      <View style={rowStyle} testID="home-tiles">
        <Tile
          testID="home-tile-on-shift"
          icon="users"
          title="On shift"
          caption={onShiftCaption(people.length, dayLabel)}
          onPress={() => {
            blurActive();
            setSheet('people');
          }}
        />
        <Tile
          testID="home-tile-open-shifts"
          icon="unlock"
          title="Open shifts"
          caption={openShiftsCaption(openShifts.length)}
          onPress={() => {
            blurActive();
            setSheet('open');
          }}
        />
        <Tile
          testID="home-tile-swaps"
          icon="repeat"
          title="Swaps"
          caption={swapsCaption(pendingSwaps)}
          emphasis={pendingSwaps > 0}
          onPress={onOpenSwaps}
        />
      </View>

      {sheet === 'people' ? (
        <Sheet
          onClose={() => setSheet(null)}
          testID="home-people-sheet"
          title="On shift"
          subtitle={onShiftCaption(people.length, dayLabel)}
        >
          {people.length === 0 ? (
            <Empty text="Nobody is on shift this day." />
          ) : (
            people.map((person) => (
              <View key={person.key} style={personRowStyle} testID={`home-person-${person.id ?? person.key}`}>
                <Avatar name={person.name} size="sm" />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={nameStyle(t)} numberOfLines={1}>{person.name}</Text>
                  <Text style={timeStyle(t)} numberOfLines={1}>{person.time}</Text>
                </View>
                <StatusChip status={person.status} />
              </View>
            ))
          )}
        </Sheet>
      ) : null}

      {sheet === 'open' ? (
        <Sheet
          onClose={() => setSheet(null)}
          testID="home-open-sheet"
          title="Open shifts"
          subtitle={openShiftsCaption(openShifts.length)}
        >
          {openShifts.length === 0 ? (
            <Empty text="Nothing open this week." />
          ) : (
            openShifts.map((shift) => (
              <View key={shift.id} style={openRowStyle(t)} testID={`home-open-${shift.id}`}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={nameStyle(t)} numberOfLines={1}>{shift.title}</Text>
                  <Text style={timeStyle(t)} numberOfLines={1}>{shift.time}</Text>
                </View>
                <Pressable
                  accessibilityLabel={isAdmin ? `Assign ${shift.title}` : `Claim ${shift.title}`}
                  testID={`home-open-action-${shift.id}`}
                  onPress={() => {
                    setSheet(null);
                    blurActive();
                    if (isAdmin) onAssign();
                    else onClaim(shift.id);
                  }}
                  style={actionStyle(t)}
                >
                  <Text style={actionTextStyle}>{isAdmin ? 'Assign' : 'Claim shift'}</Text>
                </Pressable>
              </View>
            ))
          )}
        </Sheet>
      ) : null}
    </>
  );
}

function Tile({
  testID,
  icon,
  title,
  caption,
  emphasis,
  onPress,
}: {
  testID: string;
  icon: 'users' | 'unlock' | 'repeat';
  title: string;
  caption: string;
  emphasis?: boolean;
  onPress: () => void;
}) {
  const t = useTheme();
  const { scale, onPressIn, onPressOut } = usePressScale(0.98);
  return (
    <Animated.View style={{ flex: 1, transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${title}, ${caption}`}
        testID={testID}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={tileStyle(t)}
      >
        <View style={[iconCircleStyle, { backgroundColor: t.primaryTint }]}>
          <Feather name={icon} size={16} color={t.primaryText} />
        </View>
        <Text style={titleStyle(t)} numberOfLines={1}>{title}</Text>
        <Text style={emphasis ? captionStrongStyle(t) : captionStyle(t)} numberOfLines={1} ellipsizeMode="tail">
          {caption}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

function SkeletonTile({ testID }: { testID: string }) {
  const t = useTheme();
  return (
    <View style={tileStyle(t)} testID={testID} accessibilityElementsHidden>
      <View style={[iconCircleStyle, { backgroundColor: t.primaryTint }]} />
      <View style={{ width: '70%', height: 10, borderRadius: 5, backgroundColor: t.more, marginTop: 4 }} />
      <View style={{ width: '45%', height: 9, borderRadius: 5, backgroundColor: t.more, marginTop: 6 }} />
    </View>
  );
}

function StatusChip({ status }: { status: AssignmentStatus }) {
  const t = useTheme();
  const palette: Record<AssignmentStatus, { bg: string; fg: string }> = {
    accepted: { bg: t.chip, fg: t.green },
    pending: { bg: t.amberTint, fg: t.amber },
    declined: { bg: t.dangerTint, fg: t.danger },
  };
  const { bg, fg } = palette[status];
  return (
    <View style={{ backgroundColor: bg, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
      <Text style={{ fontFamily: font.semi, fontSize: 12, color: fg }}>{STATUS_LABEL[status]}</Text>
    </View>
  );
}

function Sheet({
  title,
  subtitle,
  testID,
  onClose,
  children,
}: {
  title: string;
  subtitle: string;
  testID: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const t = useTheme();
  useEffect(() => {
    blurActive();
  }, []);
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' }}>
        <Pressable
          onPress={onClose}
          accessibilityLabel="Close"
          testID="home-sheet-backdrop"
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        />
        <View
          testID={testID}
          style={{
            backgroundColor: t.card,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            padding: 20,
            paddingBottom: 32,
            gap: 12,
            maxHeight: '80%',
            ...shadow(10, 30, 'rgba(47,36,32,0.18)'),
          }}
        >
          <View style={{ gap: 2 }}>
            <Text style={{ fontFamily: font.black, fontSize: 18, color: t.ink }}>{title}</Text>
            <Text style={{ fontFamily: font.semi, fontSize: 13, color: t.muted }}>{subtitle}</Text>
          </View>
          <ScrollView style={{ flexGrow: 0 }} contentContainerStyle={{ gap: 8 }}>
            {children}
          </ScrollView>
          <Pressable
            onPress={onClose}
            accessibilityLabel="Close"
            style={{ height: 48, borderRadius: 24, backgroundColor: t.chip, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ fontFamily: font.bold, fontSize: 15, color: t.ink }}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function Empty({ text }: { text: string }) {
  const t = useTheme();
  return <Text style={{ fontFamily: font.regular, fontSize: 14, color: t.muted, paddingVertical: 12 }}>{text}</Text>;
}

const rowStyle = { flexDirection: 'row' as const, gap: 12, marginTop: 16 };
const iconCircleStyle = {
  width: 32,
  height: 32,
  borderRadius: 16,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  marginBottom: 8,
};
const personRowStyle = { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 12, paddingVertical: 6 };
const actionTextStyle = { fontFamily: font.bold, fontSize: 13, color: '#FFFFFF' };

type Theme = ReturnType<typeof useTheme>;

function tileStyle(t: Theme) {
  return {
    flex: 1,
    height: 96,
    borderRadius: 20,
    padding: 12,
    backgroundColor: t.card,
    justifyContent: 'center' as const,
    overflow: 'hidden' as const,
    ...(t.mode === 'dark' ? { borderWidth: 1, borderColor: t.border } : {}),
    ...shadow(6, 18, 'rgba(47,36,32,0.06)'),
  };
}

function openRowStyle(t: Theme) {
  return {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: t.hairline,
  };
}

function nameStyle(t: Theme) {
  return { fontFamily: font.semi, fontSize: 14, color: t.ink };
}

function timeStyle(t: Theme) {
  return { fontFamily: font.regular, fontSize: 12, color: t.muted };
}

function titleStyle(t: Theme) {
  return { fontFamily: font.bold, fontSize: 13, lineHeight: 16, color: t.ink };
}

function captionStyle(t: Theme) {
  return { fontFamily: font.semi, fontSize: 12, lineHeight: 15, color: t.muted };
}

function captionStrongStyle(t: Theme) {
  return { fontFamily: font.bold, fontSize: 12, lineHeight: 15, color: t.primaryText };
}

function actionStyle(t: Theme) {
  return {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: t.primaryText,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };
}
