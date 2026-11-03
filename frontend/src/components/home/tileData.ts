import type { AssignmentStatus, Shift as ApiShift } from '@rota/contract';
import { addDays, dayKey, dayKeyOfIso, startOfWeek } from '@/lib/rota';
import { formatCardTimeRange } from './cardData';

/**
 * Selectors behind the three Home tiles. They take the raw calendar page the
 * Home query already fetched — the tiles never hard-code people, shifts or
 * counts, they read the same rows the day list renders.
 */

export type TilePerson = {
  /** Stable list key: the user id when known, else the display name. */
  key: string;
  id?: string;
  name: string;
  /** The person's own photo, null when they have not uploaded one. */
  photo: string | null;
  /** The wall-clock window of their shift, already in the profile zone. */
  time: string;
  status: AssignmentStatus;
};

export type TileOpenShift = {
  id: string;
  title: string;
  time: string;
};

/**
 * A shift created before the assignment-response column existed carries no
 * `assignmentStatus`; treat those as already accepted (the migration default).
 */
export function statusOf(shift: { assignmentStatus?: AssignmentStatus }): AssignmentStatus {
  return shift.assignmentStatus ?? 'accepted';
}

/**
 * Distinct people holding at least one shift on a day, earliest shift first.
 * A person with two shifts appears once, with their first shift's window.
 */
export function peopleOnDay(shifts: readonly ApiShift[], timeZone?: string): TilePerson[] {
  const sorted = [...shifts].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const seen = new Set<string>();
  const out: TilePerson[] = [];
  for (const shift of sorted) {
    if (!shift.user) continue;
    if (seen.has(shift.user.id)) continue;
    seen.add(shift.user.id);
    out.push({
      key: shift.user.id,
      id: shift.user.id,
      name: shift.user.name,
      photo: shift.user.avatarUrl,
      time: formatCardTimeRange(new Date(shift.startsAt), new Date(shift.endsAt), timeZone),
      status: statusOf(shift),
    });
  }
  return out;
}

/** Unassigned shifts across the Mon–Sun week containing `anchor`, earliest first. */
export function openShiftsInWeek(
  shifts: readonly ApiShift[],
  anchor: Date,
  timeZone?: string,
): TileOpenShift[] {
  const start = dayKey(startOfWeek(anchor));
  const end = dayKey(addDays(startOfWeek(anchor), 7));
  return [...shifts]
    .filter((shift) => shift.userId == null)
    .filter((shift) => {
      const day = dayKeyOfIso(shift.startsAt);
      return day >= start && day < end;
    })
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .map((shift) => ({
      id: shift.id,
      title: shift.role ?? 'Shift',
      time: formatCardTimeRange(new Date(shift.startsAt), new Date(shift.endsAt), timeZone),
    }));
}

/** Captions are pure so the copy lives in one place, not scattered in JSX. */
export function onShiftCaption(count: number, dayLabel: string): string {
  return count > 0 ? `${count} on ${dayLabel}` : 'Nobody yet';
}

export function openShiftsCaption(count: number): string {
  return count > 0 ? `${count} to claim` : 'None open';
}

export function swapsCaption(count: number): string {
  return count > 0 ? `${count} pending` : 'All clear';
}
