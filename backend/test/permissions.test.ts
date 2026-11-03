import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { Id, RequestBodies, type Role } from '@rota/contract';
import { createTestContext, resetDatabases, type TestContext } from './helpers/app';
import { seedSubscription } from './helpers/billing';
import { addMember, auth, createTeam, signup, type RosterUser } from './helpers/roster';

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
  users: Record<Role, RosterUser>;
}

const SCHEDULERS: readonly Role[] = ['owner', 'admin', 'manager'];
const ADMINS: readonly Role[] = ['owner', 'admin'];

async function fixture(): Promise<Fixture> {
  const { teamId, owner } = await createTeam(ctx, 'Matrix', 'owner@perms.test');
  const users = { owner } as Record<Role, RosterUser>;
  for (const role of ['admin', 'manager', 'member'] as const) {
    const user = await signup(ctx, `${role}@perms.test`);
    await addMember(ctx, teamId, user.id, role);
    users[role] = user;
  }
  return { teamId, users };
}

async function call(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  url: string,
  by: RosterUser,
  payload?: unknown,
): Promise<number> {
  const hasPayload = payload !== undefined;
  const res = await ctx.app.inject({
    method,
    url,
    // A content-type on a body-less request makes Fastify reject it as an empty
    // JSON body; only send the header when there is something to parse.
    headers: hasPayload ? { ...auth(by), 'content-type': 'application/json' } : auth(by),
    payload: hasPayload ? JSON.stringify(payload) : undefined,
  });
  return res.statusCode;
}

/** A fresh shift for `assignee` with a unique window; returns its id. */
async function freshShift(f: Fixture, assignee: RosterUser, day: string, by?: RosterUser): Promise<string> {
  const res = await ctx.app.inject({
    method: 'POST',
    url: `/v1/teams/${f.teamId}/shifts`,
    headers: auth(by ?? f.users.owner),
    payload: RequestBodies.createShift.parse({
      userId: assignee.id,
      startsAt: `${day}T09:00:00Z`,
      endsAt: `${day}T17:00:00Z`,
    }),
  });
  expect(res.statusCode).toBe(200);
  return (res.json() as { id: string }).id;
}

