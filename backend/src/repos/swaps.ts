import type { SwapStatus } from '@rota/contract';
import type { Queryable, TeamScope } from '../db/types';
import { newId } from '../lib/ids';
import type { CursorPosition } from './cursor';

export interface SwapRow {
  id: string;
  team_id: string;
  shift_id: string;
  from_user_id: string;
  to_user_id: string | null;
  note: string | null;
  status: SwapStatus;
  decided_by: string | null;
  decided_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export const SWAP_COLUMNS =
  'id, team_id, shift_id, from_user_id, to_user_id, note, status, decided_by, decided_at, created_at, updated_at';

/** Same shard walk as `findShift`: a bare id carries no shard hint. */
export async function findSwap(
  shards: readonly Queryable[],
  swapId: string,
): Promise<SwapRow | undefined> {
  for (const shard of shards) {
    const row = await shard.one<SwapRow>(`SELECT ${SWAP_COLUMNS} FROM swap_requests WHERE id = $1`, [swapId]);
    if (row) return row;
  }
  return undefined;
}

/** At most one `pending` request per shift — the caller enforces it under a shift lock. */
export async function pendingForShift(
  db: Queryable,
  scope: TeamScope,
  shiftId: string,
): Promise<SwapRow | undefined> {
  return db.one<SwapRow>(
    `SELECT ${SWAP_COLUMNS} FROM swap_requests WHERE team_id = $1 AND shift_id = $2 AND status = 'pending'`,
    [scope.teamId, shiftId],
  );
}

export interface InsertSwapInput {
  shiftId: string;
  fromUserId: string;
  /** null = open request (any member may take it) */
  toUserId: string | null;
  note: string | null;
}

export async function insertSwap(db: Queryable, scope: TeamScope, input: InsertSwapInput): Promise<SwapRow> {
  const row = await db.one<SwapRow>(
    `INSERT INTO swap_requests (id, team_id, shift_id, from_user_id, to_user_id, note)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${SWAP_COLUMNS}`,
    [newId(), scope.teamId, input.shiftId, input.fromUserId, input.toUserId, input.note],
  );
  if (!row) throw new Error('failed to create swap request');
  return row;
}

/**
 * Writes the decision only while the row is still `pending`, so two racing
 * decisions cannot both win. Returns undefined when the row was already
 * decided (or gone) and the caller surfaces a CONFLICT.
 */
export async function decideSwap(
  db: Queryable,
  scope: TeamScope,
  swapId: string,
  decision: { status: SwapStatus; decidedBy: string },
): Promise<SwapRow | undefined> {
  const rows = await db.query<SwapRow>(
    `UPDATE swap_requests
        SET status = $3, decided_by = $4, decided_at = now(), updated_at = now()
      WHERE id = $1 AND team_id = $2 AND status = 'pending'
      RETURNING ${SWAP_COLUMNS}`,
    [swapId, scope.teamId, decision.status, decision.decidedBy],
  );
  return rows[0];
}

export interface ListSwapsArgs {
  status?: SwapStatus | undefined;
  after?: CursorPosition | undefined;
  limit: number;
}

/** Keyset paging on `(created_at, id)` DESC — never OFFSET (Rule 05). */
export async function listSwaps(db: Queryable, scope: TeamScope, args: ListSwapsArgs): Promise<SwapRow[]> {
  const params: unknown[] = [scope.teamId];
  const conditions = ['team_id = $1'];
  if (args.status) {
    params.push(args.status);
    conditions.push(`status = $${params.length}`);
  }
  if (args.after) {
    params.push(args.after.t.toISOString(), args.after.i);
    conditions.push(`(created_at, id) < ($${params.length - 1}::timestamptz, $${params.length}::uuid)`);
  }
  params.push(args.limit);
  return db.query<SwapRow>(
    `SELECT ${SWAP_COLUMNS} FROM swap_requests
      WHERE ${conditions.join(' AND ')}
      ORDER BY created_at DESC, id DESC
      LIMIT $${params.length}`,
    params,
  );
}
