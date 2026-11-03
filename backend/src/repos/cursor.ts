import { CursorPayload } from '@rota/contract';
import { badRequest } from '../lib/errors';

/**
 * Opaque keyset cursor (cursor-pagination skill): base64url(JSON `{t, i}`)
 * where `t` is the sort timestamp and `i` the id tie-break. Compared as a
 * `(timestamp, id)` row value, so ties can neither repeat nor hide across
 * pages. Never OFFSET (Rule 05).
 */
export interface CursorPosition {
  t: Date;
  i: string;
}

export function encodeCursor(t: Date | string, id: string): string {
  const iso = t instanceof Date ? t.toISOString() : new Date(t).toISOString();
  return Buffer.from(JSON.stringify({ t: iso, i: id }), 'utf8').toString('base64url');
}

export function decodeCursor(cursor: string): CursorPosition {
  try {
    const payload = CursorPayload.parse(JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8')));
    return { t: new Date(payload.t), i: payload.i };
  } catch {
    throw badRequest('Invalid cursor');
  }
}
