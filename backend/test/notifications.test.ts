import type { ExpoPushMessage } from 'expo-server-sdk';
import { Shift, type Shift as ShiftContract } from '@rota/contract';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createTestContext, resetDatabases, type TestContext } from './helpers/app';
import { depsOf } from './helpers/billing';
import { addMember, auth, createTeam, signup, type RosterUser } from './helpers/roster';
import { PUSH_QUEUE, drainOutbox, type PushSender } from '../src/jobs/push';
import { newId } from '../src/lib/ids';

/**
 * End-to-end delivery (push-notifications skill): a domain route writes outbox
 * rows and enqueues a dispatcher run; the dispatcher then delivers through the
 * injected sender. This is the only place the request -> queue -> delivery path
 * is exercised together, so no test touches the network.
 */

const VALID_TOKEN = 'ExponentPushToken[nnnnnnnn-1111-2222-3333-444444444444]';

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

async function addDevice(userId: string, token: string): Promise<void> {
  await ctx.topology.global.query('INSERT INTO devices (device_id, user_id, push_token) VALUES ($1, $2, $3)', [
    newId(),
    userId,
    token,
  ]);
}

/** Empty quiet window (start == end) so delivery never depends on wall-clock time. */
async function quietOff(userId: string): Promise<void> {
  await ctx.topology.global.query(
    `INSERT INTO user_settings (user_id, quiet_start, quiet_end) VALUES ($1, '00:00', '00:00')
     ON CONFLICT (user_id) DO UPDATE SET quiet_start = '00:00', quiet_end = '00:00'`,
    [userId],
  );
}

interface Team {
  teamId: string;
  owner: RosterUser;
  member: RosterUser;
}

async function teamWithMember(email = 'member@notify.test'): Promise<Team> {
  const { teamId, owner } = await createTeam(ctx, 'Notify Team');
  const member = await signup(ctx, email);
  await addMember(ctx, teamId, member.id, 'member');
  return { teamId, owner, member };
}

async function createShift(team: Team, assigneeId: string, startsAt: string, endsAt: string): Promise<ShiftContract> {
  const res = await ctx.app.inject({
    method: 'POST',
    url: `/v1/teams/${team.teamId}/shifts`,
    headers: auth(team.owner),
    payload: { userId: assigneeId, startsAt, endsAt, role: 'Chef' },
  });
  expect(res.statusCode).toBe(200);
  return Shift.parse(res.json());
}

describe('notification delivery', () => {
  it('delivers a push with a shift deep link when a member is assigned a shift', async () => {
    const team = await teamWithMember();
    await addDevice(team.member.id, VALID_TOKEN);
    await quietOff(team.member.id);

    const sent: ExpoPushMessage[] = [];
    activeSender = async (messages) => void sent.push(...messages);

    const created = await createShift(team, team.member.id, '2026-10-15T09:00:00Z', '2026-10-15T17:00:00Z');
    await ctx.queue.drain();

    expect(sent).toHaveLength(1);
    expect(sent[0]?.to).toBe(VALID_TOKEN);
    expect(sent[0]?.data).toMatchObject({ shiftId: created.id, url: `rota://shift/${created.id}` });
  });

  it('does not push the assigner a shift they created for themselves', async () => {
    const team = await teamWithMember();
    await addDevice(team.owner.id, VALID_TOKEN);
    await quietOff(team.owner.id);

    const sent: ExpoPushMessage[] = [];
    activeSender = async (messages) => void sent.push(...messages);

    await createShift(team, team.owner.id, '2026-10-15T09:00:00Z', '2026-10-15T17:00:00Z');
    await ctx.queue.drain();

    expect(sent).toHaveLength(0);
  });

  it('delivers a swap deep link to the rest of the team for an open request', async () => {
    const team = await teamWithMember('swapper@notify.test');
    const shift = await createShift(team, team.member.id, '2026-10-15T09:00:00Z', '2026-10-15T17:00:00Z');
    await addDevice(team.owner.id, VALID_TOKEN);
    await quietOff(team.owner.id);

    const sent: ExpoPushMessage[] = [];
    activeSender = async (messages) => void sent.push(...messages);

    const res = await ctx.app.inject({
      method: 'POST',
      url: `/v1/shifts/${shift.id}/swap-requests`,
      headers: auth(team.member),
      payload: { note: 'Can anyone cover?' },
    });
    expect(res.statusCode).toBe(200);
    const swapId = (res.json() as { id: string }).id;
    await ctx.queue.drain();

    expect(sent).toHaveLength(1);
    expect(sent[0]?.to).toBe(VALID_TOKEN);
    expect(sent[0]?.data).toMatchObject({ swapId, url: `rota://swap/${swapId}` });
  });
});
