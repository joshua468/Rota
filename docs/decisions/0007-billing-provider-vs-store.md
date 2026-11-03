# 0007-billing-provider-vs-store.md

**Date:** 2026-10-07  
**Status:** accepted

## Problem

Mobile app stores (Apple App Store / Google Play) may require using platform in-app purchases for digital subscriptions sold inside an app, including certain B2B cases. Need to document constraint and chosen approach.

## Options considered

- **Option A:** Web checkout (Flutterwave hosted checkout) with server-authoritative webhooks and `Idempotency-Key`; document compliance trade-off
- **Option B:** Apple/Google in-app purchase as primary billing path
- **Option C:** Hybrid (unclear) without documented constraint

## Decision

Use **Option A**: implement/document web-checkout path (Flutterwave hosted checkout). `Idempotency-Key` on checkout creation; webhook signature verification is the only source of payment success; webhook events deduped. The app never decides payment succeeded. Document the constraint in README (App Store/Play billing section).

## Consequences

- Billing state remains server-authoritative and auditable.
- Sensitive payment flow handled via hosted checkout (reduced PCI surface).
- Constraint explicitly documented so distribution considerations are clear.
- Trade-off recorded against potential store billing requirements; alternative path documented.