#!/usr/bin/env node
/**
 * tokens:build — resolves design/tokens.json into app/src/theme/tokens.generated.ts.
 *
 * Steps:
 *   1. Walk design/tokens.json and resolve every "{a.b.c}" reference.
 *   2. Validate contrast for every entry in contrastPairs, in EVERY theme mode (light, dark, sage).
 *   3. Validate typography weights map to an exact loaded font family.
 *   4. Emit app/src/theme/tokens.generated.ts (never hand-edited).
 *
 * Usage: node tools/build-tokens.mjs [--check]
 *   --check regenerates in memory and fails if the committed file is stale.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = resolve(root, 'design/tokens.json');
const OUT = resolve(root, 'frontend/src/theme/tokens.generated.ts');

const raw = JSON.parse(readFileSync(SOURCE, 'utf8'));

/** ---------- reference resolution ---------- */
const REF = /^\{([^}]+)\}$/;

function getPath(path) {
  return path.split('.').reduce((node, key) => (node == null ? undefined : node[key]), raw);
}

function leafValue(node) {
  if (node && typeof node === 'object' && 'type' in node && 'value' in node) return node;
  return null;
}

function resolveRef(value, seen = new Set()) {
  if (typeof value !== 'string') return value;
  const m = REF.exec(value.trim());
  if (!m) return value;
  const path = m[1];
  if (seen.has(path)) throw new Error(`Circular token reference: ${path}`);
  seen.add(path);
  const target = getPath(path);
  if (target === undefined) throw new Error(`Unresolved token reference: {${path}}`);
  const leaf = leafValue(target);
  if (leaf) return resolveRef(leaf.value, seen);
  throw new Error(`Reference {${path}} does not point at a token leaf`);
}

function resolveSemantic(mode) {
  const out = {};
  for (const [key, node] of Object.entries(raw.semantic[mode].color)) {
    if (key.startsWith('$')) continue;
    out[key] = resolveRef(node.value);
  }
  return out;
}

/** ---------- colour helpers ---------- */
function toRgb(hex) {
  const h = hex.trim().replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  if (!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(full)) {
    throw new Error(`Not a hex colour: ${hex}`);
  }
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
    a: full.length === 8 ? parseInt(full.slice(6, 8), 16) / 255 : 1,
  };
}

function channel(c) {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const { r, g, b } = toRgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** ---------- build ---------- */
const modes = Object.keys(raw.semantic).filter((mode) => !mode.startsWith('$'));
const themes = Object.fromEntries(modes.map((mode) => [mode, resolveSemantic(mode)]));
const failures = [];

for (const mode of modes) {
  const colors = themes[mode];
  for (const pair of raw.contrastPairs.pairs) {
    const fg = colors[pair.fg];
    const bg = colors[pair.bg];
    if (!fg || !bg) {
      failures.push(`[${mode}] ${pair.name}: unknown role fg=${pair.fg} bg=${pair.bg}`);
      continue;
    }
    const min = pair.kind === 'text' ? 4.5 : 3;
    const ratio = contrast(fg, bg);
    if (ratio < min) {
      failures.push(
        `[${mode}] ${pair.name}: ${pair.fg}(${fg}) on ${pair.bg}(${bg}) = ${ratio.toFixed(2)}:1, needs ${min}:1`,
      );
    }
  }
}

const loaded = {};
for (const [weight, node] of Object.entries(raw.core.font.loaded)) {
  if (weight.startsWith('$')) continue;
  loaded[Number(weight)] = node.value;
}

const typeStyles = {};
for (const [name, node] of Object.entries(raw.type)) {
  const weight = Number(node.fontWeight);
  const family = loaded[weight];
  if (!family) {
    failures.push(`typography.${name}: no loaded family for weight ${weight}`);
    continue;
  }
  typeStyles[name] = {
    fontFamily: family,
    fontWeight: String(weight),
    fontSize: node.fontSize,
    lineHeight: node.lineHeight,
    letterSpacing: node.letterSpacing,
  };
}

if (failures.length) {
  console.error('tokens:build FAILED contrast/type validation:\n  - ' + failures.join('\n  - '));
  process.exit(1);
}

function serialize(value, indent = 0) {
  const pad = '  '.repeat(indent);
  const padIn = '  '.repeat(indent + 1);
  if (Array.isArray(value)) {
    return `[${value.map((v) => `\n${padIn}${serialize(v, indent + 1)}`).join(',')}\n${pad}]`;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value);
    return `{${entries.map(([k, v]) => `\n${padIn}${/^[A-Za-z_$][\w$]*$/.test(k) ? k : `'${k}'`}: ${serialize(v, indent + 1)}`).join(',')}\n${pad}}`;
  }
  if (typeof value === 'string') return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  return String(value);
}

