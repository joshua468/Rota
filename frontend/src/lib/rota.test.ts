import { describe, expect, it } from 'vitest';
import {
  addDays,
  canRespondToSwap,
  dayKey,
  dayKeyOfIso,
  groupShiftsByDay,
  isAdmin,
  isDayInput,
  isScheduler,
  isTimeHHMM,
  ledgerKindTone,
  localIsoFromDayAndTime,
  optimisticSwapStatus,
  relativeTime,
  startOfDay,
  startOfWeek,
  subscriptionStatusTone,
  swapStatusTone,
  weekStrip,
} from './rota';

describe('week math', () => {
  it('startOfWeek returns the Monday of the week (local)', () => {
    // Thursday 8 Oct 2026
    const thursday = new Date(2026, 9, 8, 15, 30);
    expect(dayKey(startOfWeek(thursday))).toBe('2026-10-05');
    // Sunday rolls back 6 days
    const sunday = new Date(2026, 9, 11);
    expect(dayKey(startOfWeek(sunday))).toBe('2026-10-05');
    // Monday is itself
    const monday = new Date(2026, 9, 5, 0, 1);
    expect(dayKey(startOfWeek(monday))).toBe('2026-10-05');
  });

  it('weekStrip returns 7 consecutive local days starting Monday', () => {
    const strip = weekStrip(new Date(2026, 9, 8));
    expect(strip).toHaveLength(7);
    expect(dayKey(strip[0]!)).toBe('2026-10-05');
    expect(dayKey(strip[6]!)).toBe('2026-10-11');
    for (let i = 1; i < 7; i += 1) {
      expect(addDays(strip[i - 1]!, 1).getTime()).toBe(strip[i]!.getTime());
    }
  });

  it('startOfDay clears the time of day', () => {
    const date = startOfDay(new Date(2026, 9, 8, 23, 59, 59, 999));
    expect(date.getHours()).toBe(0);
    expect(date.getMinutes()).toBe(0);
    expect(date.getSeconds()).toBe(0);
    expect(date.getMilliseconds()).toBe(0);
  });
});

describe('day keys and grouping', () => {
  it('dayKeyOfIso uses the local calendar day', () => {
    const iso = new Date(2026, 0, 2, 0, 30).toISOString();
    expect(dayKeyOfIso(iso)).toBe('2026-01-02');
    expect(dayKeyOfIso('not-a-date')).toBe('');
  });

  it('groupShiftsByDay buckets by local day and sorts by start', () => {
    const dayTwo = new Date(2026, 9, 6, 13, 0).toISOString();
    const dayOneLate = new Date(2026, 9, 5, 18, 0).toISOString();
    const dayOneEarly = new Date(2026, 9, 5, 9, 0).toISOString();
    const grouped = groupShiftsByDay([
      { startsAt: dayTwo, id: 'c' },
      { startsAt: dayOneLate, id: 'b' },
      { startsAt: dayOneEarly, id: 'a' },
    ]);
    expect([...grouped.keys()]).toEqual(['2026-10-05', '2026-10-06']);
    expect(grouped.get('2026-10-05')!.map((s) => s.id)).toEqual(['a', 'b']);
    expect(grouped.get('2026-10-06')!.map((s) => s.id)).toEqual(['c']);
  });
});

describe('form validation helpers', () => {
  it('isTimeHHMM accepts 24h times only', () => {
    expect(isTimeHHMM('09:30')).toBe(true);
    expect(isTimeHHMM('23:59')).toBe(true);
    expect(isTimeHHMM('24:00')).toBe(false);
    expect(isTimeHHMM('9:30')).toBe(false);
    expect(isTimeHHMM('09:60')).toBe(false);
    expect(isTimeHHMM('')).toBe(false);
  });

  it('isDayInput rejects impossible calendar dates', () => {
    expect(isDayInput('2026-10-08')).toBe(true);
    expect(isDayInput('2024-02-29')).toBe(true);
    expect(isDayInput('2026-02-29')).toBe(false);
    expect(isDayInput('2026-13-01')).toBe(false);
    expect(isDayInput('8 Oct 2026')).toBe(false);
  });

  it('localIsoFromDayAndTime composes a local instant and rejects bad input', () => {
    const iso = localIsoFromDayAndTime('2026-10-08', '14:30');
    expect(iso).not.toBeNull();
    expect(new Date(iso!).getHours()).toBe(14);
    expect(new Date(iso!).getMinutes()).toBe(30);
    expect(localIsoFromDayAndTime('2026-10-08', 'nope')).toBeNull();
    expect(localIsoFromDayAndTime('nope', '14:30')).toBeNull();
  });
});

