import { build } from 'esbuild';

// Vercel compiles each TypeScript function file as CommonJS, while the backend
// package is ESM. Bundling the entry into one CommonJS file keeps the function
// self-contained and avoids a mixed CJS/ESM module graph at runtime.
// Native binding cannot be bundled; it is a root dependency so Vercel's
// dependency tracing puts it in /var/task/node_modules. BullMQ and ioredis are
// only loaded when REDIS_URL is set, so they stay external and unloaded in the
// serverless (in-process queue) deployment.
const external = ['@node-rs/argon2', 'bullmq', 'ioredis', 'pg-native'];

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
