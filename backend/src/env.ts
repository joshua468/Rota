import { z } from 'zod';

/**
 * Server configuration (Rule 03): read exactly once, validated with Zod, and
 * the process refuses to start when a value is missing or malformed. Never
 * logged, never exposed to the client. `.env.example` lists names only.
 */

const boolish = z
  .union([z.boolean(), z.string()])
  .transform((v) => (typeof v === 'boolean' ? v : ['1', 'true', 'yes', 'on'].includes(v.toLowerCase())));

const urlList = z
  .string()
  .transform((raw) => raw.split(',').map((s) => s.trim()).filter(Boolean))
  .refine((list) => list.length > 0, { message: 'SHARD_DATABASE_URLS must contain at least one URL' });

const originList = z
  .string()
  .default('')
  .transform((raw) => raw.split(',').map((s) => s.trim()).filter(Boolean))
  .refine((list) => list.every((origin) => origin === '*' || /^https?:\/\/[^/]+$/.test(origin)), {
    message: 'CORS_ORIGINS must be a comma-separated list of origins (or *)',
  });

const EnvObject = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(4000),
    /** identity/global database */
    DATABASE_URL: z.string().url(),
    /** one URL per shard, index = shard number (0-based) */
    SHARD_DATABASE_URLS: urlList,
    SHARD_COUNT: z.coerce.number().int().min(1).default(1),
    /** `pg` for the real server, `pglite` for hermetic dev/test (ADR-0006) */
    DB_DRIVER: z.enum(['pg', 'pglite']).default('pg'),
    /** require TLS on production database connections */
    DB_SSL: boolish.default(false),
    DB_CONNECTION_TIMEOUT_MS: z.coerce.number().int().min(1000).default(10_000),
    DB_STATEMENT_TIMEOUT_MS: z.coerce.number().int().min(1000).default(15_000),
    /**
     * Redis is the durable backend for jobs, rate limits and locks. It is
     * optional only outside production: production refuses to start without it
     * so a deploy can never silently degrade to per-instance memory.
     */
    REDIS_URL: z.string().refine((v) => v === '' || v.startsWith('redis://') || v.startsWith('rediss://'), {
      message: 'REDIS_URL must be empty or a redis:// URL',
    }).default(''),
    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
    PUBLIC_BASE_URL: z
      .string()
      .url()
      .transform((value) => value.replace(/\/+$/, '')),
    /** Comma-separated browser origins. Empty means "reflect any origin" outside production. */
    CORS_ORIGINS: originList,
    /** Only enable behind a trusted proxy/load balancer; otherwise X-Forwarded-For is spoofable. */
    TRUST_PROXY: boolish.default(false),
    /** Bearer secret Vercel Cron sends to `/v1/internal/cron`; empty disables the route. */
    CRON_SECRET: z.string().default(''),
    /** Flutterwave secret key (test or live). Empty selects the deterministic fake driver outside production. */
    FLUTTERWAVE_SECRET_KEY: z.string().default(''),
    FLUTTERWAVE_PUBLIC_KEY: z.string().default(''),
    /** the `verif-hash` value configured in the Flutterwave dashboard for webhooks */
    FLUTTERWAVE_SECRET_HASH: z.string().default(''),
    EXPO_ACCESS_TOKEN: z.string().default(''),
    SENTRY_DSN: z.string().default(''),
    FEATURE_SWAP_ASSIST: boolish.default(false),
    OPENAI_API_KEY: z.string().default(''),
    /** `dev` writes `.mail.jsonl`; `log` only logs; `resend` delivers through Resend. */
    MAIL_DRIVER: z.enum(['dev', 'log', 'resend']).default('dev'),
    MAIL_FROM: z.string().default(''),
    RESEND_API_KEY: z.string().default(''),
  })
  .strict();

const EnvSchema = EnvObject.superRefine((env, ctx) => {
    if (env.NODE_ENV !== 'production') return;
    const require = (value: string, path: string, message: string): void => {
      if (!value) ctx.addIssue({ code: z.ZodIssueCode.custom, path: [path], message });
    };
    require(env.REDIS_URL, 'REDIS_URL', 'REDIS_URL is required in production');
    require(env.CRON_SECRET, 'CRON_SECRET', 'CRON_SECRET is required in production');
    require(env.FLUTTERWAVE_SECRET_KEY, 'FLUTTERWAVE_SECRET_KEY', 'a real payment key is required in production');
    require(env.FLUTTERWAVE_SECRET_HASH, 'FLUTTERWAVE_SECRET_HASH', 'webhook verification hash is required in production');
    require(env.MAIL_FROM, 'MAIL_FROM', 'MAIL_FROM is required in production');
    require(env.RESEND_API_KEY, 'RESEND_API_KEY', 'RESEND_API_KEY is required in production');
    if (env.MAIL_DRIVER !== 'resend') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['MAIL_DRIVER'],
        message: 'MAIL_DRIVER must be "resend" in production',
      });
    }
    if (env.DB_DRIVER !== 'pg') {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['DB_DRIVER'], message: 'DB_DRIVER must be "pg" in production' });
    }
    if (env.CORS_ORIGINS.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['CORS_ORIGINS'],
        message: 'CORS_ORIGINS must list the allowed origins in production',
      });
    }
    if (env.CORS_ORIGINS.includes('*')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['CORS_ORIGINS'],
        message: 'CORS_ORIGINS cannot be "*" in production',
      });
    }
  });

export type Env = z.infer<typeof EnvSchema>;

let cached: Env | null = null;

/**
 * `process.env` carries the whole operating-system environment, so we select the
 * keys this service owns before validating. `EnvSchema` stays strict, which
 * still catches an unexpected key when a caller hands over an explicit object
 * (tests, tooling) — but OS noise can never fail startup.
 */
function pickKnown(source: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const picked: NodeJS.ProcessEnv = {};
  for (const key of Object.keys(EnvObject.shape)) picked[key] = source[key];
  return picked;
}

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  if (cached) return cached;
  const parsed = EnvSchema.safeParse(pickKnown(source));
  if (!parsed.success) {
    const detail = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Refusing to start: invalid environment (${detail})`);
  }
  cached = parsed.data;
  return cached;
}

export function resetEnv(): void {
  cached = null;
}
