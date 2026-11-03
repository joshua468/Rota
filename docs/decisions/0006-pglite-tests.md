# 0006-pglite-tests.md

**Date:** 2026-10-07  
**Status:** accepted

## Problem

Need hermetic, fast CI tests with real Postgres semantics (constraints, triggers, transactions) for team isolation and permissions.

## Options considered

- **Option A:** PGlite (real Postgres in-process) + in-memory Redis for tests; `pg`/`ioredis` in production
- **Option B:** Testcontainers/Docker
- **Option C:** SQLite-incompatible mocks

## Decision

Use **Option A**: PGlite provides real Postgres in-process; in-memory Redis for tests. Production uses `pg`/`ioredis` behind the same interface. This matches production SQL behaviour while keeping CI hermetic and fast.

## Consequences

- Deterministic tests without external services.
- Real SQL (not emulated), supports complex constraints/triggers.
- Same repository interface in test/prod reduces drift.