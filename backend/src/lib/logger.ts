import { pino, stdSerializers, type Logger } from 'pino';

/**
 * Structured logs with secrets redacted (Rule 06). Every request line carries
 * reqId, userId, teamId, route, status, ms; job lines carry queue, jobId,
 * attempt, result, ms.
 */
export function createLogger(level = 'info'): Logger {
  return pino({
    level,
    redact: {
      paths: ['req.headers.authorization', 'password', 'token', 'secret', '*.password', '*.token', '*.secret'],
      censor: '[redacted]',
    },
    serializers: {
      err: stdSerializers.err,
    },
  });
}

export const logger: Logger = createLogger(process.env.LOG_LEVEL ?? 'info');
