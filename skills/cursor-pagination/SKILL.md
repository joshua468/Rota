---
name: cursor-pagination
description: Build or fix Rota's cursor-paginated activity feed (server keyset query, index, EXPLAIN evidence, FlashList infinite scroll). Use for any list that grows or changes while users scroll.
---

# Cursor pagination

## Server
```sql
-- index
CREATE INDEX activity_team_cursor ON activity (team_id, created_at DESC, id DESC);

-- first page
SELECT * FROM activity WHERE team_id = $1
ORDER BY created_at DESC, id DESC LIMIT $2 + 1;

-- next page (row-value comparison keeps ties correct)
SELECT * FROM activity
WHERE team_id = $1 AND (created_at, id) < ($2, $3)
ORDER BY created_at DESC, id DESC LIMIT $4 + 1;
```
- Fetch `limit + 1` to know `hasMore`. Return `{items, nextCursor|null}`.
- Cursor = base64url(JSON `{t: ISO timestamp, i: id}`), validated with Zod; invalid cursor → 400.
- `limit` default 20, max 50.
- Never use OFFSET.

## Evidence
1. `pnpm seed --activities 12000`.
2. Drop the index, run `EXPLAIN (ANALYZE, BUFFERS)` for a deep page → save `docs/perf/feed-before.txt`.
3. Create the index, repeat → `feed-after.txt`. Put the two timings in the README and the LinkedIn post.

## Tests
- 5 rows with identical `created_at`, limit 2 → all 5 seen exactly once.
- Insert 3 rows between page 1 and 2 → page 2 contains no repeats and no gaps.

## App
`useInfiniteQuery({ getNextPageParam: p => p.nextCursor })`, FlashList `onEndReached` guarded by `hasNextPage && !isFetchingNextPage`, pull-to-refresh resets to page 1, states: skeleton loading, designed empty, end-of-list footer, retryable error row.
