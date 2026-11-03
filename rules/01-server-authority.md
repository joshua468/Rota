# Rule 01: The server is the authority

- Role, team, price, plan, seat count, payment status and quiet hours are never read from the request body or client state. Derive them from the verified token and the database.
- A new route must pass through `can(action)` before its handler. Add the action to `backend/src/lib/policy.ts` and a row to the permission test table in the same change.
- Resource ids belonging to another team return **404**.
- UI that hides a button for a role is cosmetic. Handle 403 in the app anyway.
- Slow or unreliable work (push, email, webhooks, renewals, third-party calls) is a BullMQ job, never inline in a request.
