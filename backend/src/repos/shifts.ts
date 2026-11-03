import type { AssignmentStatus, Shift } from '@rota/contract';
import type { Queryable, TeamScope } from '../db/types';
import { newId } from '../lib/ids';
import type { CursorPosition } from './cursor';
import { isoStamp } from './public';

export interface ShiftRow {
  id: string;
  team_id: string;
  /** null when the shift is open / nobody is assigned. */
  user_id: string | null;
  assignment_status: AssignmentStatus;
  starts_at: Date;
  ends_at: Date;
  role: string | null;
  location: string | null;
  meeting_url: string | null;
  notes: string | null;
  version: number;
  created_by: string | null;
  created_at: Date;
  updated_at: Date;
}

export const SHIFT_COLUMNS =
  'id, team_id, user_id, assignment_status, starts_at, ends_at, role, location, meeting_url, notes, version, created_by, created_at, updated_at';

export function toShift(
  row: ShiftRow,
  user: { id: string; name: string; avatarUrl: string | null } | null,
): Shift {
  return {
    id: row.id,
    teamId: row.team_id,
    userId: row.user_id,
    user,
    assignmentStatus: row.assignment_status,
    startsAt: isoStamp(row.starts_at),
    endsAt: isoStamp(row.ends_at),
    role: row.role,
    location: row.location,
    meetingUrl: row.meeting_url,
    notes: row.notes,
    version: row.version,
  };
}

/**
 * A shift id carries no shard hint, so resolution walks the shards in turn —
 * one statement per shard, never across shards (docs/SHARDING.md). This is the
 * same pattern `membershipsForUser` uses.
 */
export async function findShift(
  shards: readonly Queryable[],
  shiftId: string,
): Promise<ShiftRow | undefined> {
  for (const shard of shards) {
    const row = await shard.one<ShiftRow>(`SELECT ${SHIFT_COLUMNS} FROM shifts WHERE id = $1`, [shiftId]);
    if (row) return row;
  }
  return undefined;
}

export async function getShift(db: Queryable, scope: TeamScope, shiftId: string): Promise<ShiftRow | undefined> {
  return db.one<ShiftRow>(`SELECT ${SHIFT_COLUMNS} FROM shifts WHERE id = $1 AND team_id = $2`, [
    shiftId,
    scope.teamId,
  ]);
}

export async function getShiftsByIds(
  db: Queryable,
  scope: TeamScope,
  ids: readonly string[],
): Promise<Map<string, ShiftRow>> {
  const unique = [...new Set(ids)];
  const found = new Map<string, ShiftRow>();
  if (unique.length === 0) return found;
  const placeholders = unique.map((_, index) => `$${index + 2}`).join(', ');
  const rows = await db.query<ShiftRow>(
    `SELECT ${SHIFT_COLUMNS} FROM shifts WHERE team_id = $1 AND id IN (${placeholders})`,
    [scope.teamId, ...unique],
  );
  for (const row of rows) found.set(row.id, row);
  return found;
}

export interface OverlapArgs {
  userId: string;
  startsAt: Date;
  endsAt: Date;
  /** ignored when checking a brand-new shift */
  excludeShiftId?: string | undefined;
}

/** Half-open intervals touch without overlapping: `a.starts < b.ends && a.ends > b.starts`. */
export async function hasOverlap(db: Queryable, scope: TeamScope, args: OverlapArgs): Promise<boolean> {
  const params: unknown[] = [scope.teamId, args.userId, args.startsAt.toISOString(), args.endsAt.toISOString()];
  const conditions = ['team_id = $1', 'user_id = $2', 'starts_at < $4::timestamptz', 'ends_at > $3::timestamptz'];
  if (args.excludeShiftId) {
    params.push(args.excludeShiftId);
    conditions.push(`id <> $${params.length}`);
  }
  const row = await db.one(`SELECT 1 FROM shifts WHERE ${conditions.join(' AND ')} LIMIT 1`, params);
  return row !== undefined;
}

export interface InsertShiftInput {
  userId: string;
  startsAt: Date;
  endsAt: Date;
  role?: string | undefined;
  location?: string | undefined;
  meetingUrl?: string | undefined;
  notes?: string | undefined;
  createdBy: string;
  /**
   * Someone other than the assignee schedules a shift, so it lands in their
   * inbox as `pending` until they accept or decline it. Assigning your own
   * shift records `accepted` — there is nobody left to answer.
   */
  assignmentStatus?: AssignmentStatus;
}

