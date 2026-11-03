# 0001-stack.md

**Date:** 2026-10-07  
**Status:** accepted

## Problem

Choose core stack for B2B shift-scheduling mobile app with strict server authority, team isolation, background jobs, and billing.

## Options considered

- **Option A:** Expo + Expo Router (frontend), Fastify (backend), Postgres + Redis + BullMQ
- **Option B:** React Native CLI + Next.js API (monolith split differently)
- **Option C:** Flutter + Express

## Decision

Use **Option A**: Expo + Expo Router for cross-platform mobile with predictable builds and routing; Fastify for high-performance API with schema validation; Postgres for relational integrity; Redis for job queue/cache where permitted; BullMQ for background jobs.

## Consequences

- Clear separation between frontend/backend packages (frontend/, backend/).
- Type-safe contract via `packages/contract`.
- BullMQ enforces slow work never inline.
- Expo tooling fits token generation pipeline and mobile distribution constraints.