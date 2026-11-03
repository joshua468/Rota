---
name: settings-sync
description: Implement Rota user settings coordination: server source of truth, per-field updatedAt, last-write-wins with stale detection, optimistic updates, foreground refetch, optional SSE, and server enforcement in the push job.
---

# Settings sync

## Model
`user_settings` columns: `quiet_start`, `quiet_end`, `time_zone` (IANA), `notif_shifts`, `notif_swaps`, `notif_billing`, `language`, `theme`, each with its own `*_updated_at` set by the **server** (`now()`).

## API
`GET /me/settings` → values + per-field `updatedAt`. `PATCH /me/settings` body `{changes:{field:value}, baseUpdatedAt:{field:iso}}`:
- For each field, if `baseUpdatedAt[field] < current updatedAt` → conflict for that field: keep the server value, include it in `409`/`conflicts`.
- Otherwise write and stamp now. Last write wins per field. Weakness: server arrival time stands in for user intent, so an offline-delayed edit that passes the base check can still override a concurrent online one.

## App
- TanStack mutation with optimistic `onMutate` + rollback `onError` + toast.
- Refetch on launch and on AppState → active. Optional SSE `GET /me/settings/stream` invalidates the query.
- Offline: queue the patch with `baseUpdatedAt`; on reconnect send; on conflict show "Updated on another device" and adopt the server value.
- `theme` setting drives `ThemeProvider`.

## Server enforcement
The push job reads settings fresh; never from a cache; quiet hours and category toggles are applied there (see `push-notifications`).

## Tests
two-device scenario, stale base conflict, per-field independence, optimistic rollback in app test, quiet hours obeyed after a change made elsewhere.
