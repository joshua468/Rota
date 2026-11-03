# Rule 07: Testing and proof

- Write the test first for auth, permissions, isolation, proration, webhooks, cursors and quiet hours.
- Permission tests are generated from the policy table and call the real HTTP app (as Postman would), not service functions.
- Isolation tests create two teams and assert every read and write path with the other team's ids returns 404 with no side effects.
- Proration needs ≥ 8 cases; we keep 15, including day 1, last day, two changes in one period, and rounding edges.
- Webhook tests send the same event three times and assert exactly one ledger row and one subscription change.
- "It works" is not evidence. A feature is done when there is a passing test or a recorded number and the traceability row links to it.
- `pnpm verify` must be green before a PR is opened.
