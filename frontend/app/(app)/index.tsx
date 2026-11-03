import { useState, useMemo, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { useTheme } from '@/theme';
import { font, shadow } from '@/theme/tokens';

import { Header } from '@/components/home/Header';
import { DayStrip } from '@/components/home/DayStrip';
import { HomeTiles } from '@/components/home/HomeTiles';
import { SectionLabel } from '@/components/home/SectionLabel';
import { ShiftCard } from '@/components/home/ShiftCard';
import { FAB } from '@/components/home/FAB';
import { AssignSheet } from '@/components/home/AssignSheet';
import { formatCardDuration, formatCardTimeRange, type CardData } from '@/components/home/cardData';
import { placeIcon } from '@/lib/shifts/place';
import { useHomeData, SEED } from '@/components/home/useHome';
import { DEMO_SELF, DEMO_TEAM } from '@/lib/demo';
import { useSessionStore } from '@/stores/session';
import { useDeleteShift } from '@/api/queries';
import { dateFromDayKey, useHomeStore } from '@/stores/home';
import { dayKey } from '@/lib/rota';
import { blurActive, go } from '@/lib/nav';
import { Avatar, Skeleton } from '@/components';
import { dayViewMode } from '@/components/home/dayView';
import { formatHeaderDate, formatWeekday } from '@/lib/format';
import { TAB_BAR_BOTTOM, TAB_BAR_HEIGHT } from '@/components/home/AppTabBar';
import { t } from '@/i18n';
import { ROLE_KEYS } from '@/lib/rota';
import type { Role } from '@rota/contract';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}/i;

