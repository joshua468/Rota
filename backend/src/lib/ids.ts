import { randomUUID } from 'node:crypto';

export { randomSecret } from './crypto';

export function newId(): string {
  return randomUUID();
}

/** 256-bit URL-safe random token (refresh tokens, magic links, reset, invites). */
export function randomToken(bytes = 32): string {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(bytes))).toString('base64url');
}
