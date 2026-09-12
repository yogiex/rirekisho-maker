import { describe, expect, it } from 'vitest';
import { createDefaultDraft, DRAFT_VERSION } from '@/lib/schema/rirekisho-schema';
import { envelopeSchema } from '@/lib/storage/draft';

function envelope(extra: Record<string, unknown> = {}) {
  return {
    version: DRAFT_VERSION,
    savedAt: new Date().toISOString(),
    data: {
      ...createDefaultDraft(new Date()),
      furigana: 'さんとそ',
      fullName: 'ブディ・サントソ',
      dateOfBirth: { year: 2000, month: 1, day: 15 },
      postalCode: '123-4567',
      prefecture: '東京都',
      address: '新宿区1-1',
      phone: '090-1234-5678',
      email: 'a@b.co',
    },
    ...extra,
  };
}

describe('envelopeSchema', () => {
  it('accepts an envelope without lastStep', () => {
    const result = envelopeSchema.safeParse(envelope());
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.lastStep).toBeUndefined();
  });

  it('accepts lastStep 5', () => {
    const result = envelopeSchema.safeParse(envelope({ lastStep: 5 }));
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.lastStep).toBe(5);
  });

  it('rejects lastStep 6', () => {
    expect(envelopeSchema.safeParse(envelope({ lastStep: 6 })).success).toBe(false);
  });

  it('strips unknown keys', () => {
    const result = envelopeSchema.safeParse(envelope({ injected: 'x' }));
    expect(result.success).toBe(true);
    if (result.success) expect('injected' in result.data).toBe(false);
  });
});
