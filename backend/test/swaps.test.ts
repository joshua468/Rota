import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  Id,
  PagedResponse,
  RequestBodies,
  Shift,
  SwapRequest,
  SwapSuggestionsResponse,
} from '@rota/contract';
import { createTestContext, resetDatabases, type TestContext } from './helpers/app';
import { auth, createTeam, inviteAndJoin, type RosterUser } from './helpers/roster';

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
  carol: RosterUser;
  shiftId: string;
}

async function fixture(): Promise<Fixture> {
  const { teamId, owner } = await createTeam(ctx, 'Cooks', 'owner@swap.test');
  const alice = await inviteAndJoin(ctx, teamId, 'Cooks', 'alice@swap.test', 'member', owner);
  const bob = await inviteAndJoin(ctx, teamId, 'Cooks', 'bob@swap.test', 'member', owner);
  const carol = await inviteAndJoin(ctx, teamId, 'Cooks', 'carol@swap.test', 'member', owner);
  const shiftRes = await ctx.app.inject({
    method: 'POST',
    url: `/v1/teams/${teamId}/shifts`,
    headers: auth(owner),
    payload: RequestBodies.createShift.parse({
      userId: alice.id,
      startsAt: '2026-10-15T09:00:00Z',
      endsAt: '2026-10-15T17:00:00Z',
      role: 'Chef',
    }),
  });
  if (shiftRes.statusCode !== 200) throw new Error(`creating shift failed: ${shiftRes.statusCode} ${shiftRes.body}`);
  return { teamId, owner, alice, bob, carol, shiftId: Shift.parse(shiftRes.json()).id };
}

function errorCodeOf(res: { json(): unknown }): string {
  return ((res.json() as { error?: { code?: string } }).error?.code) ?? 'NO_ERROR';
}

async function requestSwap(f: Fixture, by: RosterUser, toUserId?: string): Promise<SwapRequest> {
  const res = await ctx.app.inject({
    method: 'POST',
    url: `/v1/shifts/${f.shiftId}/swap-requests`,
    headers: auth(by),
    payload: RequestBodies.createSwapRequest.parse({
      toUserId: toUserId ? Id.parse(toUserId) : undefined,
      note: 'Please cover',
    }),
  });
  expect(res.statusCode).toBe(200);
  return SwapRequest.parse(res.json());
}

async function decide(f: Fixture, by: RosterUser, swapId: string, decision: 'approve' | 'reject'): Promise<SwapRequest> {
  const res = await ctx.app.inject({
    method: 'POST',
    url: `/v1/swaps/${swapId}/decision`,
    headers: auth(by),
    payload: RequestBodies.decideSwap.parse({ decision }),
  });
  expect(res.statusCode).toBe(200);
  return SwapRequest.parse(res.json());
}

async function shiftById(f: Fixture, by: RosterUser): Promise<ReturnType<typeof Shift.parse>> {
  const res = await ctx.app.inject({
    method: 'GET',
    url: `/v1/teams/${f.teamId}/shifts`,
    headers: auth(by),
    query: { from: '2026-10-01T00:00:00Z', to: '2026-11-01T00:00:00Z' },
  });
  const page = PagedResponse(Shift).parse(res.json());
  const shift = page.items.find((item) => item.id === f.shiftId);
  if (!shift) throw new Error('shift not found after decision');
  return shift;
}

