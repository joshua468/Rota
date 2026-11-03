import { describe, expect, it } from 'vitest';
import {
  fmtTime,
  fmtTimeParts,
  formatDate,
  formatDateTime,
  formatDayTitle,
  formatDuration,
  formatHeaderDate,
  formatMoney,
  formatTime,
  formatTimeRange,
  hourOfDay,
} from './format';

describe('formatMoney', () => {
  it('renders integer cents with two decimals', () => {
    expect(formatMoney(0)).toBe('$0.00');
    expect(formatMoney(5)).toBe('$0.05');
    expect(formatMoney(1234)).toBe('$12.34');
  });

  it('groups thousands and never uses toFixed rounding', () => {
    expect(formatMoney(123456789)).toBe('$1,234,567.89');
    expect(formatMoney(999999)).toBe('$9,999.99');
  });

  it('keeps the sign outside the grouping', () => {
    expect(formatMoney(-1234)).toBe('-$12.34');
  });

  it('formats a non-USD currency with a space prefix', () => {
    expect(formatMoney(2500, 'NGN')).toBe('NGN 25.00');
  });
});

describe('date and time', () => {
  const morning = '2026-01-15T09:05:00.000Z';
  const evening = '2026-01-15T17:30:00.000Z';

  it('formats a 12-hour clock in the given time zone', () => {
    expect(formatTime(morning, 'UTC')).toBe('09:05 AM');
    expect(formatTime(evening, 'UTC')).toBe('05:30 PM');
  });

  it('formats a date and a date-time', () => {
    expect(formatDate(morning, 'UTC')).toBe('Thu 15 Jan');
    expect(formatDateTime(morning, 'UTC')).toBe('Thu 15 Jan, 09:05 AM');
  });

  it('joins a range with an en dash', () => {
    expect(formatTimeRange(morning, evening, 'UTC')).toBe('09:05 AM – 05:30 PM');
  });

  it('renders a stored UTC instant in the viewer time zone', () => {
    // 07:00Z is 08:00 in Lagos (UTC+1) — the same instant must never read as
    // 07:00 just because the server stored it in UTC.
    expect(fmtTime('2026-01-15T07:00:00.000Z', 'Africa/Lagos')).toBe('08:00 AM');
    expect(fmtTime('2026-01-15T07:00:00.000Z', 'UTC')).toBe('07:00 AM');
    expect(fmtTime('2026-01-15T07:00:00.000Z', 'Asia/Tokyo')).toBe('04:00 PM');
  });

  it('keeps fmtTime and its structured parts in sync', () => {
    const parts = fmtTimeParts('2026-01-15T07:00:00.000Z', 'Africa/Lagos');
    expect(parts).toEqual({ hour: '08', minute: '00', meridiem: 'AM' });
    expect(parts && `${parts.hour}:${parts.minute} ${parts.meridiem}`).toBe(
      fmtTime('2026-01-15T07:00:00.000Z', 'Africa/Lagos'),
    );
  });

  it('reads the wall-clock hour in the given zone, not the device zone', () => {
    expect(hourOfDay('2026-01-15T07:00:00.000Z', 'Africa/Lagos')).toBe(8);
    expect(hourOfDay('2026-01-15T07:00:00.000Z', 'UTC')).toBe(7);
    expect(hourOfDay('not-a-date')).toBe(-1);
  });

  it('formats a header date and a duration', () => {
    expect(formatHeaderDate(new Date(2026, 0, 15))).toBe('Thu, 15 Jan');
    expect(formatDuration('2026-01-15T09:00:00.000Z', '2026-01-15T17:30:00.000Z')).toBe('8h 30m');
    expect(formatDuration('2026-01-15T09:00:00.000Z', '2026-01-15T17:00:00.000Z')).toBe('8h');
    expect(formatDuration('2026-01-15T09:00:00.000Z', '2026-01-15T09:45:00.000Z')).toBe('45m');
  });

  it('formats a compact day title without a comma', () => {
    expect(formatDayTitle(new Date(2026, 0, 15))).toBe('Thu 15 Jan');
  });

  it('returns an empty string for invalid input instead of throwing', () => {
    expect(formatTime('not-a-date')).toBe('');
    expect(fmtTime('nope', 'UTC')).toBe('');
    expect(fmtTimeParts('nope', 'UTC')).toBeNull();
    expect(formatDate('')).toBe('');
    expect(formatDateTime('nope', 'UTC')).toBe('');
    expect(formatTimeRange('not-a-date', evening, 'UTC')).toBe('');
    expect(formatDuration('not-a-date', evening)).toBe('');
  });
});
