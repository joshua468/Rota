# EXPLAIN ANALYZE notes (Rule 05)

Rule 05: "New tables expected to exceed 10k rows ship with the index and an
`EXPLAIN ANALYZE` note in `docs/perf/`." This directory is that note. Every
number below came from one real run of `tools/explain-analyze.mjs` — nothing
here is estimated.

## How to reproduce

```bash
node tools/explain-analyze.mjs   # reads backend/.env; takes ~1.5 minutes
```

The script seeds synthetic rows for two fake teams into the real shard
database, runs the exact list queries from `backend/src/repos` with the
shipped index, then drops that index and runs them again — all inside **one
transaction that is rolled back**, so no bench data survives and the rollback
restores every dropped index (verified at the end of the run).

## Run environment

- Run at: 2026-10-18T21:13:28.623Z
- Engine: PostgreSQL 17.5 on x86_64-windows, compiled by msvc-19.43.34808, 64-bit
- Seeding: activity 2 teams × 100k rows (24.4s), shifts 100k (11.3s),
  swap_requests 50k (6.4s), ledger_entries 100k (8.8s); `ANALYZE` on all four.
- Queries: verbatim SQL from `repos/feed.ts`, `repos/shifts.ts`,
  `repos/swaps.ts`, `repos/ledger.ts` (literals inlined instead of bind
  params; same plan).

## Results

### activity — feed, page 1 (`listActivity`, no cursor)

Index under test: `activity_team_cursor (team_id, created_at DESC, id DESC)`.
Bench team rows: 100k of 200k (split across two teams).

With the index (shipped state):

```
Limit  (cost=0.42..10.01 rows=50 width=88) (actual time=0.024..0.052 rows=50 loops=1)
  ->  Index Scan using activity_team_cursor on activity  (cost=0.42..19101.10 rows=99616 width=88) (actual time=0.022..0.043 rows=50 loops=1)
        Index Cond: (team_id = 'a11a11a1-0000-4000-8000-00000000feed'::uuid)
Planning Time: 8.021 ms
Execution Time: 0.082 ms
```

Without the index (dropped for the comparison):

```
Limit  (cost=7085.32..7091.07 rows=50 width=88) (actual time=338.735..363.033 rows=50 loops=1)
  ->  Gather Merge  (cost=7085.32..13824.09 rows=58598 width=88) (actual time=338.733..363.022 rows=50 loops=1)
        Workers Planned: 1
        Workers Launched: 1
        ->  Sort  (cost=6085.31..6231.81 rows=58598 width=88) (actual time=68.871..68.875 rows=25 loops=2)
              Sort Key: created_at DESC, id DESC
              Sort Method: top-N heapsort  Memory: 31kB
              Worker 0:  Sort Method: quicksort  Memory: 25kB
              ->  Parallel Seq Scan on activity  (cost=0.00..4138.73 rows=58598 width=88) (actual time=0.011..51.105 rows=50000 loops=2)
                    Filter: (team_id = 'a11a11a1-0000-4000-8000-00000000feed'::uuid)
                    Rows Removed by Filter: 50010
Planning Time: 0.262 ms
Execution Time: 363.088 ms
```

**Execution time: 0.08 ms with the index vs 363.09 ms without — 4427.9× faster.**

### activity — feed, page N (row-value cursor comparison)

Same index. The `(created_at, id) < ($2, $3)` row comparison is pushed into
the `Index Cond`, so deep pages stay an index seek:

With the index (shipped state):

```
Limit  (cost=0.42..14.64 rows=50 width=88) (actual time=0.023..0.066 rows=50 loops=1)
  ->  Index Scan using activity_team_cursor on activity  (cost=0.42..14302.28 rows=50296 width=88) (actual time=0.022..0.056 rows=50 loops=1)
        Index Cond: ((team_id = 'a11a11a1-0000-4000-8000-00000000feed'::uuid) AND (ROW(created_at, id) < ROW('2026-10-17 18:26:46.405+01'::timestamp with time zone, '00000000-0000-0000-0000-000000000000'::uuid)))
Planning Time: 0.191 ms
Execution Time: 0.133 ms
```