export default function Home() {
  const t = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const status = useSessionStore((state) => state.status);
  useEffect(() => {
    if (SEED) {
      const st = useSessionStore.getState();
      if (st.status !== 'signedIn' || st.user?.id !== DEMO_SELF.id) {
        useSessionStore.setState({ status: 'signedIn', user: DEMO_SELF, team: DEMO_TEAM, identityResolved: true, accessToken: 'seed' });
      }
    }
  }, []);

  // The selected day lives in a store, not in screen state: a remount (a back
  // gesture, a reload) must not throw the user back on today.
  const selectedDay = useHomeStore((state) => state.dayKey);
  const date = useMemo(() => dateFromDayKey(selectedDay), [selectedDay]);
  const setDate = useCallback((next: Date) => {
    useHomeStore.getState().setDay(dayKey(next));
  }, []);
  const home = useHomeData(date);
  const deleteShift = useDeleteShift();
  const [monthOpen, setMonthOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [detail, setDetail] = useState<CardData | null>(null);
  const [menu, setMenu] = useState<CardData | null>(null);
  const [claimed, setClaimed] = useState<Record<string, true>>({});
  const [removed, setRemoved] = useState<Record<string, true>>({});
  const [loadErrorDismissed, setLoadErrorDismissed] = useState(false);

  const cards = useMemo(
    () =>
      home.cards
        .filter((c) => !removed[c.id])
        .map((c) =>
          claimed[c.id] && c.variant === 'open'
            ? {
                ...c,
                variant: 'mine' as const,
                people: [{ name: 'You' }, ...c.people],
                duration: c.duration ?? formatCardDuration(c.start, c.end),
              }
            : c,
        ),
    [home.cards, claimed, removed],
  );

  const groups = useMemo(
    () =>
      (['morning', 'afternoon', 'evening'] as const)
        .map((k) => ({ k, items: cards.filter((c) => c.group === k) }))
        .filter((g) => g.items.length),
    [cards],
  );

  const mode = dayViewMode({
    isLoading: home.isLoading,
    isError: home.isError,
    hasGroups: groups.length > 0,
  });

  const onClaim = useCallback((c: CardData) => {
    setClaimed((prev) => ({ ...prev, [c.id]: true }));
  }, []);

  /** A shift claimed or deleted this session leaves the tile's count too. */
  const tileOpenShifts = useMemo(
    () => home.openShifts.filter((s) => !claimed[s.id] && !removed[s.id]),
    [home.openShifts, claimed, removed],
  );

  const onClaimId = useCallback((id: string) => {
    setClaimed((prev) => ({ ...prev, [id]: true }));
  }, []);

  const onDelete = useCallback(
    (c: CardData) => {
      setMenu(null);
      if (!SEED && UUID.test(c.id)) {
        deleteShift.mutate(c.id);
      } else {
        setRemoved((prev) => ({ ...prev, [c.id]: true }));
      }
    },
    [deleteShift],
  );

  const tabH = bottom + TAB_BAR_BOTTOM + TAB_BAR_HEIGHT;

  if (!SEED && status !== 'signedIn') {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={home.isRefetching} onRefresh={() => void home.refetch()} />}
        contentContainerStyle={{ paddingTop: top + 16, paddingHorizontal: 20, paddingBottom: tabH + 24 + 72, flexGrow: 1 }}
      >
        <Header
          date={date}
          unread={home.unread}
          onBell={() => {
            blurActive();
            go('/settings/notifications');
          }}
          onTitle={() => {
            blurActive();
            setMonthOpen(true);
          }}
        />
        <DayStrip selected={date} onSelect={setDate} hasShift={home.hasShift} />
        <HomeTiles
          people={home.people}
          openShifts={tileOpenShifts}
          pendingSwaps={home.pendingSwapCount}
          dayLabel={formatWeekday(date)}
          isAdmin={home.isAdmin}
          loading={home.isLoading}
          onClaim={onClaimId}
          onAssign={() => {
            blurActive();
            setAssignOpen(true);
          }}
          onOpenSwaps={() => {
            blurActive();
            go('/swap');
          }}
        />
        {home.isError && !loadErrorDismissed ? (
          <View
            testID="home-load-error"
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: t.dangerTint,
              borderRadius: 16,
              padding: 12,
              marginTop: 16,
            }}
          >
            <Feather name="alert-circle" size={18} color={t.danger} />
            <Text style={{ flex: 1, fontFamily: font.semi, fontSize: 13, color: t.danger }}>
              Couldn&apos;t load your shifts.
            </Text>
            <Pressable
              onPress={() => void home.refetch()}
              accessibilityLabel="Retry"
              testID="home-load-retry"
              style={{ height: 32, paddingHorizontal: 12, borderRadius: 16, backgroundColor: t.card, justifyContent: 'center' }}
            >
              <Text style={{ fontFamily: font.bold, fontSize: 13, color: t.danger }}>Retry</Text>
            </Pressable>
            <Pressable
              onPress={() => setLoadErrorDismissed(true)}
              accessibilityLabel="Dismiss"
              testID="home-load-dismiss"
              hitSlop={8}
            >
              <Feather name="x" size={16} color={t.danger} />
            </Pressable>
          </View>
        ) : null}
        {mode === 'loading' ? (
          <DayListSkeleton />
        ) : mode === 'empty' ? (
          <EmptyDay
            date={date}
            isAdmin={home.isAdmin}
            hasNext={home.nextShiftDay != null}
            onJump={() => home.nextShiftDay && setDate(home.nextShiftDay)}
            onAdd={() => {
              blurActive();
              setAssignOpen(true);
            }}
          />
        ) : mode === 'list' ? (
          <>
            {groups.map((g, gi) => (
              <View key={g.k}>
                <SectionLabel kind={g.k} first={gi === 0} />
                {g.items.map((c) => (
                  <ShiftCard
                    key={c.id}
                    c={c}
                    onPress={() => {
                      blurActive();
                      setDetail(c);
                    }}
                    onMenu={() => {
                      blurActive();
                      setMenu(c);
                    }}
                    onClaim={() => onClaim(c)}
                  />
                ))}
              </View>
            ))}
            {home.dataUpdatedAt ? (
              <Text
                testID="home-last-updated"
                style={{
                  fontFamily: font.regular,
                  fontSize: 12,
                  color: t.muted,
                  textAlign: 'center',
                  marginTop: 16,
                }}
              >
                {`Last updated ${new Date(home.dataUpdatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })}`}
              </Text>
            ) : null}
          </>
        ) : null}
      </ScrollView>

      <FAB label="Assign shift" bottom={tabH + 16} onPress={() => {
        blurActive();
        setAssignOpen(true);
      }} />

      {monthOpen ? (
        <Overlay onClose={() => setMonthOpen(false)}>
          <MonthPicker
            initial={date}
            onPick={(picked) => {
              setDate(picked);
              setMonthOpen(false);
            }}
            onClose={() => setMonthOpen(false)}
          />
        </Overlay>
      ) : null}

      {assignOpen ? (
        <Overlay onClose={() => setAssignOpen(false)}>
          <AssignSheet date={date} onClose={() => setAssignOpen(false)} />
        </Overlay>
      ) : null}

      {detail ? (
        <Overlay onClose={() => setDetail(null)}>
          <ShiftSheet
            c={detail}
            onClose={() => setDetail(null)}
            onView={() => {
              const id = detail.id;
              setDetail(null);
              go(`/shift/${id}`);
            }}
          />
        </Overlay>
      ) : null}

      {menu ? (
        <Overlay onClose={() => setMenu(null)}>
          <ShiftMenu
            c={menu}
            isAdmin={home.isAdmin}
            onClose={() => setMenu(null)}
            onViewDetails={() => {
              setDetail(menu);
              setMenu(null);
            }}
            onRequestSwap={() => {
              setMenu(null);
              if (!SEED && UUID.test(menu.id)) go(`/shift/${menu.id}?swap=1`);
            }}
            onEdit={() => {
              setMenu(null);
              if (!SEED && UUID.test(menu.id)) go(`/shift/new?editId=${menu.id}`);
            }}
            onDelete={() => onDelete(menu)}
          />
        </Overlay>
      ) : null}
    </View>
  );
}

