import type { ExpoPushMessage } from 'expo-server-sdk';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createTestContext, resetDatabases, type TestContext } from './helpers/app';
import { createTeamWithOwner, depsOf, shardOf } from './helpers/billing';
import { PUSH_QUEUE, drainOutbox, localMinutes, msUntilQuietEnd, type PushSender } from '../src/jobs/push';
import { newId } from '../src/lib/ids';
import { createLogger } from '../src/lib/logger';

/**
 * Outbox dispatcher (push-notifications skill). Quiet-hour math is exercised
 * as pure functions; delivery behaviour runs through `drainOutbox` with an
 * injected sender so no test ever touches the network.
 */

const log = createLogger('silent');
const VALID_TOKEN = 'ExponentPushToken[aaaaaaaa-1111-2222-3333-444444444444]';
const MINUTE = 60_000;

let ctx: TestContext;
let activeSender: PushSender = async () => {};

beforeAll(async () => {
  ctx = await createTestContext();
  ctx.queue.register(PUSH_QUEUE, (_payload, job) => drainOutbox(depsOf(ctx), activeSender, job.log));
});

beforeEach(async () => {
  activeSender = async () => {};
  await resetDatabases(ctx);
});

afterAll(async () => {
  await ctx.queue.close();
  await ctx.close();
});

const at = (iso: string): Date => new Date(iso);

