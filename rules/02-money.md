# Rule 02: Money

- Store and compute money as integer cents. No floats, no decimal columns for money, no `toFixed` in logic. Format only at the display edge.
- Use `Math.floor` for proration exactly as in `docs/PRD.md` 6.5. Never invent another rounding rule without an ADR.
- Plans, prices and seat limits come from the `plans` table. They are never hardcoded in the app.
- Only a signature-verified webhook, processed in a job, can change subscription state.
- Ledger rows are append-only. Fix mistakes with a new adjustment row.
- Every payment-creating request needs an `Idempotency-Key`. Every webhook is deduped by `(provider, event_key)`.
- Never cache subscription, payment status, balances, ledger, idempotency or webhook records.