describe('permission matrix', () => {
  it('applies shift write/delete to schedulers only', async () => {
    const f = await fixture();
    for (const role of ['owner', 'admin', 'manager', 'member'] as const) {
      const user = f.users[role];
      const index = ['owner', 'admin', 'manager', 'member'].indexOf(role) as number;
      const shiftId = await freshShift(f, f.users.member, `2026-10-1${index}`);
      // Each iteration's `create` must use a window no earlier iteration left a
      // shift in, or the member's overlap guard 409s before permissions matter.
      const create = await call('POST', `/v1/teams/${f.teamId}/shifts`, user, {
        userId: f.users.member.id,
        startsAt: `2026-10-${20 + index}T09:00:00Z`,
        endsAt: `2026-10-${20 + index}T17:00:00Z`,
      });
      const patch = await call('PATCH', `/v1/shifts/${shiftId}`, user, { notes: `by ${role}` });
      const del = await call('DELETE', `/v1/shifts/${shiftId}`, user);
      const canWrite = (SCHEDULERS as readonly string[]).includes(role);
      expect(create, `${role} create`).toBe(canWrite ? 200 : 403);
      expect(patch, `${role} patch`).toBe(canWrite ? 200 : 403);
      expect(del, `${role} delete`).toBe(canWrite ? 204 : 403);
    }
  });

  it('gates invites and membership removal to admins', async () => {
    const f = await fixture();
    // Each iteration adds a fresh victim + invitee, and invite creation enforces
    // the seat limit — the default Starter plan (5) would 402 before the
    // permission assertion runs, so move the team up to a 15-seat plan.
    await seedSubscription(ctx, f.teamId, { planKey: 'team', seats: 15 });
    for (const role of ['owner', 'admin', 'manager', 'member'] as const) {
      const user = f.users[role];
      const canAdmin = (ADMINS as readonly string[]).includes(role);
      // A fresh victim per iteration: removing soft-deactivates, and removing an
      // already-inactive member is a 404, so a shared victim would never pass.
      const victim = await signup(ctx, `victim-${role}@perms.test`);
      await addMember(ctx, f.teamId, victim.id, 'member');
      const invite = await call('POST', `/v1/teams/${f.teamId}/invites`, user, {
        email: `${role}-invite@perms.test`,
        role: 'member',
      });
      const remove = await call('DELETE', `/v1/teams/${f.teamId}/members/${victim.id}`, user);
      expect(invite, `${role} invite`).toBe(canAdmin ? 200 : 403);
      expect(remove, `${role} remove`).toBe(canAdmin ? 204 : 403);
    }
  });

  it('keeps read surfaces open to every role', async () => {
    const f = await fixture();
    for (const role of ['owner', 'admin', 'manager', 'member'] as const) {
      const user = f.users[role];
      expect(await call('GET', `/v1/teams/${f.teamId}`, user)).toBe(200);
      expect(await call('GET', `/v1/teams/${f.teamId}/members`, user)).toBe(200);
      expect(await call('GET', `/v1/teams/${f.teamId}/swaps`, user)).toBe(200);
      expect(await call('GET', `/v1/teams/${f.teamId}/activity`, user)).toBe(200);
    }
  });

  it('lets a member open a swap on their own shift; schedulers on any shift', async () => {
    const f = await fixture();
    for (const role of ['owner', 'admin', 'manager', 'member'] as const) {
      const user = f.users[role];
      const shiftId = await freshShift(f, f.users.member, `2026-10-2${['owner', 'admin', 'manager', 'member'].indexOf(role) as number}`);
      // A swap hands the shift to the recipient, so the recipient must be someone
      // who does not already hold it (the shift's assignee always 409s).
      const target = role === 'member' ? f.users.owner : f.users.manager;
      const req = await call('POST', `/v1/shifts/${shiftId}/swap-requests`, user, {
        toUserId: target.id,
      });
      expect(req, `${role} swap.request`).toBe(200);
    }
  });

  it('blocks the requester from approving their own swap, at every role', async () => {
    const f = await fixture();
    const req = await ctx.app.inject({
      method: 'POST',
      url: `/v1/shifts/${await freshShift(f, f.users.member, '2026-10-30')}/swap-requests`,
      headers: auth(f.users.member),
      payload: RequestBodies.createSwapRequest.parse({ toUserId: Id.parse(f.users.manager.id) }),
    });
    const swapId = (req.json() as { id: string }).id;
    const self = await call('POST', `/v1/swaps/${swapId}/decision`, f.users.member, { decision: 'approve' });
    expect(self, 'member self-approve').toBe(403);

    // An owner may decide swaps — and still may not approve their own.
    const ownShift = await freshShift(f, f.users.owner, '2026-11-05');
    const ownReq = await ctx.app.inject({
      method: 'POST',
      url: `/v1/shifts/${ownShift}/swap-requests`,
      headers: auth(f.users.owner),
      payload: RequestBodies.createSwapRequest.parse({ toUserId: Id.parse(f.users.member.id) }),
    });
    expect(ownReq.statusCode).toBe(200);
    const ownerSelf = await call('POST', `/v1/swaps/${(ownReq.json() as { id: string }).id}/decision`, f.users.owner, { decision: 'approve' });
    expect(ownerSelf, 'owner self-approve').toBe(403);
  });

  it('gates swap.decide to schedulers; the requester may withdraw their own at every role', async () => {
    const f = await fixture();
    const roles = ['owner', 'admin', 'manager', 'member'] as const;
    for (const [index, role] of roles.entries()) {
      // Someone else's pending request (on the member's shift), decided by this role.
      const shiftId = await freshShift(f, f.users.member, `2026-11-2${index}`);
      const req = await ctx.app.inject({
        method: 'POST',
        url: `/v1/shifts/${shiftId}/swap-requests`,
        headers: auth(f.users.member),
        payload: RequestBodies.createSwapRequest.parse({ toUserId: Id.parse(f.users.manager.id) }),
      });
      expect(req.statusCode).toBe(200);
      const swapId = (req.json() as { id: string }).id;
      const decided = await call('POST', `/v1/swaps/${swapId}/decision`, f.users[role], { decision: 'approve' });
      expect(decided, `${role} decides someone else's swap`).toBe(role === 'member' ? 403 : 200);

      // The requester withdraws their own request — every role, member included.
      const ownShift = await freshShift(f, f.users[role], `2026-12-0${index + 1}`);
      const target = role === 'member' ? f.users.admin : f.users.member;
      const own = await ctx.app.inject({
        method: 'POST',
        url: `/v1/shifts/${ownShift}/swap-requests`,
        headers: auth(f.users[role]),
        payload: RequestBodies.createSwapRequest.parse({ toUserId: Id.parse(target.id) }),
      });
      expect(own.statusCode).toBe(200);
      const cancel = await call('POST', `/v1/swaps/${(own.json() as { id: string }).id}/decision`, f.users[role], { decision: 'reject' });
      expect(cancel, `${role} withdraws their own swap`).toBe(200);
    }
  });

  it('lets an owner approve a targeted swap as a scheduler', async () => {
    const f = await fixture();
    const req = await ctx.app.inject({
      method: 'POST',
      url: `/v1/shifts/${await freshShift(f, f.users.member, '2026-10-31')}/swap-requests`,
      headers: auth(f.users.member),
      payload: RequestBodies.createSwapRequest.parse({ toUserId: Id.parse(f.users.manager.id) }),
    });
    const swapId = (req.json() as { id: string }).id;
    const owned = await call('POST', `/v1/swaps/${swapId}/decision`, f.users.owner, { decision: 'approve' });
    expect(owned).toBe(200);
  });

  it('lets the assignee respond to their own shift at every role; nobody else can', async () => {
    const f = await fixture();
    const roles = ['owner', 'admin', 'manager', 'member'] as const;
    for (const [index, role] of roles.entries()) {
      const user = f.users[role];
      const own = await freshShift(f, user, `2026-11-0${index + 1}`);
      expect(await call('POST', `/v1/shifts/${own}/respond`, user, { action: 'accept' }), `${role} own`).toBe(200);

      // A shift assigned to the member, answered by someone who does not hold it.
      const theirs = await freshShift(f, f.users.member, `2026-11-1${index}`);
      const intruder = role === 'member' ? f.users.admin : user;
      expect(await call('POST', `/v1/shifts/${theirs}/respond`, intruder, { action: 'accept' }), `${role} other`).toBe(403);
    }
  });
});