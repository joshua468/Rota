import { z } from 'zod';
import { Email, Password } from '@rota/contract';

export type PasswordStrength = 0 | 1 | 2 | 3 | 4;

export type PasswordCrack = { score: PasswordStrength; checks: boolean[] };

export function validateEmail(value: string): string | undefined {
  return Email.safeParse(value.trim()).success ? undefined : 'auth.error.email';
}

export function validateName(value: string): string | undefined {
  return value.trim().length >= 1 && value.trim().length <= 80
    ? undefined
    : 'auth.error.name';
}

export function validatePassword(value: string): string | undefined {
  return Password.safeParse(value).success ? undefined : 'auth.error.password';
}

export const SignUpPasswordSchema = z
  .object({
    password: Password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'auth.error.confirmPassword',
    path: ['confirmPassword'],
  });

export function validateConfirmPassword(password: string, confirmPassword: string): string | undefined {
  const result = SignUpPasswordSchema.safeParse({ password, confirmPassword });
  if (!result.success) {
    const issue = result.error.issues.find((i) => i.path.includes('confirmPassword'));
    return issue?.message ?? 'auth.error.confirmPassword';
  }
  return undefined;
}

const CHECK_LENGTH = (pw: string): boolean => pw.length >= 10;
const CHECK_CASE = (pw: string): boolean => /[a-z]/.test(pw) && /[A-Z]/.test(pw);
const CHECK_DIGIT = (pw: string): boolean => /\d/.test(pw);
const CHECK_SYMBOL = (pw: string): boolean => /[^A-Za-z0-9]/.test(pw);

/**
 * NIST-style entropy proxy. A password gets one point per class it passes,
 * starting from the 10-char minimum enforced by the contract's `Password`.
 */
export function passwordChecks(password: string): boolean[] {
  return [
    CHECK_LENGTH(password),
    CHECK_CASE(password),
    CHECK_DIGIT(password),
    CHECK_SYMBOL(password),
  ];
}

export function passwordStrength(password: string): PasswordCrack {
  const checks = passwordChecks(password);
  const passed = checks.filter(Boolean).length;
  const score: PasswordStrength =
    password.length === 0 ? 0 : passed === 1 ? 1 : passed === 2 ? 2 : passed === 3 ? 3 : 4;
  return { score, checks };
}