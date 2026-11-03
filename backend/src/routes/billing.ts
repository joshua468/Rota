import { z } from 'zod';
import { Id, LedgerEntry, Plan, QueryParams, RequestBodies, Subscription } from '@rota/contract';
import type { FastifyInstance } from 'fastify';
import type { AppDeps } from '../app';
import { ledgerPage } from '../billing/ledger';
import { createCheckout } from '../billing/checkout';
import { buildSubscription, toPlanContract } from '../billing/subscription';
import type { PlanRow, SubscriptionRow } from '../billing/entitlements';
import { assertCan, requireMembership, requireUser } from '../http/auth';
import { RATE_RULES } from '../http/rate-limit';
import { NoQuery, parseWith } from '../http/validate';
import { ApiError } from '../lib/errors';
import { sha256 } from '../lib/crypto';
import { membershipsForUser } from '../repos/members';
import {
  beginIdempotent,
  canonicalJson,
  finishIdempotent,
  releaseIdempotent,
} from '../repos/idempotency';

const TeamParams = z.object({ teamId: Id }).strict();
const IdempotencyKey = z.string().min(1).max(200);

/**
 * Billing HTTP surface (Rule 01/06): plans from the `plans` table, subscription
 * and ledger reads scoped by TeamScope, checkout guarded by policy + rate limit
 * + Idempotency-Key. Money never crosses this boundary in a request body —
 * the server derives every cent.
 */
export function registerBillingRoutes(app: FastifyInstance, deps: AppDeps): void {
  app.get('/v1/plans', async (req): Promise<Plan[]> => {
    parseWith(NoQuery, req.query, 'query');
    const user = await requireUser(deps.env, deps.topology, req);
    const memberships = await membershipsForUser(deps.topology.shards, user.id);
    assertCan(memberships[0]?.role ?? 'member', 'plans.read');
    const rows = await deps.topology.global.query<PlanRow>(
      'SELECT * FROM plans WHERE active = true ORDER BY price_cents ASC, key ASC',
    );
    return rows.map(toPlanContract);
  });

  app.get('/v1/teams/:teamId/billing/subscription', async (req): Promise<Subscription | null> => {
    const { teamId } = parseWith(TeamParams, req.params, 'params');
    parseWith(NoQuery, req.query, 'query');
    const membership = await requireMembership(deps.env, deps.topology, req, teamId);
    assertCan(membership.role, 'billing.read');
    const row = await deps.topology.shardDb(membership.scope).one<SubscriptionRow>(
      'SELECT * FROM subscriptions WHERE team_id = $1',
      [teamId],
    );
    if (!row) return null;
    return buildSubscription(deps.topology.shardDb(membership.scope), row);
  });

  app.get('/v1/teams/:teamId/billing/ledger', async (req): Promise<{ items: LedgerEntry[]; nextCursor: string | null }> => {
    const { teamId } = parseWith(TeamParams, req.params, 'params');
    const membership = await requireMembership(deps.env, deps.topology, req, teamId);
    assertCan(membership.role, 'billing.ledger');
    const query = parseWith(QueryParams.ledger, req.query, 'query');
    return ledgerPage(deps.topology.shardDb(membership.scope), membership.scope, query);
  });

  app.post('/v1/teams/:teamId/billing/checkout', async (req, reply): Promise<{ url: string }> => {
    const { teamId } = parseWith(TeamParams, req.params, 'params');
    const membership = await requireMembership(deps.env, deps.topology, req, teamId);
    assertCan(membership.role, 'billing.checkout');
    await deps.rateLimiter.enforce(RATE_RULES.checkout, `team:${teamId}|user:${membership.user.id}`);

    const key = parseWith(IdempotencyKey, req.headers['idempotency-key'], 'headers.Idempotency-Key');
    const body = parseWith(RequestBodies.checkout, req.body, 'body');
    const requestHash = sha256(canonicalJson({ teamId, body }));

    const begin = await beginIdempotent(deps.topology.global, {
      userId: membership.user.id,
      key,
      requestHash,
    });
    if (begin.kind === 'replay') {
      reply.status(begin.status);
      return begin.body as { url: string };
    }

    try {
      const result = await createCheckout(deps, {
        scope: membership.scope,
        userId: membership.user.id,
        email: membership.user.email,
        body,
      });
      const payload = { url: result.url };
      await finishIdempotent(deps.topology.global, {
        userId: membership.user.id,
        key,
        status: 200,
        body: payload,
      });
      req.log.info(
        {
          reqId: req.reqId,
          userId: membership.user.id,
          teamId,
          paymentRef: result.reference,
          amountCents: result.amountCents,
          daysRemaining: result.proration.daysRemaining,
          effective: result.proration.effective,
        },
        'checkout',
      );
      reply.status(200);
      return payload;
    } catch (error) {
      // Client errors are stored so a retry with the same key replays them;
      // server errors release the key so the client may try again.
      if (error instanceof ApiError && error.status < 500) {
        const payload = error.envelope(req.reqId);
        await finishIdempotent(deps.topology.global, {
          userId: membership.user.id,
          key,
          status: error.status,
          body: payload,
        });
        reply.status(error.status);
        return payload as unknown as { url: string };
      }
      await releaseIdempotent(deps.topology.global, { userId: membership.user.id, key });
      throw error;
    }
  });
}
