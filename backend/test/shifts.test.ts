import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { PagedResponse, RequestBodies, Shift, type Shift as ShiftContract } from '@rota/contract';
import { createTestContext, resetDatabases, type TestContext } from './helpers/app';
import { auth, createTeam, inviteAndJoin, signup, type RosterUser } from './helpers/roster';

let ctx: TestContext;

beforeAll(async () => {
  ctx = await createTestContext();
});

beforeEach(async () => {
  await resetDatabases(ctx);
});

afterAll(async () => {
  await ctx.close();
});

interface Fixture {
  teamId: string;
  owner: RosterUser;
  alice: RosterUser;
  bob: RosterUser;
}

async function fixture(name: string = 'Cooks'): Promise<Fixture> {
  const { teamId, owner } = await createTeam(ctx, name, 'owner@shift.test');
  const alice = await inviteAndJoin(ctx, teamId, name, 'alice@shift.test', 'member', owner);
  const bob = await inviteAndJoin(ctx, teamId, name, 'bob@shift.test', 'member', owner);
  return { teamId, owner, alice, bob };
}

function shiftBody(userId: string, startsAt: string, endsAt: string, extra: Record<string, unknown> = {}) {
  return RequestBodies.createShift.parse({ userId, startsAt, endsAt, role: 'Chef', location: 'Kitchen', ...extra });
}

function errorCodeOf(res: { json(): unknown }): string {
  return ((res.json() as { error?: { code?: string } }).error?.code) ?? 'NO_ERROR';
}

async function createShift(f: Fixture, by: RosterUser, startsAt: string, endsAt: string): Promise<ShiftContract> {
  const res = await ctx.app.inject({
    method: 'POST',
    url: `/v1/teams/${f.teamId}/shifts`,
    headers: auth(by),
    payload: shiftBody(f.alice.id, startsAt, endsAt),
  });
  expect(res.statusCode).toBe(200);
  return Shift.parse(res.json());
}

async function listShifts(
  f: Fixture,
  by: RosterUser,
  query: Record<string, string>,
): Promise<{ items: ShiftContract[]; nextCursor: string | null }> {
  const res = await ctx.app.inject({ method: 'GET', url: `/v1/teams/${f.teamId}/shifts`, headers: auth(by), query });
  expect(res.statusCode).toBe(200);
  return PagedResponse(Shift).parse(res.json());
}

const WINDOW = { from: '2026-10-01T00:00:00Z', to: '2026-11-01T00:00:00Z' };

