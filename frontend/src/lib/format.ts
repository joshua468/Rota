const DATE_TIME_INVALID = '';

function toValidDate(iso: string): Date | null {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatter(options: Intl.DateTimeFormatOptions, timeZone?: string): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat('en-GB', { ...options, timeZone });
}

export function formatMoney(cents: number, currency = 'USD'): string {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(Math.trunc(cents));
  const dollars = Math.floor(abs / 100);
  const remainder = abs % 100;
  const grouped = String(dollars).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const fraction = String(remainder).padStart(2, '0');
  const prefix = currency === 'USD' ? '$' : `${currency} `;
  return `${sign}${prefix}${grouped}.${fraction}`;
}

/**
 * The single clock-time formatter for the whole app. Renders an instant as a
 * 12-hour wall-clock time in `timeZone`, e.g. `08:00 AM`.
 *
 * Every displayed time (Home card, shift sheet, shift detail, assign sheet,
 * notifications) must go through this function so the same shift always reads
 * the same on every screen. `timeZone` is the viewer's profile zone and defaults
 * to the device zone — never to the raw UTC instant the server stored.
 */
export function fmtTime(
  date: Date | string | null | undefined,
  timeZone?: string,
): string {
  const parts = fmtTimeParts(date, timeZone);
  if (!parts) return DATE_TIME_INVALID;
  return `${parts.hour}:${parts.minute} ${parts.meridiem}`;
}

/**
 * Structured form of {@link fmtTime} for layouts that stack the clock (the
 * Home card's two-column time). Split out of the same formatter output that
 * `fmtTime` joins back together, so both always agree — callers never slice
 * the formatted string or read `Date#getHours()` directly.
 */
export type TimeParts = { hour: string; minute: string; meridiem: string };

/** One formatter for one clock: `en-US`, 12-hour, zero-padded hour+minute. */
function timeFormatter(timeZone?: string): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h12',
    timeZone,
  });
}

export function fmtTimeParts(
  date: Date | string | null | undefined,
  timeZone?: string,
): TimeParts | null {
  const value =
    date instanceof Date ? date : toValidDate(typeof date === 'string' ? date : '');
  if (!value) return null;

  let formatter: Intl.DateTimeFormat;
  try {
    formatter = timeFormatter(resolveZone(timeZone));
  } catch {
    // An unrecognised IANA zone must never blank the UI: fall back to device time.
    try {
      formatter = timeFormatter(undefined);
    } catch {
      return null;
    }
  }

  try {
    const pieces = formatter.formatToParts(value);
    const pick = (type: Intl.DateTimeFormatPartTypes) =>
      pieces.find((piece) => piece.type === type)?.value ?? '';
    const hour = pick('hour');
    const minute = pick('minute');
    if (!hour && !minute) return null;
    return { hour, minute, meridiem: pick('dayPeriod') };
  } catch {
    return null;
  }
}

let deviceZone: string | undefined;
/** Device IANA zone, resolved once — the fallback when no profile zone is set. */
function detectDefaultZone(): string | undefined {
  if (deviceZone !== undefined) return deviceZone;
  try {
    deviceZone = Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
  } catch {
    deviceZone = undefined;
  }
  return deviceZone;
}

function resolveZone(timeZone?: string): string | undefined {
  return timeZone || detectDefaultZone();
}

export function formatTime(iso: string, timeZone?: string): string {
  return fmtTime(iso, timeZone);
}

export function formatDate(iso: string, timeZone?: string): string {
  const date = toValidDate(iso);
  if (!date) return DATE_TIME_INVALID;
  return formatter(
    { weekday: 'short', day: 'numeric', month: 'short' },
    timeZone,
  ).format(date);
}

export function formatDateTime(iso: string, timeZone?: string): string {
  const date = toValidDate(iso);
  if (!date) return DATE_TIME_INVALID;
  const day = formatter({ weekday: 'short', day: 'numeric', month: 'short' }, timeZone).format(date);
  return `${day}, ${fmtTime(date, timeZone)}`;
}

export function formatTimeRange(startsAt: string, endsAt: string, timeZone?: string): string {
  const start = fmtTime(startsAt, timeZone);
  const end = fmtTime(endsAt, timeZone);
  if (!start || !end) return DATE_TIME_INVALID;
  return `${start} – ${end}`;
}

/** Long friendly date in device-local time, e.g. "Sunday, 12 October". */
export function formatLongDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
}

/** Zero-padded day number, e.g. "12". */
export function formatDayNumber(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric' }).format(date);
}

/** Short weekday label, e.g. "Mon". */
export function formatWeekday(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', { weekday: 'short' }).format(date);
}

/** Month + year, e.g. "October 2026". */
export function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(date);
}

/** Header date, e.g. "Mon, 12 Oct". */
export function formatHeaderDate(date: Date): string {
  const weekday = formatWeekday(date);
  const day = formatDayNumber(date);
  const month = new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(date);
  return `${weekday}, ${day} ${month}`;
}

/** Compact day title without a comma, e.g. "Mon 12 Oct" (empty-state copy). */
export function formatDayTitle(date: Date): string {
  const weekday = formatWeekday(date);
  const day = formatDayNumber(date);
  const month = new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(date);
  return `${weekday} ${day} ${month}`;
}

/** Compact shift length from two ISO instants, e.g. "8h 30m" / "8h" / "45m". */
export function formatDuration(startsAt: string, endsAt: string): string {
  const start = new Date(startsAt).getTime();
  const end = new Date(endsAt).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return DATE_TIME_INVALID;
  const totalMinutes = Math.round((end - start) / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}

/** 24-hour wall-clock hour (0–23) of an instant in `timeZone` (device zone by default). */
export function hourOfDay(iso: string, timeZone?: string): number {
  const date = toValidDate(iso);
  if (!date) return -1;
  try {
    const part = new Intl.DateTimeFormat('en-GB', {
      hour: 'numeric',
      hourCycle: 'h23',
      timeZone: timeZone || detectDefaultZone(),
    }).format(date);
    const hour = Number.parseInt(part, 10);
    return Number.isNaN(hour) ? -1 : hour;
  } catch {
    return -1;
  }
}
