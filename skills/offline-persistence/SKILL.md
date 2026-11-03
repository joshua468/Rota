---
name: offline-persistence
description: Implement Rota offline viewing of upcoming shifts with TanStack Query persistence, last-updated indicator, NetInfo banner, and safe mutation rules.
---

# Offline shifts

## Persistence
- `@tanstack/react-query-persist-client` with an MMKV (or AsyncStorage) persister, **only** for allow-listed query keys: `['shifts','upcoming',teamId]`, `['roster',teamId]`, `['me']`.
- `gcTime` 7 days, `staleTime` 30 s, `networkMode: 'offlineFirst'` for these reads.
- Persist nothing sensitive: no tokens, billing, ledger. Clear the persisted cache on logout and team switch.
- Upcoming window = now → +14 days, fetched from `GET /teams/:id/shifts?mine=1&from&to`.

## UX
- Chip "Last updated 14:32" from `dataUpdatedAt`.
- Offline banner from NetInfo (Zustand `netStore`), calm tone, tokens only.
- Swap request/approve and billing actions are disabled offline with an explanation; settings edits queue (see `settings-sync`).

## Proof
Airplane-mode clip: open app, shifts and last-updated time still shown; reconnect, chip updates. Add to README GIF and cold-message follow-up.
