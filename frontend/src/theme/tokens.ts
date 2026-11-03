export const light = {
  name: 'light',
  bg: '#FDFAF6', card: '#FFFFFF', primary: '#D9694A', primaryTint: '#F6E7DF',
  /* The brand orange mixed with the warm cream (#F6E7DF): the "mine" card
     surface. Full-strength orange reads as loud on a phone screen, the mix
     keeps the warmth without the glare. */
  primarySoft: '#E8A895',
  primaryText: '#B5583C', ink: '#2F2420', muted: '#8A7F7A', inactive: '#A59B96',
  dotInactive: '#F3C9B8',
  chip: '#F1EEEB', more: '#EDE6E2', hairline: '#E8E0DB', border: '#E8E0DB', danger: '#D64545',
  dangerTint: '#FDECEC', amber: '#B7791F', amberTint: '#FDF1D8', green: '#3E9B6B',
  greenTint: '#E7F5EC',
};
export const dark = { ...light, name: 'dark', bg: '#0F1424', card: '#161C30', primary: '#A78BFA',
  primaryTint: '#1F2638', primarySoft: '#A78BFA', primaryText: '#A78BFA', ink: '#FFFFFF', muted: '#6B7390',
  inactive: '#6B7390', chip: '#1F2638', more: '#2A3350', hairline: '#252C45', border: '#252C45',
  greenTint: '#12281C' };
export const sage = { ...light, name: 'sage', bg: '#E8EEE8', card: '#FFFDF6', primary: '#5E7F6B',
  primaryTint: '#E5ECE6', primarySoft: '#5E7F6B', primaryText: '#3F6B52', ink: '#1F3A2E', muted: '#6F7F75',
  inactive: '#8FA096', chip: '#EDEFE6', more: '#E6EDE7', hairline: '#D5DED6', border: '#D5DED6',
  greenTint: '#E3EFE7' };
export const font = { regular: 'Nunito_500Medium', semi: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold', black: 'Nunito_800ExtraBold' };
export const shadow = (y: number, blur: number, color: string) => ({
  boxShadow: `0px ${y}px ${blur}px ${color}`,
});

export const authTokens = {
  color: {
    bg: '#FDFAF6',
    brand: '#C4512D',
    brandPressed: '#B44B29', // darker 8%
    surface: '#FFFFFF',
    surfaceMuted: '#F3EDE6',
    border: '#E4DBD1',
    text: '#1F1A17',
    textSecondary: '#6B625A',
    error: '#C0362C',
  },
  radius: {
    input: 14,
    pill: 999,
    checkbox: 6,
    circle: 999,
  },
  type: {
    title: {
      fontFamily: 'Nunito_700Bold',
      fontWeight: '700' as const,
      fontSize: 32,
      lineHeight: 38,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontFamily: 'Nunito_400Regular',
      fontWeight: '400' as const,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0,
    },
    label: {
      fontFamily: 'Nunito_500Medium',
      fontWeight: '500' as const,
      fontSize: 15,
      lineHeight: 20,
      letterSpacing: 0,
    },
    input: {
      fontFamily: 'Nunito_400Regular',
      fontWeight: '400' as const,
      fontSize: 16,
      lineHeight: 22,
      letterSpacing: 0,
    },
    body: {
      fontFamily: 'Nunito_400Regular',
      fontWeight: '400' as const,
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0,
    },
    caption: {
      fontFamily: 'Nunito_400Regular',
      fontWeight: '400' as const,
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: 0,
    },
    button: {
      fontFamily: 'Nunito_600SemiBold',
      fontWeight: '600' as const,
      fontSize: 17,
      lineHeight: 22,
      letterSpacing: 0,
    },
    socialLabel: {
      fontFamily: 'Nunito_500Medium',
      fontWeight: '500' as const,
      fontSize: 16,
      lineHeight: 22,
      letterSpacing: 0,
    },
    linkSemibold: {
      fontFamily: 'Nunito_600SemiBold',
      fontWeight: '600' as const,
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0,
    },
    bodySemibold: {
      fontFamily: 'Nunito_600SemiBold',
      fontWeight: '600' as const,
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0,
    },
    footer: {
      fontFamily: 'Nunito_400Regular',
      fontWeight: '400' as const,
      fontSize: 15,
      lineHeight: 22,
      letterSpacing: 0,
    },
    footerLink: {
      fontFamily: 'Nunito_600SemiBold',
      fontWeight: '600' as const,
      fontSize: 15,
      lineHeight: 22,
      letterSpacing: 0,
    },
  },
  space: {
    // Spacing scale: multiples of 4/8 only
    none: 0,
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
    screenPaddingHorizontal: 24,
    backTop: 8,
    titleGap: 24,
    subtitleGap: 8,
    formGap: 32,
    labelGap: 8,
    fieldGap: 20,
    inputPaddingX: 16,
    iconGap: 12,
    errorGap: 4,
    helperGap: 6,
    termsGap: 16,
    buttonGap: 24,
    dividerMargin: 24,
    socialGap: 12,
    footerBottom: 16,
  },
  size: {
    touchMin: 44,
    backButton: 44,
    backIcon: 20,
    icon: 20,
    inputHeight: 56,
    checkbox: 22,
    buttonHeight: 56,
    socialButtonHeight: 52,
    maxWebWidth: 440,
  },
} as const;

export type Palette = typeof light;
export const palettes: Record<'light' | 'dark' | 'sage', Palette> = { light, dark, sage };
