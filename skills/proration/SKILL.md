---
name: proration
description: Implement or change Rota subscription proration (upgrades, seat changes, downgrades). Use whenever a task touches plan prices, seat counts, billing periods or the proration unit tests.
---

# Proration

Source of truth: `backend/src/billing/proration.ts` and `docs/PRD.md` 6.5. All integer cents, whole UTC days, `Math.floor`.

## Formula
```
daysRemaining = periodDays − floor((now − periodStart) / 86_400_000)   // clamp 0..periodDays
credit  = floor(currentPeriodPrice × daysRemaining / periodDays)
cost    = floor(newPeriodPrice     × daysRemaining / periodDays)
charge  = max(0, cost − credit)
```
`periodPrice(plan, seats) = base + max(0, seats − included) × extraSeatPrice` (extra seats unavailable on Starter → reject).

## Change types
| Change | When applied | Charge |
|---|---|---|
| Upgrade plan | now | formula |
| Add seats | now | formula |
| Downgrade plan | period end | 0 now |
| Remove seats | period end | 0 now |
| Two changes in a period | second change prices against the **already-upgraded** current entitlement | formula each time |

## Steps
1. Add or change a case in `backend/test/proration.test.ts` first (name it by the scenario).
2. Change `proration.ts`. Keep the function pure: inputs `{plan, seats, now, periodStart, periodEnd}` and the target; output `{chargeCents, creditCents, costCents, daysRemaining, effective: 'now'|'period_end'}`.
3. Never call a provider feature to calculate proration.
4. Keep the worked examples true: Starter→Team with 20/30 days = 2000; Team +3 seats beyond 15 with 12/30 = 360.
5. Update PRD wording only if the rule itself changes (needs an ADR).
