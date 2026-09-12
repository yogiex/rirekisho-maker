import { describe, expect, it } from 'vitest';
import { stepSchemas } from '@/lib/schema/rirekisho-schema';

const schema = stepSchemas[3];

const validEntry = {
  id: 'lic-1',
  date: { year: 2024, month: 3 },
  name: 'JLPT N3',
  issuer: 'JEES',
};

describe('stepSchemas[3] (licenses)', () => {
  it('accepts an empty licenses array', () => {
    expect(schema.safeParse({ licenses: [] }).success).toBe(true);
  });

  it('accepts a valid entry with issuer', () => {
    const result = schema.safeParse({ licenses: [validEntry] });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.licenses[0]).toEqual(validEntry);
    }
  });

  it('rejects an empty name with issue path licenses.0.name', () => {
    const result = schema.safeParse({ licenses: [{ ...validEntry, name: '' }] });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.join('.') === 'licenses.0.name')).toBe(true);
    }
  });

  it('normalizes full-width license name to half-width', () => {
    const result = schema.safeParse({ licenses: [{ ...validEntry, name: 'ＪＬＰＴ Ｎ３' }] });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.licenses[0].name).toBe('JLPT N3');
    }
  });

  it('rejects a name longer than 60 characters', () => {
    const result = schema.safeParse({ licenses: [{ ...validEntry, name: 'a'.repeat(61) }] });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.join('.') === 'licenses.0.name')).toBe(true);
    }
  });

  it('accepts a name of exactly 60 characters', () => {
    const result = schema.safeParse({ licenses: [{ ...validEntry, name: 'a'.repeat(60) }] });
    expect(result.success).toBe(true);
  });
});
