type CryptoModule = { randomUUID?: () => string };

declare const require: ((id: string) => unknown) | undefined;

let loaded: CryptoModule | null | undefined;

function loadExpoCrypto(): CryptoModule | null {
  if (loaded !== undefined) return loaded;
  try {
    loaded = typeof require === 'function' ? (require('expo-crypto') as CryptoModule) : null;
  } catch {
    loaded = null;
  }
  return loaded;
}

function fallbackUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

export function createRandomUUID(load: () => CryptoModule | null = loadExpoCrypto): string {
  let expoCrypto: CryptoModule | null = null;
  try {
    expoCrypto = load();
  } catch {}
  if (expoCrypto && typeof expoCrypto.randomUUID === 'function') {
    try {
      return expoCrypto.randomUUID();
    } catch {}
  }
  const globalCrypto = globalThis.crypto as Crypto | undefined;
  if (globalCrypto && typeof globalCrypto.randomUUID === 'function') {
    try {
      return globalCrypto.randomUUID();
    } catch {}
  }
  return fallbackUUID();
}

export function randomUUID(): string {
  return createRandomUUID();
}
