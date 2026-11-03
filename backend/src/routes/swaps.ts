import { z } from 'zod';
import {
  Id,
  QueryParams,
  RequestBodies,
  type SwapRequest,
  type SwapSuggestion,
  type SwapSuggestionsResponse,
} from '@rota/contract';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { AppDeps } from '../app';
import { assertCan, requireMembership, type TeamAuthed } from '../http/auth';
import { assertTeamWritable } from '../billing/entitlements';
import { invalidatePrefix } from '../cache/cache';
import { calendarPrefix } from '../cache/keys';
import { RATE_RULES } from '../http/rate-limit';
import { parseWith, NoQuery } from '../http/validate';
import type { Queryable, TeamScope } from '../db/types';
import { badRequest, conflict, forbidden, notFound } from '../lib/errors';
import { requestPushDelivery } from '../jobs/push';
import { logActivity } from '../repos/activity';
import { decodeCursor, encodeCursor } from '../repos/cursor';
import { insertOutbox } from '../repos/outbox';
import { briefUser, isoStamp, loadUsersByIds, toPublicUser, type DirectoryUser } from '../repos/public';
import { getShift, getShiftsByIds, toShift, type ShiftRow } from '../repos/shifts';
import { listActiveMembers, membersByIds, type MemberRow } from '../repos/teams';
import {
  decideSwap,
  findSwap,
  insertSwap,
  listSwaps,
  pendingForShift,
  type SwapRow,
} from '../repos/swaps';

const TeamParams = z.object({ teamId: Id }).strict();
const ShiftParams = z.object({ shiftId: Id }).strict();
const SwapParams = z.object({ swapId: Id }).strict();

const SCHEDULERS = new Set(['owner', 'admin', 'manager']);

async function requireShiftMembership(
  deps: AppDeps,
  req: FastifyRequest,
  shiftId: string,
): Promise<{ membership: TeamAuthed; scope: TeamScope; shift: ShiftRow }> {
  const row = await getShiftFromAnyShard(deps, shiftId);
  if (!row) throw notFound('That shift does not exist.');
  const membership = await requireMembership(deps.env, deps.topology, req, row.team_id);
  const shift = await getShift(deps.topology.shardDb(membership.scope), membership.scope, shiftId);
  if (!shift) throw notFound('That shift does not exist.');
  return { membership, scope: membership.scope, shift };
}

/** Bare ids carry no shard hint: walk the shards, one statement per shard. */
async function getShiftFromAnyShard(deps: AppDeps, shiftId: string): Promise<ShiftRow | undefined> {
  const cols =
    'id, team_id, user_id, starts_at, ends_at, role, location, notes, version, created_by, created_at, updated_at';
  for (const shard of deps.topology.shards) {
    const row = await shard.one<ShiftRow>(`SELECT ${cols} FROM shifts WHERE id = $1`, [shiftId]);
    if (row) return row;
  }
  return undefined;
}

function toSwapPayload(row: SwapRow, shift: ShiftRow, members: Map<string, MemberRow>, directory: Map<string, DirectoryUser>): SwapRequest {
  const from = members.get(row.from_user_id);
  const to = row.to_user_id ? members.get(row.to_user_id) : undefined;
  return {
    id: row.id,
    shift: toShift(shift, briefUser(directory, shift.user_id)),
    fromUser: toPublicUser(
      directory.get(row.from_user_id),
      from?.role ?? 'member',
      from?.active ?? true,
      row.from_user_id,
    ),
    toUser:
      row.to_user_id && to
        ? toPublicUser(directory.get(row.to_user_id), to.role, to.active, row.to_user_id)
        : null,
    status: row.status,
    note: row.note,
    createdAt: isoStamp(row.created_at),
    decidedAt: row.decided_at ? isoStamp(row.decided_at) : null,
  };
}

