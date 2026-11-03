import { describe, expect, it } from 'vitest';
import { toCardList, type Shift } from './cardData';
import { summarize } from './summary';

const at = (hour: number, minute = 0) => new Date(2026, 0, 15, hour, minute);
const person = (id: string, name: string) => ({ id, name });

function shift(hour: number, overrides: Partial<Shift> & { id: string; title: string }): Shift {
  return {
    start: at(hour),
    end: at(hour + 1),
    assignees: [],
    createdBy: 'owner',
    ...overrides,
  };
}

const cards = (shifts: Shift[], nowHour: number, nowMinute = 0) =>
  toCardList(shifts, null, at(nowHour, nowMinute).getTime());

describe('summarize', () => {
  it('counts unique people on shifts in progress and picks the first such shift', () => {
    const list = cards(
      [
        shift(9, { id: 'a', title: 'Product Strategy', end: at(10), assignees: [person('1', 'Ada'), person('2', 'Grace')] }),
        shift(9, { id: 'b', title: 'Overlap', end: at(11), assignees: [person('1', 'Ada'), person('3', 'Ben')] }),
      ],
      9,
      30,
    );
    const s = summarize(list, at(9, 30).getTime());
    expect(s.duty.count).toBe(3);
    expect(s.duty.shift?.title).toBe('Product Strategy');
  });

  it('picks the next shift to start and ignores one already running', () => {
    const list = cards(
      [
        shift(9, { id: 'a', title: 'Running now', assignees: [person('1', 'Ada')] }),
        shift(16, { id: 'b', title: 'Later' }),
      ],
      9,
      30,
    );
    const s = summarize(list, at(9, 30).getTime());
    expect(s.next.shift?.title).toBe('Later');
  });

  it('reports no up-next shift once the day is over', () => {
    const list = cards([shift(16, { id: 'a', title: 'Close' })], 20, 0);
    const s = summarize(list, at(20, 0).getTime());
    expect(s.next.shift).toBeNull();
  });

  it('counts unassigned shifts, prefers a live one for the title, and counts overdue', () => {
    const list = cards(
      [
        shift(9, { id: 'a', title: 'Morning open' }),
        shift(16, { id: 'b', title: 'Evening open' }),
      ],
      12,
      0,
    );
    const s = summarize(list, at(12, 0).getTime());
    expect(s.open.count).toBe(2);
    expect(s.open.shift?.title).toBe('Evening open');
    expect(s.overdue).toBe(1);
  });

  it('returns an all-zero summary for an empty day', () => {
    const s = summarize([], at(12).getTime());
    expect(s.duty.count).toBe(0);
    expect(s.duty.shift).toBeNull();
    expect(s.next.shift).toBeNull();
    expect(s.open.count).toBe(0);
    expect(s.open.shift).toBeNull();
    expect(s.overdue).toBe(0);
  });
});
