import { fileURLToPath } from 'node:url';
import type { Role } from '@rota/contract';
import { loadEnv } from '../env';
import { loadDotEnv } from '../lib/dotenv';
import { createTopology, type Topology } from './topology';

/**
 * Dev/ops tool: grant a user full access by changing their `team_members.role`
 * in every team they belong to. Roles live on the shard with the team, so we
 * scan each shard for the user's memberships (there is no cross-shard SQL).
 *
 *   pnpm --filter @rota/backend promote <email> [owner|admin|manager|member] [--team <teamId>]
 *
 * Defaults to `owner` so the account can reach every feature, including the
 * owner-only billing screens. With `--team`, the membership is upserted on that
 * team (useful when the user belongs to no team yet); without it, every
 * existing membership is updated. This bypasses the API on purpose (it is an
 * admin data fix), so never wire it into a request path.
 */
export const PROMOTE_ROLES: readonly Role[] = ['owner', 'admin', 'manager', 'member'];

export type PromoteChange = { teamId: string; from: string; to: Role };
export type PromoteResult = { userId: string; email: string; changes: PromoteChange[] };

export async function promoteUser(
  topology: Topology,
  email: string,
  role: Role,
  teamId?: string,
): Promise<PromoteResult | null> {
  const user = await topology.global.one<{ id: string; email: string }>(
    'SELECT id, email FROM users WHERE lower(email) = $1',
    [email.trim().toLowerCase()],
  );
  if (!user) return null;

  const changes: PromoteChange[] = [];

  if (teamId) {
    const shard = topology.shardDb(topology.scopeFor(teamId));
    const existing = await shard.one<{ role: string }>(
      'SELECT role FROM team_members WHERE team_id = $1 AND user_id = $2',
      [teamId, user.id],
    );
    if (!existing) {
      await shard.query('INSERT INTO team_members (team_id, user_id, role) VALUES ($1, $2, $3)', [
        teamId,
        user.id,
        role,
      ]);
      changes.push({ teamId, from: '(none)', to: role });
    } else if (existing.role !== role) {
      await shard.query('UPDATE team_members SET role = $1 WHERE team_id = $2 AND user_id = $3', [
        role,
        teamId,
        user.id,
      ]);
      changes.push({ teamId, from: existing.role, to: role });
    }
    return { userId: user.id, email: user.email, changes };
  }

  for (const shard of topology.shards) {
    const rows = await shard.query<{ team_id: string; role: string }>(
      'SELECT team_id, role FROM team_members WHERE user_id = $1',
      [user.id],
    );
    for (const row of rows) {
      if (row.role === role) continue;
      await shard.query('UPDATE team_members SET role = $1 WHERE team_id = $2 AND user_id = $3', [
        role,
        row.team_id,
        user.id,
      ]);
      changes.push({ teamId: row.team_id, from: row.role, to: role });
    }
  }
  return { userId: user.id, email: user.email, changes };
}

async function main(): Promise<void> {
  loadDotEnv();
  const env = loadEnv();
  const rest = process.argv.slice(2);
  const teamFlag = rest.indexOf('--team');
  let teamId: string | undefined;
  if (teamFlag >= 0) {
    teamId = rest[teamFlag + 1];
    rest.splice(teamFlag, 2);
  }
  const [email, roleArg = 'owner'] = rest;
  if (!email) {
    console.error('usage: pnpm --filter @rota/backend promote <email> [owner|admin|manager|member] [--team <teamId>]');
    process.exit(1);
  }
  const role = roleArg as Role;
  if (!PROMOTE_ROLES.includes(role)) {
    console.error(`role must be one of: ${PROMOTE_ROLES.join(', ')}`);
    process.exit(1);
  }

  const topology = await createTopology(env);
  try {
    const result = await promoteUser(topology, email, role, teamId);
    if (!result) {
      console.log(`promote: no user found with email ${email}`);
      return;
    }
    if (result.changes.length === 0) {
      console.log(`promote: ${email} already has role "${role}" (or belongs to no team)`);
      return;
    }
    for (const change of result.changes) {
      console.log(`promote: ${email} in team ${change.teamId}: ${change.from} -> ${change.to}`);
    }
  } finally {
    await topology.close();
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
