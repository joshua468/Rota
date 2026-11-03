import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { Algorithm, hash as argon2Hash, verify as argon2Verify } from '@node-rs/argon2';

export function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

export function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a, 'utf8');
  const right = Buffer.from(b, 'utf8');
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/** argon2id, 19 MiB memory, time cost 2 (auth-tokens skill). */
export async function hashPassword(password: string): Promise<string> {
  return argon2Hash(password, { algorithm: Algorithm.Argon2id, memoryCost: 19_456, timeCost: 2, parallelism: 1 });
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try {
    return await argon2Verify(hash, password);
  } catch {
    return false;
  }
}

export function randomSecret(bytes = 32): string {
  return randomBytes(bytes).toString('base64url');
}
