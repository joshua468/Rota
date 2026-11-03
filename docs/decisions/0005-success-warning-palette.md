# 0005-success-warning-palette.md

**Date:** 2026-10-07  
**Status:** accepted

## Problem

Figma export had no success/warning ramps; status colours + labels need to pass contrast in light and dark modes.

## Options considered

- **Option A:** Add success/warning ramps to `design/tokens.json`
- **Option B:** Reuse existing colours (risking insufficient contrast)
- **Option C:** Hardcode ad-hoc values

## Decision

Use **Option A**: add success and warning colour ramps in `design/tokens.json` so semantic status tokens + their label pairs meet WCAG 4.5:1 contrast in light and dark. These ramps come from the design source of truth (extended in tokens).

## Consequences

- Accessible status indicators.
- All UI uses generated tokens (no literals).
- Validated via token/contrast checks.