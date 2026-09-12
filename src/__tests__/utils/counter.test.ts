import { describe, expect, it } from 'vitest';
import { countChars, isNearLimit } from '@/lib/utils/counter';

describe('countChars', () => {
  it('counts Japanese characters as 1 each', () => {
    expect(countChars('あいう')).toBe(3);
  });

  it('counts an emoji as 2 UTF-16 units (matches Zod max())', () => {
    expect(countChars('👍')).toBe(2);
  });

  it('returns 0 for empty string', () => {
    expect(countChars('')).toBe(0);
  });
});

describe('isNearLimit', () => {
  it('is true at exactly 95% of 400 (380)', () => {
    expect(isNearLimit('a'.repeat(380), 400)).toBe(true);
  });

  it('is false just below 95% of 400 (379)', () => {
    expect(isNearLimit('a'.repeat(379), 400)).toBe(false);
  });

  it('is true at 95% of 300 (285)', () => {
    expect(isNearLimit('a'.repeat(285), 300)).toBe(true);
  });

  it('is false just below 95% of 300 (284)', () => {
    expect(isNearLimit('a'.repeat(284), 300)).toBe(false);
  });

  it('is false for empty string', () => {
    expect(isNearLimit('', 400)).toBe(false);
  });

  it('is true when over the limit (401/400)', () => {
    expect(isNearLimit('a'.repeat(401), 400)).toBe(true);
  });
});