function DayListSkeleton() {
  return (
    <View
      testID="home-day-skeleton"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ paddingTop: 24, gap: 20 }}
    >
      {[0, 1, 2].map((i) => (
        <View key={i} style={{ gap: 8 }}>
          <Skeleton width={96} height={12} radius={6} />
          <Skeleton height={132} radius={24} />
        </View>
      ))}
    </View>
  );
}

function EmptyDay({ date, isAdmin, hasNext, onJump, onAdd }: {
  date: Date; isAdmin: boolean; hasNext: boolean; onJump: () => void; onAdd: () => void;
}) {
  const t = useTheme();
  const WD_ = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const label = `${WD_[date.getDay()]} ${date.getDate()} ${MO[date.getMonth()]}`;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 16 }}>
      <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: '#FBE4DE', alignItems: 'center', justifyContent: 'center' }}>
        <Feather name="calendar" size={40} color="#D9694A" />
      </View>
      <Text style={{ fontFamily: font.bold, fontSize: 17, color: t.ink, textAlign: 'center' }}>
        {`No shifts on ${label}`}
      </Text>
      <Text style={{ fontFamily: font.regular, fontSize: 14, color: t.muted, textAlign: 'center' }}>
        {isAdmin ? 'Add a shift to get this day started.' : 'Nothing scheduled. Enjoy the break.'}
      </Text>
      {hasNext ? (
        <Pressable
          onPress={onJump}
          accessibilityLabel="Jump to next shift"
          style={{ height: 44, paddingHorizontal: 20, borderRadius: 22, backgroundColor: '#FFFFFF',
            borderWidth: 1, borderColor: t.hairline, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontFamily: font.bold, fontSize: 14, color: t.ink }}>Jump to next shift</Text>
        </Pressable>
      ) : null}
      {isAdmin ? (
        <Pressable
          onPress={onAdd}
          accessibilityLabel="Assign shift"
          style={{ height: 48, paddingHorizontal: 24, borderRadius: 24, backgroundColor: t.primary,
            alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontFamily: font.bold, fontSize: 15, color: '#FFFFFF' }}>Assign shift</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function MonthPicker({ initial, onPick, onClose }: { initial: Date; onPick: (d: Date) => void; onClose: () => void }) {
  const t = useTheme();
  const [year, setYear] = useState(initial.getFullYear());
  return (
    <View style={{ backgroundColor: t.card, borderTopLeftRadius: 32, borderTopRightRadius: 32, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, padding: 20,
      paddingBottom: 32, overflow: 'hidden', ...shadow(10, 30, 'rgba(47,36,32,0.18)') }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <Pressable onPress={() => setYear(year - 1)} accessibilityLabel="Previous year"
          style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: t.chip }}>
          <Feather name="chevron-left" size={20} color={t.ink} />
        </Pressable>
        <Text style={{ fontFamily: font.black, fontSize: 18, color: t.ink }}>{year}</Text>
        <Pressable onPress={() => setYear(year + 1)} accessibilityLabel="Next year"
          style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: t.chip }}>
          <Feather name="chevron-right" size={20} color={t.ink} />
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {MONTHS.map((label, index) => {
          const active = year === initial.getFullYear() && initial.getMonth() === index;
          return (
            <Pressable key={label} onPress={() => { onPick(new Date(year, index, 1)); onClose(); }}
              accessibilityLabel={label}
              style={{ width: '23%', height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
                backgroundColor: active ? t.primary : t.chip }}>
              <Text style={{ fontFamily: font.bold, fontSize: 14, color: active ? '#FFFFFF' : t.ink }}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function ShiftSheet({
  c,
  onClose,
  onView,
}: {
  c: CardData;
  onClose: () => void;
  onView: () => void;
}) {
  const theme = useTheme();
  const isUuid = UUID.test(c.id);
  const status = c.past ? 'Completed' : c.now ? 'In progress' : 'Upcoming';
  const statusColor = c.past ? theme.muted : c.now ? theme.primary : theme.ink;
  const dateLine = `${formatHeaderDate(c.start)} · ${formatCardTimeRange(c.start, c.end)}`;
  const description = c.notes;
  const maxAssignees = 4;
  const assignees = c.people;
  const showMore = assignees.length > maxAssignees;
  const visible = showMore ? assignees.slice(0, maxAssignees) : assignees;
  return (
    <View
      style={{
        backgroundColor: theme.card,
        borderRadius: 32,
        padding: 20,
        paddingBottom: 32,
        gap: 12,
        overflow: 'hidden',
        ...shadow(10, 30, 'rgba(47,36,32,0.18)'),
      }}
      testID="shift-detail-sheet"
    >
      <Text style={{ fontFamily: font.semi, fontSize: 12, color: statusColor }} testID="shift-detail-status">
        {status}
      </Text>
      <Text style={{ fontFamily: font.black, fontSize: 20, color: theme.ink }}>{c.title}</Text>
      <Text style={{ fontFamily: font.regular, fontSize: 14, color: theme.muted }}>{dateLine}</Text>
      {c.location ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Feather name={placeIcon(c.location)} size={16} color={theme.primary} />
          <Text style={{ fontFamily: font.semi, fontSize: 14, color: theme.ink }}>{c.location.label}</Text>
        </View>
      ) : null}
      {assignees.length ? (
        <View style={{ gap: 8 }}>
          <Text style={{ fontFamily: font.semi, fontSize: 12, color: theme.muted }}>Assigned</Text>
          {visible.map((p) => (
            <View key={`${p.id ?? p.name}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Avatar name={p.name} photo={p.photo} size="sm" />
              <Text style={{ fontFamily: font.regular, fontSize: 14, color: theme.ink }} numberOfLines={1}>
                {p.name}
                {p.role ? ` · ${t(ROLE_KEYS[p.role as Role])}` : ''}
              </Text>
            </View>
          ))}
          {showMore ? (
            <Text style={{ fontFamily: font.regular, fontSize: 12, color: theme.muted }}>
              +{assignees.length - maxAssignees} more
            </Text>
          ) : null}
        </View>
      ) : null}
      {description ? (
        <View style={{ gap: 4 }}>
          <Text style={{ fontFamily: font.semi, fontSize: 12, color: theme.muted }}>Description</Text>
          <Text style={{ fontFamily: font.regular, fontSize: 14, color: theme.ink }}>{description}</Text>
        </View>
      ) : null}
      <View style={{ gap: 8, marginTop: 8 }}>
        {isUuid ? (
          <Pressable
            onPress={onView}
            accessibilityLabel="View shift details"
            style={{
              height: 48,
              borderRadius: 24,
              backgroundColor: theme.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontFamily: font.bold, fontSize: 15, color: '#FFFFFF' }}>View details</Text>
          </Pressable>
        ) : null}
        <Pressable
          onPress={onClose}
          accessibilityLabel="Close"
          style={{
            height: 48,
            borderRadius: 24,
            backgroundColor: theme.chip,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontFamily: font.bold, fontSize: 15, color: theme.ink }}>Close</Text>
        </Pressable>
      </View>
    </View>
  );
}

function MenuItem({ label, icon, danger, testID, onPress }:
  { label: string; icon: 'info' | 'repeat' | 'edit-2' | 'trash-2'; danger?: boolean; testID: string; onPress: () => void }) {
  const t = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityLabel={label} testID={testID}
      style={{ height: 52, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 8, borderRadius: 16 }}>
      <Feather name={icon} size={20} color={danger ? t.danger : t.ink} />
      <Text style={{ fontFamily: font.semi, fontSize: 15, color: danger ? t.danger : t.ink }}>{label}</Text>
    </Pressable>
  );
}

function ShiftMenu({ c, isAdmin, onClose, onViewDetails, onRequestSwap, onEdit, onDelete }:
  { c: CardData; isAdmin: boolean; onClose: () => void; onViewDetails: () => void; onRequestSwap: () => void; onEdit: () => void; onDelete: () => void }) {
  const t = useTheme();
  return (
    <View style={{ backgroundColor: t.card, borderRadius: 28, padding: 20,
      paddingBottom: 32, gap: 4, overflow: 'hidden', ...shadow(10, 30, 'rgba(47,36,32,0.18)') }} testID="shift-menu-sheet">
      <Text style={{ fontFamily: font.black, fontSize: 16, color: t.ink, marginBottom: 8 }}>{c.title}</Text>
      <MenuItem label="View details" icon="info" testID="menu-view-details" onPress={onViewDetails} />
      {c.variant === 'mine' ? (
        <MenuItem label="Request swap" icon="repeat" testID="menu-request-swap" onPress={onRequestSwap} />
      ) : null}
      {isAdmin ? (
        <>
          <MenuItem label="Edit shift" icon="edit-2" testID="menu-edit" onPress={onEdit} />
          <MenuItem label="Delete shift" icon="trash-2" danger testID="menu-delete" onPress={onDelete} />
        </>
      ) : null}
      <Pressable onPress={onClose} accessibilityLabel="Close"
        style={{ height: 48, borderRadius: 24, backgroundColor: t.chip, alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
        <Text style={{ fontFamily: font.bold, fontSize: 15, color: t.ink }}>Close</Text>
      </Pressable>
    </View>
  );
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  useEffect(() => {
    blurActive();
  }, []);
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' }}>
        <Pressable
          onPress={onClose}
          accessibilityLabel="Close"
          testID="overlay-backdrop"
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        />
        <View>{children}</View>
      </View>
    </Modal>
  );
}
