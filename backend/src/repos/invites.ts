import type { Role } from '@rota/contract';
import { assertSeatAvailable } from '../billing/entitlements';
import type { Queryable, TeamScope } from '../db/types';
import { sha256 } from '../lib/crypto';
import { newId, randomSecret } from '../lib/ids';

export const INVITE_TTL_DAYS = 7;

export interface InviteRow {
  id: string;
  team_id: string;
  email: string;
  role: Exclude<Role, 'owner'>;
  token_hash: string;
  invited_by: string;
  expires_at: Date;
  accepted_at: Date | null;
  revoked_at: Date | null;
  created_at: Date;
}

export type InviteStatus = 'pending' | 'accepted' | 'revoked' | 'expired';

export function inviteStatus(row: InviteRow): InviteStatus {
  if (row.accepted_at) return 'accepted';
  if (row.revoked_at) return 'revoked';
  if (row.expires_at.getTime() <= Date.now()) return 'expired';
  return 'pending';
}

/**
 * Token format from docs/SHARDING.md: `teamId.secret`, so a stray URL still
 * routes to the right shard before the hash lookup. Only the hash is stored.
 */
export async function createInvite(
  db: Queryable,
  input: { teamId: string; email: string; role: Exclude<Role, 'owner'>; invitedBy: string },
): Promise<{ token: string; row: InviteRow }> {
  const token = `${input.teamId}.${randomSecret(24)}`;
  const expiresAt = new Date(Date.now() + INVITE_TTL_DAYS * 86_400_000);
  const row = await db.one<InviteRow>(
    `INSERT INTO invites (id, team_id, email, role, token_hash, invited_by, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [newId(), input.teamId, input.email.toLowerCase(), input.role, sha256(token), input.invitedBy, expiresAt],
  );
  if (!row) throw new Error('failed to create invite');
  return { token, row };
}

export async function findInviteByToken(db: Queryable, token: string): Promise<InviteRow | undefined> {
  return db.one<InviteRow>('SELECT * FROM invites WHERE token_hash = $1', [sha256(token)]);
}

export async function revokeInvite(db: Queryable, teamId: string, inviteId: string): Promise<boolean> {
  const updated = await db.query<{ id: string }>(
    'UPDATE invites SET revoked_at = now() WHERE id = $1 AND team_id = $2 AND accepted_at IS NULL AND revoked_at IS NULL RETURNING id',
    [inviteId, teamId],
  );
  return updated.length > 0;
}

/**
 * Consumes an invite inside one transaction: validate → lock subscription →
 * seat check → membership upsert → mark accepted. Two racing acceptances of
 * the same token serialize here, so the last seat cannot be double-sold.
 */
export async function acceptInvite(
  db: Queryable,
  scope: TeamScope,
  token: string,
  user: { id: string; email: string },
): Promise<{ teamId: string; teamName: string; role: Role } | null> {
  return db.tx(async (tx) => {
    const invite = await tx.one<InviteRow>('SELECT * FROM invites WHERE token_hash = $1 FOR UPDATE', [
      sha256(token),
    ]);
    if (!invite || invite.team_id !== scope.teamId) return null;
    if (inviteStatus(invite) !== 'pending') return null;
    if (invite.email.toLowerCase() !== user.email.toLowerCase()) return null;

    await assertSeatAvailable(tx, invite.team_id, 1);

    const existing = await tx.one<{ role: Role; active: boolean }>(
      'SELECT role, active FROM team_members WHERE team_id = $1 AND user_id = $2',
      [invite.team_id, user.id],
    );
    let role: Role = invite.role;
    if (existing) {
      if (existing.active) {
        role = existing.role;
      } else {
        await tx.query('UPDATE team_members SET active = true, role = $1, joined_at = now() WHERE team_id = $2 AND user_id = $3', [
          invite.role,
          invite.team_id,
          user.id,
        ]);
      }
    } else {
      await tx.query('INSERT INTO team_members (team_id, user_id, role, active) VALUES ($1, $2, $3, true)', [
        invite.team_id,
        user.id,
        invite.role,
      ]);
    }
    await tx.query('UPDATE invites SET accepted_at = now() WHERE id = $1', [invite.id]);
    const team = await tx.one<{ name: string }>('SELECT name FROM teams WHERE id = $1', [invite.team_id]);
    return { teamId: invite.team_id, teamName: team?.name ?? '', role };
  });
}
