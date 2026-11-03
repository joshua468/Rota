# Load Test Report

**Numbers are recorded only after a run; nothing here is estimated.**

## Environment
- API base: `TODO(metric)` (e.g. http://localhost:3000 or deployed URL)
- k6 version: `TODO(metric)`
- Postgres: `TODO(metric)` (shards/config)
- Redis: `TODO(metric)`
- Node/OS: `TODO(metric)`
- Date/time of run: `TODO(metric)`

## Script settings
| Script | VUs | Duration/Ramp | Notes |
|---|---|---|---|
| feed-200vu.js | 0→200→0 | 20s/60s/20s | Cursor feed; thresholds http_req_failed < 0.01, p(95) < 300ms |
| calendar.js | 100 | 60s | Week range reads |
| auth-login.js | bursts (50) | 10s/30s/10s | Must produce 429s; no 5xx |

## Before/after caching
| Metric | feed-200vu.js (before cache) | feed-200vu.js (after cache) | calendar.js (before cache) | calendar.js (after cache) | Notes |
|---|---|---|---|---|---|
| http_reqs | TODO(metric) | TODO(metric) | TODO(metric) | TODO(metric) | Total requests |
| http_req_failed (%) | TODO(metric) | TODO(metric) | TODO(metric) | TODO(metric) | Fail rate |
| http_req_duration p(50) (ms) | TODO(metric) | TODO(metric) | TODO(metric) | TODO(metric) | Median |
| http_req_duration p(95) (ms) | TODO(metric) | TODO(metric) | TODO(metric) | TODO(metric) | 95th percentile |
| http_req_duration p(99) (ms) | TODO(metric) | TODO(metric) | TODO(metric) | TODO(metric) | 99th percentile |
| vus_max | TODO(metric) | TODO(metric) | TODO(metric) | TODO(metric) | Peak VUs |
| data_received (MB) | TODO(metric) | TODO(metric) | TODO(metric) | TODO(metric) | — |
| data_sent (MB) | TODO(metric) | TODO(metric) | TODO(metric) | TODO(metric) | — |
| Redis hit rate (%) | TODO(metric) | TODO(metric) | TODO(metric) | TODO(metric) | If applicable |
| DB connections (peak) | TODO(metric) | TODO(metric) | TODO(metric) | TODO(metric) | Pool usage |

## What surprised me
TODO(metric/text when run exists)

## What breaks first
TODO(metric/text when run exists)

## What I would change
TODO(metric/text when run exists)

## Command lines to run each script
```bash
# Feed (200 VUs)
k6 run load-tests/feed-200vu.js --env API_BASE=http://localhost:3000

# Calendar (100 VUs)
k6 run load-tests/calendar.js --env API_BASE=http://localhost:3000

# Auth login bursts (must produce 429s, no 5xx)
k6 run load-tests/auth-login.js --env API_BASE=http://localhost:3000
```

Notes: Set `AUTH_TOKEN`/`FEED_CURSOR` via env if endpoints require auth. Never hardcode secrets. Results only recorded after actual runs.