Without the index (dropped for the comparison):

```
Limit  (cost=6709.85..6715.60 rows=50 width=88) (actual time=223.629..250.281 rows=50 loops=1)
  ->  Gather Merge  (cost=6709.85..10112.24 rows=29586 width=88) (actual time=223.627..250.274 rows=50 loops=1)
        Workers Planned: 1
        Workers Launched: 1
        ->  Sort  (cost=5709.84..5783.81 rows=29586 width=88) (actual time=53.480..53.484 rows=25 loops=2)
              Sort Key: created_at DESC, id DESC
              Sort Method: top-N heapsort  Memory: 31kB
              Worker 0:  Sort Method: quicksort  Memory: 25kB
              ->  Parallel Seq Scan on activity  (cost=0.00..4727.02 rows=29586 width=88) (actual time=12.895..44.513 rows=25000 loops=2)
                    Filter: ((team_id = 'a11a11a1-0000-4000-8000-00000000feed'::uuid) AND (ROW(created_at, id) < ROW('2026-10-17 18:26:46.405+01'::timestamp with time zone, '00000000-0000-0000-0000-000000000000'::uuid)))
                    Rows Removed by Filter: 75010
Planning Time: 0.139 ms
Execution Time: 250.325 ms
```

**Execution time: 0.13 ms with the index vs 250.32 ms without — 1882.1× faster.**

### shifts — calendar week range (`listShifts`, team + window)

Index under test: `shifts_team_window_idx (team_id, starts_at, ends_at)`.
Bench team rows: 100k spread over ~13 months; the window is one week
(~7k rows in range, 50 returned).

With the index (shipped state):

```
Limit  (cost=0.94..28.91 rows=50 width=131) (actual time=0.814..0.861 rows=50 loops=1)
  ->  Incremental Sort  (cost=0.94..4003.38 rows=7156 width=131) (actual time=0.812..0.851 rows=50 loops=1)
        Sort Key: starts_at, id
        Presorted Key: starts_at
        Full-sort Groups: 2  Sort Method: quicksort  Average Memory: 29kB  Peak Memory: 29kB
        ->  Index Scan using shifts_team_window_idx on shifts  (cost=0.42..3681.36 rows=7156 width=131) (actual time=0.637..0.696 rows=51 loops=1)
              Index Cond: ((team_id = 'a11a11a1-0000-4000-8000-00000000feed'::uuid) AND (starts_at < '2026-11-24 22:13:26.406+01'::timestamp with time zone) AND (ends_at > '2026-11-17 22:13:26.406+01'::timestamp with time zone))
Planning Time: 1.409 ms
Execution Time: 0.926 ms
```

Without the index (dropped for the comparison):

```
Limit  (cost=3713.31..3713.44 rows=50 width=131) (actual time=24.831..24.843 rows=50 loops=1)
  ->  Sort  (cost=3713.31..3731.20 rows=7156 width=131) (actual time=24.829..24.835 rows=50 loops=1)
        Sort Key: starts_at, id
        Sort Method: top-N heapsort  Memory: 31kB
        ->  Seq Scan on shifts  (cost=0.00..3475.60 rows=7156 width=131) (actual time=2.053..24.033 rows=1509 loops=1)
              Filter: ((starts_at < '2026-11-24 22:13:26.406+01'::timestamp with time zone) AND (ends_at > '2026-11-17 22:13:26.406+01'::timestamp with time zone) AND (team_id = 'a11a11a1-0000-4000-8000-00000000feed'::uuid))
              Rows Removed by Filter: 98525
Planning Time: 0.312 ms
Execution Time: 24.877 ms
```

**Execution time: 0.93 ms with the index vs 24.88 ms without — 26.9× faster.**

### swap_requests — swap list cursor (`listSwaps`)

Index under test: `swap_requests_team_cursor_idx (team_id, created_at DESC, id DESC)`.
Bench team rows: 50k (all of them).

With the index (shipped state):

