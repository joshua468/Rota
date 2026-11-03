import type { Queryable, TeamScope } from '../db/types';
import { newId } from '../lib/ids';

/**
 * Append-only ledger (Rule 02, seat-billing-ledger skill). The table carries a
 * trigger that rejects UPDATE/DELETE, and `ref` is unique so a retried job can
 * never double-record the same payment.
 */
export interface LedgerRow {
  id: string;
  team_id: string;
  kind: 'charge' | 'credit' | 'refund' | 'adjustment';
  amount_cents: number;
  currency: string;
  ref: string;
  reason: string;
  created_at: Date;
}

export const LEDGER_COLUMNS =
  'id, team_id, kind, amount_cents, currency, ref, reason, created_at';

export interface AppendLedgerInput {
  kind: LedgerRow['kind'];
  amountCents: number;
  /** globally unique payment reference, e.g. `pay:<provider reference>` */
  ref: string;
  reason: string;
}

/**
 * Returns the inserted row, or `undefined` when `ref` already exists — callers
 * treat that as "already recorded" and continue (job retries stay idempotent).
 */
export async function appendLedgerEntry(
  db: Queryable,
  scope: TeamScope,
  input: AppendLedgerInput,
): Promise<LedgerRow | undefined> {
  return db.one<LedgerRow>(
    `INSERT INTO ledger_entries (id, team_id, kind, amount_cents, currency, ref, reason)
     VALUES ($1, $2, $3, $4, 'USD', $5, $6)
     ON CONFLICT (ref) DO NOTHING
     RETURNING ${LEDGER_COLUMNS}`,
    [newId(), scope.teamId, input.kind, input.amountCents, input.ref, input.reason],
  );
}

export interface ListLedgerArgs {
  limit: number;
  /** keyset position from the previous page; omit for the first page */
  after?: { t: Date; i: string };
}

/** Keyset paging on `(created_at DESC, id DESC)` — never OFFSET (Rule 05). */
export async function listLedger(db: Queryable, scope: TeamScope, args: ListLedgerArgs): Promise<LedgerRow[]> {
  if (args.after) {
    return db.query<LedgerRow>(
      `SELECT ${LEDGER_COLUMNS} FROM ledger_entries
        WHERE team_id = $1 AND (created_at, id) < ($2::timestamptz, $3::uuid)
        ORDER BY created_at DESC, id DESC
        LIMIT $4`,
      [scope.teamId, args.after.t.toISOString(), args.after.i, args.limit],
    );
  }
  return db.query<LedgerRow>(
    `SELECT ${LEDGER_COLUMNS} FROM ledger_entries
      WHERE team_id = $1
      ORDER BY created_at DESC, id DESC
      LIMIT $2`,
    [scope.teamId, args.limit],
  );
}
