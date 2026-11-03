import { z, type ZodType } from 'zod';
import { ApiError } from '../lib/errors';

/**
 * An empty, strict query schema. Routes that accept no query string parse with
 * this so an unexpected `?foo=1` is rejected rather than silently ignored
 * (Rule 06: every request body, query and param is validated with Zod).
 */
export const NoQuery = z.object({}).strict();

/** Every body, query and param is parsed with a `.strict()` schema (Rule 06). */
export function parseWith<T>(schema: ZodType<T>, value: unknown, where: string): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    const first = result.error.issues[0];
    const where2 = first ? `${where}.${first.path.join('.')}` : where;
    throw new ApiError('VALIDATION_FAILED', 400, `${where2}: ${first?.message ?? 'invalid'}`);
  }
  return result.data;
}
