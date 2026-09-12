import { describe, expect, it } from 'vitest';
import { createSampleDraft } from '@/lib/constants/sample-draft';
import {
  createRirekishoSchema,
  refineAlternateContact,
  refineHistoryActions,
} from '@/lib/schema/rirekisho-schema';

describe('createSampleDraft', () => {
  const today = new Date();
  const sample = createSampleDraft(today);

  it('passes the full schema for today', () => {
    const schema = createRirekishoSchema(today)
      .base.superRefine(refineAlternateContact)
      .superRefine(refineHistoryActions);
    const result = schema.safeParse(sample);
    expect(result.success, JSON.stringify(result.success ? null : result.error.issues)).toBe(true);
  });

  it('sets fillDate to today', () => {
    expect(sample.fillDate).toEqual({
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    });
  });

  it('has at least 6 history entries including work', () => {
    expect(sample.history.length).toBeGreaterThanOrEqual(6);
    expect(sample.history.some((h) => h.category === 'work')).toBe(true);
  });

  it('has a motivation between 200 and 400 characters', () => {
    const len = [...sample.motivation].length;
    expect(len).toBeGreaterThanOrEqual(200);
    expect(len).toBeLessThanOrEqual(400);
  });

  it('uses unique ids', () => {
    const ids = [...sample.history, ...sample.licenses].map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
