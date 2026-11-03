import React, { createContext, useContext, useMemo } from 'react';
import { Platform, useColorScheme } from 'react-native';
import { darkTheme, lightTheme, themes, type Theme, type ThemeMode } from './tokens.generated';
import { palettes, type Palette } from './tokens';

/**
 * The app theme is the generated token set (colour roles, type, spacing, shadows)
 * merged with the Home design palette (`bg`, `primary`, `ink`, …). Existing screens
 * keep using `t.color.*` / `t.space.*`; the Home screen uses the palette fields.
 */
export type AppTheme = Theme & Palette;

export type ThemePreference = 'system' | ThemeMode;

type ThemeContextValue = { theme: AppTheme; preference: ThemePreference; setPreference: (p: ThemePreference) => void };

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Web: RNW treats the legacy `shadow*` props as deprecated and prints a dev
 * warning for every `t.shadow.*` spread. Swap each shadow token for the
 * `boxShadow` string the token builder already emits. App code keeps spreading
 * `t.shadow.*` as before — the token IS the single source of truth.
 */
function webShadows(theme: Theme): Theme {
  if (Platform.OS !== 'web') return theme;
  const shadow = Object.fromEntries(
    Object.entries(theme.shadow).map(([key, value]) => [key, { boxShadow: value.boxShadow }]),
  ) as unknown as Theme['shadow'];
  return { ...theme, shadow };
}

/**
 * ThemeProvider — Rule 04: every colour, font, spacing, radius, shadow, motion
 * duration and touch size reaches the UI through here, from tokens.generated.ts
 * (which is generated from design/tokens.json, never hand-edited).
 *
 * Each mode (light, dark, sage) is designed in tokens: `themes.dark` is its own
 * set of values, not an inversion of the light set.
 */
export function ThemeProvider({
  children,
  preference = 'system',
}: {
  children: React.ReactNode;
  preference?: ThemePreference;
}) {
  const system = useColorScheme();
  const mode: ThemeMode = preference === 'system' ? (system === 'dark' ? 'dark' : 'light') : preference;

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: { ...webShadows(themes[mode]), ...palettes[mode] },
      preference,
      setPreference: () => {
        /* preference is owned by the settings query (server is the source of truth);
           the parent re-renders with the new preference prop */
      },
    }),
    [mode, preference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): AppTheme {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx.theme;
}

export function useThemePreference(): ThemePreference {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemePreference must be used inside <ThemeProvider>');
  return ctx.preference;
}

/**
 * createStyles — module-level style factory.
 *
 *   const useStyles = createStyles(t => ({
 *     card: { backgroundColor: t.color.surface, padding: t.space[4], borderRadius: t.radius.lg },
 *     title: { ...t.type.titleMedium, color: t.color.textPrimary },
 *   }));
 *   const styles = useStyles(); // inside the component
 *
 * Styles are cached per theme mode, so no re-parsing per render and no inline
 * style literals anywhere in app/src (pnpm check:styles enforces it).
 */
export function createStyles<const T>(fn: (t: Theme) => T): () => T {
  const cache = new Map<ThemeMode, T>();
  return function useStyles(): T {
    const theme = useTheme();
    const cached = cache.get(theme.mode);
    if (cached) return cached;
    const built = fn(theme);
    cache.set(theme.mode, built);
    return built;
  };
}
