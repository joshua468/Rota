import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { describe, expect, it } from 'vitest';
import en from './en.json';

const here = fileURLToPath(new URL('.', import.meta.url));
const frontendRoot = resolve(here, '..', '..');
const SCAN_DIRS = [join(frontendRoot, 'src'), join(frontendRoot, 'app')];

const UNUSED_PREFIXES = [
  'nav.',
  'home.',
  'calendar.',
  'shift.',
  'activity.',
  'swaps.',
  'swap.',
  'settings.',
  'billing.',
  'team.',
  'offline.',
  'push.',
  'auth.',
];

const UNUSED_KEYS = new Set([
  'auth.invalid',
  'auth.signedOut',
  'common.cancel',
  'common.save',
  'common.remove',
  'common.optional',
  'common.loading',
  'app.name',
  'app.tagline',
  'empty.default.title',
]);

function walk(dir: string, out: string[] = []): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === 'node_modules' || entry === 'assets') continue;
      walk(full, out);
    } else if (/\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

const sources = SCAN_DIRS.flatMap((dir) => walk(dir)).map((file) => ({
  file,
  text: readFileSync(file, 'utf8'),
}));

const allSourceText = sources.map((source) => source.text).join('\n');

const calledKeys = new Set<string>();
for (const source of sources) {
  for (const match of source.text.matchAll(/\bt\(\s*'([^']+)'/g)) {
    calledKeys.add(match[1] ?? '');
  }
  for (const match of source.text.matchAll(/\bt\(\s*"([^"]+)"/g)) {
    calledKeys.add(match[1] ?? '');
  }
}

describe('i18n', () => {
  it('every t() call site resolves to a key in en.json', () => {
    const missing = [...calledKeys].filter((key) => !(key in en));
    expect(missing, `keys used in code but missing from en.json: ${missing.join(', ')}`).toEqual([]);
  });

  it('every key in en.json is reachable from the code (or reserved for a later screen)', () => {
    const unused = Object.keys(en).filter((key) => {
      if (calledKeys.has(key)) return false;
      if (UNUSED_PREFIXES.some((prefix) => key.startsWith(prefix))) return false;
      if (UNUSED_KEYS.has(key)) return false;
      return !allSourceText.includes(`'${key}'`) && !allSourceText.includes(`"${key}"`);
    });
    expect(unused, `keys in en.json never referenced: ${unused.join(', ')}`).toEqual([]);
  });

  it('the resource is flat, non-empty and has no duplicate values of copy', () => {
    for (const [key, value] of Object.entries(en)) {
      expect(typeof value, `${key} should be a string`).toBe('string');
      expect(value.length, `${key} should not be empty`).toBeGreaterThan(0);
    }
  });
});
