---
name: push-notifications
description: Implement Rota push notifications end to end: device token registration, outbox, BullMQ push job, quiet hours in the user's timezone, category toggles, receipts and dead-token cleanup, notification tap deep links.
---

# Push notifications

## Registration
After login: request permission → `getExpoPushTokenAsync` → `PUT /me/devices/:deviceId/push-token`. Unique `(user_id, device_id)`; many devices per user. Needs an **EAS development build** on Android (not Expo Go).

## Sending (never in the request)
Domain change + `outbox` row in one transaction → dispatcher enqueues `push` job `{userId, category, urgency, title, body, data}`.

## Job logic (`backend/src/jobs/push.ts`)
1. Load recipient settings **fresh from primary**.
2. Category (`shifts|swaps|billing`) disabled → skip, log reason.
3. Quiet hours evaluated in the user's IANA timezone (handle windows that wrap midnight and DST). If inside quiet hours and `urgency !== 'urgent'` → re-enqueue with `delay = msUntilQuietEnd`.
4. Chunk and send via `expo-server-sdk` to all of the user's tokens.
5. Fetch receipts later (delayed job); on `DeviceNotRegistered` **delete the token**.
6. Failures retry with exponential backoff, then land in the failed set.

## Payload `data`
`{ url: 'rota://swap/<id>' }` (or `shift/<id>`, `billing`). The app validates with Zod before routing.

## Categories
shifts (created/changed/removed), swaps (requested/approved/rejected), billing (renewal failed, grace reminders; owner only, urgent).

## Tests
quiet-hours matrix (before, inside, after, wrap-midnight, DST day, non-Lagos zone), toggle off, urgent bypass, invalid token deleted, multiple devices all notified, job not executed in the request path (assert queue add, not HTTP call).