describe('relativeTime', () => {
  const now = 1_800_000_000_000;

  it('picks the right bucket', () => {
    expect(relativeTime(new Date(now - 30_000).toISOString(), now)).toEqual({ key: 'activity.time.now' });
    expect(relativeTime(new Date(now - 5 * 60_000).toISOString(), now)).toEqual({
      key: 'activity.time.minutes',
      params: { n: 5 },
    });
    expect(relativeTime(new Date(now - 3 * 3_600_000).toISOString(), now)).toEqual({
      key: 'activity.time.hours',
      params: { n: 3 },
    });
    expect(relativeTime(new Date(now - 48 * 3_600_000).toISOString(), now)).toEqual({
      key: 'activity.time.days',
      params: { n: 2 },
    });
  });

  it('clamps future timestamps and invalid input', () => {
    expect(relativeTime(new Date(now + 90_000).toISOString(), now)).toEqual({ key: 'activity.time.now' });
    expect(relativeTime('garbage', now)).toEqual({ key: 'activity.time.now' });
  });
});

describe('presentation mappings', () => {
  it('maps swap statuses to badge tones', () => {
    expect(swapStatusTone('pending')).toBe('warning');
    expect(swapStatusTone('approved')).toBe('success');
    expect(swapStatusTone('rejected')).toBe('error');
    expect(swapStatusTone('canceled')).toBe('neutral');
  });

  it('maps subscription statuses to badge tones', () => {
    expect(subscriptionStatusTone('active')).toBe('success');
    expect(subscriptionStatusTone('trialing')).toBe('brand');
    expect(subscriptionStatusTone('past_due')).toBe('warning');
    expect(subscriptionStatusTone('restricted')).toBe('error');
    expect(subscriptionStatusTone('canceled')).toBe('neutral');
  });

  it('maps ledger kinds to badge tones', () => {
    expect(ledgerKindTone('charge')).toBe('neutral');
    expect(ledgerKindTone('credit')).toBe('success');
    expect(ledgerKindTone('refund')).toBe('brand');
    expect(ledgerKindTone('adjustment')).toBe('warning');
  });

  it('knows scheduler roles', () => {
    expect(isScheduler('owner')).toBe(true);
    expect(isScheduler('manager')).toBe(true);
    expect(isScheduler('member')).toBe(false);
    expect(isScheduler(null)).toBe(false);
  });

  it('knows admin roles (owner or admin), matching team.*/billing.read', () => {
    expect(isAdmin('owner')).toBe(true);
    expect(isAdmin('admin')).toBe(true);
    expect(isAdmin('manager')).toBe(false);
    expect(isAdmin('member')).toBe(false);
    expect(isAdmin(undefined)).toBe(false);
  });
});

describe('canRespondToSwap', () => {
  const swap = { status: 'pending' as const, fromUser: { id: 'a' } };

  it('a scheduler may respond to someone else\'s pending swap (cosmetic)', () => {
    expect(canRespondToSwap(swap, 'b', 'owner')).toBe(true);
    expect(canRespondToSwap(swap, 'b', 'admin')).toBe(true);
    expect(canRespondToSwap(swap, 'b', 'manager')).toBe(true);
  });

  it('a plain member, the requester or a settled swap may not respond', () => {
    expect(canRespondToSwap(swap, 'b', 'member')).toBe(false);
    expect(canRespondToSwap(swap, 'a', 'owner')).toBe(false);
    expect(canRespondToSwap(swap, null, 'owner')).toBe(false);
    expect(canRespondToSwap(swap, 'b', null)).toBe(false);
    expect(canRespondToSwap({ ...swap, status: 'approved' as const }, 'b', 'owner')).toBe(false);
  });
});

describe('optimisticSwapStatus', () => {
  it('approves for either side', () => {
    expect(optimisticSwapStatus('a', 'approve', 'a')).toBe('approved');
    expect(optimisticSwapStatus('a', 'approve', 'b')).toBe('approved');
  });

  it('maps the requester cancelling to canceled and everyone else to rejected', () => {
    expect(optimisticSwapStatus('a', 'reject', 'a')).toBe('canceled');
    expect(optimisticSwapStatus('a', 'reject', 'b')).toBe('rejected');
    expect(optimisticSwapStatus('a', 'reject', null)).toBe('rejected');
  });
});
