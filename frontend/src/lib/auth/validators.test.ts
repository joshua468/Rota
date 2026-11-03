import { describe, expect, it } from 'vitest';
import {
  passwordStrength,
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from './validators';

describe('auth validators', () => {
  it('validates emails with the contract shape', () => {
    expect(validateEmail('ada@example.com')).toBeUndefined();
    expect(validateEmail('  ada@example.com ')).toBeUndefined();
    expect(validateEmail('nope')).toBe('auth.error.email');
    expect(validateEmail('')).toBe('auth.error.email');
  });

  it('validates names within the contract bounds', () => {
    expect(validateName('Ada')).toBeUndefined();
    expect(validateName('  Ada  ')).toBeUndefined();
    expect(validateName('')).toBe('auth.error.name');
    expect(validateName(' '.repeat(80))).toBe('auth.error.name');
  });

  it('validates passwords within the contract bounds', () => {
    expect(validatePassword('1234567890')).toBeUndefined();
    expect(validatePassword('short')).toBe('auth.error.password');
    expect(validatePassword('x'.repeat(201))).toBe('auth.error.password');
  });

  it('validates confirm password matches password and satisfies Password schema', () => {
    expect(validateConfirmPassword('1234567890', '1234567890')).toBeUndefined();
    expect(validateConfirmPassword('1234567890', 'different123')).toBe('auth.error.confirmPassword');
    expect(validateConfirmPassword('short', 'short')).toBe('auth.error.confirmPassword');
  });
});

describe('passwordStrength', () => {
  it('is zero for an empty password', () => {
    expect(passwordStrength('').score).toBe(0);
  });

  it('never scores below one once anything is typed', () => {
    expect(passwordStrength('aaaaaaaaaa').score).toBeGreaterThanOrEqual(1);
  });

  it('rewards each extra character class', () => {
    const lower = passwordStrength('aaaaaaaaaa');
    const withCase = passwordStrength('Aaaaaaaaaaa');
    const withDigit = passwordStrength('Aaaaaaaaaa1');
    const withSymbol = passwordStrength('Aaaaaaaaaa1!');

    expect(lower.score).toBeLessThan(withCase.score);
    expect(withCase.score).toBeLessThan(withDigit.score);
    expect(withDigit.score).toBeLessThanOrEqual(withSymbol.score);
  });

  it('exposes the per-check breakdown', () => {
    const { checks } = passwordStrength('Aaaaaaaaaa1!');
    expect(checks).toEqual([true, true, true, true]);
    expect(passwordStrength('nope-nope-nope').checks).toEqual([true, false, false, true]);
  });
});