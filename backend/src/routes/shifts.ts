import { z } from 'zod';
import { Cursor, Id, QueryParams, RequestBodies, type Shift } from '@rota/contract';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { AppDeps } from '../app';
import type { TeamAuthed } from '../http/auth';
import { assertCan, requireMembership } from '../http/auth';
import { assertTeamWritable } from '../billing/entitlements';
import { cached, invalidatePrefix } from '../cache/cache';
import { CALENDAR_TTL_MS, calendarKey, calendarPrefix } from '../cache/keys';
import type { TeamScope } from '../db/types';
import { parseWith, NoQuery } from '../http/validate';
import { badRequest, conflict, forbidden, notFound } from '../lib/errors';
import { wallRange } from '../lib/zone-time';
import { requestPushDelivery } from '../jobs/push';
import { logActivity } from '../repos/activity';
import { decodeCursor, encodeCursor } from '../repos/cursor';
import { insertOutbox } from '../repos/outbox';
import { briefUser, loadUsersByIds, loadUserZones } from '../repos/public';
import {
  deleteShift,
  findShift,
  getShift,
  hasOverlap,
  insertShift,
  listShifts,
  respondToShift,
  toShift,
  updateShift,
  type ShiftRow,
} from '../repos/shifts';
import { listActiveMembers, membersByIds } from '../repos/teams';

const TeamParams = z.object({ teamId: Id }).strict();
const ShiftParams = z.object({ shiftId: Id }).strict();
/** QueryParams.shifts plus keyset cursor — the contract's fixed shape for the calendar. */
const ListShiftsQuery = QueryParams.shifts
  .extend({
    cursor: Cursor.optional(),
    limit: z.coerce.number().int().min(1).max(50).optional(),
  })
  .strict();

async function shiftPayload(deps: AppDeps, row: ShiftRow): Promise<Shift> {
  const directory = await loadUsersByIds(deps.topology.global, [row.user_id]);
  return toShift(row, briefUser(directory, row.user_id));
}

/**
 * A shift id carries no shard hint, so membership is resolved from the row's
 * own team (the team_id a client could put in the body is never trusted). A
 * row that is not in the caller's team is a 404, never a 403 (Rule 01).
 */
async function requireShiftMembership(
  deps: AppDeps,
  req: FastifyRequest,
  shiftId: string,
): Promise<{ membership: TeamAuthed; scope: TeamScope; shift: ShiftRow }> {
  const row = await findShift(deps.topology.shards, shiftId);
  if (!row) throw notFound('That shift does not exist.');
  const membership = await requireMembership(deps.env, deps.topology, req, row.team_id);
  const shift = await getShift(deps.topology.shardDb(membership.scope), membership.scope, shiftId);
  if (!shift) throw notFound('That shift does not exist.');
  return { membership, scope: membership.scope, shift };
}

