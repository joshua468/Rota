# Rule 06: Validation, errors, observability

- Every request body, query and param is parsed with a Zod schema using `.strict()`. Responses are typed from the same schemas where possible.
- Error envelope: `{ "error": { "code", "message", "reqId" } }`. Codes are stable strings (`FORBIDDEN`, `NOT_FOUND`, `RATE_LIMITED`, `IDEMPOTENCY_MISMATCH`, `VALIDATION_FAILED`, …). No stack traces to clients.
- Do not reveal whether an email exists (login, reset, magic link responses are uniform).
- Every request log line contains `reqId, userId, teamId, route, status, ms`. Billing logs add `paymentRef`. Every job attempt logs `queue, jobId, attempt, result, ms`.
- Redact `authorization`, `password`, `token`, `secret` in logs. Scrub PII in Sentry `beforeSend`.
- Sentry runs on both server and app.
- Rate limits live in Redis. Auth and billing fail closed if Redis is down; read endpoints fail open and log it.
