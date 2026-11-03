import { create } from 'zustand';
import { dayKey } from '@/lib/rota';

/**
 * The day the Home screen shows.
 *
 * It used to live in the screen's own state, which meant any remount of the
 * screen — a back gesture, a tab switch that unmounted it, a hot reload —
 * silently dropped the user back on today. The day is a calendar day, not a
 * screen detail, so it lives here: the strip, the header and the shift list
 * all read the same value, and it survives the screen being rebuilt.
 *
 * The value is a `YYYY-MM-DD` day key (device-local) rather than a timestamp,
 * so the same calendar day stays the same day whatever the clock says.
 */
type HomeState = {
  dayKey: string;
  setDay: (key: string) => void;
  showToday: () => void;
};

export const useHomeStore = create<HomeState>()((set) => ({
  dayKey: dayKey(new Date()),
  setDay: (key) => set({ dayKey: key }),
  showToday: () => set({ dayKey: dayKey(new Date()) }),
}));

/** Turns a `YYYY-MM-DD` day key back into a local `Date` at midnight. */
export function dateFromDayKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  if (!year || !month || !day) return new Date();
  return new Date(year, month - 1, day);
}
