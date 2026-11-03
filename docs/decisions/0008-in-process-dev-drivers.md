# 0008-in-process-dev-drivers.md

**Date:** 2026-10-08  
**Status:** accepted

## Problem

Local development and tests must run without Docker, Redis or a live payment
provider, while production still needs real BullMQ, Redis-backed rate limiting
and Flutterwave. The server must behave identically in both modes so that tests are
meaningful and the app runs on a single laptop.

## Options considered

- **Option A:** Drivers selected by env var (queue, rate-limit store, mail and
  payments), with an in-process fallback and a real implementation behind the
  same interface.
- **Option B:** Require Docker Compose (Redis + Postgres) for all local runs.
- **Option C:** Mock the queue/cache in tests but always run real services in dev.

## Decision

Use **Option A**. `jobs/queue.ts` uses BullMQ when `REDIS_URL` is set and an
in-process `MemoryQueue` otherwise. `http/rate-limit.ts` uses a Redis store when
`REDIS_URL` is set and `MemoryRateStore` otherwise. `locks/locks.ts` uses a Redis
`SET NX PX` lock when `REDIS_URL` is set and `MemoryLock` otherwise, so a
self-scheduling sweep (the hourly renewals job) runs on one node at a time.
Tests also run on `PGlite` (ADR-0006). `billing/flutterwave.ts` returns a
`FakeFlutterwaveProvider` with a deterministic hosted-checkout URL when
`FLUTTERWAVE_SECRET_KEY` is empty; real HTTP only when the key is present.
`MAIL_DRIVER=dev` appends mail to `.mail.jsonl`.

## Consequences

- `pnpm verify`, `pnpm dev:server` and `pnpm dev:app` work with no external
  services; production flips drivers purely through env vars.
- All drivers share one interface, so route/service code never branches on the
  environment (Rule 01/05 stay intact).
- The in-memory queue is drained/scheduled across tests; quiet hours, retries
  and backoff are exercised as real job code, not stubs.
- `REDIS_URL`/`FLUTTERWAVE_SECRET_KEY` are listed by name in `.env.example`; no
  secret values are committed (Rule 03).
