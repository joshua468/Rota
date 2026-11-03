import { z } from 'zod';
import type { FastifyInstance } from 'fastify';
import type { AppDeps } from '../app';
import { WEBHOOK_QUEUE } from '../jobs/billing';
import { safeEqual } from '../lib/crypto';
import { badRequest, unauthorized } from '../lib/errors';
import {
  deleteWebhookEvent,
  getWebhookEventByKey,
  insertWebhookEvent,
  isRecord,
  webhookEventKey,
} from '../repos/webhooks';

const EventBody = z
  .object({ event: z.string().min(1) })
  .passthrough();

/**
 * Flutterwave webhook (webhook-idempotency skill, SECURITY.md threat 3): the
 * request must carry a `verif-hash` header equal to the secret hash configured
 * in the Flutterwave dashboard, compared in constant time before any parsing of
 * meaning. Replays are deduped by `(provider, event_key)`, and the actual state
 * change happens in the `webhooks` job — never in this request.
 *
 * The raw string is retained so the idempotency key can fall back to a body
 * hash, so this route registers its own scoped content-type parser that leaves
 * `req.body` as text (app.ts stays generic).
 */
export function registerWebhookRoutes(app: FastifyInstance, deps: AppDeps): void {
  app.register(async (scope) => {
    scope.addContentTypeParser('application/json', { parseAs: 'string' }, (_req, body, done) => {
      done(null, body);
    });

    scope.post('/v1/webhooks/flutterwave', async (req, reply) => {
      const raw = typeof req.body === 'string' ? req.body : '';
      const secretHash = deps.env.FLUTTERWAVE_SECRET_HASH;

      if (deps.env.NODE_ENV === 'production' && !secretHash) {
        req.log.error({ reqId: req.reqId }, 'flutterwave webhook rejected: no verif-hash configured');
        throw unauthorized();
      }

      const header = req.headers['verif-hash'];
      const provided = Array.isArray(header) ? header[0] : header;
      if (!secretHash || !provided || !safeEqual(secretHash, provided)) {
        req.log.warn({ reqId: req.reqId }, 'webhook signature rejected');
        throw unauthorized('Invalid webhook signature');
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        throw badRequest('Malformed JSON payload');
      }
      if (!isRecord(parsed)) throw badRequest('Malformed JSON payload');
      const body = EventBody.parse(parsed);

      const eventKey = webhookEventKey(body, raw);
      const stored = await insertWebhookEvent(deps.topology.global, {
        provider: 'flutterwave',
        eventKey,
        payload: body,
      });

      if (!stored) {
        // A duplicate is not automatically done: if the first delivery crashed
        // between the insert and the enqueue (or the queue was down), the row is
        // still `received`. Re-enqueue so the retry actually processes it.
        const existing = await getWebhookEventByKey(deps.topology.global, 'flutterwave', eventKey);
        if (existing?.status === 'received') {
          try {
            await deps.queue.add(WEBHOOK_QUEUE, { eventId: existing.id }, { attempts: 5 });
            req.log.info({ reqId: req.reqId, eventKey }, 'duplicate webhook requeued');
          } catch (error) {
            req.log.error({ reqId: req.reqId, eventKey, err: error }, 'duplicate webhook requeue failed');
            throw error;
          }
        } else {
          req.log.info({ reqId: req.reqId, eventKey }, 'duplicate webhook ignored');
        }
        reply.status(200);
        return { received: true };
      }

      try {
        await deps.queue.add(WEBHOOK_QUEUE, { eventId: stored.id }, { attempts: 5 });
      } catch (error) {
        // Roll the inbox row back so the provider's retry can insert it again.
        await deleteWebhookEvent(deps.topology.global, stored.id).catch(() => undefined);
        req.log.error({ reqId: req.reqId, eventKey, err: error }, 'webhook enqueue failed; event row rolled back');
        throw error;
      }
      reply.status(200);
      return { received: true };
    });
  });
}
