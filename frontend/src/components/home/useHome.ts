import { useMemo } from 'react';
import type { Shift as ApiShift } from '@rota/contract';
import { useSettings, useShifts, useSwaps } from '@/api/queries';
import { addDays, dayKey, dayKeyOfIso, isScheduler, startOfDay, startOfWeek } from '@/lib/rota';
import { useSessionStore } from '@/stores/session';
import { DEMO_ME, DEMO_MEMBERS, DEMO_TEAM, SEED } from '@/lib/demo';
import { resolveProfileZone } from '@/lib/timezone';
import { toCardList, type CardData, type Shift as CardShift } from './cardData';
import { openShiftsInWeek, peopleOnDay, type TileOpenShift, type TilePerson } from './tileData';
import { sameDay } from './dates';

function adapter(shift: ApiShift, meId: string | null): CardShift {
  const mine = shift.userId != null && shift.userId === meId;
  return {
    id: shift.id,
    title: shift.role ?? (mine ? 'Your shift' : 'Shift'),
    notes: shift.notes ?? undefined,
    start: new Date(shift.startsAt),
    end: new Date(shift.endsAt),
    meetingUrl: shift.meetingUrl ?? undefined,
    location: shift.location ?? undefined,
    assignees: shift.user
      ? [{ id: shift.user.id, name: shift.user.name, photo: shift.user.avatarUrl ?? undefined }]
      : [],
    createdBy: shift.userId ?? '',
  };
}

function seedCards(date: Date, timeZone?: string): CardData[] {
  const start = startOfDay(date);
  const at = (hour: number, minute = 0) =>
    new Date(start.getFullYear(), start.getMonth(), start.getDate(), hour, minute);
  const member = (i: number) => ({ id: DEMO_MEMBERS[i]!.id, name: DEMO_MEMBERS[i]!.name, role: DEMO_MEMBERS[i]!.role });
  const ada = member(0);
  const grace = member(1);
  const alan = member(2);
  const katherine = member(3);
  const margaret = member(4);
  const me = { id: DEMO_ME.id, name: DEMO_ME.name, role: DEMO_TEAM.role };
  const nan = { id: 'demo-6', name: 'Nancy Lee' };
  const shifts: CardShift[] = [
    {
      id: 'seed-1',
      title: 'Product Strategy',
      notes: 'Reviewing Q4 roadmap with design team',
      start: at(9, 30),
      end: at(10, 30),
      meetingUrl: 'https://zoom.us/j/123456789',
      location: 'Zoom',
      assignees: [ada, grace, alan],
      createdBy: DEMO_TEAM.id,
    },
    {
      id: 'seed-2',
      title: 'Marketing Sync',
      notes: 'Quarterly campaign kickoff',
      start: at(11, 0),
      end: at(12, 30),
      location: 'Room 402',
      assignees: [me, ada, grace, alan, katherine, margaret, nan],
      createdBy: DEMO_TEAM.id,
    },
    {
      id: 'seed-3',
      title: 'Lunch Cover',
      notes: 'Front desk coverage',
      start: at(14, 0),
      end: at(15, 0),
      location: 'Front desk',
      assignees: [katherine, margaret],
      createdBy: DEMO_TEAM.id,
    },
    {
      id: 'seed-4',
      title: 'Close Shift',
      notes: 'Evening handover',
      start: at(16, 0),
      end: at(17, 0),
      location: 'Main floor',
      assignees: [],
      createdBy: DEMO_TEAM.id,
    },
  ];
  return toCardList(shifts, { id: me.id }, Date.now(), timeZone);
}

