import type { CardData } from './cardData';

export type Summary = {
  /** People currently on a shift, plus the shift they are on. */
  duty: { count: number; shift: CardData | null };
  /** The next shift to start today. */
  next: { shift: CardData | null };
  /** Unassigned shifts, plus the first one still worth claiming. */
  open: { count: number; shift: CardData | null };
  /** Unassigned shifts whose end time has already passed. */
  overdue: number;
};

/**
 * Derive the day's overview from a card list: who is on duty right now, the
 * next shift to start, how many shifts are still unassigned, and how many
 * unassigned shifts have already passed without cover.
 */
export function summarize(cards: CardData[], nowMs: number = Date.now()): Summary {
  const working = new Set<string>();
  const open: CardData[] = [];
  let dutyShift: CardData | null = null;
  let next: CardData | null = null;

  for (const card of cards) {
    if (card.now) {
      for (const person of card.people) {
        if (person.name) working.add(person.name);
      }
      if (!dutyShift) dutyShift = card;
    }
    if (card.variant === 'open') open.push(card);
    if (!card.past && card.start.getTime() >= nowMs) {
      if (!next || card.start.getTime() < next.start.getTime()) next = card;
    }
  }

  return {
    duty: { count: working.size, shift: dutyShift },
    next: { shift: next },
    open: { count: open.length, shift: open.find((card) => !card.past) ?? open[0] ?? null },
    overdue: open.filter((card) => card.past).length,
  };
}
