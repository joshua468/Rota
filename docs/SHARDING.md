# SHARDING.md

## Shard key

- **Shard function:** `fnv1a(teamId) % SHARD_COUNT`
- **Rationale:** Deterministic mapping of team-scoped data to shards using teamId as the partition key. This keeps team data colocated and preserves team isolation at the storage layer boundary.

## Global vs sharded

- **Sharded:** Team-scoped entities (shifts, swaps, roster membership details tied to team operations, team billing records as applicable). Accessed via repository with `TeamScope`.
- **Global:** Cross-team/shared lookup tables and system metadata that must be queryable without team context (e.g. certain user identity lookups, global configuration, system webhook logs where appropriate). Global tables are not team-scoped.
- **Isolation:** No cross-shard SQL. Queries are always scoped to a known shard (when operating on team-scoped data, shard is determined by `teamId`).

## Migrations

- Migrations run on **global** + **all shards**. Migration tooling targets global schema and iterates over each shard (1..SHARD_COUNT) applying the same migration set in order.
- Ensures schema parity across all shards; global and shard migrations tracked separately as needed but applied consistently.

## Moving teams between shards

**We do not move teams between shards** (or do so only under exceptional, planned maintenance with full data migration strategy). Rationale:

- TeamId is immutable as the sharding key; moving breaks referential locality and complicates consistency.
- Rebalancing is avoided by fixed hash + `SHARD_COUNT`. If rebalancing is ever required, it would be a planned offline/dual-write migration with careful cutover; not part of normal operations.
- This simplifies isolation guarantees (no cross-shard move during live traffic).

## Invite token format

Invite tokens use format: `<teamId>.<random>`

- The presence of `teamId` at the start makes **the shard known up front** (can route/validate against correct shard without extra lookup). This preserves the sharding model and avoids cross-shard resolution on invite acceptance.
- `random` provides entropy; token is treated as opaque in transport and validated server-side.