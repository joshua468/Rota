import { describe, expect, it } from 'vitest';
import { avatarNeedsAuth, avatarSource, initials } from './avatar';

describe('initials', () => {
  it('uses the first and last name', () => {
    expect(initials('Ada Lovelace')).toBe('AL');
    expect(initials('Ada Byron Lovelace')).toBe('AL');
  });

  it('uses a single letter for a single name', () => {
    expect(initials('Ada')).toBe('A');
  });

  it('handles spacing, casing and empty names', () => {
    expect(initials('  ada   lovelace  ')).toBe('AL');
    expect(initials('ada lovelace')).toBe('AL');
    expect(initials('')).toBe('?');
    expect(initials('   ')).toBe('?');
  });
});

describe('avatarSource', () => {
  it('returns nothing when the user has no photo', () => {
    expect(avatarSource(null)).toBeUndefined();
    expect(avatarSource(undefined)).toBeUndefined();
    expect(avatarSource('')).toBeUndefined();
  });

  it('leaves an absolute URL alone', () => {
    expect(avatarSource('https://cdn.test/photo.jpg')).toBe('https://cdn.test/photo.jpg');
  });
});

describe('avatarNeedsAuth', () => {
  it('requires the session token for API paths', () => {
    expect(avatarNeedsAuth('/v1/users/u1/avatar?v=1')).toBe(true);
    expect(avatarNeedsAuth('v1/users/u1/avatar')).toBe(true);
  });

  it('does not send the session token to third-party images', () => {
    expect(avatarNeedsAuth('https://cdn.test/photo.jpg')).toBe(false);
    expect(avatarNeedsAuth('http://cdn.test/photo.jpg')).toBe(false);
  });

  it('has nothing to authenticate when there is no photo', () => {
    expect(avatarNeedsAuth(null)).toBe(false);
    expect(avatarNeedsAuth(undefined)).toBe(false);
    expect(avatarNeedsAuth('')).toBe(false);
  });
});
