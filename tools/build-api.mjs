import { build } from 'esbuild';

// Vercel compiles each TypeScript function file as CommonJS, while the backend
// package is ESM. Bundling the entry into one CommonJS file keeps the function
// self-contained and avoids a mixed CJS/ESM module graph at runtime.
const external = [
  '@fastify/cors',
  '@node-rs/argon2',
  'bullmq',
  'expo-server-sdk',
  'fastify',
  'ioredis',
  'jose',
  'pg',
  'pino',
  'zod',
];

await build({
  entryPoints: ['tools/api-entry.ts'],
  outfile: 'api/index.js',
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'cjs',
  external,
  sourcemap: false,
  logLevel: 'info',
});
