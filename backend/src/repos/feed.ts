import type { Queryable, TeamScope } from '../db/types';
import type { CursorPosition } from './cursor';

export interface ActivityRow {
  id: string;
  team_id: string;
  type: string;
  actor_id: string | null;
  summary: string;
  data: Record<string, unknown>;
  created_at: Date;
}

export const ACTIVITY_COLUMNS = 'id, team_id, type, actor_id, summary, data, created_at';

export interface ListActivityArgs {
  after?: CursorPosition | undefined;
  limit: number;
}

/**
 * Keyset paging over the `(team_id, created_at DESC, id DESC)` index that ships
 * in 0001_init.sql — row-value comparison keeps ties correct and OFFSET is
 * banned for feeds (Rule 05, cursor-pagination skill).
 */
export async function listActivity(
  db: Queryable,
  scope: TeamScope,
  args: ListActivityArgs,
): Promise<ActivityRow[]> {
  if (args.after) {
    return db.query<ActivityRow>(
      `SELECT ${ACTIVITY_COLUMNS} FROM activity
        WHERE team_id = $1 AND (created_at, id) < ($2::timestamptz, $3::uuid)
        ORDER BY created_at DESC, id DESC
        LIMIT $4`,
      [scope.teamId, args.after.t.toISOString(), args.after.i, args.limit],
    );
  }
  return db.query<ActivityRow>(
    `SELECT ${ACTIVITY_COLUMNS} FROM activity
      WHERE team_id = $1
      ORDER BY created_at DESC, id DESC
      LIMIT $2`,
    [scope.teamId, args.limit],
  );
}
