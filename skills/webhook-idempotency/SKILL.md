---
name: webhook-idempotency
description: Build or review Rota's payment webhook endpoint, Idempotency-Key middleware and event dedupe. Use for any payment confirmation path.
---

# Webhooks and idempotency

## Webhook endpoint (`POST /v1/webhooks/flutterwave`)
1. Read the **raw** body (do not JSON-parse first).
2. Compare the `verif-hash` header with `FLUTTERWAVE_SECRET_HASH` using `safeEqual` (constant time). Flutterwave sends the plain secret hash, not an HMAC. Missing or mismatched → 401, log, stop.
3. Parse JSON. `event_key = event + ':' + (data.id ?? data.reference ?? data.tx_ref)`.
4. `INSERT INTO webhook_events (provider, event_key, payload) ... ON CONFLICT DO NOTHING RETURNING id`. No row returned → duplicate → respond 200, do nothing.
5. Enqueue `webhooks` job `{eventId}`; respond 200 immediately.

## Job
Load event → for `charge.completed`/`charge.failed` find `payment_intents` by `tx_ref` → check the charge succeeded and the amount (Flutterwave sends decimal major units → `toMinorUnits`) equals `amount_cents` with a matching currency, status still pending → in **one transaction**: insert ledger entry (unique `ref = 'pay:' + reference`), apply subscription change, mark intent paid, write outbox for notification. Retries are safe because every write is guarded by a unique key.

## HTTP Idempotency-Key (checkout)
Header required. Table `idempotency_keys(user_id, key, request_hash, response_status, response_body)`.
- New key → insert as in-flight, run, store response.
- Same key, same hash, finished → replay stored response.
- Same key, different hash → 422 `IDEMPOTENCY_MISMATCH`.
- Same key still in flight → 409.
Keys expire after 24 h (cleanup job). Never cache these in Redis only; they live in Postgres.

## Tests
Bad signature; same webhook ×3 → 1 ledger row; amount mismatch → rejected and logged; replayed checkout returns same authorization URL; changed body with same key → 422; job crash after ledger insert and retry → still 1 row.
