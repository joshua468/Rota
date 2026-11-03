# PRD.md

## Product requirements

### Personas
- **Team owner** — Manages team, billing, roles, and subscription.
- **Admin/Manager** — Schedules shifts, manages roster, approves swaps.
- **Member** — Views shifts, requests swaps, receives notifications.

### Feature priorities

| Priority | Features |
|---|---|
| P0 | Auth, team isolation, role-based access, shift scheduling core, basic billing/subscription state, webhook verification |
| P1 | Shift swaps (core flow), push notifications, roster management, activity feed (cursor pagination) |
| P2 | **Swap Assist / AI** (never on P0 path). Feature flag controlled (`FEATURE_SWAP_ASSIST=0` must leave the app fully correct). |
| P2 | Reporting/analytics (non-critical) |

Notes: AI-assisted features are explicitly P2 and isolated behind feature flag. The system must remain correct with the flag disabled.

## 6.5 Proration

The product uses the exact formula below for proration (upgrades/downgrades, seat changes):

```text
daysRemaining = periodDays - floor((now - periodStart) / 86_400_000)
daysRemaining = clamp(daysRemaining, 0, periodDays)

credit = floor(currentPeriodPrice × daysRemaining / periodDays)
cost   = floor(newPeriodPrice × daysRemaining / periodDays)
charge = max(0, cost - credit)
```

Business rules:
- **Upgrades/seat additions:** charge now (`charge > 0`) for the pro-rated difference for remaining days in the current period.
- **Downgrades/seat removals:** apply at period end with **no refund** of the difference.
- **Two changes in one period:** price the second change against the already-upgraded entitlement (entitlement state is updated after first change for the purpose of the second calculation within the same period).
- **Money:** All amounts in integer cents (`*_cents`). Integer arithmetic (floor) as specified.
- **Period units:** Timestamps in milliseconds; `86_400_000` ms/day. `periodStart` and `periodDays` are the current billing period start and length in days (server-derived).
- **Server authority:** Calculations performed server-side only; never client-side. Results persisted to ledger.

## Plans

| Plan | Price (cents/month) | Included seats | Extra seat (cents/month) |
|---|---|---|---|
| Starter | 2000 ($20) | 5 | — |
| Team | 5000 ($50) | 15 | 300 ($3/extra seat) |
| Business | 12000 ($120) | 40 | 200 ($2/extra seat) |

All prices are integer cents. See [ADR-0007](docs/decisions/0007-billing-provider-vs-store.md) and [SECURITY.md](docs/SECURITY.md) for billing constraints and webhook authority.