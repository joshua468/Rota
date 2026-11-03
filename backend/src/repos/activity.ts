import type { Queryable, TeamScope } from '../db/types';
import { newId } from '../lib/ids';

export interface ActivityInput {
  type: string;
  actorId: string | null;
  summary: string;
  data?: Record<string, unknown>;
}

/**
 * Appends to the team feed. Feed reads use the `(team_id, created_at DESC,
 * id DESC)` index for keyset paging — never OFFSET (Rule 05).
 */
export async function logActivity(shard: Queryable, scope: TeamScope, input: ActivityInput): Promise<string> {
  const id = newId();
  await shard.query(
    'INSERT INTO activity (id, team_id, type, actor_id, summary, data) VALUES ($1, $2, $3, $4, $5, $6)',
    [id, scope.teamId, input.type, input.actorId, input.summary, JSON.stringify(input.data ?? {})],
  );
  return id;
}
