import type { Queryable, TeamScope } from '../db/types';
import { newId } from '../lib/ids';

export type OutboxCategory = 'shifts' | 'swaps';

export interface OutboxInput {
  userId: string;
  category: OutboxCategory;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  urgency?: 'normal' | 'urgent';
}

/**
 * Notifications are an outbox row written in the same transaction as the
 * domain change (push-notifications skill). The dispatcher/push job that
 * drains the table is owned elsewhere — a request never sends push itself.
 */
export async function insertOutbox(
  db: Queryable,
  scope: TeamScope,
  input: OutboxInput,
): Promise<void> {
  await db.query(
    `INSERT INTO outbox (id, team_id, user_id, category, urgency, title, body, data)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      newId(),
      scope.teamId,
      input.userId,
      input.category,
      input.urgency ?? 'normal',
      input.title,
      input.body,
      JSON.stringify(input.data ?? {}),
    ],
  );
}
