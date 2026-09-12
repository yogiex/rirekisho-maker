import { describe, expect, it } from 'vitest';
import { createSampleDraft } from '@/lib/constants/sample-draft';
import { createDefaultDraft } from '@/lib/schema/rirekisho-schema';
import { isDraftEmpty } from '@/lib/utils/draft-state';

describe('isDraftEmpty', () => {
  const today = new Date();

  it('is true for the default draft', () => {
    expect(isDraftEmpty(createDefaultDraft(today))).toBe(true);
  });

  it('is false for the sample draft', () => {
    expect(isDraftEmpty(createSampleDraft(today))).toBe(false);
  });

  it('is false when only photo is set', () => {
    expect(isDraftEmpty({ ...createDefaultDraft(today), photo: 'data:image/png;base64,AAAA' })).toBe(false);
  });

  it('is false when a history row exists with empty names', () => {
    const d = createDefaultDraft(today);
    d.history.push({
      id: 'h1',
      date: { year: 2020, month: 4 },
      category: 'education',
      name: '',
      nameFurigana: '',
      action: '入学',
      detail: '',
    });
    expect(isDraftEmpty(d)).toBe(false);
  });
});
