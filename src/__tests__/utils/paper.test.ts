import { describe, expect, it } from 'vitest';
import type { HistoryEntry, LicenseEntry } from '@/lib/schema/rirekisho-schema';
import {
  buildExportFilename, compareJpDate, formatCommute, formatDependents,
  padRows, sortHistoryStable, sortLicensesStable,
} from '@/lib/utils/paper';

const hist = (id: string, year: number, month: number): HistoryEntry => ({
  id,
  date: { year, month },
  category: 'education',
  name: `school-${id}`,
  nameFurigana: '',
  action: '入学',
  detail: '',
});

const lic = (id: string, year: number, month: number): LicenseEntry => ({
  id,
  date: { year, month },
  name: `lic-${id}`,
  issuer: '',
});

describe('compareJpDate', () => {
  it('orders by year then month', () => {
    expect(compareJpDate({ year: 2020, month: 4 }, { year: 2021, month: 1 })).toBeLessThan(0);
    expect(compareJpDate({ year: 2021, month: 5 }, { year: 2021, month: 3 })).toBeGreaterThan(0);
    expect(compareJpDate({ year: 2021, month: 3 }, { year: 2021, month: 3 })).toBe(0);
  });
});

describe('sortHistoryStable', () => {
  it('sorts chronologically', () => {
    const sorted = sortHistoryStable([hist('c', 2022, 3), hist('a', 2018, 4), hist('b', 2018, 12)]);
    expect(sorted.map((e) => e.id)).toEqual(['a', 'b', 'c']);
  });

  it('keeps insertion order for same month', () => {
    const sorted = sortHistoryStable([hist('x', 2020, 4), hist('y', 2020, 4), hist('z', 2020, 4)]);
    expect(sorted.map((e) => e.id)).toEqual(['x', 'y', 'z']);
  });

  it('does not mutate input', () => {
    const input = [hist('b', 2021, 1), hist('a', 2019, 1)];
    const copy = [...input];
    const sorted = sortHistoryStable(input);
    expect(input).toEqual(copy);
    expect(sorted).not.toBe(input);
  });
});

describe('sortLicensesStable', () => {
  it('sorts licenses chronologically without mutation', () => {
    const input = [lic('b', 2020, 6), lic('a', 2019, 6), lic('c', 2020, 6)];
    const sorted = sortLicensesStable(input);
    expect(sorted.map((e) => e.id)).toEqual(['a', 'b', 'c']);
    expect(input.map((e) => e.id)).toEqual(['b', 'a', 'c']);
  });
});

describe('padRows', () => {
  it('pads with null up to min', () => {
    expect(padRows([1, 2], 5)).toEqual([1, 2, null, null, null]);
  });

  it('never truncates', () => {
    expect(padRows([1, 2, 3], 2)).toEqual([1, 2, 3]);
  });

  it('returns a new array', () => {
    const input = [1];
    expect(padRows(input, 1)).not.toBe(input);
  });
});

describe('buildExportFilename', () => {
  it('zero pads month and day', () => {
    expect(buildExportFilename(new Date(2025, 0, 5))).toBe('rirekisho-20250105.json');
  });

  it('handles two-digit month and day', () => {
    expect(buildExportFilename(new Date(2025, 11, 31))).toBe('rirekisho-20251231.json');
  });
});

describe('formatCommute', () => {
  it('returns empty when both zero', () => {
    expect(formatCommute(0, 0)).toBe('');
  });

  it('formats hours and minutes', () => {
    expect(formatCommute(1, 30)).toBe('1時間30分');
    expect(formatCommute(0, 45)).toBe('45分');
    expect(formatCommute(1, 0)).toBe('1時間');
  });
});

describe('formatDependents', () => {
  it('formats spouse and count', () => {
    expect(formatDependents(true, 2)).toBe('配偶者あり・2人');
    expect(formatDependents(false, 0)).toBe('配偶者なし・0人');
  });
});
