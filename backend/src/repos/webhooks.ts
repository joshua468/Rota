import type { DatabaseHandle } from '../db/types';
import { sha256 } from '../lib/crypto';

/**
 * Webhook event inbox (Rule 02: deduped by `(provider, event_key)` in the
 * global database — webhook records are never cached and never team-sharded).
 * The unique index makes replays harmless: the insert simply returns nothing.
 */
export type WebhookStatus = 'received' | 'processed' | 'rejected';

export interface WebhookEventRow {
  id: string;
  provider: string;
  event_key: string;
  payload: Record<string, unknown>;
  status: WebhookStatus;
  note: string | null;
  created_at: Date;
  processed_at: Date | null;
}

export const WEBHOOK_EVENT_COLUMNS = 'id, provider, event_key, payload, status, note, created_at, processed_at';

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** `event + ':' + (data.id ?? data.reference ?? data.tx_ref)` — falls back to a body hash. */
export function webhookEventKey(body: Record<string, unknown>, raw: string): string {
  const event = typeof body.event === 'string' && body.event.length > 0 ? body.event : 'unknown';
  const data = isRecord(body.data) ? body.data : {};
  const id = data.id ?? data.reference ?? data.tx_ref;
  if (id !== undefined && id !== null && id !== '') return `${event}:${String(id)}`;
  return `${event}:${sha256(raw)}`;
}

export async function insertWebhookEvent(
  global: DatabaseHandle,
  input: { provider: string; eventKey: string; payload: Record<string, unknown> },
): Promise<WebhookEventRow | undefined> {
  return global.one<WebhookEventRow>(
    `INSERT INTO webhook_events (provider, event_key, payload)
     VALUES ($1, $2, $3)
     ON CONFLICT (provider, event_key) DO NOTHING
     RETURNING ${WEBHOOK_EVENT_COLUMNS}`,
    [input.provider, input.eventKey, JSON.stringify(input.payload)],
  );
}

export async function getWebhookEvent(global: DatabaseHandle, id: string): Promise<WebhookEventRow | undefined> {
  return global.one<WebhookEventRow>(`SELECT ${WEBHOOK_EVENT_COLUMNS} FROM webhook_events WHERE id = $1`, [id]);
}

export async function getWebhookEventByKey(
  global: DatabaseHandle,
  provider: string,
  eventKey: string,
): Promise<WebhookEventRow | undefined> {
  return global.one<WebhookEventRow>(
    `SELECT ${WEBHOOK_EVENT_COLUMNS} FROM webhook_events WHERE provider = $1 AND event_key = $2`,
    [provider, eventKey],
  );
}

/**
 * Removes an event whose processing job could not be enqueued. Leaving the row
 * behind would make the provider's retry hit `ON CONFLICT DO NOTHING` and the
 * event would never be processed.
 */
export async function deleteWebhookEvent(global: DatabaseHandle, id: string): Promise<void> {
  await global.query("DELETE FROM webhook_events WHERE id = $1 AND status = 'received'", [id]);
}

/** Events left in `received` because a worker crashed between ingest and enqueue. */
export async function staleWebhookEvents(
  global: DatabaseHandle,
  olderThan: Date,
  limit = 100,
): Promise<WebhookEventRow[]> {
  return global.query<WebhookEventRow>(
    `SELECT ${WEBHOOK_EVENT_COLUMNS} FROM webhook_events
      WHERE status = 'received' AND created_at <= $1
      ORDER BY created_at ASC
      LIMIT $2`,
    [olderThan, limit],
  );
}

/**
 * Finalises the event after its side effects are written (or after it is
 * rejected). The `status = 'received'` guard keeps a retry from overwriting a
 * settled event, and a crash before this call simply leaves the event in
 * `received` so the retry re-runs safely against the guarded writes.
 */
export async function settleWebhookEvent(
  global: DatabaseHandle,
  input: { id: string; status: 'processed' | 'rejected'; note: string },
): Promise<boolean> {
  const rows = await global.query<{ id: string }>(
    `UPDATE webhook_events SET status = $2, note = $3, processed_at = now()
      WHERE id = $1 AND status = 'received'
      RETURNING id`,
    [input.id, input.status, input.note],
  );
  return rows.length > 0;
}
