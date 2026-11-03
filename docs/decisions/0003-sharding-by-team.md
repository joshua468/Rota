# 0003-sharding-by-team.md

**Date:** 2026-10-07  
**Status:** accepted

## Problem

Scale while preserving strong team isolation and predictable query routing.

## Options considered

- **Option A:** `fnv1a(teamId) % SHARD_COUNT` (shard by team)
- **Option B:** Single Postgres DB for all teams
- **Option C:** Shard by userId

## Decision

Use **Option A**: shard by `teamId` with deterministic hash. Team-scoped data lives on chosen shard; global tables shared. No cross-shard SQL. Invite tokens `<teamId>.<random>` make shard known up front.

## Consequences

- Strong isolation boundary aligned to tenancy (team).
- Deterministic routing simplifies authz checks.
- Avoids cross-shard joins; queries stay scoped.
- Moving teams not supported (simplifies correctness). Migrations run global + all shards.