const space = Object.fromEntries(
  Object.entries(raw.space)
    .filter(([k]) => !k.startsWith('$'))
    .map(([k, v]) => [k, v.value]),
);
const radius = Object.fromEntries(
  Object.entries(raw.radius)
    .filter(([k]) => !k.startsWith('$'))
    .map(([k, v]) => [k, v.value]),
);
const size = Object.fromEntries(
  Object.entries(raw.size)
    .filter(([k]) => !k.startsWith('$'))
    .map(([k, v]) => [k, v.value]),
);
const motion = {
  duration: Object.fromEntries(
    Object.entries(raw.motion.duration)
      .filter(([k]) => !k.startsWith('$'))
      .map(([k, v]) => [k, v.value]),
  ),
  easing: Object.fromEntries(
    Object.entries(raw.motion.easing)
      .filter(([k]) => !k.startsWith('$'))
      .map(([k, v]) => [k, v.value]),
  ),
};

function toShadow(node) {
  const v = node.value;
  const { a } = toRgb(v.color);
  return {
    shadowColor: v.color,
    shadowOffset: { width: v.offsetX, height: v.offsetY },
    shadowRadius: v.radius,
    shadowOpacity: Number(a.toFixed(2)),
    elevation: Math.min(24, Math.max(v.offsetY, Math.round(v.radius / 2))),
    boxShadow: `${v.offsetX}px ${v.offsetY}px ${v.radius}px ${v.color}`,
  };
}

const shadows = Object.fromEntries(
  Object.entries(raw.shadow)
    .filter(([k]) => !k.startsWith('$'))
    .map(([k, v]) => [k, toShadow(v)]),
);

const spaceTuple = Object.keys(space)
  .filter((k) => /^\d+$/.test(k))
  .sort((a, b) => Number(a) - Number(b))
  .map((k) => space[k]);

const shadowKeys = Object.keys(shadows);
const colorRoles = Object.keys(themes[modes[0]]);
const radiusKeys = Object.keys(radius);
const sizeKeys = Object.keys(size);
const typeKeys = Object.keys(typeStyles);

const header = `/* eslint-disable */
/**
 * GENERATED FILE — DO NOT EDIT.
 * Source: design/tokens.json  |  Regenerate: pnpm tokens:build
 * Contrast: every pair in contrastPairs verified >= 4.5:1 (text) / >= 3:1 (boundary) in every theme mode.
 */
`;

const themeEntries = modes.map(
  (mode) => `export const ${mode}Theme: Theme = ${serialize({
    mode,
    color: themes[mode],
    space: spaceTuple,
    radius,
    shadow: shadows,
    type: typeStyles,
    motion,
    size,
    textScale: raw.textScale.maxFontSizeMultiplier ? { maxFontSizeMultiplier: raw.textScale.maxFontSizeMultiplier.value } : { maxFontSizeMultiplier: 1.6 },
  })} as const;`,
);

const body = `${header}
export type ThemeMode = ${modes.map((m) => `'${m}'`).join(' | ')};

export type ColorRole = ${colorRoles.map((k) => `'${k}'`).join(' | ')};
export type RadiusKey = ${radiusKeys.map((k) => `'${k}'`).join(' | ')};
export type SizeKey = ${sizeKeys.map((k) => `'${k}'`).join(' | ')};
export type TypeStyleKey = ${typeKeys.map((k) => `'${k}'`).join(' | ')};

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
  space: readonly [${spaceTuple.join(', ')}];
  radius: Record<RadiusKey, number>;
  shadow: Record<${shadowKeys.map((k) => `'${k}'`).join(' | ')}, ShadowStyle>;
  type: Record<TypeStyleKey, TypeStyle>;
  motion: { duration: { ${Object.keys(motion.duration)
    .map((k) => `${k}: number`)
    .join('; ')} }; easing: { standard: readonly number[]; emphasized: readonly number[] } };
  size: Record<SizeKey, number>;
  textScale: { maxFontSizeMultiplier: number };
}

export const spaceScale = ${serialize(spaceTuple)} as const;

${themeEntries.join('\n\n')}

export const themes: Record<ThemeMode, Theme> = { ${modes.map((m) => `${m}: ${m}Theme`).join(', ')} };
`;

const check = process.argv.includes('--check');
if (check) {
  const current = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
  if (current !== body) {
    console.error('tokens:build --check FAILED: frontend/src/theme/tokens.generated.ts is stale. Run `pnpm tokens:build`.');
    process.exit(1);
  }
  console.log('tokens:build --check OK (generated file is up to date, contrast passes)');
} else {
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, body, 'utf8');
  const pairs = raw.contrastPairs.pairs.length * modes.length;
  console.log(
    `tokens:build OK → ${OUT.replace(root + '/', '')} (${pairs} contrast checks across ${modes.join('/')}, ${typeKeys.length} type styles, ${colorRoles.length} color roles)`,
  );
}
