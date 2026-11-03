import { Expo, type ExpoPushMessage } from 'expo-server-sdk';
import type { Logger } from 'pino';
import type { AppDeps } from '../app';
import type { DatabaseHandle, Queryable } from '../db/types';
import { backoffMs, type Queue } from './queue';

/**
 * Outbox dispatcher (push-notifications skill). Domain changes write an
 * `outbox` row in their own transaction; this job — never the request path —
 * loads recipient settings fresh from primary, honours category toggles and
 * quiet hours, and delivers to every device token via `expo-server-sdk`.
 */
export const PUSH_QUEUE = 'push';
export const MAX_PUSH_ATTEMPTS = 5;

/**
 * A domain route writes outbox rows then asks the queue to drain them. The
 * request never sends push itself (Rule 01); this only enqueues a dispatcher
 * run, which scans every shard for rows due now.
 */
export function requestPushDelivery(queue: Queue): Promise<string> {
  return queue.add(PUSH_QUEUE, {}, { attempts: MAX_PUSH_ATTEMPTS });
}

export interface OutboxRow {
  id: string;
  team_id: string | null;
  user_id: string;
  category: 'shifts' | 'swaps' | 'billing';
  urgency: 'normal' | 'urgent';
  title: string;
  body: string;
  data: Record<string, unknown>;
  status: 'pending' | 'sent' | 'failed';
  attempts: number;
  next_attempt_at: Date;
  created_at: Date;
}

export interface PushSettings {
  quiet_start: string;
  quiet_end: string;
  time_zone: string;
  notif_shifts: boolean;
  notif_swaps: boolean;
  notif_billing: boolean;
}

export type PushSender = (messages: ExpoPushMessage[]) => Promise<void>;

const OUTBOX_COLUMNS =
  'id, team_id, user_id, category, urgency, title, body, data, status, attempts, next_attempt_at, created_at';

function parseHhMm(value: string): number | null {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

/** Minutes since local midnight in `timeZone` (falls back to UTC if invalid). */
export function localMinutes(date: Date, timeZone: string): number {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(date);
    const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0');
    const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? '0');
    return (hour % 24) * 60 + minute;
  } catch {
    return date.getUTCHours() * 60 + date.getUTCMinutes();
  }
}

/**
 * `null` when `now` is outside the quiet window, otherwise the milliseconds
 * until it ends. Windows may wrap midnight; an empty window (start == end) is
 * never quiet. Local wall-clock minutes keep DST days to at most an hour of
 * scheduling skew instead of a wrong-day delivery.
 */
export function msUntilQuietEnd(now: Date, quietStart: string, quietEnd: string, timeZone: string): number | null {
  const start = parseHhMm(quietStart);
  const end = parseHhMm(quietEnd);
  if (start === null || end === null || start === end) return null;
  const minutes = localMinutes(now, timeZone);
  const inside = start < end ? minutes >= start && minutes < end : minutes >= start || minutes < end;
  if (!inside) return null;
  const minutesUntilEnd = (end - minutes + 1440) % 1440;
  const secondsIntoMinute = now.getUTCSeconds() * 1000 + now.getUTCMilliseconds();
  return Math.max(0, minutesUntilEnd * 60_000 - secondsIntoMinute);
}

async function markSent(db: Queryable, row: OutboxRow): Promise<void> {
  await db.query(
    `UPDATE outbox SET status = 'sent', updated_at = now()
      WHERE id = $1 AND status = 'sending' AND team_id IS NOT DISTINCT FROM $2`,
    [row.id, row.team_id],
  );
}

async function markFailed(db: Queryable, row: OutboxRow, attempts: number): Promise<void> {
  await db.query(
    `UPDATE outbox SET status = 'failed', attempts = $3, updated_at = now()
      WHERE id = $1 AND status = 'sending' AND team_id IS NOT DISTINCT FROM $2`,
    [row.id, row.team_id, attempts],
  );
}

async function markAttempt(db: Queryable, row: OutboxRow, attempts: number, nextAttemptAt: Date): Promise<void> {
  await db.query(
    `UPDATE outbox SET status = 'pending', attempts = $3, next_attempt_at = $4, updated_at = now()
      WHERE id = $1 AND status = 'sending' AND team_id IS NOT DISTINCT FROM $2`,
    [row.id, row.team_id, attempts, nextAttemptAt],
  );
}

/**
 * Claims due rows atomically with `FOR UPDATE SKIP LOCKED`, so two BullMQ
 * workers can never deliver the same outbox row. The claim moves the row to
 * `sending` and increments attempts; every terminal transition requires that
 * state, which makes a stale worker's write a no-op.
 */