function hhmm(minutes: number): string {
  const m = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

/** A quiet window guaranteed to contain `now`, independent of wall-clock time. */
function windowAroundNow(): { start: string; end: string } {
  const m = localMinutes(new Date(), 'UTC');
  return { start: hhmm(m - 30), end: hhmm(m + 30) };
}

async function setQuiet(userId: string, start: string, end: string, timeZone = 'UTC'): Promise<void> {
  await ctx.topology.global.query(
    'UPDATE user_settings SET quiet_start = $2, quiet_end = $3, time_zone = $4 WHERE user_id = $1',
    [userId, start, end, timeZone],
  );
}

async function setBillingToggle(userId: string, on: boolean): Promise<void> {
  await ctx.topology.global.query('UPDATE user_settings SET notif_billing = $2 WHERE user_id = $1', [userId, on]);
}

async function addDevice(userId: string, token: string): Promise<void> {
  await ctx.topology.global.query('INSERT INTO devices (device_id, user_id, push_token) VALUES ($1, $2, $3)', [
    newId(),
    userId,
    token,
  ]);
}

interface SeedOutboxOptions {
  urgency?: 'normal' | 'urgent';
  category?: 'shifts' | 'swaps' | 'billing';
  attempts?: number;
  nextAttemptAt?: Date;
}

async function seedOutbox(teamId: string, userId: string, opts: SeedOutboxOptions = {}): Promise<string> {
  const id = newId();
  await shardOf(ctx, teamId).query(
    `INSERT INTO outbox (id, team_id, user_id, category, urgency, title, body, data, status, attempts, next_attempt_at)
     VALUES ($1, $2, $3, $4, $5, 'Shift ready', 'Tap to view', '{"kind":"test"}', 'pending', $6, $7)`,
    [
      id,
      teamId,
      userId,
      opts.category ?? 'billing',
      opts.urgency ?? 'urgent',
      opts.attempts ?? 0,
      (opts.nextAttemptAt ?? new Date()).toISOString(),
    ],
  );
  return id;
}

interface RowState {
  status: 'pending' | 'sent' | 'failed';
  attempts: number;
  next_attempt_at: Date;
}

async function rowState(teamId: string, id: string): Promise<RowState | undefined> {
  return shardOf(ctx, teamId).one<RowState>('SELECT status, attempts, next_attempt_at FROM outbox WHERE id = $1', [id]);
}

describe('msUntilQuietEnd', () => {
  it('treats a window that wraps midnight as quiet after hours', () => {
    expect(msUntilQuietEnd(at('2026-06-15T23:00:00.000Z'), '22:00', '07:00', 'UTC')).toBe(8 * 3_600_000);
  });

  it('returns null outside the window', () => {
    expect(msUntilQuietEnd(at('2026-06-15T12:00:00.000Z'), '22:00', '07:00', 'UTC')).toBeNull();
  });

  it('is never quiet when start equals end', () => {
    expect(msUntilQuietEnd(at('2026-06-15T09:00:00.000Z'), '09:00', '09:00', 'UTC')).toBeNull();
  });

  it('includes the start minute and excludes the end minute', () => {
    expect(msUntilQuietEnd(at('2026-06-15T07:00:00.000Z'), '07:00', '22:00', 'UTC')).toBe(15 * 3_600_000);
    expect(msUntilQuietEnd(at('2026-06-15T22:00:00.000Z'), '07:00', '22:00', 'UTC')).toBeNull();
  });

  it('rejects malformed times', () => {
    expect(msUntilQuietEnd(at('2026-06-15T09:00:00.000Z'), '7:00', '22:00', 'UTC')).toBeNull();
    expect(msUntilQuietEnd(at('2026-06-15T09:00:00.000Z'), '07:00', '24:00', 'UTC')).toBeNull();
  });

  it('subtracts the seconds already elapsed in the current minute', () => {
    expect(msUntilQuietEnd(at('2026-06-15T23:00:30.000Z'), '22:00', '07:00', 'UTC')).toBe(8 * 3_600_000 - 30_000);
  });
});

describe('localMinutes', () => {
  it('returns UTC wall-clock minutes', () => {
    expect(localMinutes(at('2026-06-15T15:47:00Z'), 'UTC')).toBe(15 * 60 + 47);
  });

  it('offsets by the configured time zone', () => {
    expect(localMinutes(at('2026-01-01T00:30:00Z'), 'Asia/Tokyo')).toBe(9 * 60 + 30);
  });

  it('falls back to UTC when the time zone is unusable', () => {
    expect(localMinutes(at('2026-06-15T15:47:00Z'), 'Not/AZone')).toBe(15 * 60 + 47);
  });
});

describe('drainOutbox', () => {
  it('delivers an urgent message even inside the quiet window', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    const window = windowAroundNow();
    await setQuiet(owner.id, window.start, window.end);
    await addDevice(owner.id, VALID_TOKEN);
    const id = await seedOutbox(teamId, owner.id, { urgency: 'urgent' });

    const sent: ExpoPushMessage[] = [];
    await drainOutbox(depsOf(ctx), async (messages) => void sent.push(...messages), log);

    expect(sent).toHaveLength(1);
    expect(sent[0]?.to).toBe(VALID_TOKEN);
    expect(sent[0]?.data).toMatchObject({ kind: 'test' });
    expect(await rowState(teamId, id)).toMatchObject({ status: 'sent', attempts: 1 });
  });

  it('defers a normal message inside the quiet window without consuming an attempt', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    const window = windowAroundNow();
    await setQuiet(owner.id, window.start, window.end);
    await addDevice(owner.id, VALID_TOKEN);
    const id = await seedOutbox(teamId, owner.id, { urgency: 'normal' });

    let calls = 0;
    const before = Date.now();
    await drainOutbox(depsOf(ctx), async () => void (calls += 1), log);

    expect(calls).toBe(0);
    const row = await rowState(teamId, id);
    expect(row?.status).toBe('pending');
    expect(row?.attempts).toBe(0);
    const resume = new Date(row!.next_attempt_at).getTime();
    expect(resume).toBeGreaterThanOrEqual(before + 29 * MINUTE);
    expect(resume).toBeLessThanOrEqual(before + 31 * MINUTE);
    // the dispatcher re-queued a delayed re-check instead of running inline
    expect(ctx.queue.inFlight()).toBeGreaterThanOrEqual(1);
  });

  it('sends immediately when the quiet window is empty (start equals end)', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    const current = hhmm(localMinutes(new Date(), 'UTC'));
    await setQuiet(owner.id, current, current);
    await addDevice(owner.id, VALID_TOKEN);
    const id = await seedOutbox(teamId, owner.id, { urgency: 'normal' });

    let calls = 0;
    await drainOutbox(depsOf(ctx), async () => void (calls += 1), log);

    expect(calls).toBe(1);
    expect(await rowState(teamId, id)).toMatchObject({ status: 'sent', attempts: 1 });
  });

  it('skips a disabled category without touching the device registry', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    await setBillingToggle(owner.id, false);
    await addDevice(owner.id, VALID_TOKEN);
    const id = await seedOutbox(teamId, owner.id, { category: 'billing' });

    let calls = 0;
    await drainOutbox(depsOf(ctx), async () => void (calls += 1), log);

    expect(calls).toBe(0);
    expect(await rowState(teamId, id)).toMatchObject({ status: 'sent', attempts: 1 });
  });

  it('marks the row sent when the user has no devices at all', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    const id = await seedOutbox(teamId, owner.id);

    let calls = 0;
    await drainOutbox(depsOf(ctx), async () => void (calls += 1), log);

    expect(calls).toBe(0);
    expect(await rowState(teamId, id)).toMatchObject({ status: 'sent', attempts: 1 });
  });

  it('filters tokens that are not Expo push tokens', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    await addDevice(owner.id, 'definitely-not-an-expo-token');
    const id = await seedOutbox(teamId, owner.id);

    let calls = 0;
    await drainOutbox(depsOf(ctx), async () => void (calls += 1), log);

    expect(calls).toBe(0);
    expect(await rowState(teamId, id)).toMatchObject({ status: 'sent', attempts: 1 });
  });

  it('leaves rows whose next attempt is in the future untouched', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    await addDevice(owner.id, VALID_TOKEN);
    const id = await seedOutbox(teamId, owner.id, {
      urgency: 'normal',
      nextAttemptAt: new Date(Date.now() + 3_600_000),
    });

    let calls = 0;
    await drainOutbox(depsOf(ctx), async () => void (calls += 1), log);

    expect(calls).toBe(0);
    expect(await rowState(teamId, id)).toMatchObject({ status: 'pending', attempts: 0 });
    expect(ctx.queue.inFlight()).toBe(0);
  });

  it('retries with backoff when the sender throws, keeping the row pending', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    await addDevice(owner.id, VALID_TOKEN);
    const id = await seedOutbox(teamId, owner.id, { urgency: 'urgent' });

    const failing: PushSender = async () => {
      throw new Error('expo unreachable');
    };
    const before = Date.now();
    await drainOutbox(depsOf(ctx), failing, log);

    const row = await rowState(teamId, id);
    expect(row?.status).toBe('pending');
    expect(row?.attempts).toBe(1);
    const retryAt = new Date(row!.next_attempt_at).getTime();
    expect(retryAt).toBeGreaterThanOrEqual(before + 500);
    expect(retryAt).toBeLessThanOrEqual(before + 5_000);
    expect(ctx.queue.inFlight()).toBeGreaterThanOrEqual(1);
  });

  it('fails the row once the attempt budget is exhausted', async () => {
    const { teamId, owner } = await createTeamWithOwner(ctx);
    await addDevice(owner.id, VALID_TOKEN);
    const id = await seedOutbox(teamId, owner.id, { urgency: 'urgent', attempts: 4 });

    const failing: PushSender = async () => {
      throw new Error('expo unreachable');
    };
    await drainOutbox(depsOf(ctx), failing, log);

    expect(await rowState(teamId, id)).toMatchObject({ status: 'failed', attempts: 5 });
    expect(ctx.queue.inFlight()).toBe(0);
  });
});
