# AGENTS.md: how to work in this repo (for any coding agent)

Same contract as `CLAUDE.md`, written for tools that read `AGENTS.md`.

## Before you change code

1. Read `docs/PRD.md` and the relevant section of `docs/ARCHITECTURE.md`.
2. Find the requirement ID in `docs/TRACEABILITY.md`. If your change doesn't map to one, ask why you're making it.
3. Follow `.claude/rules/*.md`. They are short and binding.

## Hard rules

- Server decides permissions, money, payment truth, quiet hours, seat limits.
- Money is integer minor units (cents). Plans come from the `plans` table.
- Every request body, query and param is parsed with Zod (`.strict()`).
- Every DB access goes through a repository that takes a `TeamScope`.
- Slow or unreliable work (push, email, webhooks, renewals) runs in BullMQ jobs with exponential backoff.
- Styles come from tokens only: no hex colors, raw font sizes or magic spacing in `app/src`.
- Tokens live in `expo-secure-store`. Never `AsyncStorage`.
- Never commit secrets; update `.env.example` with names only.
- Use `pnpm` only. Never run `npm install` or `yarn` here; the workspace uses `workspace:*` and pnpm's symlinked `node_modules`, which npm cannot read.

## Definition of done for any change

Test written or updated → `pnpm verify` green → docs updated if behaviour changed → traceability row updated with proof → explain-back reminder given to the user.

## Agents available (`.claude/agents`)

| Agent | Use it for |
|---|---|
| `backend-engineer` | schema, routes, services, jobs, caching, pooling, sharding |
| `mobile-engineer` | Expo screens, TanStack Query, Zustand, offline, deep links, push client |
| `design-systems-engineer` | tokens, theme, components, accessibility, dark mode |
| `billing-engineer` | plans, proration, checkout, webhooks, ledger, renewals |
| `security-reviewer` | threat review, permission matrix, isolation, secrets, auth |
| `qa-load-engineer` | tests, k6, EXPLAIN reports, load report, failure drills |
| `ai-engineer` | Swap Assist (P2), prompt and eval design, safe LLM use |
| `docs-positioning` | README, ADRs, demo script, LinkedIn post, case study |
