# Rota

A B2B shift-scheduling, swap and billing mobile product for small B2B SaaS teams.

![GIF placeholder](TODO(gif))

- Build: [TODO(build)](#)
- Demo: [TODO(demo)](#)

Proof: Built with Expo + Fastify + Postgres; team isolation enforced on every route. TODO(metric)

## What Rota is

Rota is a B2B shift-scheduling product that manages shifts, shift swaps, and subscription billing for small teams. It prioritises clear separation between the mobile frontend and backend, strict server-authoritative data, and deterministic billing through verified webhooks.

## Architecture at a glance

- **frontend/** (Expo + Expo Router) — mobile client. UI consumes design tokens generated from `design/tokens.json`. No secrets or billing decisions live in the bundle.
- **backend/** (Fastify) — API server. Server is the authority: derives role, team, plan, seats, subscription status from verified tokens and database. All writes go through policy checks.
- **packages/contract/** — shared type-safe API contract (Zod schemas) between `frontend/src` and `backend/src`. Single source of truth for requests/responses and money as integer cents.
- **design/** — Figma-exported palette + generated semantic tokens. Design tokens workflow ensures consistent colour/spacing/typography across the app.
- **Postgres (sharded by team)** — data isolation enforced at query time with `TeamScope`. Migrations run on global + all shards.
- **Redis + BullMQ** — caching where permitted and background jobs for push, webhooks, renewals, third-party calls.
- **Payment provider (Flutterwave)** — web-hosted checkout with idempotency keys. Webhook signature verification is the only source of payment success.

For full details, see [ARCHITECTURE.md](docs/ARCHITECTURE.md), [STATE.md](docs/STATE.md), [SECURITY.md](docs/SECURITY.md), [SHARDING.md](docs/SHARDING.md), [PRD.md](docs/PRD.md), [TRACEABILITY.md](docs/TRACEABILITY.md), [LEARNING-LOG.md](docs/LEARNING-LOG.md), [decisions](docs/decisions/), [load tests](load-tests/REPORT.md).

## Quickstart

```bash
pnpm install
pnpm tokens:build
pnpm migrate
pnpm dev:server
pnpm dev:app
```

This is a pnpm workspace. Always use `pnpm`, never `npm install` or `yarn`: the workspace depends on the `workspace:*` protocol and pnpm's symlinked `node_modules`, which npm cannot read (it fails with `Cannot read properties of null (reading 'matches')`). Add app dependencies through the workspace filter, and prefer Expo's version-aware installer:

```bash
pnpm add <pkg> --filter @rota/frontend
pnpm --filter @rota/frontend exec expo install <pkg>
```

Notes: `tokens:build` generates semantic tokens from `design/tokens.json`. The frontend package is `frontend/` (previously `app/`), backend is `backend/` (previously `server/`).

## Run tests

```bash
pnpm verify
```

## Design tokens workflow

```bash
pnpm tokens:build
pnpm check:styles
```

Design tokens are the source of truth for colours, spacing, radius, typography. Figma exports define the core palette; semantic roles are validated for contrast in CI. See [ADR-0002](docs/decisions/0002-tokens-not-literals.md).

## App Store / Play billing section

Mobile app stores have rules that may require using Apple/Google in-app purchases for digital subscriptions sold inside an app, including certain B2B cases. This has implications for Rota:

- **Store billing may be required:** If a subscription is offered as an in-app purchase inside the mobile app (rather than solely through web checkout), the app may be expected to use the platform's billing system. Compliance with store policies is required for distribution on App Store/Play.
- **Rota's approach (web-checkout alternative):** Rota documents a web-checkout path using **Flutterwave hosted checkout** with `Idempotency-Key` on checkout creation and idempotent processing of webhook events. The hosted checkout keeps sensitive payment details on the provider surface and allows B2B flows where appropriate.
- **Server authority on payment outcome:** The app **never** decides a payment succeeded. Only a **signature-verified webhook** from the payment provider determines final subscription/payment state. Checkout attempts are idempotent; webhook events are deduped (idempotency keys + webhook event deduplication) before mutating billing state.
- **Constraint documented:** The trade-off between store billing and web checkout is recorded in [ADR-0007](docs/decisions/0007-billing-provider-vs-store.md). This design keeps billing state server-authoritative and auditable.

See also: [SECURITY.md](docs/SECURITY.md) (webhook forgery, replayed checkout, idempotency), [PRD.md](docs/PRD.md) (proration and plan details), [ARCHITECTURE.md](docs/ARCHITECTURE.md) (request lifecycle and data boundaries).