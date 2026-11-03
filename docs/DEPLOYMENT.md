# DEPLOYMENT.md

How Rota reaches production: the API container, the database, the mobile build,
and the rollback path. The server refuses to boot when a production secret is
missing, so a failed deploy fails closed instead of running degraded.

## Topology

| Piece | Runtime | Notes |
|---|---|---|
| API | `Dockerfile` (Node 20 + pnpm + tsx) | Stateless; scale horizontally behind a proxy. |
| Postgres | Managed Postgres 16 (or `docker-compose.yml`) | Global DB plus one DB per shard (`SHARD_DATABASE_URLS`). |
| Redis | Managed Redis 7 (or compose) | Required in production: jobs, rate limits, locks. |
| Mobile | EAS Build + EAS Update | `frontend/eas.json` profiles. |
| Mail | Resend | `MAIL_DRIVER=resend`, `MAIL_FROM`, `RESEND_API_KEY`. |
| Push | Expo Push | `EXPO_ACCESS_TOKEN`. |
| Errors | Sentry-compatible DSN | `SENTRY_DSN` enables the reporter. |

## Required environment

Names live in `.env.example`; values never enter the repo. Production requires:

- `DATABASE_URL`, `SHARD_DATABASE_URLS`, `SHARD_COUNT`, `DB_DRIVER=pg`,
  `DB_SSL=true` for managed Postgres.
- `REDIS_URL` (`rediss://` for managed Redis).
- `JWT_SECRET` (32+ random characters), `PUBLIC_BASE_URL`.
- `CORS_ORIGINS` (explicit origins, no `*`), `TRUST_PROXY=true` only behind a
  trusted proxy/load balancer.
- `FLUTTERWAVE_SECRET_KEY`, `FLUTTERWAVE_SECRET_HASH`.
- `MAIL_DRIVER=resend`, `MAIL_FROM`, `RESEND_API_KEY`.
- Optional: `SENTRY_DSN`, `EXPO_ACCESS_TOKEN`, `OPENAI_API_KEY`,
  `FEATURE_SWAP_ASSIST=false`.

Generate secrets with `openssl rand -base64 48`. Store them in the platform's
secret manager (GitHub Environments, Fly secrets, Render env group, etc.), never
in `docker-compose.yml` or the image.

## First deploy

1. Provision Postgres (global DB + `SHARD_COUNT` shard DBs) and Redis.
2. Set every environment variable above in the target environment.
3. Build and push the image:

   ```sh
   docker build -t rota-api:$GIT_SHA .
   docker tag rota-api:$GIT_SHA registry.example.com/rota-api:$GIT_SHA
   docker push registry.example.com/rota-api:$GIT_SHA
   ```

4. Run migrations as a one-off release step before switching traffic:

   ```sh
   pnpm --filter @rota/backend migrate
   ```

   Migrations are forward-only, transaction-per-file, and tracked per database
   in `schema_migrations`.
5. Start the new image. It serves `/healthz` (liveness) and `/readyz`
   (database, shards, Redis, queue, mail, payment config). Point the load
   balancer at `/readyz`.
6. Point the mobile app at the API URL configured in `frontend/eas.json` for
   that profile.

## Vercel demo deployment

The public demo runs both the Expo web export and the API on Vercel:

- Web app and API: https://rota-mocha.vercel.app (`/healthz`, `/readyz`).
- Repo: https://github.com/joshua468/Rota (Vercel project builds `frontend`).
- Postgres: Neon via the Vercel Marketplace (`DATABASE_URL`,
  `SHARD_DATABASE_URLS`, `DB_DRIVER=pg`, `DB_SSL=true`, `SHARD_COUNT=1`).

Key differences from a production container, chosen to keep the demo free of
extra services:

- `NODE_ENV=development`: fake payment driver, dev mail, in-memory rate limits,
  cache and locks. Do not take real money through this deployment.
- No Redis. Jobs use the in-process queue and are drained per request; recurring
  renewals are not scheduled (`registerBillingJobs({ scheduleRenewals: false })`).
- Vercel serves `api/index.js`, a committed esbuild CommonJS bundle of
  `tools/api-entry.ts`. Rebuild it after changing backend code:

  ```sh
  pnpm build:api
  vercel deploy --prod
  ```

  Everything except the native `@node-rs/argon2`, `bullmq` and `ioredis` is
  bundled. `bullmq`/`ioredis` are only loaded when `REDIS_URL` is set.

Before a real launch, move the API to the container topology above with Redis,
Flutterwave and Resend configured, and set `NODE_ENV=production`.

## Local production-like stack

Create a `.env` for compose (or export the variables) with `POSTGRES_PASSWORD`,
`JWT_SECRET`, `FLUTTERWAVE_SECRET_KEY`, `FLUTTERWAVE_SECRET_HASH`, `MAIL_FROM`
and `RESEND_API_KEY`, then:

```sh
docker compose up --build
curl http://localhost:4000/healthz
curl http://localhost:4000/readyz
curl http://localhost:4000/metrics
```

The API container runs `migrate` before `start`. The compose Postgres init script
creates `rota_shard0` on a fresh volume; if the volume already exists, create the
shard database manually and rerun migrations.

## Mobile release

```sh
cd frontend
eas build --profile preview --platform android
eas build --profile production --platform all
eas submit --profile production
eas update --channel production --message "…"
```

`frontend/app.config.js` reads `EAS_PROJECT_ID`, `EAS_OWNER` and `EAS_CHANNEL`
from the build environment. Run `eas init` once and store the project id in the
EAS/GitHub environment. Without `EAS_PROJECT_ID` the config omits OTA updates,
which is intentional: an update must never point at the wrong project.

## Promotion policy

| Stage | Backend | Mobile |
|---|---|---|
| Development | Local compose / `pnpm dev:server` | Expo Go / development build |
| Preview | Staging API + staging DB/Redis | `preview` profile, internal distribution |
| Production | Tagged image, migrated, `/readyz` green | `production` profile, store tracks |

Promote the same image digest from preview to production; do not rebuild.
Every production change needs a `docs/TRACEABILITY.md` row and a green
`pnpm verify` in CI. Run the load test (`load-tests/`) against staging before a
billing or scheduling release.

## Rollout

1. Migrate (backwards-compatible migrations only).
2. Deploy a canary/one instance; watch `/readyz`, `/metrics`, error rate.
3. Roll the rest. Keep the previous image tag pinned.

## Rollback

- **App only**: redeploy the previous image digest. No migration is reverted.
- **Bad migration**: migrations are forward-only; ship a corrective migration.
  Restore from the pre-deploy backup only if data is corrupted.
- **Data restore**: `pg_dump`/`pg_restore` per database (global and each shard),
  then replay Redis-independent jobs; BullMQ retries pending work.

Take an automated daily backup plus a manual backup before every migration.
Test the restore path quarterly. Never restore only one shard: shard and global
rows must come from the same backup timestamp.

## Incident checks

- `/healthz` fails → process is down; restart/redeploy.
- `/readyz` fails → inspect `checks` (database/shard/redis/queue/mail/payments).
- `/metrics` → `rota_http_requests_total`, `rota_http_errors_total`,
  `rota_webhook_events{status="received"}` (should stay near zero).
- Webhooks stuck in `received` are re-enqueued by the renewals job every pass.
