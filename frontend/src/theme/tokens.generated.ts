/* eslint-disable */
/**
 * GENERATED FILE — DO NOT EDIT.
 * Source: design/tokens.json  |  Regenerate: pnpm tokens:build
 * Contrast: every pair in contrastPairs verified >= 4.5:1 (text) / >= 3:1 (boundary) in every theme mode.
 */

export type ThemeMode = 'light' | 'dark' | 'sage';

export type ColorRole = 'background' | 'surface' | 'surfaceMuted' | 'surfaceSunken' | 'surfaceInverse' | 'textPrimary' | 'textSecondary' | 'textMuted' | 'textInverse' | 'primary' | 'onPrimary' | 'primaryContainer' | 'onPrimaryContainer' | 'secondary' | 'onSecondary' | 'secondaryContainer' | 'onSecondaryContainer' | 'tertiary' | 'onTertiary' | 'tertiaryContainer' | 'onTertiaryContainer' | 'error' | 'onError' | 'errorContainer' | 'onErrorContainer' | 'success' | 'onSuccess' | 'successContainer' | 'onSuccessContainer' | 'warning' | 'onWarning' | 'warningContainer' | 'onWarningContainer' | 'brand' | 'border' | 'borderStrong' | 'divider' | 'link' | 'focus' | 'overlay' | 'skeleton' | 'skeletonHighlight' | 'tabBar' | 'disabled' | 'onDisabled' | 'scrim' | 'shadowFill' | 'pillOnPrimary' | 'onPillOnPrimary' | 'accent' | 'accentPressed' | 'accentTint' | 'accentText' | 'iconMuted' | 'chipNeutral' | 'avatarMore' | 'surfaceWarm' | 'brandSoft';
export type RadiusKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'card' | 'container' | 'chip' | 'chipLg' | 'cardLarge' | 'bar' | 'full';
export type SizeKey = 'touchMin' | 'controlMin' | 'controlLg' | 'hairline' | 'ring' | 'iconSm' | 'iconMd' | 'iconLg' | 'avatarSm' | 'avatarMd' | 'avatarLg' | 'avatarXl' | 'fab' | 'dot' | 'dayChip' | 'sheetGrab' | 'arrow' | 'tabBar' | 'footerBar' | 'dayCard';
export type TypeStyleKey = 'displayLarge' | 'displayMedium' | 'displaySmall' | 'headlineLarge' | 'headlineMedium' | 'headlineSmall' | 'titleLarge' | 'titleMedium' | 'titleSmall' | 'bodyLarge' | 'bodyMedium' | 'bodySmall' | 'labelLarge' | 'labelMedium' | 'labelSmall' | 'label' | 'sectionTitle';

export interface TypeStyle {
  fontFamily: string;
  fontWeight: '400' | '500' | '600' | '700' | '800';
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
}

export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowRadius: number;
  shadowOpacity: number;
  elevation: number;
  boxShadow: string;
}

export interface Theme {
  mode: ThemeMode;
  color: Record<ColorRole, string>;
  space: readonly [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64];
  radius: Record<RadiusKey, number>;
  shadow: Record<'soft' | 'medium' | 'hard' | 'none', ShadowStyle>;
  type: Record<TypeStyleKey, TypeStyle>;
  motion: { duration: { fast: number; base: number; slow: number }; easing: { standard: readonly number[]; emphasized: readonly number[] } };
  size: Record<SizeKey, number>;
  textScale: { maxFontSizeMultiplier: number };
}

export const spaceScale = [
  0,
  4,
  8,
  12,
  16,
  20,
  24,
  32,
  40,
  48,
  64
] as const;

