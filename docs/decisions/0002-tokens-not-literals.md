# 0002-tokens-not-literals.md

**Date:** 2026-10-07  
**Status:** accepted

## Problem

Avoid hardcoded colour/spacing values; ensure consistent theming and contrast compliance for light/dark. Need deterministic token pipeline.

## Options considered

- **Option A:** Generated token pipeline from `design/tokens.json` with contrast validation in CI
- **Option B:** StyleSheet metadata only (manual)
- **Option C:** Restyle library without generated source of truth

## Decision

Use **Option A**: generate semantic design tokens from `design/tokens.json` (Figma export is source of core palette). The semantic `primary` role was remapped to palette step 50 so white label text passes 4.5:1 while the key colour `#4b76fa` stays the brand accent. Run `pnpm tokens:build` and `pnpm check:styles` in CI to validate contrast.

## Consequences

- Single source of truth in `design/tokens.json`.
- No literal values in UI; tokens only.
- Contrast validation catches regressions early.
- Semantic remapping documented (accessibility requirement).