```
Limit  (cost=0.41..6.64 rows=50 width=160) (actual time=0.021..0.044 rows=50 loops=1)
  ->  Index Scan using swap_requests_team_cursor_idx on swap_requests  (cost=0.41..6229.74 rows=50001 width=160) (actual time=0.020..0.036 rows=50 loops=1)
        Index Cond: (team_id = 'a11a11a1-0000-4000-8000-00000000feed'::uuid)
Planning Time: 6.769 ms
Execution Time: 0.071 ms
```

Without the index (dropped for the comparison):

```
Limit  (cost=3056.01..3056.13 rows=50 width=160) (actual time=41.289..41.302 rows=50 loops=1)
  ->  Sort  (cost=3056.01..3181.01 rows=50001 width=160) (actual time=41.286..41.293 rows=50 loops=1)
        Sort Key: created_at DESC, id DESC
        Sort Method: top-N heapsort  Memory: 31kB
        ->  Seq Scan on swap_requests  (cost=0.00..1395.01 rows=50001 width=160) (actual time=0.020..20.326 rows=50000 loops=1)
              Filter: (team_id = 'a11a11a1-0000-4000-8000-00000000feed'::uuid)
              Rows Removed by Filter: 1
Planning Time: 0.269 ms
Execution Time: 41.335 ms
```

**Execution time: 0.07 ms with the index vs 41.34 ms without — 582.2× faster.**

### ledger_entries — billing ledger cursor (`listLedger`)

Index under test: `ledger_entries_team_cursor (team_id, created_at DESC, id DESC)`.
Bench team rows: 100k (all of them).

With the index (shipped state):

```
Limit  (cost=0.42..6.42 rows=50 width=102) (actual time=0.020..0.050 rows=50 loops=1)
  ->  Index Scan using ledger_entries_team_cursor on ledger_entries  (cost=0.42..11996.62 rows=100001 width=102) (actual time=0.019..0.040 rows=50 loops=1)
        Index Cond: (team_id = 'a11a11a1-0000-4000-8000-00000000feed'::uuid)
Planning Time: 0.791 ms
Execution Time: 0.076 ms
```

Without the index (dropped for the comparison):

```
Limit  (cost=5329.42..5335.17 rows=50 width=102) (actual time=95.989..102.524 rows=50 loops=1)
  ->  Gather Merge  (cost=5329.42..12094.18 rows=58824 width=102) (actual time=95.987..102.516 rows=50 loops=1)
        Workers Planned: 1
        Workers Launched: 1
        ->  Sort  (cost=4329.41..4476.47 rows=58824 width=102) (actual time=38.452..38.455 rows=25 loops=2)
              Sort Key: created_at DESC, id DESC
              Sort Method: top-N heapsort  Memory: 31kB
              Worker 0:  Sort Method: quicksort  Memory: 25kB
              ->  Parallel Seq Scan on ledger_entries  (cost=0.00..2375.32 rows=58824 width=102) (actual time=0.015..22.148 rows=50000 loops=2)
                    Filter: (team_id = 'a11a11a1-0000-4000-8000-00000000feed'::uuid)
                    Rows Removed by Filter: 2
Planning Time: 0.294 ms
Execution Time: 102.561 ms
```

**Execution time: 0.08 ms with the index vs 102.56 ms without — 1349.5× faster.**

## Post-rollback verification (from the same run)

- Bench activity rows left behind: **0**
- Dropped indexes restored by rollback: **4/4**

## Summary

| Table | Query | With index | Without index | Speedup |
|---|---|---|---|---|
| activity | feed page 1 (LIMIT 50) | 0.08 ms | 363.09 ms | 4427.9× |
| activity | feed page N (row-value cursor) | 0.13 ms | 250.32 ms | 1882.1× |
| shifts | week window (LIMIT 50) | 0.93 ms | 24.88 ms | 26.9× |
| swap_requests | swap list (LIMIT 50) | 0.07 ms | 41.34 ms | 582.2× |
| ledger_entries | ledger list (LIMIT 50) | 0.08 ms | 102.56 ms | 1349.5× |

Every list endpoint over a >10k-row table is an index seek on the shipped
composite index; without it the same query is a sequential scan plus a top-N
sort of the whole team partition (Rule 05; keyset pagination per ADR-0004).
