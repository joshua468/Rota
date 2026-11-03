import { ApiError, type ClientErrorCode } from '@/api/client';
import { t, type TranslationKey } from '@/i18n';

const CODE_KEYS: Record<ClientErrorCode, TranslationKey> = {
  VALIDATION_FAILED: 'error.validation',
  UNAUTHORIZED: 'error.unauthorized',
  FORBIDDEN: 'error.forbidden',
  NOT_FOUND: 'error.notFound',
  CONFLICT: 'error.conflict',
  RATE_LIMITED: 'error.rateLimited',
  PAYMENT_FAILED: 'error.payment',
  SEAT_LIMIT: 'error.seatLimit',
  PLAN_UPGRADE_REQUIRED: 'error.planUpgrade',
  IDEMPOTENCY_MISMATCH: 'error.generic',
  IDEMPOTENCY_IN_PROGRESS: 'error.generic',
  SUBSCRIPTION_RESTRICTED: 'error.restricted',
  PAYLOAD_TOO_LARGE: 'error.generic',
  INTERNAL: 'error.generic',
  NETWORK: 'error.network',
};

export function isNetworkError(error: unknown): boolean {
  return error instanceof ApiError && error.code === 'NETWORK';
}

export function errorMessage(error: unknown): string {
  const apiError = error instanceof ApiError ? error : null;
  if (!apiError) return t('error.generic');
  // A 409 is not always "someone else changed this": the server already
  // explains the specific reason (overlapping shift, decided swap, email
  // taken). Show the server's reason instead of the generic conflict copy.
  // A 401 is not always an expired session either: a failed login or invite
  // says exactly what went wrong, and "sign in again" would be nonsense there.
  if (
    (apiError.code === 'CONFLICT' || apiError.code === 'UNAUTHORIZED') &&
    apiError.fromEnvelope &&
    apiError.message
  ) {
    return apiError.message;
  }
  return t(CODE_KEYS[apiError.code]);
}