async function swapPayloads(
  deps: AppDeps,
  db: Queryable,
  scope: TeamScope,
  rows: SwapRow[],
): Promise<SwapRequest[]> {
  const shiftIds = rows.map((row) => row.shift_id);
  const userIds = rows.flatMap((row) => [row.from_user_id, row.to_user_id ?? '']).filter((id) => id.length > 0);
  const shifts = await getShiftsByIds(db, scope, shiftIds);
  const members = await membersByIds(db, scope, userIds);
  const directory = await loadUsersByIds(deps.topology.global, userIds);
  return rows.map((row) => {
    const shift = shifts.get(row.shift_id);
    if (!shift) throw notFound('That shift does not exist.');
    return toSwapPayload(row, shift, members, directory);
  });
}

async function swapPayload(
  deps: AppDeps,
  db: Queryable,
  scope: TeamScope,
  row: SwapRow,
): Promise<SwapRequest> {
  const [payload] = await swapPayloads(deps, db, scope, [row]);
  if (!payload) throw notFound('That shift does not exist.');
  return payload;
}

export function registerSwapRoutes(app: FastifyInstance, deps: AppDeps): void {
  app.get('/v1/teams/:teamId/swaps', async (req): Promise<{ items: SwapRequest[]; nextCursor: string | null }> => {
    const { teamId } = parseWith(TeamParams, req.params, 'params');
    const membership = await requireMembership(deps.env, deps.topology, req, teamId);
    assertCan(membership.role, 'swap.read');
    const query = parseWith(QueryParams.swaps, req.query, 'query');

    const limit = query.limit ?? 50;
    const after = query.cursor ? decodeCursor(query.cursor) : undefined;
    const db = deps.topology.shardDb(membership.scope);
    const rows = await listSwaps(db, membership.scope, { status: query.status, after, limit: limit + 1 });
    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;
    const last = page[page.length - 1];
    return {
      items: await swapPayloads(deps, db, membership.scope, page),
      nextCursor: hasMore && last ? encodeCursor(last.created_at, last.id) : null,
    };
  });

  app.post('/v1/shifts/:shiftId/swap-requests', async (req): Promise<SwapRequest> => {
    const { shiftId } = parseWith(ShiftParams, req.params, 'params');
    const { membership, scope, shift } = await requireShiftMembership(deps, req, shiftId);
    assertCan(membership.role, 'swap.request');
    await assertTeamWritable(deps.topology.shardDb(membership.scope), membership.scope.teamId);

    // Only the assignee or a scheduler may open a swap for a shift.
    if (shift.user_id !== membership.user.id && !SCHEDULERS.has(membership.role)) {
      throw forbidden('Only the assigned member or a scheduler can request a swap.');
    }
    // A swap hands a shift from its holder to someone else; a shift that is open
    // has no holder, so there is nothing to hand over.
    const assigneeId = shift.user_id;
    if (!assigneeId) throw conflict('This shift is open — there is nobody to swap with.');

    const body = parseWith(RequestBodies.createSwapRequest, req.body, 'body');
    if (body.toUserId === assigneeId) throw conflict('That member already holds this shift.');
    if (body.toUserId === membership.user.id && assigneeId === body.toUserId) {
      throw badRequest('You cannot swap a shift with yourself.');
    }

    const db = deps.topology.shardDb(membership.scope);
    if (body.toUserId) {
      const members = await membersByIds(db, scope, [body.toUserId]);
      const target = members.get(body.toUserId);
      if (!target?.active) throw conflict('That user is not an active member.');
    }

    const row = await db.tx(async (tx) => {
      // Serialize swap creation against the shift row so two racing requests
      // for the same shift cannot both become pending.
      const locked = await tx.one<ShiftRow>(
        'SELECT id FROM shifts WHERE id = $1 AND team_id = $2 FOR UPDATE',
        [shiftId, scope.teamId],
      );
      if (!locked) throw notFound('That shift does not exist.');
      if (await pendingForShift(tx, scope, shiftId)) {
        throw conflict('That shift already has a pending swap request.');
      }
      return insertSwap(tx, scope, {
        shiftId,
        fromUserId: assigneeId,
        toUserId: body.toUserId ?? null,
        note: body.note ?? null,
      });
    });

    const recipients =
      body.toUserId ? [body.toUserId] : (await listActiveMembers(db, scope)).filter((m) => m.user_id !== assigneeId).map((m) => m.user_id);
    for (const userId of recipients) {
      await insertOutbox(db, scope, {
        userId,
        category: 'swaps',
        urgency: 'normal',
        title: body.toUserId ? 'You were asked to take a shift' : 'A shift is up for grabs',
        body: `${membership.user.name} requested a swap ${body.toUserId ? 'from you' : 'open to the team'}.`,
        data: { swapId: row.id, shiftId: row.shift_id, url: `rota://swap/${row.id}` },
      });
    }
    if (recipients.length > 0) await requestPushDelivery(deps.queue);
    await logActivity(db, scope, {
      type: 'swap.requested',
      actorId: membership.user.id,
      summary: `${membership.user.name} requested a swap for a shift on ${new Date(shift.starts_at).toISOString()}`,
      data: { swapId: row.id, shiftId: shift.id, targeted: body.toUserId ? true : false },
    });

    return swapPayload(deps, db, scope, row);
  });

  app.post('/v1/swaps/:swapId/decision', async (req): Promise<SwapRequest> => {
    const { swapId } = parseWith(SwapParams, req.params, 'params');
    const body = parseWith(RequestBodies.decideSwap, req.body, 'body');

    const swap = await findSwap(deps.topology.shards, swapId);
    if (!swap) throw notFound('That swap request does not exist.');
    const membership = await requireMembership(deps.env, deps.topology, req, swap.team_id);
    const caller = membership.user.id;
    const isRequester = swap.from_user_id === caller;
    // The requester may always withdraw their own request, whatever their role;
    // anyone else deciding needs the scheduler sign-off from the matrix —
    // swaps get manager approval (Rule 01).
    if (!(isRequester && body.decision === 'reject')) {
      assertCan(membership.role, 'swap.decide');
    }
    await assertTeamWritable(deps.topology.shardDb(membership.scope), membership.scope.teamId);
    if (swap.status !== 'pending') throw conflict('This request has already been decided.');

    const status = body.decision === 'approve' ? 'approved' : 'rejected';
    if (body.decision === 'approve' && isRequester) {
      // Manager approval: the requester never approves their own request, even
      // when their own role lets them decide.
      throw forbidden('You cannot approve your own swap request.');
    }
    // The requester cancels; everyone else rejects.
    const finalStatus: SwapRequest['status'] = isRequester && body.decision === 'reject' ? 'canceled' : status;

    const db = deps.topology.shardDb(membership.scope);
    const newOwner = body.decision === 'approve' ? (swap.to_user_id ?? caller) : swap.from_user_id;
    const decided = await db.tx(async (tx) => {
      const row = await decideSwap(tx, membership.scope, swapId, {
        status: finalStatus,
        decidedBy: caller,
      });
      if (!row) throw conflict('This request has already been decided.');
      if (row.status === 'approved') {
        await tx.query('UPDATE shifts SET user_id = $3, version = version + 1, updated_at = now() WHERE id = $1 AND team_id = $2', [
          row.shift_id,
          membership.scope.teamId,
          newOwner,
        ]);
      }
      const shift = await getShift(tx, membership.scope, row.shift_id);
      return { row, shift };
    });
    if (!decided.shift) throw notFound('That shift does not exist.');

    const notify = new Set<string>();
    if (swap.from_user_id !== caller) notify.add(swap.from_user_id);
    if (finalStatus === 'approved' && newOwner !== caller && newOwner !== swap.from_user_id) {
      notify.add(newOwner);
    }
    for (const userId of notify) {
      await insertOutbox(db, membership.scope, {
        userId,
        category: 'swaps',
        urgency: 'normal',
        title: finalStatus === 'approved' ? 'Your swap was approved' : 'Your swap request was declined',
        body: finalStatus === 'approved'
          ? `${membership.user.name} approved your swap.`
          : `${membership.user.name} ${finalStatus === 'canceled' ? 'canceled' : 'declined'} your swap.`,
        data: { swapId: swap.id, shiftId: swap.shift_id, status: finalStatus, url: `rota://swap/${swap.id}` },
      });
    }
    if (notify.size > 0) await requestPushDelivery(deps.queue);
    await logActivity(db, membership.scope, {
      type: 'swap.decided',
      actorId: caller,
      summary: `${membership.user.name} ${finalStatus} a swap on a shift on ${new Date(decided.shift.starts_at).toISOString()}`,
      data: { swapId: swap.id, shiftId: swap.shift_id, status: finalStatus },
    });
    if (finalStatus === 'approved') {
      await invalidatePrefix(deps.cache, calendarPrefix(membership.scope.teamId));
    }

    return swapPayload(deps, db, membership.scope, decided.row);
  });

  app.get('/v1/shifts/:shiftId/swap-suggestions', async (req): Promise<SwapSuggestionsResponse> => {
    const { shiftId } = parseWith(ShiftParams, req.params, 'params');
    parseWith(NoQuery, req.query, 'query');
    const { membership, scope, shift } = await requireShiftMembership(deps, req, shiftId);
    assertCan(membership.role, 'swap.suggest');
    await deps.rateLimiter.enforce(RATE_RULES.swapSuggest, `user:${membership.user.id}`);

    if (!deps.env.FEATURE_SWAP_ASSIST) {
      throw notFound('Swap Assist is not enabled for this workspace.');
    }

    const db = deps.topology.shardDb(membership.scope);
    const authors = await listActiveMembers(db, scope);
    const directory = await loadUsersByIds(deps.topology.global, authors.map((member) => member.user_id));
    const suggestions: SwapSuggestion[] = [];

    for (const member of authors) {
      if (member.user_id === membership.user.id) continue;

      const overlapping = await db.one(
        `SELECT 1 FROM shifts
          WHERE team_id = $1 AND user_id = $2 AND starts_at < $3::timestamptz AND ends_at > $4::timestamptz
          LIMIT 1`,
        [scope.teamId, member.user_id, shift.ends_at.toISOString(), shift.starts_at.toISOString()],
      );
      if (overlapping) {
        suggestions.push({
          userId: member.user_id,
          name: directory.get(member.user_id)?.name ?? 'Unknown user',
          score: 0,
          eligible: false,
          reasons: [],
          blockers: ['has an overlapping shift'],
          sentence: null,
        });
        continue;
      }

      const sameDay = await db.one(
        `SELECT 1 FROM shifts
          WHERE team_id = $1 AND user_id = $2
            AND starts_at >= date_trunc('day', $3::timestamptz) AND starts_at < date_trunc('day', $3::timestamptz) + interval '1 day'
          LIMIT 1`,
        [scope.teamId, member.user_id, shift.starts_at.toISOString()],
      );
      const sameRole = shift.role
        ? await db.one(
            `SELECT 1 FROM shifts
              WHERE team_id = $1 AND user_id = $2 AND role = $4
                AND starts_at >= $3::timestamptz - interval '30 days' AND starts_at < $3::timestamptz
              LIMIT 1`,
            [scope.teamId, member.user_id, shift.starts_at.toISOString(), shift.role],
          )
        : undefined;

      const reasons: string[] = [];
      const score = 60 + (sameDay ? 20 : 0) + (sameRole ? 10 : 0);
      if (!sameDay) reasons.push('Free for the rest of that day');
      else reasons.push('Has no other shift that day');
      if (sameRole) reasons.push('Has worked this role recently');
      suggestions.push({
        userId: member.user_id,
        name: directory.get(member.user_id)?.name ?? 'Unknown user',
        score,
        eligible: true,
        reasons,
        blockers: [],
        sentence: null,
      });
    }

    suggestions.sort((a, b) => {
      if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
      if (b.score !== a.score) return b.score - a.score;
      return a.userId < b.userId ? -1 : a.userId > b.userId ? 1 : 0;
    });

    return { shiftId, suggestions: suggestions.slice(0, 3), deterministic: true };
  });
}