describe('shifts', () => {
  it('creates and lists a shift assigned to a member', async () => {
    const f = await fixture();
    const created = await createShift(f, f.owner, '2026-10-15T09:00:00Z', '2026-10-15T17:00:00Z');
    expect(created.version).toBe(1);
    expect(created.user).toEqual({ id: f.alice.id, name: 'alice', avatarUrl: null });

    const page = await listShifts(f, f.owner, WINDOW);
    expect(page.items).toHaveLength(1);
    expect(page.items[0]?.id).toBe(created.id);
    expect(page.nextCursor).toBeNull();
  });

  it('supports the mine filter', async () => {
    const f = await fixture();
    await createShift(f, f.owner, '2026-10-15T09:00:00Z', '2026-10-15T17:00:00Z');
    const alicePage = await listShifts(f, f.alice, { ...WINDOW, mine: '1' });
    expect(alicePage.items).toHaveLength(1);
    const bobPage = await listShifts(f, f.bob, { ...WINDOW, mine: '1' });
    expect(bobPage.items).toHaveLength(0);
  });

  it('rejects an inverted window', async () => {
    const f = await fixture();
    const res = await ctx.app.inject({
      method: 'POST',
      url: `/v1/teams/${f.teamId}/shifts`,
      headers: auth(f.owner),
      payload: shiftBody(f.alice.id, '2026-10-15T17:00:00Z', '2026-10-15T09:00:00Z'),
    });
    expect(res.statusCode).toBe(400);
    expect(errorCodeOf(res)).toBe('VALIDATION_FAILED');
  });

  it('rejects assignment to someone outside the team', async () => {
    const f = await fixture();
    const outsider = await signup(ctx, 'outsider@shift.test');
    const res = await ctx.app.inject({
      method: 'POST',
      url: `/v1/teams/${f.teamId}/shifts`,
      headers: auth(f.owner),
      payload: shiftBody(outsider.id, '2026-10-15T09:00:00Z', '2026-10-15T17:00:00Z'),
    });
    expect(res.statusCode).toBe(409);
    expect(errorCodeOf(res)).toBe('CONFLICT');
  });

  it('rejects an overlapping shift for the same member', async () => {
    const f = await fixture();
    await createShift(f, f.owner, '2026-10-15T09:00:00Z', '2026-10-15T13:00:00Z');
    const res = await ctx.app.inject({
      method: 'POST',
      url: `/v1/teams/${f.teamId}/shifts`,
      headers: auth(f.owner),
      payload: shiftBody(f.alice.id, '2026-10-15T12:00:00Z', '2026-10-15T16:00:00Z'),
    });
    expect(res.statusCode).toBe(409);
    expect(errorCodeOf(res)).toBe('CONFLICT');
  });

  it('lets a scheduler create but not a plain member', async () => {
    const f = await fixture();
    const forbidden = await ctx.app.inject({
      method: 'POST',
      url: `/v1/teams/${f.teamId}/shifts`,
      headers: auth(f.alice),
      payload: shiftBody(f.bob.id, '2026-10-15T09:00:00Z', '2026-10-15T17:00:00Z'),
    });
    expect(forbidden.statusCode).toBe(403);

    const manager = await inviteAndJoin(ctx, f.teamId, 'Cooks', 'boss@shift.test', 'manager', f.owner);
    const allowed = await ctx.app.inject({
      method: 'POST',
      url: `/v1/teams/${f.teamId}/shifts`,
      headers: auth(manager),
      payload: shiftBody(f.bob.id, '2026-10-16T09:00:00Z', '2026-10-16T17:00:00Z'),
    });
    expect(allowed.statusCode).toBe(200);
  });

  it('patches a shift and bumps the version', async () => {
    const f = await fixture();
    const created = await createShift(f, f.owner, '2026-10-15T09:00:00Z', '2026-10-15T17:00:00Z');
    const res = await ctx.app.inject({
      method: 'PATCH',
      url: `/v1/shifts/${created.id}`,
      headers: auth(f.owner),
      payload: RequestBodies.updateShift.parse({ startsAt: '2026-10-15T10:00:00Z', endsAt: '2026-10-15T18:00:00Z', notes: 'Bring your own apron' }),
    });
    expect(res.statusCode).toBe(200);
    const updated = Shift.parse(res.json());
    expect(updated.version).toBe(2);
    expect(updated.startsAt).toBe('2026-10-15T10:00:00Z');
    expect(updated.notes).toBe('Bring your own apron');
    expect(updated.user?.id).toBe(f.alice.id);
  });

  it('reassigns a shift to another member and refuses outsiders', async () => {
    const f = await fixture();
    const created = await createShift(f, f.owner, '2026-10-15T09:00:00Z', '2026-10-15T17:00:00Z');
    const res = await ctx.app.inject({
      method: 'PATCH',
      url: `/v1/shifts/${created.id}`,
      headers: auth(f.owner),
      payload: RequestBodies.updateShift.parse({ userId: f.bob.id }),
    });
    expect(res.statusCode).toBe(200);
    const updated = Shift.parse(res.json());
    expect(updated.version).toBe(2);
    expect(updated.user?.id).toBe(f.bob.id);
    // Bob is not the actor, so the assignment waits for his acceptance.
    expect(updated.assignmentStatus).toBe('pending');

    const outsider = await ctx.app.inject({
      method: 'PATCH',
      url: `/v1/shifts/${created.id}`,
      headers: auth(f.owner),
      payload: RequestBodies.updateShift.parse({ userId: '00000000-0000-4000-8000-000000000000' }),
    });
    expect(outsider.statusCode).toBe(409);
    expect(errorCodeOf(outsider)).toBe('CONFLICT');
  });

  it('rejects a patch that would overlap another shift', async () => {
    const f = await fixture();
    await createShift(f, f.owner, '2026-10-15T09:00:00Z', '2026-10-15T13:00:00Z');
    const second = await createShift(f, f.owner, '2026-10-15T14:00:00Z', '2026-10-15T18:00:00Z');
    const res = await ctx.app.inject({
      method: 'PATCH',
      url: `/v1/shifts/${second.id}`,
      headers: auth(f.owner),
      payload: RequestBodies.updateShift.parse({ startsAt: '2026-10-15T12:30:00Z', endsAt: '2026-10-15T18:00:00Z' }),
    });
    expect(res.statusCode).toBe(409);
    expect(errorCodeOf(res)).toBe('CONFLICT');
  });

  it('requires both window edges when updating times', async () => {
    const f = await fixture();
    const created = await createShift(f, f.owner, '2026-10-15T09:00:00Z', '2026-10-15T17:00:00Z');
    const res = await ctx.app.inject({
      method: 'PATCH',
      url: `/v1/shifts/${created.id}`,
      headers: auth(f.owner),
      payload: RequestBodies.updateShift.parse({ startsAt: '2026-10-15T08:00:00Z' }),
    });
    expect(res.statusCode).toBe(400);
    expect(errorCodeOf(res)).toBe('VALIDATION_FAILED');
  });

  it('removes a shift; it is gone from lists and updates', async () => {
    const f = await fixture();
    const created = await createShift(f, f.owner, '2026-10-15T09:00:00Z', '2026-10-15T17:00:00Z');
    const del = await ctx.app.inject({
      method: 'DELETE',
      url: `/v1/shifts/${created.id}`,
      headers: auth(f.owner),
    });
    expect(del.statusCode).toBe(204);

    const page = await listShifts(f, f.owner, WINDOW);
    expect(page.items).toHaveLength(0);

    const patch = await ctx.app.inject({
      method: 'PATCH',
      url: `/v1/shifts/${created.id}`,
      headers: auth(f.owner),
      payload: RequestBodies.updateShift.parse({ notes: 'nope' }),
    });
    expect(patch.statusCode).toBe(404);
  });

  it('pages the shift list by keyset cursor', async () => {
    const f = await fixture();
    await createShift(f, f.owner, '2026-10-15T07:00:00Z', '2026-10-15T08:00:00Z');
    await createShift(f, f.owner, '2026-10-15T09:00:00Z', '2026-10-15T10:00:00Z');
    await createShift(f, f.owner, '2026-10-15T11:00:00Z', '2026-10-15T12:00:00Z');

    const first = await listShifts(f, f.owner, { ...WINDOW, limit: '2' });
    expect(first.items).toHaveLength(2);
    expect(first.nextCursor).not.toBeNull();

    const second = await listShifts(f, f.owner, { ...WINDOW, limit: '2', cursor: first.nextCursor ?? '' });
    expect(second.items).toHaveLength(1);
    expect(second.nextCursor).toBeNull();

    const all = [...first.items, ...second.items];
    expect(new Set(all.map((item) => item.id)).size).toBe(3);
  });
});

