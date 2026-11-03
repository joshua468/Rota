# STATE.md

All data the app holds, owner, location, `staleTime`, and whether persisted offline. Subscription/billing/ledger/idempotency/webhook records are never cached and never offline-authoritative.

| Data | Owner | Where it lives | `staleTime` | Persisted offline? | Notes |
|---|---|---|---|---|---|
| Session/tokens | User session | Zustand session store in memory + `expo-secure-store` (tokens only). Server session context ephemeral. | N/A (ephemeral) | No (never persisted to offline cache) | Never written to AsyncStorage or general offline cache. Tokens not in bundle. |
| Auth identity (`me`) | User | DB (global/user scope) + client state | Fresh on auth checks; no long-term cache | Yes (allow-list) | Read fresh for permission/billing gates. |
| Team/role/membership | Team | DB (sharded/global as appropriate), derived server-side | Authoritative fresh; never cached | No | Never from request body. Cross-team returns 404. |
| Roster (team members) | Team | Postgres (sharded) | Short (non-billing); no billing authority | Yes (allow-list) | Team-scoped via TeamScope. Server read-through cache `roster:<teamId>` (30s), invalidated on accept/remove — never used for authorization. |
| Shifts (upcoming) | Team | TanStack Query (shifts) persisted via query client cache; source Postgres (sharded) | Allow-listed per query (default 30s) | Yes (upcoming shifts, 7 days persisted via persister) | Limited offline allow-list. Calendar reads cached server-side `cal:<teamId>:<query>` (15s), invalidated on shift/swap writes. Window client-side: from week-start -3d to +60d (see `frontend/src/components/home/useHome.ts`). |
| Shifts (historical) | Team | Postgres (sharded) | Live | No | Not in offline allow-list. |
| Swap requests | Team | Postgres (sharded) | Live | No | State transitions server-authoritative. |
| Settings | Team/User | TanStack Query (settings) + persisted cache; source Postgres | Non-critical (default 30s) | Yes (allow-list) | Single source of truth on server with `updatedAt`. Refetched on app open/foreground via AppState; clients apply server-wins (most recent `updatedAt`). Optimistic updates with rollback on failure. |
| Activity feed | Team | Postgres (sharded) | Live; cursor-based | No | Not persisted offline (cursor pagination). |
| Subscription | Team | Postgres (sharded/global as per schema) | **Never cached** (0/fresh) | No | Plan, status, period, seats, current period price. Server-derived only. |
| Payment status/attempts | Team | Postgres (sharded) | **Never cached** | No | Authoritative only via verified webhooks. |
| Balances | Team | Postgres (sharded) | **Never cached** | No | Ledger-derived. |
| Ledger (billing ledger) | Team | Postgres (sharded) | **Never cached** | No | Immutable audit trail; integer cents. |
| Idempotency records | Team/System | Postgres (sharded/global) | **Never cached** | No | Checkout idempotency keys, event dedupe. |
| Webhook records | System/Team | Postgres | **Never cached** | No | Raw events, signature verification, processing state, dedupe keys. |
| Push devices/tokens | User/Team | Postgres (sharded) | Job-managed | No | Written/read via jobs/repo, not client-cached for authority. |
| Permissions/policy | System | Code + DB (where applicable) | Static+enforced fresh | No | `can(action)` enforced per request. |

Notes: "Never cached" means no Redis/client cache read is treated as authoritative; those reads go to primary Postgres. Only non-authoritative roster/calendar reads use the server read-through cache (`backend/src/cache/cache.ts`), always after the same permission checks and never for authorization, billing, or payment decisions. Client-side reads are managed by TanStack Query; UI/session state not held by Query lives in Zustand stores; tokens live in `expo-secure-store`. The offline allow-list is intentionally small (localStorage-backed persisted TanStack Query cache, 7-day max age) and billing-critical state is excluded entirely.