export const lightTheme: Theme = {
  mode: 'light',
  color: {
    background: '#fdf9f6',
    surface: '#ffffff',
    surfaceMuted: '#fbe9e3',
    surfaceSunken: '#f3e9e2',
    surfaceInverse: '#2b2220',
    textPrimary: '#2b2220',
    textSecondary: '#5d4b43',
    textMuted: '#76655f',
    textInverse: '#ffffff',
    primary: '#c05330',
    onPrimary: '#ffffff',
    primaryContainer: '#fbe9e3',
    onPrimaryContainer: '#6e2c19',
    secondary: '#b04a2c',
    onSecondary: '#ffffff',
    secondaryContainer: '#fbdcd0',
    onSecondaryContainer: '#6e2c19',
    tertiary: '#8a6a58',
    onTertiary: '#ffffff',
    tertiaryContainer: '#f0dfd3',
    onTertiaryContainer: '#52392c',
    error: '#c00c0c',
    onError: '#fffafa',
    errorContainer: '#fdd9d9',
    onErrorContainer: '#a80a0a',
    success: '#0f7d3a',
    onSuccess: '#fbfffc',
    successContainer: '#dcfce7',
    onSuccessContainer: '#0b5229',
    warning: '#b45309',
    onWarning: '#fffefb',
    warningContainer: '#fef3c7',
    onWarningContainer: '#5c2f06',
    brand: '#d96a4a',
    border: '#8e827d',
    borderStrong: '#76655f',
    divider: '#ede3dd',
    link: '#b04a2c',
    focus: '#b04a2c',
    overlay: '#00000099',
    skeleton: '#f1e7e0',
    skeletonHighlight: '#ffffff',
    tabBar: '#ffffff',
    disabled: '#f1e7e0',
    onDisabled: '#76655f',
    scrim: '#2b2220',
    shadowFill: '#c0533059',
    pillOnPrimary: '#fffffff2',
    onPillOnPrimary: '#8f3a22',
    accent: '#d9694a',
    accentPressed: '#c05330',
    accentTint: '#fbe9e3',
    accentText: '#b04a2c',
    iconMuted: '#8a7f7a',
    chipNeutral: '#f1e7e0',
    avatarMore: '#e9e0dc',
    surfaceWarm: '#f6e7df',
    brandSoft: '#e8a895'
  },
  space: [
    0,
    4,
    8,
    12,
    16,
    20,
    24,
    32,
    40,
    48,
    64
  ],
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    card: 20,
    container: 20,
    chip: 14,
    chipLg: 16,
    cardLarge: 24,
    bar: 28,
    full: 999
  },
  shadow: {
    soft: {
      shadowColor: '#8e4a2c1f',
      shadowOffset: {
        width: 0,
        height: 6
      },
      shadowRadius: 20,
      shadowOpacity: 0.12,
      elevation: 10,
      boxShadow: '0px 6px 20px #8e4a2c1f'
    },
    medium: {
      shadowColor: '#8e4a2c2e',
      shadowOffset: {
        width: 0,
        height: 10
      },
      shadowRadius: 28,
      shadowOpacity: 0.18,
      elevation: 14,
      boxShadow: '0px 10px 28px #8e4a2c2e'
    },
    hard: {
      shadowColor: '#8e4a2c38',
      shadowOffset: {
        width: 0,
        height: 12
      },
      shadowRadius: 24,
      shadowOpacity: 0.22,
      elevation: 12,
      boxShadow: '0px 12px 24px #8e4a2c38'
    },
    none: {
      shadowColor: '#00000000',
      shadowOffset: {
        width: 0,
        height: 0
      },
      shadowRadius: 0,
      shadowOpacity: 0,
      elevation: 0,
      boxShadow: '0px 0px 0px #00000000'
    }
  },
  type: {
    displayLarge: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontWeight: '800',
      fontSize: 28,
      lineHeight: 34,
      letterSpacing: -0.5
    },
    displayMedium: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 26,
      lineHeight: 32,
      letterSpacing: -0.4
    },
    displaySmall: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 24,
      lineHeight: 30,
      letterSpacing: -0.4
    },
    headlineLarge: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 22,
      lineHeight: 28,
      letterSpacing: -0.3
    },
    headlineMedium: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 20,
      lineHeight: 26,
      letterSpacing: -0.3
    },
    headlineSmall: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 20,
      lineHeight: 26,
      letterSpacing: -0.3
    },
    titleLarge: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontWeight: '800',
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: -0.2
    },
    titleMedium: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 17,
      lineHeight: 24,
      letterSpacing: -0.2
    },
    titleSmall: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 15,
      lineHeight: 20,
      letterSpacing: -0.2
    },
    bodyLarge: {
      fontFamily: 'PlusJakartaSans_500Medium',
      fontWeight: '500',
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0
    },
    bodyMedium: {
      fontFamily: 'PlusJakartaSans_500Medium',
      fontWeight: '500',
      fontSize: 15,
      lineHeight: 22,
      letterSpacing: 0
    },
    bodySmall: {
      fontFamily: 'PlusJakartaSans_500Medium',
      fontWeight: '500',
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0
    },
    labelLarge: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: -0.1
    },
    labelMedium: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: -0.1
    },
    labelSmall: {
      fontFamily: 'PlusJakartaSans_500Medium',
      fontWeight: '500',
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0
    },
    label: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: -0.1
    },
    sectionTitle: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 17,
      lineHeight: 24,
      letterSpacing: -0.2
    }
  },
  motion: {
    duration: {
      fast: 180,
      base: 240,
      slow: 420
    },
    easing: {
      standard: [
        0.2,
        0,
        0,
        1
      ],
      emphasized: [
        0,
        0,
        0.2,
        1
      ]
    }
  },
  size: {
    touchMin: 44,
    controlMin: 44,
    controlLg: 56,
    hairline: 1,
    ring: 2,
    iconSm: 16,
    iconMd: 20,
    iconLg: 24,
    avatarSm: 32,
    avatarMd: 40,
    avatarLg: 56,
    avatarXl: 72,
    fab: 56,
    dot: 6,
    dayChip: 56,
    sheetGrab: 4,
    arrow: 64,
    tabBar: 64,
    footerBar: 72,
    dayCard: 76
  },
  textScale: {
    maxFontSizeMultiplier: 1.6
  }
} as const;