export function registerShiftRoutes(app: FastifyInstance, deps: AppDeps): void {
  app.get('/v1/teams/:teamId/shifts', async (req): Promise<{ items: Shift[]; nextCursor: string | null }> => {
    const { teamId } = parseWith(TeamParams, req.params, 'params');
    const membership = await requireMembership(deps.env, deps.topology, req, teamId);
    assertCan(membership.role, 'shift.read');
    const query = parseWith(ListShiftsQuery, req.query, 'query');

    const from = new Date(query.from);
    const to = new Date(query.to);
    const limit = query.limit ?? 50;
    const after = query.cursor ? decodeCursor(query.cursor) : undefined;
    const db = deps.topology.shardDb(membership.scope);

    // Find the caller first so `mine=1` needs only active members (rules say
    // compare against roster, not free-form ids).
    const userId = query.mine === '1' ? membership.user.id : undefined;
    const key = calendarKey(membership.scope.teamId, {
      from: query.from,
      to: query.to,
      mine: query.mine ?? '0',
      user: userId ?? '',
      cursor: query.cursor ?? '',
      limit,
    });
    return cached(deps.cache, key, CALENDAR_TTL_MS, async () => {
      const rows = await listShifts(db, membership.scope, { from, to, userId, after, limit: limit + 1 });
      const hasMore = rows.length > limit;
      const page = hasMore ? rows.slice(0, limit) : rows;
      const last = page[page.length - 1];
      const directory = await loadUsersByIds(deps.topology.global, page.map((row) => row.user_id));
      return {
        items: page.map((row) => toShift(row, briefUser(directory, row.user_id))),
        nextCursor: hasMore && last ? encodeCursor(last.starts_at, last.id) : null,
      };
    });
  });

  app.post('/v1/teams/:teamId/shifts', async (req): Promise<Shift> => {
    const { teamId } = parseWith(TeamParams, req.params, 'params');
    const membership = await requireMembership(deps.env, deps.topology, req, teamId);
    assertCan(membership.role, 'shift.create');
    await assertTeamWritable(deps.topology.shardDb(membership.scope), membership.scope.teamId);
    const body = parseWith(RequestBodies.createShift, req.body, 'body');

    const startsAt = new Date(body.startsAt);
    const endsAt = new Date(body.endsAt);
    if (endsAt.getTime() <= startsAt.getTime()) throw badRequest('endsAt must be after startsAt');

    const db = deps.topology.shardDb(membership.scope);
    const target = (await membersByIds(db, membership.scope, [body.userId])).get(body.userId);
    if (!target?.active) throw conflict('That user is not an active member.');
    const assignee = (await loadUsersByIds(deps.topology.global, [body.userId])).get(body.userId);

    const row = await db.tx(async (tx) => {
      if (await hasOverlap(tx, membership.scope, { userId: body.userId, startsAt, endsAt })) {
        throw conflict('That member already has a shift in this window.');
      }
      return insertShift(tx, membership.scope, {
        userId: body.userId,
        startsAt,
        endsAt,
        role: body.role,
        location: body.location,
        meetingUrl: body.meetingUrl,
        notes: body.notes,
        createdBy: membership.user.id,
        // Only the assignee can answer an assignment, so planning your own
        // shift is already settled; anyone else's lands as pending.
        assignmentStatus: body.userId === membership.user.id ? 'accepted' : 'pending',
      });
    });

    if (body.userId !== membership.user.id) {
      const zones = await loadUserZones(deps.topology.global, [body.userId]);
      const zone = zones.get(body.userId) ?? 'UTC';
      await insertOutbox(db, membership.scope, {
        userId: body.userId,
        category: 'shifts',
        urgency: 'normal',
        title: 'You have a new shift',
        body: `You were assigned a shift: ${wallRange(row.starts_at, row.ends_at, zone)}.`,
        data: {
          shiftId: row.id,
          startsAt: row.starts_at.toISOString(),
          endsAt: row.ends_at.toISOString(),
          url: `rota://shift/${row.id}`,
        },
      });
      await requestPushDelivery(deps.queue);
    }
    await logActivity(db, membership.scope, {
      type: 'shift.created',
      actorId: membership.user.id,
      summary: `${membership.user.name} scheduled a shift for ${assignee?.name ?? 'a team member'}`,
      data: { shiftId: row.id, userId: body.userId },
    });
    await invalidatePrefix(deps.cache, calendarPrefix(membership.scope.teamId));

    return shiftPayload(deps, row);
  });

  app.patch('/v1/shifts/:shiftId', async (req): Promise<Shift> => {
    const { shiftId } = parseWith(ShiftParams, req.params, 'params');
    const { membership, scope, shift } = await requireShiftMembership(deps, req, shiftId);
    assertCan(membership.role, 'shift.update');
    await assertTeamWritable(deps.topology.shardDb(membership.scope), membership.scope.teamId);
    const body = parseWith(RequestBodies.updateShift, req.body, 'body');

    const hasTimes = body.startsAt !== undefined || body.endsAt !== undefined;
    if (hasTimes && (body.startsAt === undefined || body.endsAt === undefined)) {
      throw badRequest('startsAt and endsAt must be provided together');
    }
    const startsAt = body.startsAt ? new Date(body.startsAt) : shift.starts_at;
    const endsAt = body.endsAt ? new Date(body.endsAt) : shift.ends_at;
    if (endsAt.getTime() <= startsAt.getTime()) throw badRequest('endsAt must be after startsAt');

    const db = deps.topology.shardDb(membership.scope);
    const reassign = body.userId !== undefined && body.userId !== shift.user_id;
    const nextUserId = reassign ? body.userId! : shift.user_id;
    if (reassign && nextUserId) {
      const target = (await membersByIds(db, scope, [nextUserId])).get(nextUserId);
      if (!target?.active) throw conflict('That user is not an active member.');
    }
    const updated = await db.tx(async (tx) => {
      if (
        (hasTimes || reassign) &&
        nextUserId &&
        (await hasOverlap(tx, scope, { userId: nextUserId, startsAt, endsAt, excludeShiftId: shiftId }))
      ) {
        throw conflict('That member already has a shift in this window.');
      }
      return updateShift(tx, scope, shiftId, {
        startsAt,
        endsAt,
        role: body.role === undefined ? shift.role : body.role,
        location: body.location === undefined ? shift.location : body.location,
        meetingUrl: body.meetingUrl === undefined ? shift.meeting_url : body.meetingUrl,
        notes: body.notes === undefined ? shift.notes : body.notes,
        ...(reassign
          ? {
              userId: nextUserId ?? undefined,
              // Reassignment lands as pending for the new assignee, except when
              // a scheduler hands the shift to themselves (same rule as create).
              assignmentStatus: nextUserId === membership.user.id ? ('accepted' as const) : ('pending' as const),
            }
          : {}),
      });
    });
    if (!updated) throw notFound('That shift does not exist.');

    if (reassign) {
      if (shift.user_id && shift.user_id !== nextUserId) {
        await insertOutbox(db, scope, {
          userId: shift.user_id,
          category: 'shifts',
          urgency: 'normal',
          title: 'A shift was reassigned',
          body: `A shift you held now belongs to someone else: ${wallRange(updated.starts_at, updated.ends_at, 'UTC')}.`,
          data: { shiftId: shift.id, url: `rota://shift/${shift.id}` },
        });
      }
      if (nextUserId && nextUserId !== membership.user.id) {
        const zones = await loadUserZones(deps.topology.global, [nextUserId]);
        const zone = zones.get(nextUserId) ?? 'UTC';
        await insertOutbox(db, scope, {
          userId: nextUserId,
          category: 'shifts',
          urgency: 'normal',
          title: 'You have a new shift',
          body: `You were assigned a shift: ${wallRange(updated.starts_at, updated.ends_at, zone)}.`,
          data: {
            shiftId: updated.id,
            startsAt: updated.starts_at.toISOString(),
            endsAt: updated.ends_at.toISOString(),
            url: `rota://shift/${updated.id}`,
          },
        });
      }
      await requestPushDelivery(deps.queue);
    } else if (shift.user_id && shift.user_id !== membership.user.id) {
      const zone = (await loadUserZones(deps.topology.global, [shift.user_id])).get(shift.user_id) ?? 'UTC';
      await insertOutbox(db, scope, {
        userId: shift.user_id,
        category: 'shifts',
        urgency: 'normal',
        title: 'One of your shifts changed',
        body: `A shift you are assigned to was updated: ${wallRange(updated.starts_at, updated.ends_at, zone)}.`,
        data: {
          shiftId: shift.id,
          startsAt: updated.starts_at.toISOString(),
          endsAt: updated.ends_at.toISOString(),
          url: `rota://shift/${shift.id}`,
        },
      });
      await requestPushDelivery(deps.queue);
    }
    const reassignee = reassign && nextUserId
      ? (await loadUsersByIds(deps.topology.global, [nextUserId])).get(nextUserId)
      : undefined;
    await logActivity(db, scope, {
      type: 'shift.updated',
      actorId: membership.user.id,
      summary: reassignee
        ? `${membership.user.name} reassigned a shift on ${wallRange(updated.starts_at, updated.ends_at, membership.user.timezone)} to ${reassignee.name}`
        : `${membership.user.name} updated a shift on ${wallRange(updated.starts_at, updated.ends_at, membership.user.timezone)}`,
      data: { shiftId: shift.id },
    });
    await invalidatePrefix(deps.cache, calendarPrefix(scope.teamId));

    return shiftPayload(deps, updated);
  });

  app.delete('/v1/shifts/:shiftId', async (req, reply) => {
    const { shiftId } = parseWith(ShiftParams, req.params, 'params');
    parseWith(NoQuery, req.query, 'query');
    const { membership, scope, shift } = await requireShiftMembership(deps, req, shiftId);
    assertCan(membership.role, 'shift.delete');
    await assertTeamWritable(deps.topology.shardDb(membership.scope), membership.scope.teamId);

    const db = deps.topology.shardDb(membership.scope);
    const deleted = await deleteShift(db, scope, shiftId);
    if (!deleted) throw notFound('That shift does not exist.');

    if (shift.user_id && shift.user_id !== membership.user.id) {
      await insertOutbox(db, scope, {
        userId: shift.user_id,
        category: 'shifts',
        urgency: 'normal',
        title: 'One of your shifts was removed',
        body: 'A shift you were assigned to was removed.',
        data: { shiftId: shift.id, url: `rota://shift/${shift.id}` },
      });
      await requestPushDelivery(deps.queue);
    }
    await logActivity(db, scope, {
      type: 'shift.deleted',
      actorId: membership.user.id,
      summary: `${membership.user.name} removed a shift on ${wallRange(deleted.starts_at, deleted.ends_at, membership.user.timezone)}`,
      data: { shiftId: shift.id },
    });
    await invalidatePrefix(deps.cache, calendarPrefix(scope.teamId));

    reply.status(204);
    return null;
  });

  /**
   * The assignee answers their own assignment. Accepting settles it; declining
   * releases the shift (assignee cleared, so it reads as open) and tells the
   * schedulers, who are the only people who can cover it again.
   */
  app.post('/v1/shifts/:shiftId/respond', async (req): Promise<Shift> => {
    const { shiftId } = parseWith(ShiftParams, req.params, 'params');
    const { membership, scope, shift } = await requireShiftMembership(deps, req, shiftId);
    assertCan(membership.role, 'shift.respond');
    await assertTeamWritable(deps.topology.shardDb(membership.scope), membership.scope.teamId);
    const body = parseWith(RequestBodies.respondToShift, req.body, 'body');

    if (!shift.user_id || shift.user_id !== membership.user.id) {
      throw forbidden('Only the assigned member can respond to this shift.');
    }

    const db = deps.topology.shardDb(membership.scope);
    const updated = await db.tx((tx) => respondToShift(tx, scope, shiftId, body.action));
    if (!updated) throw notFound('That shift does not exist.');

    if (body.action === 'decline') {
      const schedulers = (await listActiveMembers(db, scope)).filter(
        (member) => member.role === 'owner' || member.role === 'admin' || member.role === 'manager',
      );
      const zones = await loadUserZones(
        deps.topology.global,
        schedulers.map((member) => member.user_id),
      );
      for (const scheduler of schedulers) {
        if (scheduler.user_id === membership.user.id) continue;
        const zone = zones.get(scheduler.user_id) ?? 'UTC';
        await insertOutbox(db, scope, {
          userId: scheduler.user_id,
          category: 'shifts',
          urgency: 'urgent',
          title: 'A shift was declined',
          body: `${membership.user.name} declined the shift on ${wallRange(shift.starts_at, shift.ends_at, zone)}. It is open again.`,
          data: {
            shiftId: shift.id,
            startsAt: shift.starts_at.toISOString(),
            endsAt: shift.ends_at.toISOString(),
            url: `rota://shift/${shift.id}`,
          },
        });
      }
      await requestPushDelivery(deps.queue);
    }

    await logActivity(db, scope, {
      type: body.action === 'decline' ? 'shift.declined' : 'shift.accepted',
      actorId: membership.user.id,
      summary:
        body.action === 'decline'
          ? `${membership.user.name} declined a shift on ${wallRange(shift.starts_at, shift.ends_at, membership.user.timezone)}`
          : `${membership.user.name} accepted a shift on ${wallRange(shift.starts_at, shift.ends_at, membership.user.timezone)}`,
      data: { shiftId: shift.id },
    });
    await invalidatePrefix(deps.cache, calendarPrefix(scope.teamId));

    return shiftPayload(deps, updated);
  });
}