export async function insertShift(db: Queryable, scope: TeamScope, input: InsertShiftInput): Promise<ShiftRow> {
  const row = await db.one<ShiftRow>(
    `INSERT INTO shifts (id, team_id, user_id, assignment_status, starts_at, ends_at, role, location, meeting_url, notes, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING ${SHIFT_COLUMNS}`,
    [
      newId(),
      scope.teamId,
      input.userId,
      input.assignmentStatus ?? 'pending',
      input.startsAt.toISOString(),
      input.endsAt.toISOString(),
      input.role ?? null,
      input.location ?? null,
      input.meetingUrl ?? null,
      input.notes ?? null,
      input.createdBy,
    ],
  );
  if (!row) throw new Error('failed to create shift');
  return row;
}

export interface UpdateShiftInput {
  startsAt: Date;
  endsAt: Date;
  role: string | null;
  location: string | null;
  meetingUrl: string | null;
  notes: string | null;
  /** new assignee; `undefined` keeps the current one */
  userId?: string;
  assignmentStatus?: AssignmentStatus;
}

/** Every update bumps `version` (optimistic locking for the client). */
export async function updateShift(
  db: Queryable,
  scope: TeamScope,
  shiftId: string,
  values: UpdateShiftInput,
): Promise<ShiftRow | undefined> {
  const reassign = values.userId !== undefined;
  return db.one<ShiftRow>(
    `UPDATE shifts
        SET starts_at = $3::timestamptz, ends_at = $4::timestamptz, role = $5, location = $6,
            meeting_url = $7, notes = $8,
            ${reassign ? 'user_id = $9, assignment_status = $10,' : ''}
            version = version + 1, updated_at = now()
      WHERE id = $1 AND team_id = $2
      RETURNING ${SHIFT_COLUMNS}`,
    reassign
      ? [
          shiftId,
          scope.teamId,
          values.startsAt.toISOString(),
          values.endsAt.toISOString(),
          values.role,
          values.location,
          values.meetingUrl,
          values.notes,
          values.userId,
          values.assignmentStatus ?? 'pending',
        ]
      : [
          shiftId,
          scope.teamId,
          values.startsAt.toISOString(),
          values.endsAt.toISOString(),
          values.role,
          values.location,
          values.meetingUrl,
          values.notes,
        ],
  );
}

export async function deleteShift(
  db: Queryable,
  scope: TeamScope,
  shiftId: string,
): Promise<ShiftRow | undefined> {
  return db.one<ShiftRow>(`DELETE FROM shifts WHERE id = $1 AND team_id = $2 RETURNING ${SHIFT_COLUMNS}`, [
    shiftId,
    scope.teamId,
  ]);
}

/**
 * The assignee answers an assignment. `decline` also releases the shift: the
 * assignee is cleared so it goes back to the team as an open shift, and the
 * `WHERE user_id IS NOT NULL` guard makes both branches idempotent against a
 * shift that changed hands between read and write.
 */
export async function respondToShift(
  db: Queryable,
  scope: TeamScope,
  shiftId: string,
  action: 'accept' | 'decline',
): Promise<ShiftRow | undefined> {
  const setAssignment =
    action === 'accept'
      ? "assignment_status = 'accepted'"
      : "user_id = NULL, assignment_status = 'accepted'";
  return db.one<ShiftRow>(
    `UPDATE shifts
        SET ${setAssignment},
            version = version + 1,
            updated_at = now()
      WHERE id = $1 AND team_id = $2 AND user_id IS NOT NULL
      RETURNING ${SHIFT_COLUMNS}`,
    [shiftId, scope.teamId],
  );
}

export interface ListShiftsArgs {
  from: Date;
  to: Date;
  userId?: string | undefined;
  after?: CursorPosition | undefined;
  limit: number;
}

/** Keyset paging on `(starts_at, id)` inside the requested window (Rule 05). */
export async function listShifts(db: Queryable, scope: TeamScope, args: ListShiftsArgs): Promise<ShiftRow[]> {
  const params: unknown[] = [scope.teamId, args.to.toISOString(), args.from.toISOString()];
  const conditions = ['team_id = $1', 'starts_at < $2::timestamptz', 'ends_at > $3::timestamptz'];
  if (args.userId) {
    params.push(args.userId);
    conditions.push(`user_id = $${params.length}`);
  }
  if (args.after) {
    params.push(args.after.t.toISOString(), args.after.i);
    conditions.push(`(starts_at, id) > ($${params.length - 1}::timestamptz, $${params.length}::uuid)`);
  }
  params.push(args.limit);
  return db.query<ShiftRow>(
    `SELECT ${SHIFT_COLUMNS} FROM shifts
      WHERE ${conditions.join(' AND ')}
      ORDER BY starts_at ASC, id ASC
      LIMIT $${params.length}`,
    params,
  );
}
