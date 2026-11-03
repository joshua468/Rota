---
name: ai-shift-assistant
description: Build Rota's optional P2 Swap Assist: deterministic swap-candidate ranking with explainable reasons, plus an optional LLM sentence. Only after all P0 and P1 items have proof.
---

# Swap Assist (P2)

## Scoring (pure function, `backend/src/ai/swap-assist.ts`)
Input: the shift, team members with their shifts for ±7 days, swap history. Output `[{userId, score, eligible, reasons[], blockers[]}]`.
- **Blockers (ineligible):** overlapping shift, rest < 11 h between shifts, weekly hours would exceed cap (default 48), not active, same person.
- **Score:** +30 same role/skill, +20 under weekly target, +20 accepted ≥ 1 previous swap, +10 worked this location recently, −15 worked yesterday late.
- `reasons` are human strings generated from the factors, e.g. "No overlapping shift", "Has 12 free hours since last shift".

## API
`GET /shifts/:id/swap-suggestions` → top 3, only for the requester or a manager (`can('swap.suggest')`), rate limited, cached per `(shiftId, version)` for 5 min.

## Optional explanation
Call the model with first names + factor list as data, 2 s timeout, structured output `{sentence: string}` validated with Zod; if anything fails return deterministic reasons. The sentence must not mention people absent from the candidate list (test).

## Evals
`backend/test/fixtures/swap-scenarios.json` (20 scenarios). Assert top candidate and exclusions; run in CI; the LLM path is mocked.

## Pitch value
Gives the cold-message hook: "I added explainable swap suggestions: rule-based so managers can trust them, with an LLM only for the wording."
