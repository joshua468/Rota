# 0004-keyset-over-offset.md

**Date:** 2026-10-07  
**Status:** accepted

## Problem

Activity feed pagination must be stable and efficient under growth; OFFSET causes skipping/duplication on inserts.

## Options considered

- **Option A:** Keyset (cursor) pagination
- **Option B:** OFFSET/LIMIT

## Decision

Use **Option A**: cursor-based keyset pagination (opaque cursor `base64url(JSON {t: iso, i: id})`). Sort by stable key (timestamp + id). Feed not persisted offline.

## Consequences

- Correct pagination for live feeds.
- Better performance at scale vs OFFSET.
- Enforces consistent ordering; cursor is opaque to client.