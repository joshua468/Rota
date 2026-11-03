import type { Role } from '@rota/contract';
import { fmtTime, fmtTimeParts, hourOfDay } from '@/lib/format';
import { toPlace, type Place } from '@/lib/shifts/place';

export type CardVariant = 'team' | 'mine' | 'neutral' | 'open';
export type CardGroup = 'morning' | 'afternoon' | 'evening';
export type ShiftPerson = { id?: string; name: string; photo?: string; role?: Role };

/**
 * The shape `toCard` consumes. The app's API `Shift` only ever carries a single
 * assignee, but the Home card supports a team, so we normalise to `assignees`.
 */
export type Shift = {
  id: string;
  title: string;
  notes?: string;
  start: Date;
  end: Date;
  meetingUrl?: string;
  location?: string;
  assignees: ShiftPerson[];
  createdBy: string;
  swapPending?: boolean;
  conflict?: boolean;
};

export type CardData = {
  id: string;
  time: string;
  /** Structured clock for two-column layouts — never parse `time` back apart. */
  timeParts: { hour: string; minute: string; meridiem: string };
  duration?: string;
  title: string;
  subtitle: string;
  location: Place | null;
  people: ShiftPerson[];
  variant: CardVariant;
  now?: boolean;
  past?: boolean;
  conflict?: boolean;
  swapPending?: boolean;
  start: Date;
  end: Date;
  group: CardGroup;
  notes?: string;
};

/** 12-hour clock, zero-padded hour, uppercase meridiem: `09:30 AM`, in `timeZone`. */
export function formatCardTime(date: Date, timeZone?: string): string {
  return fmtTime(date, timeZone);
}

export function formatCardTimeRange(start: Date, end: Date, timeZone?: string): string {
  return `${formatCardTime(start, timeZone)} – ${formatCardTime(end, timeZone)}`;
}

/** Human duration: `1h 30m`, `2h`, `45m`. Empty for zero/negative spans. */
export function formatCardDuration(start: Date, end: Date): string {
  const totalMinutes = Math.round((end.getTime() - start.getTime()) / 60_000);
  if (totalMinutes <= 0) return '';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}

/** Morning before 12:00, afternoon before 17:00, else evening — in `timeZone`. */
export function groupOf(date: Date, timeZone?: string): CardGroup {
  const hour = hourOfDay(date.toISOString(), timeZone);
  if (hour < 0) return 'morning';
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

/** Fraction of the shift elapsed at `nowMs`, clamped to `[0, 1]`. */
export function progressOf(start: Date, end: Date, nowMs: number): number {
  const span = end.getTime() - start.getTime();
  if (span <= 0) return 0;
  return Math.min(1, Math.max(0, (nowMs - start.getTime()) / span));
}

/**
 * The subtitle never repeats the title or the time (the chip shows the clock)
 * and never lists people — assignees get their own prominent row so their names
 * are not buried in small type. It carries the shift's note, a claim prompt when
 * nobody is on it, or nothing at all.
 */
export function cardSubtitle(shift: Shift): string {
  const notes = shift.notes?.trim();
  if (notes) return notes;
  if (shift.assignees.length === 0) return 'Unassigned. Tap to claim.';
  return '';
}

export function toCard(
  shift: Shift,
  me: { id: string } | null,
  options: { team?: boolean; nowMs?: number; timeZone?: string } = {},
): CardData {
  const { team = false, nowMs = Date.now(), timeZone } = options;
  const startMs = shift.start.getTime();
  const endMs = shift.end.getTime();
  const mine = me != null && shift.assignees.some((person) => person.id === me.id);
  const variant: CardVariant =
    shift.assignees.length === 0 ? 'open' : mine ? 'mine' : team ? 'team' : 'neutral';
  const timeParts = fmtTimeParts(shift.start, timeZone) ?? { hour: '--', minute: '--', meridiem: '' };
  return {
    id: shift.id,
    time: formatCardTime(shift.start, timeZone),
    timeParts,
    duration: formatCardDuration(shift.start, shift.end) || undefined,
    title: shift.title,
    subtitle: cardSubtitle(shift),
    location: toPlace(shift),
    people: shift.assignees.map(({ id, name, photo, role }) => ({ id, name, photo, role })),
    variant,
    now: startMs <= nowMs && nowMs < endMs,
    past: endMs < nowMs,
    conflict: shift.conflict,
    swapPending: shift.swapPending,
    start: shift.start,
    end: shift.end,
    group: groupOf(shift.start, timeZone),
    notes: shift.notes?.trim() || undefined,
  };
}

/**
 * Map a whole day's shifts to cards, promoting exactly one card to the "team"
 * variant: my shifts are "mine", unassigned are "open", and the first remaining
 * shift (chronologically) is the team highlight, the rest stay neutral.
 */
export function toCardList(
  shifts: Shift[],
  me: { id: string } | null,
  nowMs: number = Date.now(),
  timeZone?: string,
): CardData[] {
  let teamTaken = false;
  return shifts.map((shift) => {
    const card = toCard(shift, me, { nowMs, timeZone });
    if (card.variant !== 'neutral' || teamTaken) return card;
    teamTaken = true;
    return { ...card, variant: 'team' };
  });
}
