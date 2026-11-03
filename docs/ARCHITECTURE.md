# ARCHITECTURE.md

## Component map

Rota has clear frontend/backend separation with shared contracts. Components:

- **frontend/src (Expo + Expo Router)** — Mobile client. Renders UI from design tokens; never makes billing decisions or caches subscription/ledger/payment status. Uses cursor pagination and offline allow-list.
- **backend/src (Fastify)** — API server; server-authoritative. Every request passes Zod validation, auth, then `can(action)` policy check. All responses use the shared error/success envelope from contract.
- **packages/contract/src** — Type-safe contract (Zod). Defines all API methods/paths/payloads; money is integer cents (`*_cents`).
- **Postgres (sharded by team)** — Primary data store. Team isolation enforced via `TeamScope`. Split into global (shared) and sharded (per-team) tables. No cross-shard SQL.
- **Redis** — Caching only where explicitly allowed. Auth/session state not cached; subscription, payment status, balances, ledger, idempotency, webhook records are **never cached**.
- **BullMQ worker** — Background jobs for push notifications, webhooks, renewals, email, and other slow/third-party calls (never inline).
- **Push provider** — Device push delivery via jobs; failures handled asynchronously.
- **Payment provider (Flutterwave)** — Hosted checkout + signature-verified webhooks. Only verified webhooks mutate payment/subscription state.

```mermaid
graph TB
  subgraph Mobile
    FE[frontend/src<br/>Expo Router]
  end
  subgraph API
    API[backend/src<br/>Fastify]
    POL[policy.can(action)]
    Z[Zod validation]
    JOB[BullMQ worker]
  end
  subgraph Data
    PG[(Postgres<br/>global + sharded by teamId)]
    RD[(Redis)]
  end
  subgraph Ext
    PUSH[Push provider]
    PAY[Payment provider<br/>Flutterwave]
  end
  FE --> API
  API --> Z --> AUTH[auth/token] --> POL --> REPO[repository + TeamScope]
  REPO --> PG
  REPO -. permitted cache .-> RD
  API --> JOB
  JOB --> PUSH
  JOB --> PAY
  PAY --signature-verified webhook--> API
```

## Request lifecycle

Every request follows a strict pipeline (Rule 01, Rule 06):

1. **Request arrives** at `backend/src` route. Generate/propagate `reqId` (request id) for tracing.
2. **Zod validation** — Request shape validated against `packages/contract`. Role/team/plan/seats/payment status are never taken from request body; derived server-side.
3. **Auth** — Verify token; derive identity (user/team context). Session state stays in memory where applicable (tokens never persisted client-side beyond SecureStore as specified).
4. **Policy check** — Call `can(action)` for the derived role/team context. Resource ownership checked; cross-team access returns **404** (never 403 to leak existence). UI hiding is cosmetic.
5. **Repository with TeamScope** — All data access uses repository layer with `TeamScope` (team-scoped queries). Isolation enforced at query time.
6. **Response envelope** — Return either success payload (per contract) or error envelope with `ErrorCode`. Uniform responses for auth/forbidden/not-found where relevant.

## Never-cache list (Rules 02/05)

The following are **never cached** (read from primary Postgres on every authoritative read):

- Subscription state (status, plan, period, seats, current period price)
- Payment status / payment attempts
- Balances
- Ledger entries / billing ledger
- Idempotency records (checkout idempotency keys, webhook event ids)
- Webhook records (raw events, verification results, processing state)
- Auth/permission-critical reads that affect billing decisions

**What IS cached (and TTL/invalidation):**

- Non-authoritative, read-heavy reference data only where explicitly permitted. Any cached entry that could affect billing, permissions, or payment state must be treated as stale and never used for authoritative decisions.
- **Implemented now** (`backend/src/cache/cache.ts`, ADR-0008): a read-through cache for the roster (`GET /v1/teams/:teamId/members`, key `roster:<teamId>`, TTL 30s) and the calendar (`GET /v1/teams/:teamId/shifts`, key `cal:<teamId>:<query>`, TTL 15s). Redis when `REDIS_URL` is set, an in-memory map otherwise. Both are read after the same `assertCan`/`requireMembership` checks, so a cache hit never bypasses authorization, and the roster response is masked exactly as the uncached path.
- TTLs and invalidation strategy: cached items (if any) have explicit TTL and are invalidated on writes that affect them. Default: do not cache if uncertain. Cache keys include team scope when team-scoped.
- **Explicit invalidation** (`backend/src/routes/teams.ts`, `shifts.ts`, `swaps.ts`): roster is dropped on invite-accept and member removal; the whole calendar family (`cal:<teamId>:*`) is dropped on shift create/update/delete and on an approved swap (which reassigns the shift). `mine=1` calendar keys embed the caller's user id so one member can never receive another's cached page.
- Invalidation is explicit on mutations (write-through/invalidate) — never rely on client-side staleness for the never-cache list. A cache read/write failure is swallowed (`cached()`/`invalidate()`), so an outage degrades to "no cache", never a failed request.
- Proof: `backend/test/cache.test.ts` (read-through hit, invalidation on member-removal / shift-write / approved-swap, per-caller `mine=1` isolation, TTL expiry, prefix clearing, and fault tolerance).

## Pool size justification

**"10 per pool"** (Rule 05 requirement). The pool size is set to **10 connections per pool** (per database/shard pool) with justification documented here:

- **Workload profile:** B2B mobile app with mostly short queries, cursor pagination, and background jobs via BullMQ. Request latency sensitive; avoid connection churn.
- **Connection overhead:** Postgres connections have memory/overhead; 10 per pool keeps footprint predictable under normal load while allowing concurrent requests without exhausting resources on small/medium deployments.
- **Scaling:** Sharding means pools are scoped per shard/global; 10 per pool balances throughput and fairness. Background worker pool separate from HTTP pool.
- **Fail-safety:** With 10 per pool, saturation is observable and can be tuned; avoids over-provisioning. This value is explicit and documented (Rule 05).

## Offline/read strategy

- **Primary for fresh reads:** Auth, permissions, billing state, subscription/settings, and any checks that gate actions (payment status, seat limits) always read fresh from primary (authoritative). These are on the never-cache list.
- **Read strategy:** `db.read(scope)` for read-only queries with appropriate team scope. Read-your-own-writes is preserved elsewhere (e.g. after mutation, subsequent reads in same request/context reflect the write).
- **Offline:** Limited offline allow-list only. Allowed persisted offline: upcoming shifts (14 days window), roster, `me`, settings. **Not persisted:** activity feed; **never cached/offline-authoritative:** subscription, ledger, payment status, balances, idempotency, webhook records. Session/tokens held in memory + SecureStore (never persisted to general offline cache in a way that affects billing authority).

## Testing strategy

Tests run hermetically using **PGlite (real Postgres in-process)** + **in-memory Redis** for tests, with `pg`/`ioredis` in production behind the same interface.

**Why:** This gives real SQL semantics, types, constraints, triggers, and transaction behavior (not SQLite emulation quirks) while being fast and deterministic in CI without external services. In-memory Redis avoids network dependencies and keeps tests isolated. The production code uses the same repository/DB interface (swapped implementations), so behaviour matches production SQL while tests remain hermetic. This supports the isolation requirements (team isolation, permissions) with reproducible results.