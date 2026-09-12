import { describe, expect, it } from 'vitest';
import { stepSchemas, type HistoryEntry } from '@/lib/schema/rirekisho-schema';

const schema = stepSchemas[2];

const entry = (over: Partial<HistoryEntry> = {}): HistoryEntry => ({
  id: 'fixed-id',
  date: { year: 2016, month: 4 },
  category: 'education',
  name: '日本大学',
  nameFurigana: '',
  action: '入学',
  detail: '',
  ...over,
});

const draft = (history: HistoryEntry[], historyCurrent = false) => ({ history, historyCurrent });

describe('step 2 schema', () => {
  it('accepts mixed education + work chronology', () => {
    const result = schema.safeParse(
      draft([
        entry(),
        entry({ id: 'w1', category: 'work', action: '入社', name: '株式会社サンプル', date: { year: 2020, month: 4 } }),
      ]),
    );
    expect(result.success).toBe(true);
  });

  it('rejects education action on a work row (category/action mismatch)', () => {
    const result = schema.safeParse(draft([entry({ category: 'work', action: '卒業' })]));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(['history', 0, 'action']);
    }
  });

  it('rejects empty row name', () => {
    const result = schema.safeParse(draft([entry({ name: '' })]));
    expect(result.success).toBe(false);
  });

  it('rejects katakana in row furigana', () => {
    const result = schema.safeParse(draft([entry({ nameFurigana: 'ニホン' })]));
    expect(result.success).toBe(false);
  });

  it('accepts hiragana in row furigana', () => {
    const result = schema.safeParse(draft([entry({ nameFurigana: 'にほん' })]));
    expect(result.success).toBe(true);
  });

  it('historyCurrent is a free boolean', () => {
    expect(schema.safeParse(draft([], true)).success).toBe(true);
  });

  it('rejects empty history array element (no id)', () => {
    const result = schema.safeParse(draft([{ ...entry(), id: '' }]));
    expect(result.success).toBe(false);
  });
});
