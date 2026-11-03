# SECURITY.md

Exactly 8 threats. Each with threat, impact, mitigation, where enforced, and the test that proves it.

| # | Threat | Impact | Mitigation | Enforced (file/module) | Test that proves it |
|---|---|---|---|---|---|
| 1 | Refresh-token theft/reuse (family revocation) | Session takeover across devices | Token family tracking; reuse detection triggers family revocation. Rotated refresh tokens bound to family. Old refresh tokens rejected on reuse. | `backend/src/auth/*` (token issuance/rotation), session/token stores | Integration test: reuse rotated refresh token → family revoked; all tokens in family invalidated; new auth required. |
| 2 | IDOR/cross-team access | Data leakage across teams | All queries use `TeamScope`. Cross-team resource access returns **404** (never 403). Resource IDs never trusted from body. | `backend/src/repositories/*` (TeamScope), route handlers + policy | Team isolation tests: user from team A cannot access team B resource → 404; assert no data leaked. |
| 3 | Webhook forgery | Fake payment state changes | `verif-hash` header verification on Flutterwave webhooks; constant-time comparison of the secret hash; reject if missing/invalid. | `backend/src/routes/webhooks.ts`, `backend/src/repos/webhooks.ts`, `lib/crypto.safeEqual` | Webhook test: tampered/missing hash → rejected; valid signed webhook → accepted only after verification. |
| 4 | Replayed checkout | Duplicate/incorrect charges | `Idempotency-Key` required for checkout creation; idempotent processing of checkout intent. Webhook events deduped (event id/key) to prevent replays. | `backend/src/billing/checkout/*`, `backend/src/webhooks/*`, idempotency repo | Replay tests: same Idempotency-Key → same checkout response (no duplicate charge); replayed webhook event → deduped (no double processing). |
| 5 | Secrets in app bundle | Credential exposure | Strict `EXPO_PUBLIC_*` allowlist. No secrets in `frontend/`. Server-only env vars. Secrets never logged. Build-time check. | `frontend/*` (env handling), build config, `.env.example` policy | Bundle scan test: grep for known secret patterns in built assets → none; allowlist enforced. |
| 6 | Privilege escalation | Unauthorized actions | Server-derived roles; `can(action)` policy table per action. Role never from request body. UI cosmetic. New routes must add action to policy + permission test. | `backend/src/lib/policy.ts`, route guards, permission tests | Permission matrix tests: each role vs actions; forbidden actions rejected with correct code; owner/admin boundaries enforced. |
| 7 | Enumeration | User/team existence leakage | Uniform auth responses (unauthorized/forbidden/not-found) where appropriate. Avoid distinct messages that leak existence. Rate limiting on auth endpoints. | Auth routes, error mapping | Auth tests: invalid user vs wrong password return uniform response; 404 for cross-team to avoid existence leaks. |
| 8 | Rate-limit abuse / Redis outage behaviour | DoS or incorrect auth decisions | Per-endpoint rate limits (auth+billing stricter). On Redis outage for auth/billing, **fail closed** (deny) not open. Circuit/health handling; degraded paths documented. | `backend/src/middleware/rate-limit/*`, Redis health checks | Failure tests: Redis unavailable on auth/billing → requests rejected (fail closed); non-critical paths behave as documented; no 500 leaking details. |

## EXPO_PUBLIC_* table

Only the following names may be exposed to the client bundle. Anything sensitive must stay server-side.

| Name | Why it is public | What must NEVER be put there |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | Client needs API base URL to reach backend. | Tokens, secrets, API keys, DB URLs, webhook secrets, internal hosts. |
| `EXPO_PUBLIC_SENTRY_DSN` | Client error reporting DSN (public by design). | Private keys, auth tokens, user PII beyond what Sentry expects client-side. |
| `EXPO_PUBLIC_APP_SCHEME` | Deep linking scheme for mobile app. | Any secrets, credentials, internal endpoints, feature flags that expose internals. |

Notes: This is an allowlist. New `EXPO_PUBLIC_*` vars require review. Server env vars (e.g. `JWT_SECRET`, `FLUTTERWAVE_SECRET_KEY`, `DATABASE_URL`, `REDIS_URL`) are never prefixed `EXPO_PUBLIC_*`. See `.env.example` (names only).

Tooling keys injected by the Expo/Metro dev server (currently `EXPO_PUBLIC_PROJECT_ROOT`) are ignored by the allowlist scan in `frontend/src/api/env.ts` — they carry no secret and are not app config. Proof: `frontend/src/api/env.test.ts`.