export const darkTheme: Theme = {
  mode: 'dark',
  color: {
    background: '#0f1424',
    surface: '#1b2237',
    surfaceMuted: '#2b2047',
    surfaceSunken: '#0a0e1b',
    surfaceInverse: '#fbf8f6',
    textPrimary: '#fdf9f6',
    textSecondary: '#ddd4d0',
    textMuted: '#c3b8b3',
    textInverse: '#0a0e1b',
    primary: '#a88bfa',
    onPrimary: '#17112e',
    primaryContainer: '#2b2047',
    onPrimaryContainer: '#dcd3ff',
    secondary: '#c2b8ff',
    onSecondary: '#17112e',
    secondaryContainer: '#2b2047',
    onSecondaryContainer: '#dcd3ff',
    tertiary: '#cfc8e0',
    onTertiary: '#17112e',
    tertiaryContainer: '#3a2f52',
    onTertiaryContainer: '#e8e0f2',
    error: '#f88787',
    onError: '#0a0e1b',
    errorContainer: '#7d0808',
    onErrorContainer: '#fbbcbc',
    success: '#4ade80',
    onSuccess: '#0a0e1b',
    successContainer: '#0b5229',
    onSuccessContainer: '#bbf7d0',
    warning: '#fbbf24',
    onWarning: '#0a0e1b',
    warningContainer: '#5c2f06',
    onWarningContainer: '#fde68a',
    brand: '#a88bfa',
    border: '#647098',
    borderStrong: '#7b85a6',
    divider: '#2c3550',
    link: '#c2b8ff',
    focus: '#c2b8ff',
    overlay: '#000000b3',
    skeleton: '#2a334f',
    skeletonHighlight: '#3a4464',
    tabBar: '#18203a',
    disabled: '#2e3650',
    onDisabled: '#9aa3bf',
    scrim: '#000000',
    shadowFill: '#a88bfa66',
    pillOnPrimary: '#fffffff2',
    onPillOnPrimary: '#5a468d',
    accent: '#a88bfa',
    accentPressed: '#8c78d4',
    accentTint: '#2b2047',
    accentText: '#c2b8ff',
    iconMuted: '#8b93ad',
    chipNeutral: '#262f49',
    avatarMore: '#2a3350',
    surfaceWarm: '#2a1f1b',
    brandSoft: '#2b2047'
  },
  space: [
    0,
    4,
    8,
    12,
    16,
    20,
    24,
    32,
    40,
    48,
    64
  ],
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    card: 20,
    container: 20,
    chip: 14,
    chipLg: 16,
    cardLarge: 24,
    bar: 28,
    full: 999
  },
  shadow: {
    soft: {
      shadowColor: '#8e4a2c1f',
      shadowOffset: {
        width: 0,
        height: 6
      },
      shadowRadius: 20,
      shadowOpacity: 0.12,
      elevation: 10,
      boxShadow: '0px 6px 20px #8e4a2c1f'
    },
    medium: {
      shadowColor: '#8e4a2c2e',
      shadowOffset: {
        width: 0,
        height: 10
      },
      shadowRadius: 28,
      shadowOpacity: 0.18,
      elevation: 14,
      boxShadow: '0px 10px 28px #8e4a2c2e'
    },
    hard: {
      shadowColor: '#8e4a2c38',
      shadowOffset: {
        width: 0,
        height: 12
      },
      shadowRadius: 24,
      shadowOpacity: 0.22,
      elevation: 12,
      boxShadow: '0px 12px 24px #8e4a2c38'
    },
    none: {
      shadowColor: '#00000000',
      shadowOffset: {
        width: 0,
        height: 0
      },
      shadowRadius: 0,
      shadowOpacity: 0,
      elevation: 0,
      boxShadow: '0px 0px 0px #00000000'
    }
  },
  type: {
    displayLarge: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontWeight: '800',
      fontSize: 28,
      lineHeight: 34,
      letterSpacing: -0.5
    },
    displayMedium: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 26,
      lineHeight: 32,
      letterSpacing: -0.4
    },
    displaySmall: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 24,
      lineHeight: 30,
      letterSpacing: -0.4
    },
    headlineLarge: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 22,
      lineHeight: 28,
      letterSpacing: -0.3
    },
    headlineMedium: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 20,
      lineHeight: 26,
      letterSpacing: -0.3
    },
    headlineSmall: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 20,
      lineHeight: 26,
      letterSpacing: -0.3
    },
    titleLarge: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontWeight: '800',
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: -0.2
    },
    titleMedium: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 17,
      lineHeight: 24,
      letterSpacing: -0.2
    },
    titleSmall: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 15,
      lineHeight: 20,
      letterSpacing: -0.2
    },
    bodyLarge: {
      fontFamily: 'PlusJakartaSans_500Medium',
      fontWeight: '500',
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0
    },
    bodyMedium: {
      fontFamily: 'PlusJakartaSans_500Medium',
      fontWeight: '500',
      fontSize: 15,
      lineHeight: 22,
      letterSpacing: 0
    },
    bodySmall: {
      fontFamily: 'PlusJakartaSans_500Medium',
      fontWeight: '500',
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0
    },
    labelLarge: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: -0.1
    },
    labelMedium: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: -0.1
    },
    labelSmall: {
      fontFamily: 'PlusJakartaSans_500Medium',
      fontWeight: '500',
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0
    },
    label: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: -0.1
    },
    sectionTitle: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 17,
      lineHeight: 24,
      letterSpacing: -0.2
    }
  },
  motion: {
    duration: {
      fast: 180,
      base: 240,
      slow: 420
    },
    easing: {
      standard: [
        0.2,
        0,
        0,
        1
      ],
      emphasized: [
        0,
        0,
        0.2,
        1
      ]
    }
  },
  size: {
    touchMin: 44,
    controlMin: 44,
    controlLg: 56,
    hairline: 1,
    ring: 2,
    iconSm: 16,
    iconMd: 20,
    iconLg: 24,
    avatarSm: 32,
    avatarMd: 40,
    avatarLg: 56,
    avatarXl: 72,
    fab: 56,
    dot: 6,
    dayChip: 56,
    sheetGrab: 4,
    arrow: 64,
    tabBar: 64,
    footerBar: 72,
    dayCard: 76
  },
  textScale: {
    maxFontSizeMultiplier: 1.6
  }
} as const;

