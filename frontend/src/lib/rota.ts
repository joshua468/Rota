import type { Role, SubscriptionStatus, SwapStatus } from '@rota/contract';
import type { BadgeTone } from '@/components/Badge';
import type { TranslationKey } from '@/i18n';
import { hourOfDay } from './format';

export const ROLE_KEYS: Record<Role, TranslationKey> = {
  owner: 'role.owner',
  admin: 'role.admin',
  manager: 'role.manager',
  member: 'role.member',
};

export const SWAP_STATUS_KEYS: Record<SwapStatus, TranslationKey> = {
  pending: 'swaps.status.pending',
  approved: 'swaps.status.approved',
  rejected: 'swaps.status.rejected',
  canceled: 'swaps.status.canceled',
};

export const SUBSCRIPTION_STATUS_KEYS: Record<SubscriptionStatus, TranslationKey> = {
  trialing: 'billing.status.trialing',
  active: 'billing.status.active',
  past_due: 'billing.status.pastDue',
  restricted: 'billing.status.restricted',
  canceled: 'billing.status.canceled',
};

export const LEDGER_KIND_KEYS: Record<'charge' | 'credit' | 'refund' | 'adjustment', TranslationKey> = {
  charge: 'billing.kind.charge',
  credit: 'billing.kind.credit',
  refund: 'billing.kind.refund',
  adjustment: 'billing.kind.adjustment',
};

export function swapStatusTone(status: SwapStatus): BadgeTone {
  if (status === 'approved') return 'success';
  if (status === 'rejected') return 'error';
  if (status === 'pending') return 'warning';
  return 'neutral';
}

export function subscriptionStatusTone(status: SubscriptionStatus): BadgeTone {
  if (status === 'active') return 'success';
  if (status === 'trialing') return 'brand';
  if (status === 'past_due') return 'warning';
  if (status === 'restricted') return 'error';
  return 'neutral';
}

export function ledgerKindTone(kind: 'charge' | 'credit' | 'refund' | 'adjustment'): BadgeTone {
  if (kind === 'credit') return 'success';
  if (kind === 'refund') return 'brand';
  if (kind === 'adjustment') return 'warning';
  return 'neutral';
}

export function isScheduler(role: Role | null | undefined): boolean {
  return role === 'owner' || role === 'admin' || role === 'manager';
}

export function isOwner(role: Role | null | undefined): boolean {
  return role === 'owner';
}

/**
 * Owner or admin — mirrors `team.*` and `billing.read` in the server's
 * permission matrix (backend/src/lib/policy.ts). Cosmetic only; the server
 * remains the authority and any 403/404 is rendered as a state (Rule 01).
 */
export function isAdmin(role: Role | null | undefined): boolean {
  return role === 'owner' || role === 'admin';
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date.getTime());
  next.setDate(next.getDate() + days);
  return next;
}

/** Monday-based start of the week, in device-local time. */
export function startOfWeek(anchor: Date): Date {
  const day = startOfDay(anchor);
  const weekday = day.getDay();
  const offsetToMonday = weekday === 0 ? -6 : 1 - weekday;
  return addDays(day, offsetToMonday);
}

/** The 7 local days (Mon–Sun) of the week containing `anchor`. */
export function weekStrip(anchor: Date): Date[] {
  const start = startOfWeek(anchor);
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/** Local calendar day as `YYYY-MM-DD`. */
export function dayKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function dayKeyOfIso(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return dayKey(date);
}

export function groupShiftsByDay<T extends { startsAt: string }>(shifts: readonly T[]): Map<string, T[]> {
  const grouped = new Map<string, T[]>();
  for (const shift of shifts) {
    const key = dayKeyOfIso(shift.startsAt);
    const bucket = grouped.get(key);
    if (bucket) bucket.push(shift);
    else grouped.set(key, [shift]);
  }
  for (const bucket of grouped.values()) {
    bucket.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  }
  return new Map([...grouped.entries()].sort((a, b) => a[0].localeCompare(b[0])));
}

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DAY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isTimeHHMM(value: string): boolean {
  return TIME_RE.test(value);
}

export function isDayInput(value: string): boolean {
  const match = DAY_RE.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

/** `YYYY-MM-DD` + `HH:MM` interpreted in device-local time → ISO instant. */
export function localIsoFromDayAndTime(day: string, time: string): string | null {
  if (!isDayInput(day) || !isTimeHHMM(time)) return null;
  const date = new Date(`${day}T${time}:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export type RelativeTime = { key: TranslationKey; params?: Record<string, string | number> };

export function relativeTime(iso: string, nowMs: number = Date.now()): RelativeTime {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return { key: 'activity.time.now' };
  const minutes = Math.floor(Math.max(0, nowMs - then) / 60_000);
  if (minutes < 1) return { key: 'activity.time.now' };
  if (minutes < 60) return { key: 'activity.time.minutes', params: { n: minutes } };
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return { key: 'activity.time.hours', params: { n: hours } };
  return { key: 'activity.time.days', params: { n: Math.floor(hours / 24) } };
}

/**
 * Cosmetic mirror of the server's `swap.decide` matrix: only schedulers
 * approve or decline someone else's request, and the requester never responds
 * to their own. The server remains the authority and any 403/404 is rendered
 * as a state (Rule 01).
 */
export function canRespondToSwap(
  swap: { status: SwapStatus; fromUser: { id: string } },
  meId: string | null | undefined,
  role: Role | null | undefined,
): boolean {
  return swap.status === 'pending' && !!meId && meId !== swap.fromUser.id && isScheduler(role);
}

/**
 * The status a swap settles at after a decision, mirrored client-side for the
 * optimistic update (mobile-engineer standard). The server maps a requester's
 * own reject to `canceled` and everyone else's to `rejected`; approve is always
 * `approved`. `onSettled` reconciles with the server response regardless.
 */
export function optimisticSwapStatus(
  fromUserId: string,
  decision: 'approve' | 'reject',
  meId: string | null | undefined,
): SwapStatus {
  if (decision === 'approve') return 'approved';
  return fromUserId === meId ? 'canceled' : 'rejected';
}

export type DayPeriod = 'morning' | 'afternoon' | 'evening';
/** Bucket a shift start into Morning / Afternoon / Evening by its wall-clock hour. */
export function dayPeriodOf(iso: string, timeZone?: string): DayPeriod | null {
  const hour = hourOfDay(iso, timeZone);
  if (hour < 0) return null;
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

/** First name for personalized greeting — falls back to the raw name. */
export function firstNameOf(fullName: string): string {
  const first = fullName.trim().split(/\s+/)[0];
  return first || fullName;
}
