---
name: seat-billing-ledger
description: Implement seat limits, the append-only ledger, subscription rebuild, failed renewal grace period and restricted mode in Rota.
---

# Seats, ledger, renewals

## Seat limits
Seat = active member or unexpired pending invite. Check inside a transaction: `SELECT … FROM subscriptions WHERE team_id=$1 FOR UPDATE`, count seats, compare to `included` (+ allowed extras). Starter has no extras: 6th invite → 402 `SEAT_LIMIT` with upgrade hint. Repeat at invite acceptance.

## Ledger
`ledger_entries(id, team_id, kind, amount_cents, currency, ref UNIQUE, reason, created_at)`. Trigger:
```sql
CREATE FUNCTION ledger_immutable() RETURNS trigger AS $$ BEGIN RAISE EXCEPTION 'ledger is append-only'; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER ledger_no_update BEFORE UPDATE OR DELETE ON ledger_entries FOR EACH ROW EXECUTE FUNCTION ledger_immutable();
```
Kinds: `charge`, `credit`, `refund`, `adjustment`. Reasons include plan/seat snapshot so state can be rebuilt. `rebuildFromLedger(teamId)` replays entries into `{plan, extraSeats, periodStart, periodEnd}` and a test compares it to `subscriptions`.

## Renewal job (daily, repeatable)
For subscriptions with `period_end <= now`: apply pending downgrade/seat removal → compute next period price → charge saved authorization with reference `renew:{subId}:{periodEnd}`. Success (via webhook) → new period. Failure → `past_due`, `grace_until = now + 5 days`, notify owner day 0/1/3/5 (urgent), after grace → `restricted`.

## Restricted mode
Read-only for everyone (view schedule, offline cache still works); blocked: create/edit shifts, invites, swap approval. Owner can always open billing and pay to restore.

## Tests
seat limits, concurrent last-seat invites, ledger immutability (UPDATE raises), rebuild equals state, renewal success, failure → past_due → restricted → recovery on payment.