export const sageTheme: Theme = {
  mode: 'sage',
  color: {
    background: '#f2f6ec',
    surface: '#fcfaf3',
    surfaceMuted: '#dfe9d7',
    surfaceSunken: '#dce5cf',
    surfaceInverse: '#14291b',
    textPrimary: '#14291b',
    textSecondary: '#2a5a33',
    textMuted: '#4a674f',
    textInverse: '#ffffff',
    primary: '#2f6b3a',
    onPrimary: '#ffffff',
    primaryContainer: '#dfe9d7',
    onPrimaryContainer: '#1f3a27',
    secondary: '#3e7c46',
    onSecondary: '#ffffff',
    secondaryContainer: '#c2d8c4',
    onSecondaryContainer: '#1f3a27',
    tertiary: '#5f6e5e',
    onTertiary: '#ffffff',
    tertiaryContainer: '#e3ead9',
    onTertiaryContainer: '#26382a',
    error: '#c00c0c',
    onError: '#fffafa',
    errorContainer: '#fdd9d9',
    onErrorContainer: '#a80a0a',
    success: '#0f7d3a',
    onSuccess: '#fbfffc',
    successContainer: '#dcfce7',
    onSuccessContainer: '#0b5229',
    warning: '#b45309',
    onWarning: '#fffefb',
    warningContainer: '#fef3c7',
    onWarningContainer: '#5c2f06',
    brand: '#6ba46e',
    border: '#7e8c7b',
    borderStrong: '#5f6f61',
    divider: '#e2e7db',
    link: '#2f6b3a',
    focus: '#2f6b3a',
    overlay: '#00000099',
    skeleton: '#dce6d0',
    skeletonHighlight: '#f2f6ec',
    tabBar: '#f6f4e9',
    disabled: '#e5eadf',
    onDisabled: '#55685a',
    scrim: '#14291b',
    shadowFill: '#2f6b3a59',
    pillOnPrimary: '#fffffff2',
    onPillOnPrimary: '#2f6b3a',
    accent: '#2f6b3a',
    accentPressed: '#2a5a33',
    accentTint: '#dfe9d7',
    accentText: '#2f6b3a',
    iconMuted: '#7d8a7c',
    chipNeutral: '#e9efe1',
    avatarMore: '#e3e9dd',
    surfaceWarm: '#f1e7de',
    brandSoft: '#c2d8c4'
  },
  space: [
    0,
    4,
    8,
    12,
    16,
    20,
    24,
    32,
    40,
    48,
    64
  ],
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    card: 20,
    container: 20,
    chip: 14,
    chipLg: 16,
    cardLarge: 24,
    bar: 28,
    full: 999
  },
  shadow: {
    soft: {
      shadowColor: '#8e4a2c1f',
      shadowOffset: {
        width: 0,
        height: 6
      },
      shadowRadius: 20,
      shadowOpacity: 0.12,
      elevation: 10,
      boxShadow: '0px 6px 20px #8e4a2c1f'
    },
    medium: {
      shadowColor: '#8e4a2c2e',
      shadowOffset: {
        width: 0,
        height: 10
      },
      shadowRadius: 28,
      shadowOpacity: 0.18,
      elevation: 14,
      boxShadow: '0px 10px 28px #8e4a2c2e'
    },
    hard: {
      shadowColor: '#8e4a2c38',
      shadowOffset: {
        width: 0,
        height: 12
      },
      shadowRadius: 24,
      shadowOpacity: 0.22,
      elevation: 12,
      boxShadow: '0px 12px 24px #8e4a2c38'
    },
    none: {
      shadowColor: '#00000000',
      shadowOffset: {
        width: 0,
        height: 0
      },
      shadowRadius: 0,
      shadowOpacity: 0,
      elevation: 0,
      boxShadow: '0px 0px 0px #00000000'
    }
  },
  type: {
    displayLarge: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontWeight: '800',
      fontSize: 28,
      lineHeight: 34,
      letterSpacing: -0.5
    },
    displayMedium: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 26,
      lineHeight: 32,
      letterSpacing: -0.4
    },
    displaySmall: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 24,
      lineHeight: 30,
      letterSpacing: -0.4
    },
    headlineLarge: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 22,
      lineHeight: 28,
      letterSpacing: -0.3
    },
    headlineMedium: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 20,
      lineHeight: 26,
      letterSpacing: -0.3
    },
    headlineSmall: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 20,
      lineHeight: 26,
      letterSpacing: -0.3
    },
    titleLarge: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontWeight: '800',
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: -0.2
    },
    titleMedium: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 17,
      lineHeight: 24,
      letterSpacing: -0.2
    },
    titleSmall: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 15,
      lineHeight: 20,
      letterSpacing: -0.2
    },
    bodyLarge: {
      fontFamily: 'PlusJakartaSans_500Medium',
      fontWeight: '500',
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0
    },
    bodyMedium: {
      fontFamily: 'PlusJakartaSans_500Medium',
      fontWeight: '500',
      fontSize: 15,
      lineHeight: 22,
      letterSpacing: 0
    },
    bodySmall: {
      fontFamily: 'PlusJakartaSans_500Medium',
      fontWeight: '500',
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0
    },
    labelLarge: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: -0.1
    },
    labelMedium: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: -0.1
    },
    labelSmall: {
      fontFamily: 'PlusJakartaSans_500Medium',
      fontWeight: '500',
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0
    },
    label: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: -0.1
    },
    sectionTitle: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontSize: 17,
      lineHeight: 24,
      letterSpacing: -0.2
    }
  },
  motion: {
    duration: {
      fast: 180,
      base: 240,
      slow: 420
    },
    easing: {
      standard: [
        0.2,
        0,
        0,
        1
      ],
      emphasized: [
        0,
        0,
        0.2,
        1
      ]
    }
  },
  size: {
    touchMin: 44,
    controlMin: 44,
    controlLg: 56,
    hairline: 1,
    ring: 2,
    iconSm: 16,
    iconMd: 20,
    iconLg: 24,
    avatarSm: 32,
    avatarMd: 40,
    avatarLg: 56,
    avatarXl: 72,
    fab: 56,
    dot: 6,
    dayChip: 56,
    sheetGrab: 4,
    arrow: 64,
    tabBar: 64,
    footerBar: 72,
    dayCard: 76
  },
  textScale: {
    maxFontSizeMultiplier: 1.6
  }
} as const;

export const themes: Record<ThemeMode, Theme> = { light: lightTheme, dark: darkTheme, sage: sageTheme };
