import type { DatabaseHandle } from '../db/types';
import { idempotencyInProgress, idempotencyMismatch } from '../lib/errors';

/**
 * HTTP idempotency for payment-creating requests (webhook-idempotency skill).
 * Rows live in Postgres (global database — keys are per user, not per team),
 * never in Redis only (Rule 02).
 *
 * - new key → insert `in_flight`, caller runs, response stored on finish
 * - same key + same hash + finished → replay the stored response verbatim
 * - same key + different hash → 422 IDEMPOTENCY_MISMATCH
 * - same key still in flight → 409 IDEMPOTENCY_IN_PROGRESS
 * - expired (> 24 h) or in-flight for > 5 min → stale key is deleted and taken over
 * - a 5xx releases the key (`releaseIdempotent`) so the client can retry
 */

export const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000;
export const IN_FLIGHT_TAKEOVER_MS = 5 * 60 * 1000;

export interface IdempotencyRow {
  id: string;
  user_id: string;
  key: string;
  request_hash: string;
  state: 'in_flight' | 'finished';
  response_status: number | null;
  response_body: unknown;
  created_at: Date;
  expires_at: Date;
}

export type BeginResult =
  | { kind: 'owned' }
  | { kind: 'replay'; status: number; body: unknown };

export interface BeginInput {
  userId: string;
  key: string;
  requestHash: string;
  now?: Date;
}

export async function beginIdempotent(global: DatabaseHandle, input: BeginInput): Promise<BeginResult> {
  const now = input.now ?? new Date();
  const expiresAt = new Date(now.getTime() + IDEMPOTENCY_TTL_MS);

  return global.tx(async (tx) => {
    const existing = await tx.one<IdempotencyRow>(
      'SELECT * FROM idempotency_keys WHERE user_id = $1 AND key = $2 FOR UPDATE',
      [input.userId, input.key],
    );

    if (existing) {
      const expired = new Date(existing.expires_at).getTime() <= now.getTime();
      const orphaned =
        existing.state === 'in_flight' &&
        new Date(existing.created_at).getTime() <= now.getTime() - IN_FLIGHT_TAKEOVER_MS;
      if (expired || orphaned) {
        await tx.query('DELETE FROM idempotency_keys WHERE user_id = $1 AND key = $2', [
          input.userId,
          input.key,
        ]);
      } else if (existing.request_hash !== input.requestHash) {
        throw idempotencyMismatch();
      } else if (existing.state === 'finished') {
        return {
          kind: 'replay' as const,
          status: existing.response_status ?? 500,
          body: existing.response_body ?? null,
        };
      } else {
        throw idempotencyInProgress();
      }
    }

    const inserted = await tx.one<{ id: string }>(
      `INSERT INTO idempotency_keys (user_id, key, request_hash, expires_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, key) DO NOTHING
       RETURNING id`,
      [input.userId, input.key, input.requestHash, expiresAt],
    );
    if (!inserted) throw idempotencyInProgress();
    return { kind: 'owned' as const };
  });
}

export interface FinishInput {
  userId: string;
  key: string;
  status: number;
  body: unknown;
}

export async function finishIdempotent(global: DatabaseHandle, input: FinishInput): Promise<void> {
  await global.query(
    `UPDATE idempotency_keys SET state = 'finished', response_status = $3, response_body = $4
      WHERE user_id = $1 AND key = $2`,
    [input.userId, input.key, input.status, JSON.stringify(input.body ?? null)],
  );
}

/** Releases a key after a server-side failure so the retry may start over. */
export async function releaseIdempotent(
  global: DatabaseHandle,
  input: { userId: string; key: string },
): Promise<void> {
  await global.query(
    `DELETE FROM idempotency_keys WHERE user_id = $1 AND key = $2 AND state = 'in_flight'`,
    [input.userId, input.key],
  );
}

export async function cleanupExpiredIdempotency(
  global: DatabaseHandle,
  now: Date = new Date(),
): Promise<number> {
  const rows = await global.query<{ id: string }>('DELETE FROM idempotency_keys WHERE expires_at <= $1 RETURNING id', [
    now,
  ]);
  return rows.length;
}

/** Stable key order so the same logical request always hashes identically. */
export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null';
  if (Array.isArray(value)) return `[${value.map((item) => canonicalJson(item)).join(',')}]`;
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonicalJson(v)}`).join(',')}}`;
}
