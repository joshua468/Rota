import { afterEach, describe, expect, it } from 'vitest';
import { loadEnv, resetEnv } from '../src/env';

const base = {
  NODE_ENV: 'test',
  DATABASE_URL: 'pglite://global',
  SHARD_DATABASE_URLS: 'pglite://shard0',
  SHARD_COUNT: '1',
  DB_DRIVER: 'pglite',
  JWT_SECRET: 'test-jwt-secret-that-is-long-enough-32',
  PUBLIC_BASE_URL: 'http://localhost:4000',
  MAIL_DRIVER: 'dev',
  REDIS_URL: '',
} as const;

afterEach(() => resetEnv());

describe('loadEnv', () => {
  it('ignores unrelated operating-system variables', () => {
    const env = loadEnv({
      ...base,
      Path: 'C:\\Windows\\System32',
      APPDATA: 'C:\\Users\\dev\\AppData\\Roaming',
      USERNAME: 'dev',
      RANDOM_UNRELATED_KEY: 'noise',
    });
    expect(env.PORT).toBe(4000);
    expect(env.DB_DRIVER).toBe('pglite');
  });

  it('still refuses to start when a required value is missing', () => {
    const { DATABASE_URL: _omitted, ...withoutDatabase } = base;
    expect(() => loadEnv(withoutDatabase)).toThrow(/Refusing to start/);
  });

  it('rejects a malformed value', () => {
    expect(() => loadEnv({ ...base, DB_DRIVER: 'mysql' })).toThrow(/Refusing to start/);
  });

  it('normalises a trailing slash on PUBLIC_BASE_URL', () => {
    const env = loadEnv({ ...base, PUBLIC_BASE_URL: 'https://api.example.com/' });
    expect(env.PUBLIC_BASE_URL).toBe('https://api.example.com');
  });

  it('defaults TRUST_PROXY off so X-Forwarded-For is not trusted by accident', () => {
    expect(loadEnv(base).TRUST_PROXY).toBe(false);
  });

  describe('production guards', () => {
    const production = {
      ...base,
      NODE_ENV: 'production',
      DB_DRIVER: 'pg',
      DATABASE_URL: 'postgres://user:pass@db:5432/rota',
      SHARD_DATABASE_URLS: 'postgres://user:pass@db:5432/rota_shard0',
      REDIS_URL: 'redis://redis:6379',
      FLUTTERWAVE_SECRET_KEY: 'flw_live_key',
      FLUTTERWAVE_SECRET_HASH: 'webhook-hash',
      MAIL_DRIVER: 'resend',
      MAIL_FROM: 'Rota <noreply@rota.app>',
      RESEND_API_KEY: 're_live_key',
      CORS_ORIGINS: 'https://app.rota.app',
    } as const;

    it('accepts a complete production configuration', () => {
      expect(loadEnv(production).PUBLIC_BASE_URL).toBe('http://localhost:4000');
    });

    it('refuses to start without REDIS_URL', () => {
      expect(() => loadEnv({ ...production, REDIS_URL: '' })).toThrow(/REDIS_URL/);
    });

    it('refuses to start without a real payment key', () => {
      expect(() => loadEnv({ ...production, FLUTTERWAVE_SECRET_KEY: '' })).toThrow(/payment key/);
    });

    it('refuses dev/log mail in production', () => {
      expect(() => loadEnv({ ...production, MAIL_DRIVER: 'dev' })).toThrow(/MAIL_DRIVER/);
    });

    it('refuses the pglite driver in production', () => {
      expect(() => loadEnv({ ...production, DB_DRIVER: 'pglite' })).toThrow(/DB_DRIVER/);
    });

    it('refuses a wildcard or empty CORS allowlist in production', () => {
      expect(() => loadEnv({ ...production, CORS_ORIGINS: '*' })).toThrow(/CORS_ORIGINS/);
      expect(() => loadEnv({ ...production, CORS_ORIGINS: '' })).toThrow(/CORS_ORIGINS/);
    });
  });
});