export function useHomeData(date: Date) {
  const sessionMe = useSessionStore((state) => state.user?.id ?? null);
  const role = useSessionStore((state) => state.team?.role);
  const pendingSwaps = SEED ? { data: { items: [] } } : useSwaps('pending');
  const settings = SEED ? { data: { values: { time_zone: undefined } } } : useSettings();

  /** One zone for every clock the Home screen draws. */
  const timeZone = resolveProfileZone(settings.data?.values?.time_zone);

  const isSeed = SEED;
  const meId = isSeed ? DEMO_ME.id : sessionMe;

  const window = useMemo(
    () => {
      // Fetch far enough back to cover the whole selected week, so the "Open
      // shifts" tile never misses an early-week shift when a late day is picked.
      const threeBack = addDays(startOfDay(date), -3);
      const weekStart = startOfWeek(date);
      const from = weekStart.getTime() < threeBack.getTime() ? weekStart : threeBack;
      return { from: from.toISOString(), to: addDays(startOfDay(date), 60).toISOString() };
    },
    [date],
  );

  const query = SEED ? ({ data: { items: [] }, isLoading: false, isError: false, refetch: async () => ({}), isRefetching: false, dataUpdatedAt: Date.now() } as any) : useShifts(window, { enabled: true });
  const items = useMemo(() => (SEED ? [] : (query.data?.items ?? [])), [query.data]);
  const byDay = useMemo(() => {
    if (SEED) return new Map<string, ApiShift[]>();
    const map = new Map<string, ApiShift[]>();
    for (const shift of items) {
      const key = dayKeyOfIso(shift.startsAt);
      const bucket = map.get(key);
      if (bucket) bucket.push(shift);
      else map.set(key, [shift]);
    }
    for (const bucket of map.values()) {
      bucket.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
    }
    return map;
  }, [items]);

  const cards = useMemo<CardData[]>(() => {
    if (SEED) return seedCards(date, timeZone);
    const day = byDay.get(dayKey(date)) ?? [];
    return toCardList(
      day.map((shift) => adapter(shift, meId)),
      meId ? { id: meId } : null,
      Date.now(),
      timeZone,
    );
  }, [byDay, date, meId, timeZone]);

  const hasShift = useMemo(
    () => (d: Date) => (SEED ? sameDay(d, date) : byDay.has(dayKey(d))),
    [byDay, date],
  );

  const nextShiftDay = useMemo<Date | null>(() => {
    if (SEED) return null;
    let cursor = addDays(startOfDay(date), 1);
    for (let i = 0; i < 90; i += 1) {
      if (byDay.has(dayKey(cursor))) return cursor;
      cursor = addDays(cursor, 1);
    }
    return null;
  }, [byDay, date]);

  /** People on the selected day — deduped, earliest shift first, with their answer. */
  const people = useMemo<TilePerson[]>(() => {
    if (SEED) {
      const seen = new Set<string>();
      const out: TilePerson[] = [];
      for (const card of cards) {
        for (const person of card.people) {
          const key = person.id ?? person.name;
          if (seen.has(key)) continue;
          seen.add(key);
          out.push({
            key,
            id: person.id,
            name: person.name,
            photo: person.photo ?? null,
            time: card.time,
            status: 'accepted',
          });
        }
      }
      return out;
    }
    return peopleOnDay(byDay.get(dayKey(date)) ?? [], timeZone);
  }, [byDay, cards, date, timeZone]);

  /** Unassigned shifts across the selected week (Mon–Sun). */
  const openShifts = useMemo<TileOpenShift[]>(() => {
    if (SEED) {
      return cards
        .filter((card) => card.variant === 'open')
        .map((card) => ({ id: card.id, title: card.title, time: card.time }));
    }
    return openShiftsInWeek(items, date, timeZone);
  }, [cards, items, date, timeZone]);

  return {
    cards,
    hasShift,
    timeZone,
    isAdmin: isSeed || isScheduler(role),
    unread: ((pendingSwaps as any)?.data?.items?.length ?? 0) > 0,
    pendingSwapCount: ((pendingSwaps as any)?.data?.items?.length ?? 0),
    people,
    openShifts,
    isLoading: isSeed ? false : query.isLoading,
    refetch: isSeed ? (async () => ({})) : query.refetch,
    isRefetching: isSeed ? false : (query as any).isRefetching,
    isError: isSeed ? false : (query as any).isError,
    nextShiftDay,
    dataUpdatedAt: isSeed ? Date.now() : (query as any).dataUpdatedAt,
  };
}

export { SEED };
