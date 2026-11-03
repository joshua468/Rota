import en from './en.json';

/**
 * i18n — every user-facing string in the app lives in `en.json` (Rule 04: no
 * hardcoded copy in components). Keys are typed, so a typo fails `typecheck`,
 * and `i18n.test.ts` asserts the resource and the call sites agree.
 */
export type TranslationKey = keyof typeof en;
export type TranslationParams = Record<string, string | number>;

const PLACEHOLDER = /\{(\w+)\}/g;

export const messages = en;

export function hasKey(key: string): key is TranslationKey {
  return Object.prototype.hasOwnProperty.call(en, key);
}

export function t(key: TranslationKey, params?: TranslationParams): string {
  const template: string = en[key];
  if (!params) return template;
  return template.replace(PLACEHOLDER, (whole, name: string) => {
    const value = params[name];
    if (value === undefined) return whole;
    return String(value);
  });
}

/** Placeholders a message expects, e.g. `['reqId']` for "Reference {reqId}". */
export function paramsOf(key: TranslationKey): string[] {
  return Array.from(en[key].matchAll(PLACEHOLDER), (m) => m[1] ?? '').filter(Boolean);
}
