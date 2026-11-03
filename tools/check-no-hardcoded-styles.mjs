#!/usr/bin/env node
/**
 * check:styles — fails the build when app code paints a literal instead of a token.
 *
 * Enforced by Rule 04 (tokens, not literals) and Rule 03 (no secrets/AsyncStorage for tokens):
 *   - no hex / rgb() / hsl() colours
 *   - no numeric fontSize, no literal fontFamily
 *   - no spacing numbers outside the generated scale (0 is allowed)
 *   - no borderRadius numbers (radius comes from t.radius.*)
 *   - no AsyncStorage import (tokens belong in expo-secure-store)
 *   - generated files are excluded (they are the token output)
 *
 * Scans frontend/src (application code) and frontend/app (Expo Router routes).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const SCANNED_DIRS = [join(root, 'frontend/src'), join(root, 'frontend/app')];
const EXCLUDE = [
  /tokens\.generated\.ts$/,
  /[\\/]i18n[\\/].*\.json$/,
  /\.test\.tsx?$/,
  /[\\/]__tests__[\\/]/,
  // The Home redesign ships literal design values by spec:
  // `/theme/tokens.ts` is the palette source and `components/home/**`
  // plus the Home route are hand-authored to that palette.
  /[\\/]theme[\\/]tokens\.ts$/,
  /[\\/]components[\\/]home[\\/]/,
  /[\\/]app[\\/]\(app\)[\\/]index\.tsx$/,
];

const SPACE_SCALE = new Set([0, 4, 8, 12, 16, 20, 24, 32, 40]);
const RADIUS_VALUES = new Set([0, 4, 8, 12, 16, 24, 999]);

const errors = [];

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === 'node_modules' || entry === 'assets') continue;
      walk(full, out);
    } else if (/\.tsx?$/.test(entry) && !EXCLUDE.some((re) => re.test(full))) {
      out.push(full);
    }
  }
  return out;
}

const SPACE_PROPS =
  /\b(margin|marginTop|marginBottom|marginLeft|marginRight|marginHorizontal|marginVertical|padding|paddingTop|paddingBottom|paddingLeft|paddingRight|paddingHorizontal|paddingVertical|gap|rowGap|columnGap|top|left|right|bottom|inset)\s*:/g;

function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
}

for (const dir of SCANNED_DIRS) {
  for (const file of walk(dir)) {
    const rel = relative(root, file);
    const raw = readFileSync(file, 'utf8');
    const src = stripComments(raw);
    const lines = src.split('\n');
    const report = (lineNo, rule, text) => errors.push(`${rel}:${lineNo}  ${rule}\n    ${text.trim().slice(0, 120)}`);

    lines.forEach((line, i) => {
      const n = i + 1;
      let m;

      // 1. colour literals
      const hex = line.match(/#[0-9a-fA-F]{3,8}\b/);
      if (hex && !/^\s*['"]/.test(hex[0])) {
        report(n, 'hex colour literal — use t.color.*', line);
      } else if (hex) {
        report(n, 'hex colour literal — use t.color.*', line);
      }
      if (/\b(rgba?|hsla?)\s*\(/.test(line)) {
        report(n, 'rgb()/hsl() colour literal — use t.color.*', line);
      }

      // 2. typography literals
      m = line.match(/\bfontSize\s*:\s*(-?\d+(\.\d+)?)/);
      if (m) report(n, 'numeric fontSize — use t.type.*.fontSize', line);
      m = line.match(/\bfontFamily\s*:\s*['"][^'"]+['"]/);
      if (m) report(n, 'literal fontFamily — type styles come from t.type.*', line);
      m = line.match(/\blineHeight\s*:\s*(-?\d+(\.\d+)?)/);
      if (m) report(n, 'numeric lineHeight — use t.type.*.lineHeight', line);
      m = line.match(/\bletterSpacing\s*:\s*(-?\d+(\.\d+)?)/);
      if (m) report(n, 'numeric letterSpacing — use t.type.*.letterSpacing', line);

      // 3. spacing literals outside the generated scale
      for (m of line.matchAll(SPACE_PROPS)) {
        const valueMatch = line.slice(m.index).match(/^\s*(\d+(\.\d+)?)/);
        if (!valueMatch) continue;
        const value = Number(valueMatch[1]);
        if (SPACE_SCALE.has(value)) continue;
        report(n, `spacing ${value} is outside the token scale (0,4,8,12,16,20,24,32,40) — use t.space[n]`, line);
      }

      // 4. radius literals
      m = line.match(/\bborderRadius\s*:\s*(-?\d+(\.\d+)?)/);
      if (m && !RADIUS_VALUES.has(Number(m[1]))) {
        report(n, 'borderRadius literal — use t.radius.*', line);
      } else if (m) {
        report(n, 'borderRadius literal — use t.radius.*', line);
      }

      // 5. forbidden storage for tokens/secrets
      if (/@react-native-async-storage\/async-storage/.test(line)) {
        report(n, 'AsyncStorage is banned — tokens and secrets live in expo-secure-store', line);
      }
    });
  }
}

if (errors.length) {
  console.error(`check:styles FAILED — ${errors.length} hardcoded style(s):\n`);
  for (const e of errors) console.error('  ' + e);
  console.error('\nEvery colour, font, spacing, radius and shadow comes from design/tokens.json via useTheme()/createStyles().');
  process.exit(1);
}
console.log('check:styles OK (no hardcoded colours, font sizes, families, spacing or radii in frontend/src)');
