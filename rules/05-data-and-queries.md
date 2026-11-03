# Rule 05: Data access

- Every query goes through a repository that requires a `TeamScope`. A query without `team_id` must not typecheck.
- Parameterised queries only. Never build SQL from strings containing input.
- Any list endpoint over a growing table uses keyset (cursor) pagination on `(created_at, id)` with an opaque cursor and a supporting composite index. Offset pagination is banned for feeds.
- New tables expected to exceed 10k rows ship with the index and an `EXPLAIN ANALYZE` note in `docs/perf/`.
- Reads that must be fresh (auth, permissions, billing, settings, notification checks) use the primary. Other reads use `db.read(scope)`, which honours read-your-own-writes.
- Pool size is 10 per pool; changing it requires updating the justification in `docs/ARCHITECTURE.md`.
- Shard by `fnv1a(teamId) % SHARD_COUNT`; no cross-shard SQL; global identity data lives in the global DB.
- Cache with a TTL and explicit invalidation. Check the never-cache list in `docs/ARCHITECTURE.md` first.
- Migrations are versioned and run on global and all shards via `pnpm migrate`.
