import { describe, expect, it } from 'vitest';
import { createEmptyLicenseEntry, hasLicenseContent } from '@/lib/utils/licenses';

describe('createEmptyLicenseEntry', () => {
  it('uses today year/month and empty fields', () => {
    const entry = createEmptyLicenseEntry(new Date(2025, 5, 10));
    expect(entry.date).toEqual({ year: 2025, month: 6 });
    expect(entry.name).toBe('');
    expect(entry.issuer).toBe('');
  });

  it('generates unique ids', () => {
    const today = new Date(2025, 5, 10);
    const a = createEmptyLicenseEntry(today);
    const b = createEmptyLicenseEntry(today);
    expect(a.id).not.toBe('');
    expect(a.id).not.toBe(b.id);
  });
});

describe('hasLicenseContent', () => {
  it('returns false for whitespace name and empty issuer', () => {
    expect(hasLicenseContent({ name: '  ', issuer: '' })).toBe(false);
  });

  it('returns true when name is set', () => {
    expect(hasLicenseContent({ name: 'JLPT N3' })).toBe(true);
  });

  it('returns true when only issuer is set', () => {
    expect(hasLicenseContent({ name: '', issuer: 'JEES' })).toBe(true);
  });
});
