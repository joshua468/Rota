import type { Role } from '@rota/contract';
import type { Queryable, TeamScope } from '../db/types';

export interface MembershipRow {
  team_id: string;
  user_id: string;
  role: Role;
  active: boolean;
  joined_at: Date;
}

/**
 * Membership lives on the shard with the team, so resolving "which team is
 * this user in" queries each shard in turn — never across shards in one
 * statement (docs/SHARDING.md).
 */
export async function membershipsForUser(
  shards: readonly Queryable[],
  userId: string,
): Promise<(MembershipRow & { teamName: string })[]> {
  const found: (MembershipRow & { teamName: string })[] = [];
  for (const shard of shards) {
    const rows = await shard.query<MembershipRow & { teamName: string }>(
      `SELECT tm.team_id, tm.user_id, tm.role, tm.active, tm.joined_at, t.name AS "teamName"
         FROM team_members tm
         JOIN teams t ON t.id = tm.team_id
        WHERE tm.user_id = $1 AND tm.active = true
        ORDER BY tm.joined_at ASC`,
      [userId],
    );
    found.push(...rows);
  }
  return found;
}

export async function membershipIn(
  shard: Queryable,
  scope: TeamScope,
  userId: string,
): Promise<MembershipRow | undefined> {
  return shard.one<MembershipRow>(
    'SELECT team_id, user_id, role, active, joined_at FROM team_members WHERE team_id = $1 AND user_id = $2',
    [scope.teamId, userId],
  );
}
