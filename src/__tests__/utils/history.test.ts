import { describe, expect, it } from 'vitest';
import {
  ACTION_OPTIONS, createEmptyHistoryEntry, defaultActionFor,
  findOutOfOrderRows, hasRowContent,
} from '@/lib/utils/history';

const TODAY = new Date(2025, 5, 10);

describe('createEmptyHistoryEntry', () => {
  it('defaults action by category and dates to today (y/m)', () => {
    const e = createEmptyHistoryEntry('work', TODAY);
    expect(e.action).toBe('入社');
    expect(e.date).toEqual({ year: 2025, month: 6 });
    expect(e.name).toBe('');
  });

  it('generates unique stable ids', () => {
    const a = createEmptyHistoryEntry('education', TODAY);
    const b = createEmptyHistoryEntry('education', TODAY);
    expect(a.id).not.toBe(b.id);
  });

  it('education defaults to 入学', () => {
    const e = createEmptyHistoryEntry('education', TODAY);
    expect(e.action).toBe('入学');
  });
});

describe('findOutOfOrderRows', () => {
  const row = (year: number, month: number) => ({ date: { year, month } });

  it('accepts ascending chronology', () =>
    expect(findOutOfOrderRows([row(2015, 4), row(2019, 3), row(2020, 1)])).toEqual([]));

  it('treats same year+month as NOT inverted', () =>
    expect(findOutOfOrderRows([row(2020, 4), row(2020, 4)])).toEqual([]));

  it('flags a row earlier than its predecessor (1-based)', () =>
    expect(findOutOfOrderRows([row(2020, 1), row(2019, 1)])).toEqual([2]));

  it('flags multiple inversions', () =>
    expect(findOutOfOrderRows([row(2020, 1), row(2019, 1), row(2021, 1), row(2020, 1)])).toEqual([2, 4]));

  it('handles empty and single-row lists', () => {
    expect(findOutOfOrderRows([])).toEqual([]);
    expect(findOutOfOrderRows([row(2020, 1)])).toEqual([]);
  });
});

describe('hasRowContent', () => {
  it('false for whitespace-only row', () =>
    expect(hasRowContent({ name: '  ', nameFurigana: '', detail: '' })).toBe(false));

  it('true when name present', () =>
    expect(hasRowContent({ name: '日本大学' })).toBe(true));

  it('true when only furigana present', () =>
    expect(hasRowContent({ name: '', nameFurigana: 'にほん' })).toBe(true));

  it('true when only detail present', () =>
    expect(hasRowContent({ name: '', detail: '文学部' })).toBe(true));

  it('false for all empty', () =>
    expect(hasRowContent({ name: '', nameFurigana: '', detail: '' })).toBe(false));
});

describe('ACTION_OPTIONS / defaultActionFor', () => {
  it('options are disjoint between categories', () => {
    const edu = ACTION_OPTIONS.education as readonly string[];
    const work = ACTION_OPTIONS.work as readonly string[];
    expect(edu.some((a) => work.includes(a))).toBe(false);
  });

  it('defaults: education → 入学, work → 入社', () => {
    expect(defaultActionFor('education')).toBe('入学');
    expect(defaultActionFor('work')).toBe('入社');
  });
});
