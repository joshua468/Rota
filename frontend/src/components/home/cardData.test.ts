import { describe, expect, it } from 'vitest';
import {
  cardSubtitle,
  formatCardDuration,
  formatCardTime,
  groupOf,
  progressOf,
  toCard,
  toCardList,
  type Shift,
} from './cardData';

const person = (id: string, name: string) => ({ id, name });

function shiftAt(hour: number, minute = 0, overrides: Partial<Shift> = {}): Shift {
  const start = new Date(2026, 0, 15, hour, minute);
  const end = new Date(start.getTime() + 60 * 60_000);
  return {
    id: `s-${hour}-${minute}`,
    title: 'Shift',
    start,
    end,
    location: 'Front desk',
    assignees: [],
    createdBy: 'owner',
    ...overrides,
  };
}

describe('formatCardTime', () => {
  it('zero-pads the hour and uppercases the meridiem', () => {
    expect(formatCardTime(new Date(2026, 0, 15, 9, 30))).toBe('09:30 AM');
    expect(formatCardTime(new Date(2026, 0, 15, 14, 0))).toBe('02:00 PM');
    expect(formatCardTime(new Date(2026, 0, 15, 16, 5))).toBe('04:05 PM');
  });

  it('maps midnight to 12:00 AM and noon to 12:00 PM', () => {
    expect(formatCardTime(new Date(2026, 0, 15, 0, 0))).toBe('12:00 AM');
    expect(formatCardTime(new Date(2026, 0, 15, 12, 0))).toBe('12:00 PM');
  });
});

describe('formatCardDuration', () => {
  it('renders hours and minutes', () => {
    expect(formatCardDuration(new Date(2026, 0, 15, 11, 0), new Date(2026, 0, 15, 12, 30))).toBe('1h 30m');
  });

  it('drops the minutes when there are none', () => {
    expect(formatCardDuration(new Date(2026, 0, 15, 9, 0), new Date(2026, 0, 15, 11, 0))).toBe('2h');
  });

  it('drops the hours when under an hour', () => {
    expect(formatCardDuration(new Date(2026, 0, 15, 9, 0), new Date(2026, 0, 15, 9, 45))).toBe('45m');
  });

  it('returns empty for zero-length spans', () => {
    const t = new Date(2026, 0, 15, 9, 0);
    expect(formatCardDuration(t, t)).toBe('');
  });
});

describe('groupOf', () => {
  it('splits the day at 12:00 and 17:00', () => {
    expect(groupOf(new Date(2026, 0, 15, 11, 59))).toBe('morning');
    expect(groupOf(new Date(2026, 0, 15, 12, 0))).toBe('afternoon');
    expect(groupOf(new Date(2026, 0, 15, 16, 59))).toBe('afternoon');
    expect(groupOf(new Date(2026, 0, 15, 17, 0))).toBe('evening');
  });
});

describe('toCard', () => {
  it('derives "open" when nobody is assigned', () => {
    const card = toCard(shiftAt(16, 0), null, { nowMs: new Date(2026, 0, 15, 10, 0).getTime() });
    expect(card.variant).toBe('open');
    expect(card.people).toHaveLength(0);
  });

  it('derives "mine" when my id is among the assignees', () => {
    const shift = shiftAt(11, 0, { assignees: [person('me', 'You'), person('demo-1', 'Ada')] });
    const card = toCard(shift, { id: 'me' }, { nowMs: new Date(2026, 0, 15, 10, 0).getTime() });
    expect(card.variant).toBe('mine');
    expect(card.duration).toBe('1h');
  });

  it('does not derive "mine" for someone else', () => {
    const shift = shiftAt(11, 0, { assignees: [person('demo-1', 'Ada')] });
    const card = toCard(shift, { id: 'me' }, { nowMs: new Date(2026, 0, 15, 10, 0).getTime() });
    expect(card.variant).toBe('neutral');
  });

  it('flags now and past against the supplied clock', () => {
    const shift = shiftAt(11, 0, { assignees: [person('me', 'You')] });
    const during = new Date(2026, 0, 15, 11, 15).getTime();
    const after = new Date(2026, 0, 15, 13, 0).getTime();
    expect(toCard(shift, { id: 'me' }, { nowMs: during }).now).toBe(true);
    expect(toCard(shift, { id: 'me' }, { nowMs: during }).past).toBe(false);
    expect(toCard(shift, { id: 'me' }, { nowMs: after }).now).toBe(false);
    expect(toCard(shift, { id: 'me' }, { nowMs: after }).past).toBe(true);
  });

  it('carries the day group', () => {
    expect(toCard(shiftAt(9, 30), null, { nowMs: 0 }).group).toBe('morning');
    expect(toCard(shiftAt(14, 0), null, { nowMs: 0 }).group).toBe('afternoon');
    expect(toCard(shiftAt(18, 0), null, { nowMs: 0 }).group).toBe('evening');
  });
});

describe('toCardList', () => {
  it('promotes only the first non-mine shift to "team"', () => {
    const day: Shift[] = [
      shiftAt(9, 0, { assignees: [person('other', 'Ada')] }),
      shiftAt(11, 0, { assignees: [person('me', 'You')] }),
      shiftAt(14, 0, { assignees: [person('other', 'Ada')] }),
      shiftAt(16, 0),
    ];
    const cards = toCardList(day, { id: 'me' }, new Date(2026, 0, 15, 10, 0).getTime());
    expect(cards.map((c) => c.variant)).toEqual(['team', 'mine', 'neutral', 'open']);
  });
});

describe('cardSubtitle', () => {
  it('prefers the trimmed note', () => {
    const shift = shiftAt(9, 30, { title: 'Front desk', notes: '  Handover  ' });
    expect(cardSubtitle(shift)).toBe('Handover');
  });

  it('is blank for an assigned shift with no notes (names move to their own row)', () => {
    const shift = shiftAt(9, 30, { assignees: [person('a', 'Ada Lovelace')] });
    expect(cardSubtitle(shift)).toBe('');
  });

  it('prompts to claim when unassigned', () => {
    const shift = shiftAt(9, 30, { assignees: [] });
    expect(cardSubtitle(shift)).toBe('Unassigned. Tap to claim.');
  });

  it('never repeats the title or a time', () => {
    const shift = shiftAt(9, 30, {
      title: 'Product Strategy',
      notes: undefined,
      assignees: [person('a', 'Ada')],
    });
    const subtitle = cardSubtitle(shift);
    expect(subtitle).not.toContain(shift.title);
    expect(subtitle).not.toMatch(/\d{2}:\d{2}/);
  });
});

describe('progressOf', () => {
  it('clamps to the shift span', () => {
    const start = new Date(2026, 0, 15, 10, 0);
    const end = new Date(2026, 0, 15, 12, 0);
    expect(progressOf(start, end, start.getTime())).toBe(0);
    expect(progressOf(start, end, new Date(2026, 0, 15, 11, 0).getTime())).toBe(0.5);
    expect(progressOf(start, end, end.getTime() + 60_000)).toBe(1);
  });

  it('returns 0 for zero-length spans', () => {
    const t = new Date(2026, 0, 15, 10, 0);
    expect(progressOf(t, t, t.getTime())).toBe(0);
  });
});
