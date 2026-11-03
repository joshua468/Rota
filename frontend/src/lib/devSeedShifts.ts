import { useState } from 'react';
import { useCreateShift, useMembers } from '@/api/queries';
import { dayKey, localIsoFromDayAndTime } from '@/lib/rota';
import { useSessionStore } from '@/stores/session';

type SeedPlan = {
  title: string;
  notes: string;
  from: string;
  to: string;
  location?: string;
  meetingUrl?: string;
  who: 'me' | 'other';
};

const PLAN: SeedPlan[] = [
  {
    title: 'Product Strategy',
    notes: 'Reviewing Q4 roadmap with design team',
    from: '09:30',
    to: '10:30',
    meetingUrl: 'https://zoom.us/j/123456789',
    who: 'other',
  },
  {
    title: 'Marketing Sync',
    notes: 'Quarterly campaign kickoff',
    from: '11:00',
    to: '12:30',
    location: 'Room 402',
    who: 'me',
  },
  {
    title: 'Lunch Cover',
    notes: 'Front desk coverage',
    from: '14:00',
    to: '15:00',
    location: 'Front desk',
    who: 'other',
  },
  {
    title: 'Close Shift',
    notes: 'Evening handover',
    from: '16:00',
    to: '17:00',
    location: 'Main floor',
    who: 'other',
  },
];

export type SeedResult = 'created' | 'already' | 'unavailable';

/**
 * Dev-only helper: writes the four demo cards for *today* through the real
 * create mutation so they persist and exercise the whole pipeline. The API
 * carries a single assignee per shift, so each card becomes one shift.
 */
export function useSeedDemoShifts() {
  const createShift = useCreateShift();
  const members = useMembers();
  const meId = useSessionStore((state) => state.user?.id ?? null);
  const [seeded, setSeeded] = useState(false);

  const seed = async (): Promise<SeedResult> => {
    if (seeded) return 'already';
    if (!meId) return 'unavailable';

    const others = (members.data ?? []).filter((member) => member.id !== meId);
    const today = dayKey(new Date());
    let otherIndex = 0;

    for (const item of PLAN) {
      const userId = item.who === 'me' ? meId : others[otherIndex++]?.id ?? meId;
      const startsAt = localIsoFromDayAndTime(today, item.from);
      const endsAt = localIsoFromDayAndTime(today, item.to);
      if (!startsAt || !endsAt) continue;
      await createShift.mutateAsync({
        userId,
        startsAt,
        endsAt,
        role: item.title,
        location: item.location,
        meetingUrl: item.meetingUrl,
        notes: item.notes,
      });
    }

    setSeeded(true);
    return 'created';
  };

  return { seed, seeded, pending: createShift.isPending, error: createShift.error };
}