async function claimDue(db: Queryable, now: Date): Promise<OutboxRow[]> {
  // A crashed worker can leave a row in `sending`; return it to the queue after
  // a lease longer than any legitimate send.
  await db.query(
    "UPDATE outbox SET status = 'pending', next_attempt_at = now(), updated_at = now() WHERE status = 'sending' AND updated_at < now() - interval '15 minutes'",
  );
  return db.query<OutboxRow>(
    `UPDATE outbox SET status = 'sending', attempts = attempts + 1, updated_at = now()
      WHERE id IN (
        SELECT id FROM outbox
         WHERE status = 'pending' AND next_attempt_at <= $1
         ORDER BY created_at ASC, id ASC
         LIMIT 100
         FOR UPDATE SKIP LOCKED
      )
      RETURNING ${OUTBOX_COLUMNS}`,
    [now],
  );
}

async function settingsFor(global: DatabaseHandle, userId: string): Promise<PushSettings | undefined> {
  return global.one<PushSettings>(
    `SELECT quiet_start, quiet_end, time_zone, notif_shifts, notif_swaps, notif_billing
       FROM user_settings WHERE user_id = $1`,
    [userId],
  );
}

function categoryEnabled(settings: PushSettings | undefined, category: OutboxRow['category']): boolean {
  if (category === 'billing') return settings?.notif_billing ?? true;
  if (category === 'swaps') return settings?.notif_swaps ?? true;
  return settings?.notif_shifts ?? true;
}

/**
 * Drains pending rows due now. Injectable `send` keeps tests hermetic (no
 * network) while production passes `expoSender(deps)`.
 */
export async function drainOutbox(deps: AppDeps, send: PushSender, log: Logger): Promise<void> {
  const now = new Date();
  for (const shard of deps.topology.shards) {
    const rows = await claimDue(shard, now);
    for (const row of rows) {
      try {
        const settings = await settingsFor(deps.topology.global, row.user_id);
        if (!categoryEnabled(settings, row.category)) {
          await markSent(shard, row);
          log.info({ outboxId: row.id, category: row.category }, 'push skipped: category disabled');
          continue;
        }

        const devices = await deps.topology.global.query<{ push_token: string }>(
          'SELECT push_token FROM devices WHERE user_id = $1 AND push_token IS NOT NULL',
          [row.user_id],
        );
        const tokens = devices.map((d) => d.push_token).filter((token) => Expo.isExpoPushToken(token));
        if (tokens.length === 0) {
          await markSent(shard, row);
          log.info({ outboxId: row.id }, 'push skipped: no device tokens');
          continue;
        }

        if (row.urgency !== 'urgent') {
          const quiet = msUntilQuietEnd(
            new Date(),
            settings?.quiet_start ?? '22:00',
            settings?.quiet_end ?? '07:00',
            settings?.time_zone ?? 'UTC',
          );
          if (quiet !== null) {
            const resumeAt = new Date(Date.now() + quiet);
            // Deferral is not a delivery attempt: undo the claim's increment.
            await markAttempt(shard, row, Math.max(0, row.attempts - 1), resumeAt);
            await deps.queue.add(PUSH_QUEUE, {}, { delayMs: quiet, attempts: MAX_PUSH_ATTEMPTS });
            log.info({ outboxId: row.id, resumeAt }, 'push deferred: quiet hours');
            continue;
          }
        }

        await send(
          tokens.map((token) => ({
            to: token,
            title: row.title,
            body: row.body,
            data: row.data,
            sound: 'default',
          })),
        );
        await markSent(shard, row);
      } catch (error) {
        const attempts = row.attempts;
        if (attempts >= MAX_PUSH_ATTEMPTS) {
          await markFailed(shard, row, attempts);
          log.warn({ outboxId: row.id, attempts, err: error }, 'push gave up');
        } else {
          const delayMs = backoffMs(attempts);
          await markAttempt(shard, row, attempts, new Date(Date.now() + delayMs));
          await deps.queue.add(PUSH_QUEUE, {}, { delayMs, attempts: MAX_PUSH_ATTEMPTS });
          log.warn({ outboxId: row.id, attempts, err: error }, 'push retry scheduled');
        }
      }
    }
  }
}

/** Production sender: chunked Expo delivery with dead-token cleanup. */
export function expoSender(deps: AppDeps): PushSender {
  const expo = new Expo({ accessToken: deps.env.EXPO_ACCESS_TOKEN || undefined });
  return async (messages: ExpoPushMessage[]): Promise<void> => {
    const dead: string[] = [];
    for (const chunk of expo.chunkPushNotifications(messages)) {
      const tickets = await expo.sendPushNotificationsAsync(chunk);
      tickets.forEach((ticket, index) => {
        if (ticket.status === 'error' && ticket.details?.error === 'DeviceNotRegistered') {
          const to = chunk[index]?.to;
          if (typeof to === 'string') dead.push(to);
        }
      });
    }
    if (dead.length > 0) {
      await deps.topology.global.query('DELETE FROM devices WHERE push_token = ANY($1)', [dead]);
    }
  };
}

export async function runPushJob(deps: AppDeps, log: Logger): Promise<void> {
  await drainOutbox(deps, expoSender(deps), log);
}