describe('shift assignment responses', () => {
  async function respond(f: Fixture, by: RosterUser, shiftId: string, action: 'accept' | 'decline') {
    return ctx.app.inject({
      method: 'POST',
      url: `/v1/shifts/${shiftId}/respond`,
      headers: auth(by),
      payload: RequestBodies.respondToShift.parse({ action }),
    });
  }

  async function outboxRows(teamId: string) {
    return ctx.topology
      .shardDb(ctx.topology.scopeFor(teamId))
      .query<{ user_id: string; title: string; body: string }>('SELECT user_id, title, body FROM outbox');
  }

  it('lands a colleague-assigned shift as pending and accepts it', async () => {
    const f = await fixture();
    const created = await createShift(f, f.owner, '2026-10-15T09:00:00Z', '2026-10-15T17:00:00Z');
    expect(created.assignmentStatus).toBe('pending');

    const res = await respond(f, f.alice, created.id, 'accept');
    expect(res.statusCode).toBe(200);
    const updated = Shift.parse(res.json());
    expect(updated.assignmentStatus).toBe('accepted');
    expect(updated.version).toBe(2);
    expect(updated.userId).toBe(f.alice.id);
  });

  it('records a self-assigned shift as accepted from the start', async () => {
    const f = await fixture();
    const res = await ctx.app.inject({
      method: 'POST',
      url: `/v1/teams/${f.teamId}/shifts`,
      headers: auth(f.owner),
      payload: shiftBody(f.owner.id, '2026-10-15T09:00:00Z', '2026-10-15T17:00:00Z'),
    });
    expect(res.statusCode).toBe(200);
    expect(Shift.parse(res.json()).assignmentStatus).toBe('accepted');
  });

  it('refuses a response from anyone but the assignee', async () => {
    const f = await fixture();
    const created = await createShift(f, f.owner, '2026-10-15T09:00:00Z', '2026-10-15T17:00:00Z');
    const res = await respond(f, f.bob, created.id, 'accept');
    expect(res.statusCode).toBe(403);
    expect(errorCodeOf(res)).toBe('FORBIDDEN');
  });

  it('declining releases the shift back to the team and tells the scheduler', async () => {
    const f = await fixture();
    // A reader west of UTC proves the notification renders wall-clock time in
    // the recipient's zone rather than echoing the stored UTC instant.
    await ctx.topology.global.query(`UPDATE users SET timezone = 'Africa/Lagos' WHERE id = $1`, [f.owner.id]);
    const created = await createShift(f, f.owner, '2026-10-15T07:00:00Z', '2026-10-15T15:00:00Z');

    const res = await respond(f, f.alice, created.id, 'decline');
    expect(res.statusCode).toBe(200);
    const released = Shift.parse(res.json());
    expect(released.userId).toBeNull();
    expect(released.user).toBeNull();

    const page = await listShifts(f, f.owner, WINDOW);
    expect(page.items).toHaveLength(1);
    expect(page.items[0]?.userId).toBeNull();

    const rows = await outboxRows(f.teamId);
    const decline = rows.find((row) => row.title === 'A shift was declined');
    expect(decline?.user_id).toBe(f.owner.id);
    // 07:00Z in Africa/Lagos is 08:00 AM — never a raw ISO instant.
    expect(decline?.body).toContain('08:00 AM');
    expect(decline?.body).not.toContain('T07:00:00');
  });
});