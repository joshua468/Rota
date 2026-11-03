# Rule 04: Tokens, not literals

- All colors, fonts, type sizes, line heights, spacing, radii, shadows, motion durations and touch sizes come from `design/tokens.json` via `useTheme()`.
- In `frontend/src`: no hex or `rgb()` colors, no numeric `fontSize`, `fontFamily` strings, or spacing numbers outside the generated scale (`0` is allowed). `pnpm check:styles` enforces this.
- Edit tokens only in `design/tokens.json`, then run `pnpm tokens:build`. Never hand-edit `tokens.generated.ts`.
- Every text/background pair used in the UI must be listed in `contrastPairs` and pass ≥ 4.5:1 (UI boundaries ≥ 3:1) in light and dark.
- Dark mode is designed in tokens, not computed by inverting.
- Touch targets ≥ `size.touchMin` (44). Every pressable has an accessibility label and role.
- Do not hardcode data: plans come from `/v1/plans`, demo data from the seed script, strings from the i18n resource.
