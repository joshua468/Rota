---
name: auth-tokens
description: Implement or review Rota authentication: argon2id passwords, magic links, 15-minute access tokens, rotating refresh tokens with reuse detection, logout-all, password reset, invite deep links, SecureStore.
---

# Auth and tokens

## Tokens
- **Access:** JWT, 15 min, claims `{sub, tv}` (`tv` = `users.token_version`). Verified on each request; `tv` mismatch → 401.
- **Refresh:** opaque 256-bit random, stored as SHA-256 hash in `refresh_tokens(family_id, token_hash, used_at, revoked_at, expires_at, device_id)`, 30 days.
- **Rotation:** on `/auth/refresh`, find by hash. If `used_at` is null → mark used, issue new token in the same `family_id`. If already used or revoked → **revoke the whole family**, return 401 (suspected theft).
- **Logout:** revoke the family and delete this device's push token. **Logout all:** revoke all families, `token_version += 1`.
- Refresh is single-flight in the app (one in-flight refresh, others await it).

## One-time tokens (magic link, reset, invite)
Random 256-bit, only the hash stored, `purpose`, `expires_at` (magic 15 min, reset 30 min, invite 7 days), `used_at` set in the same transaction that consumes it. Invite token format `<teamId>.<random>` so the shard is known.

## Passwords
argon2id (memory 19 MiB+, time 2). Uniform responses for login/forgot/magic (no enumeration). Reset revokes all sessions.

## Invite and deep link
`POST /teams/:id/invites` (role-limited, seat-checked) → email via job with `https://<api>/v1/i/<token>` → redirects to `rota://invite/<token>` → app stores the pending token, routes to sign-up/login, then `POST /invites/:token/accept` → lands in that team. Seat check repeats at accept time.

## App storage
Refresh token and device id in `expo-secure-store`; access token in memory only. Never AsyncStorage. Clear persisted query cache on logout.

## Tests
refresh rotation, **reuse revokes family**, expired token, logout-all kills sessions, reset single-use, magic single-use, enumeration uniformity, rate limits.
