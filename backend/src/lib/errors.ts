import type { ErrorCode } from '@rota/contract';

/**
 * The only error shape a client ever sees (Rule 06):
 * `{ error: { code, message, reqId } }` with a stable code and no stack traces.
 */
export class ApiError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly reqId: string;

  constructor(code: ErrorCode, status: number, message: string, reqId = '') {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.reqId = reqId;
  }

  envelope(reqId: string): { error: { code: ErrorCode; message: string; reqId: string } } {
    return { error: { code: this.code, message: this.message, reqId: this.reqId || reqId } };
  }
}

export const badRequest = (message: string): ApiError =>
  new ApiError('VALIDATION_FAILED', 400, message);

export const unauthorized = (message = 'Unauthorized'): ApiError =>
  new ApiError('UNAUTHORIZED', 401, message);

export const forbidden = (message = 'Forbidden'): ApiError =>
  new ApiError('FORBIDDEN', 403, message);

export const notFound = (message = 'Not found'): ApiError =>
  new ApiError('NOT_FOUND', 404, message);

export const conflict = (message: string): ApiError => new ApiError('CONFLICT', 409, message);

export const rateLimited = (message = 'Too many requests'): ApiError =>
  new ApiError('RATE_LIMITED', 429, message);

export const seatLimit = (message = 'Seat limit reached'): ApiError =>
  new ApiError('SEAT_LIMIT', 402, message);

export const paymentFailed = (message = 'Payment failed'): ApiError =>
  new ApiError('PAYMENT_FAILED', 402, message);

export const planUpgradeRequiredError = (message = 'Upgrade your plan to continue'): ApiError =>
  new ApiError('PLAN_UPGRADE_REQUIRED', 422, message);

export const subscriptionRestricted = (
  message = 'Your subscription is restricted because a payment is overdue. Restore billing to continue.',
): ApiError => new ApiError('SUBSCRIPTION_RESTRICTED', statusFor('SUBSCRIPTION_RESTRICTED'), message);

export const idempotencyMismatch = (message = 'Idempotency-Key reused with a different body'): ApiError =>
  new ApiError('IDEMPOTENCY_MISMATCH', 422, message);

export const idempotencyInProgress = (): ApiError =>
  new ApiError('IDEMPOTENCY_IN_PROGRESS', 409, 'An identical request is already running');

export const internal = (message = 'Internal error'): ApiError =>
  new ApiError('INTERNAL', 500, message);

/** HTTP status for every contract code — one place, no ad-hoc numbers in routes. */
export function statusFor(code: ErrorCode): number {
  switch (code) {
    case 'VALIDATION_FAILED':
      return 400;
    case 'UNAUTHORIZED':
      return 401;
    case 'FORBIDDEN':
      return 403;
    case 'NOT_FOUND':
      return 404;
    case 'CONFLICT':
    case 'IDEMPOTENCY_IN_PROGRESS':
      return 409;
    case 'SEAT_LIMIT':
    case 'PAYMENT_FAILED':
      return 402;
    case 'PLAN_UPGRADE_REQUIRED':
    case 'IDEMPOTENCY_MISMATCH':
      return 422;
    case 'RATE_LIMITED':
      return 429;
    case 'SUBSCRIPTION_RESTRICTED':
      return 403;
    case 'PAYLOAD_TOO_LARGE':
      return 413;
    default:
      return 500;
  }
}
