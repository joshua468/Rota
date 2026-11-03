import { z } from 'zod';
import { Id, PagedResponse, QueryParams, type ActivityItem } from '@rota/contract';
import type { FastifyInstance } from 'fastify';
import type { AppDeps } from '../app';
import { assertCan, requireMembership } from '../http/auth';
import { parseWith } from '../http/validate';
import { decodeCursor, encodeCursor } from '../repos/cursor';
import { listActivity, type ActivityRow } from '../repos/feed';
import { briefUser, isoStamp, loadUsersByIds, type DirectoryUser } from '../repos/public';

const TeamParams = z.object({ teamId: Id }).strict();

function toActivityItem(row: ActivityRow, directory: Map<string, DirectoryUser>): ActivityItem {
  return {
    id: row.id,
    type: row.type,
    actor: row.actor_id ? briefUser(directory, row.actor_id) : null,
    summary: row.summary,
    data: row.data ?? {},
    createdAt: isoStamp(row.created_at),
  };
}

export function registerFeedRoutes(app: FastifyInstance, deps: AppDeps): void {
  app.get('/v1/teams/:teamId/activity', async (req): Promise<{ items: ActivityItem[]; nextCursor: string | null }> => {
    const { teamId } = parseWith(TeamParams, req.params, 'params');
    const membership = await requireMembership(deps.env, deps.topology, req, teamId);
    assertCan(membership.role, 'feed.read');
    const query = parseWith(QueryParams.feed, req.query, 'query');

    const limit = query.limit ?? 20;
    const after = query.cursor ? decodeCursor(query.cursor) : undefined;
    const db = deps.topology.shardDb(membership.scope);
    const rows = await listActivity(db, membership.scope, { after, limit: limit + 1 });
    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;
    const directory = await loadUsersByIds(
      deps.topology.global,
      page.map((row) => row.actor_id),
    );
    const items = page.map((row) => toActivityItem(row, directory));
    const last = page[page.length - 1];
    return {
      items,
      nextCursor: hasMore && last ? encodeCursor(last.created_at, last.id) : null,
    };
  });
}