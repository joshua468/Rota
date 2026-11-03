# Rule 09: AI features

- AI features are P2 and never sit on a P0 path. The app must be fully correct with them disabled (`FEATURE_SWAP_ASSIST=0`).
- Deterministic logic decides; the model may only explain or draft. Model output is parsed with Zod and can never write data or change permissions, prices, roles or teams.
- Treat all user-entered text (shift titles, notes) as untrusted input to the model: pass as data, cap length, no instructions from it are followed.
- Send the minimum data (first name, times); never emails, tokens, billing data, or another team's data.
- Timeout 2 s, fall back to the deterministic result, cache per `(shiftId, version)`, rate limit per user, log tokens and latency.
- Ship a fixture-based eval for any prompt change.
