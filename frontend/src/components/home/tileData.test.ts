import { describe, expect, it } from 'vitest';
import type { Shift } from '@rota/contract';
import {
  onShiftCaption,
  openShiftsCaption,
  openShiftsInWeek,
  peopleOnDay,
  statusOf,
  swapsCaption,
} from './tileData';

const TEAM = '11111111-1111-4111-8111-111111111111';
const ADA = { id: 'user-ada', name: 'Ada', avatarUrl: null };
const BOB = { id: 'user-bob', name: 'Bob', avatarUrl: null };

function make(over: Partial<Shift> & { id: string; startsAt: string; endsAt: string }): Shift {
  return {
    teamId: TEAM,
    userId: null,
    user: null,
    role: 'Server',
    location: null,
    notes: null,
    version: 1,
    ...over,
  };
}

/** Local wall-clock ISO so the day grouping never depends on the CI time zone. */
const at = (day: number, hour: number) => new Date(2026, 9, day, hour).toISOString();

describe('statusOf', () => {
  it('defaults a legacy shift (no column) to accepted', () => {
    expect(statusOf({})).toBe('accepted');
  });

  it('passes through an explicit response', () => {
    expect(statusOf({ assignmentStatus: 'pending' })).toBe('pending');
    expect(statusOf({ assignmentStatus: 'declined' })).toBe('declined');
  });
});

describe('peopleOnDay', () => {
  it('lists each person once, earliest shift first, and skips open shifts', () => {
    const shifts = [
      make({ id: 'late', startsAt: at(16, 11), endsAt: at(16, 12), userId: ADA.id, user: ADA, assignmentStatus: 'pending' }),
      make({ id: 'early', startsAt: at(16, 9), endsAt: at(16, 10), userId: ADA.id, user: ADA, assignmentStatus: 'accepted' }),
      make({ id: 'bob', startsAt: at(16, 14), endsAt: at(16, 15), userId: BOB.id, user: BOB }),
      make({ id: 'open', startsAt: at(16, 16), endsAt: at(16, 17) }),
    ];

    const people = peopleOnDay(shifts);
    expect(people.map((p) => p.name)).toEqual(['Ada', 'Bob']);
    expect(people[0]).toMatchObject({ id: ADA.id, name: 'Ada', status: 'accepted', time: '09:00 AM – 10:00 AM' });
    expect(people[1]).toMatchObject({ name: 'Bob', status: 'accepted', time: '02:00 PM – 03:00 PM' });
  });

  it('is empty when nobody holds a shift', () => {
    expect(peopleOnDay([make({ id: 'open', startsAt: at(16, 9), endsAt: at(16, 10) })])).toEqual([]);
  });
});

describe('openShiftsInWeek', () => {
  // 2026-10-16 is a Friday; the Mon–Sun week runs 12–18 October.
  const anchor = new Date(2026, 9, 16);
  const shifts = [
    make({ id: 'wed', startsAt: at(14, 10), endsAt: at(14, 11) }),
    make({ id: 'sun', startsAt: at(18, 10), endsAt: at(18, 11) }),
    make({ id: 'assigned', startsAt: at(15, 10), endsAt: at(15, 11), userId: ADA.id, user: ADA }),
    make({ id: 'next-week', startsAt: at(20, 10), endsAt: at(20, 11) }),
  ];

  it('keeps only unassigned shifts inside the week, earliest first', () => {
    expect(openShiftsInWeek(shifts, anchor).map((s) => s.id)).toEqual(['wed', 'sun']);
  });

  it('carries the title and wall-clock window', () => {
    const [first] = openShiftsInWeek(shifts, anchor);
    expect(first!.title).toBe('Server');
    expect(first!.time).toBe('10:00 AM – 11:00 AM');
  });

  it('excludes shifts belonging to other weeks', () => {
    expect(openShiftsInWeek(shifts, anchor).some((s) => s.id === 'next-week')).toBe(false);
  });
});

describe('tile captions', () => {
  it('reads a friendly empty state and follows the selected day label', () => {
    expect(onShiftCaption(0, 'Sun')).toBe('Nobody yet');
    expect(onShiftCaption(3, 'Sun')).toBe('3 on Sun');
    expect(openShiftsCaption(0)).toBe('None open');
    expect(openShiftsCaption(2)).toBe('2 to claim');
    expect(swapsCaption(0)).toBe('All clear');
    expect(swapsCaption(1)).toBe('1 pending');
  });
});
