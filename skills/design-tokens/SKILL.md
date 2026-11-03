---
name: design-tokens
description: Change or consume Rota's design tokens. Use for any task about colors, typography, spacing, radii, shadows, dark mode, theme provider, or building token-driven components.
---

# Design tokens

## Files
- `design/tokens.json`: source of truth (core palette → semantic light/dark → typography, space, radius, shadow, motion, size, contrast pairs).
- `tools/build-tokens.mjs`: resolves `{references}`, validates contrast, writes `frontend/src/theme/tokens.generated.ts`.
- `tools/check-no-hardcoded-styles.mjs`: fails on literals in `frontend/src`.
- `frontend/src/theme/ThemeProvider.tsx`, `useTheme()`, `createStyles()`.

## Add or change a token
1. Edit `design/tokens.json` (reference core values from semantic ones).
2. If a new text/background pair appears in the UI, add it to `contrastPairs`.
3. `pnpm tokens:build` (must pass contrast), `pnpm check:styles`.
4. Define `const useStyles = createStyles(t => ({ ... }))` at module level and call `const styles = useStyles()` in the component (or `useTheme()` for inline values).

## Usage pattern
```ts
const useStyles = createStyles(t => ({
  card: { backgroundColor: t.color.surface, padding: t.space[4], borderRadius: t.radius.lg, ...t.shadow.sm },
  title: { ...t.type.title, color: t.color.textPrimary },
}));
```

## Rules
Spacing keys follow the 4/8 scale; fonts map weight → exact family; dark mode is designed; touch targets ≥ `t.size.touchMin`; status color + icon/label; text scales (`maxFontSizeMultiplier` from tokens).

## Interview demo
Change `core.color.teal.600` in `tokens.json`, run `pnpm tokens:build`, reload the app: every brand surface updates.
