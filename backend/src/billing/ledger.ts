import type { LedgerEntry } from '@rota/contract';
import { CursorPayload } from '@rota/contract';
import type { Queryable, TeamScope } from '../db/types';
import { ApiError, badRequest } from '../lib/errors';
import { listLedger, type LedgerRow } from '../repos/ledger';

/**
 * Cursor pagination for the billing ledger (cursor-pagination skill): an
 * opaque base64url token over `{t, i}` compared as a `(created_at, id)` row
 * value, so ties can neither repeat nor hide across pages.
 */

export function toLedgerEntry(row: LedgerRow): LedgerEntry {
  if (row.currency !== 'USD') throw new ApiError('INTERNAL', 500, `unsupported ledger currency ${row.currency}`);
  return {
    id: row.id,
    kind: row.kind,
    amountCents: row.amount_cents,
    currency: 'USD',
    ref: row.ref,
    reason: row.reason,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export function encodeCursor(row: LedgerRow): string {
  return Buffer.from(JSON.stringify({ t: new Date(row.created_at).toISOString(), i: row.id }), 'utf8').toString(
    'base64url',
  );
}

export function decodeCursor(cursor: string): { t: Date; i: string } {
  try {
    const payload = CursorPayload.parse(JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8')));
    return { t: new Date(payload.t), i: payload.i };
  } catch {
    throw badRequest('Invalid cursor');
  }
}

export interface LedgerPage {
  items: LedgerEntry[];
  nextCursor: string | null;
}

export interface LedgerQuery {
  cursor?: string | undefined;
  limit?: number | undefined;
}

export async function ledgerPage(db: Queryable, scope: TeamScope, query: LedgerQuery): Promise<LedgerPage> {
  const limit = query.limit ?? 20;
  const after = query.cursor ? decodeCursor(query.cursor) : undefined;
  const rows = await listLedger(db, scope, { limit: limit + 1, after });
  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  const last = page[page.length - 1];
  return {
    items: page.map(toLedgerEntry),
    nextCursor: hasMore && last ? encodeCursor(last) : null,
  };
}