describe('swaps', () => {
  it('targets a request; the target member cannot approve it, a scheduler can (shift changes hands)', async () => {
    const f = await fixture();
    const requested = await requestSwap(f, f.alice, f.bob.id);
    expect(requested.status).toBe('pending');
    expect(requested.toUser?.id).toBe(f.bob.id);
    expect(requested.fromUser.id).toBe(f.alice.id);

    // The target is a plain member — approval needs manager sign-off (Rule 01).
    const byTarget = await ctx.app.inject({
      method: 'POST',
      url: `/v1/swaps/${requested.id}/decision`,
      headers: auth(f.bob),
      payload: RequestBodies.decideSwap.parse({ decision: 'approve' }),
    });
    expect(byTarget.statusCode).toBe(403);
    expect(errorCodeOf(byTarget)).toBe('FORBIDDEN');

    const approved = await decide(f, f.owner, requested.id, 'approve');
    expect(approved.status).toBe('approved');
    expect(approved.decidedAt).not.toBeNull();
    expect(approved.shift.user?.id).toBe(f.bob.id);
    expect(approved.shift.version).toBe(2);

    const shift = await shiftById(f, f.owner);
    expect(shift.user?.id).toBe(f.bob.id);
  });

  it('keeps one pending request per shift', async () => {
    const f = await fixture();
    const requested = await requestSwap(f, f.alice, f.bob.id);
    expect(requested.status).toBe('pending');

    const again = await ctx.app.inject({
      method: 'POST',
      url: `/v1/shifts/${f.shiftId}/swap-requests`,
      headers: auth(f.alice),
      payload: RequestBodies.createSwapRequest.parse({ toUserId: Id.parse(f.carol.id) }),
    });
    expect(again.statusCode).toBe(409);
    expect(errorCodeOf(again)).toBe('CONFLICT');
  });

  it('lets an admin approve a targeted request', async () => {
    const f = await fixture();
    const requested = await requestSwap(f, f.alice, f.bob.id);
    const approved = await decide(f, f.owner, requested.id, 'approve');
    expect(approved.status).toBe('approved');
    expect(approved.shift.user?.id).toBe(f.bob.id);
  });

  it('forbids the requester approving their own request', async () => {
    const f = await fixture();
    const requested = await requestSwap(f, f.alice, f.bob.id);
    const res = await ctx.app.inject({
      method: 'POST',
      url: `/v1/swaps/${requested.id}/decision`,
      headers: auth(f.alice),
      payload: RequestBodies.decideSwap.parse({ decision: 'approve' }),
    });
    expect(res.statusCode).toBe(403);
    expect(errorCodeOf(res)).toBe('FORBIDDEN');
  });

  it('forbids a bystander approving a targeted request', async () => {
    const f = await fixture();
    const requested = await requestSwap(f, f.alice, f.bob.id);
    const res = await ctx.app.inject({
      method: 'POST',
      url: `/v1/swaps/${requested.id}/decision`,
      headers: auth(f.carol),
      payload: RequestBodies.decideSwap.parse({ decision: 'approve' }),
    });
    expect(res.statusCode).toBe(403);
  });

  it('an open request is claimed by a scheduler, not a plain member', async () => {
    const f = await fixture();
    const requested = await requestSwap(f, f.alice);
    expect(requested.toUser).toBeNull();

    const byMember = await ctx.app.inject({
      method: 'POST',
      url: `/v1/swaps/${requested.id}/decision`,
      headers: auth(f.bob),
      payload: RequestBodies.decideSwap.parse({ decision: 'approve' }),
    });
    expect(byMember.statusCode).toBe(403);
    expect(errorCodeOf(byMember)).toBe('FORBIDDEN');

    const approved = await decide(f, f.owner, requested.id, 'approve');
    expect(approved.status).toBe('approved');
    expect(approved.shift.user?.id).toBe(f.owner.id);
  });

  it('forbids a plain member declining someone else\'s request, even as the target', async () => {
    const f = await fixture();
    const requested = await requestSwap(f, f.alice, f.bob.id);
    const res = await ctx.app.inject({
      method: 'POST',
      url: `/v1/swaps/${requested.id}/decision`,
      headers: auth(f.bob),
      payload: RequestBodies.decideSwap.parse({ decision: 'reject' }),
    });
    expect(res.statusCode).toBe(403);
    expect(errorCodeOf(res)).toBe('FORBIDDEN');
  });

  it('reject ends rejected; the requester cancels their own instead', async () => {
    const f = await fixture();
    const rejected = await requestSwap(f, f.alice, f.bob.id);
    const afterReject = await decide(f, f.owner, rejected.id, 'reject');
    expect(afterReject.status).toBe('rejected');

    const second = await requestSwap(f, f.alice, f.carol.id);
    const canceled = await decide(f, f.alice, second.id, 'reject');
    expect(canceled.status).toBe('canceled');
  });

  it('a plain member cannot open a swap on someone else shift', async () => {
    const f = await fixture();
    const res = await ctx.app.inject({
      method: 'POST',
      url: `/v1/shifts/${f.shiftId}/swap-requests`,
      headers: auth(f.bob),
      payload: RequestBodies.createSwapRequest.parse({ toUserId: Id.parse(f.alice.id) }),
    });
    expect(res.statusCode).toBe(403);
  });

  it('lists swaps paginated and filterable by status', async () => {
    const f = await fixture();
    await requestSwap(f, f.alice, f.bob.id);
    // A second pending request on its own shift so paging has somewhere to go.
    const carolShift = await ctx.app.inject({
      method: 'POST',
      url: `/v1/teams/${f.teamId}/shifts`,
      headers: auth(f.owner),
      payload: RequestBodies.createShift.parse({
        userId: f.carol.id,
        startsAt: '2026-10-16T09:00:00Z',
        endsAt: '2026-10-16T17:00:00Z',
      }),
    });
    expect(carolShift.statusCode).toBe(200);
    const secondSwap = await ctx.app.inject({
      method: 'POST',
      url: `/v1/shifts/${Shift.parse(carolShift.json()).id}/swap-requests`,
      headers: auth(f.carol),
      payload: RequestBodies.createSwapRequest.parse({ toUserId: Id.parse(f.bob.id) }),
    });
    expect(secondSwap.statusCode).toBe(200);

    const page = await ctx.app.inject({
      method: 'GET',
      url: `/v1/teams/${f.teamId}/swaps`,
      headers: auth(f.owner),
      query: { status: 'pending', limit: '1' },
    });
    expect(page.statusCode).toBe(200);
    const first = PagedResponse(SwapRequest).parse(page.json());
    expect(first.items).toHaveLength(1);
    expect(first.nextCursor).not.toBeNull();
    expect(first.items[0]?.status).toBe('pending');

    const second = await ctx.app.inject({
      method: 'GET',
      url: `/v1/teams/${f.teamId}/swaps`,
      headers: auth(f.owner),
      query: { status: 'pending', limit: '1', cursor: first.nextCursor ?? '' },
    });
    expect(second.statusCode).toBe(200);
    const rest = PagedResponse(SwapRequest).parse(second.json());
    expect(rest.items).toHaveLength(1);
    expect(rest.items[0]?.id).not.toBe(first.items[0]?.id);
    expect(rest.nextCursor).toBeNull();
  });

  it('suggestions are deterministic and feature-gated', async () => {
    const f = await fixture();
    const off = await ctx.app.inject({
      method: 'GET',
      url: `/v1/shifts/${f.shiftId}/swap-suggestions`,
      headers: auth(f.alice),
    });
    expect(off.statusCode).toBe(404);

    const previous = ctx.env.FEATURE_SWAP_ASSIST;
    ctx.env.FEATURE_SWAP_ASSIST = true;
    try {
      // bob already covers the window → blocked; owner stays eligible.
      const blocker = await ctx.app.inject({
        method: 'POST',
        url: `/v1/teams/${f.teamId}/shifts`,
        headers: auth(f.owner),
        payload: RequestBodies.createShift.parse({
          userId: f.bob.id,
          startsAt: '2026-10-15T10:00:00Z',
          endsAt: '2026-10-15T12:00:00Z',
        }),
      });
      expect(blocker.statusCode).toBe(200);

      const res = await ctx.app.inject({
        method: 'GET',
        url: `/v1/shifts/${f.shiftId}/swap-suggestions`,
        headers: auth(f.alice),
      });
      expect(res.statusCode).toBe(200);
      const body = SwapSuggestionsResponse.parse(res.json());
      expect(body.deterministic).toBe(true);
      expect(body.suggestions.length).toBeGreaterThan(0);
      expect(body.suggestions.length).toBeLessThanOrEqual(3);
      const carol = body.suggestions.find((item) => item.userId === f.carol.id);
      const blocked = body.suggestions.find((item) => item.userId === f.bob.id);
      expect(carol).toMatchObject({ eligible: true, score: 60, sentence: null });
      expect(blocked).toMatchObject({ eligible: false, score: 0, blockers: ['has an overlapping shift'] });
    } finally {
      ctx.env.FEATURE_SWAP_ASSIST = previous;
    }
  });
});