import { describe, expect, it } from 'vitest';
import { resolveInsertion } from '@/lib/utils/insertion';

const EXAMPLE = '例文です。';

describe('resolveInsertion', () => {
  it('inserts directly when the target is empty', () => {
    expect(resolveInsertion('', EXAMPLE)).toEqual({ value: EXAMPLE, needsConfirm: false });
  });

  it('treats whitespace-only content as empty', () => {
    const result = resolveInsertion('   \n  ', EXAMPLE);
    expect(result.needsConfirm).toBe(false);
    expect(result.value).toBe(EXAMPLE);
  });

  it('requires confirmation and keeps existing text when target is non-empty', () => {
    expect(resolveInsertion('既存の文章', EXAMPLE)).toEqual({
      value: '既存の文章',
      needsConfirm: true,
    });
  });
});
