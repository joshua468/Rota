import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Minimal `.env` reader (no dependency). Comments and quotes are handled,
 * real environment variables always win, and values never get logged —
 * secrets stay in the gitignored `.env` file (Rule 03).
 */
export function loadDotEnv(file = join(process.cwd(), '.env')): void {
  if (!existsSync(file)) return;
  for (const raw of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}
