---
name: load-testing
description: Create and run Rota's k6 load tests and produce the written report: 200 VUs on the activity feed, before and after caching, plus rate-limit and failure drills.
---

# Load testing with k6

## Scripts (`load-tests/`)
- `feed-200vu.js`: login once per VU (setup), ramp 0 → 200 VUs over 20 s, hold 60 s, ramp down; request the feed with real cursors; thresholds `http_req_failed < 1%`, `http_req_duration p(95) < 300` (after cache).
- `calendar.js`: week range reads, 100 VUs.
- `auth-login.js`: bursts that must produce 429s without 5xx.

## Procedure
1. Seed 12,000 activity rows and ≥ 50 users.
2. Run with `CACHE_DISABLED=1` → save `results/feed-nocache.json` (`--summary-export`).
3. Run with cache enabled → `results/feed-cache.json`.
4. Record from server logs by `reqId`: slowest request path, DB connection count, Redis hit ratio.
5. Failure drills: stop Redis, kill worker, make push provider fail 50%. Note what degraded.

## `REPORT.md` template
Environment (CPU/RAM, region, DB tier) · script settings · table: p50/p95/p99, req/s, error rate (before vs after) · what surprised me · what breaks first · what I'd change. Use only measured numbers.
