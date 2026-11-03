/**
 * Wall-clock rendering for text the server writes on the user's behalf —
 * notification titles/bodies and activity summaries. Timestamps are stored as
 * UTC instants; this is the one place they become human text, always in the
 * reader's IANA zone, always 12-hour (`08:00 AM`). Never call
 * `toISOString()` for anything a person reads.
 */

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function formatterFor(timeZone: string): Intl.DateTimeFormat {
  const cached = formatterCache.get(timeZone);
  if (cached) return cached;
  let formatter: Intl.DateTimeFormat;
  try {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h12',
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      hourCycle: 'h12',
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  formatterCache.set(timeZone, formatter);
  return formatter;
}

interface WallParts {
  weekday: string;
  day: string;
  month: string;
  hour: string;
  minute: string;
  meridiem: string;
}

function partsOf(instant: Date, timeZone: string): WallParts {
  const out: WallParts = { weekday: '', day: '', month: '', hour: '', minute: '', meridiem: '' };
  for (const part of formatterFor(timeZone).formatToParts(instant)) {
    switch (part.type) {
      case 'weekday':
        out.weekday = part.value;
        break;
      case 'day':
        out.day = part.value;
        break;
      case 'month':
        out.month = part.value;
        break;
      case 'hour':
        out.hour = part.value;
        break;
      case 'minute':
        out.minute = part.value;
        break;
      case 'dayPeriod':
        out.meridiem = part.value.toUpperCase();
        break;
      default:
        break;
    }
  }
  return out;
}

/** `08:00 AM` — the canonical clock time. */
export function wallClock(instant: Date, timeZone: string): string {
  const p = partsOf(instant, timeZone);
  return `${p.hour}:${p.minute} ${p.meridiem}`;
}

/** `Fri 16 Oct, 08:00 AM` — a date a reader can place without a calendar. */
export function wallDayTime(instant: Date, timeZone: string): string {
  const p = partsOf(instant, timeZone);
  return `${p.weekday} ${p.day} ${p.month}, ${p.hour}:${p.minute} ${p.meridiem}`;
}

/** `Fri 16 Oct, 08:00 AM – 04:00 PM` — end repeats the day only when it differs. */
export function wallRange(start: Date, end: Date, timeZone: string): string {
  const a = partsOf(start, timeZone);
  const b = partsOf(end, timeZone);
  const head = `${a.weekday} ${a.day} ${a.month}, ${a.hour}:${a.minute} ${a.meridiem}`;
  const sameDay = a.weekday === b.weekday && a.day === b.day && a.month === b.month;
  const tail = sameDay ? `${b.hour}:${b.minute} ${b.meridiem}` : `${b.weekday} ${b.day} ${b.month}, ${b.hour}:${b.minute} ${b.meridiem}`;
  return `${head} – ${tail}`;
}
