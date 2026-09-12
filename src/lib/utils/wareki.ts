export interface WarekiInfo {
  era: string;
  eraYear: number;
  label: string;
}

/**
 * Era start boundaries (year, month). Month-level precision by design —
 * day-level edge (1989-01-01..07) is approximated as 平成元年. PRD D-8.
 * Newest-first: first match wins.
 */
const ERAS = [
  { name: '令和', startYear: 2019, startMonth: 5 },
  { name: '平成', startYear: 1989, startMonth: 1 },
  { name: '昭和', startYear: 1926, startMonth: 12 },
  { name: '大正', startYear: 1912, startMonth: 7 },
  { name: '明治', startYear: 1868, startMonth: 9 },
] as const;

export function getWareki(date: { year: number; month: number }): WarekiInfo | null {
  for (const era of ERAS) {
    const afterStart =
      date.year > era.startYear ||
      (date.year === era.startYear && date.month >= era.startMonth);
    if (afterStart) {
      const eraYear = date.year - era.startYear + 1;
      return {
        era: era.name,
        eraYear,
        label: eraYear === 1 ? `${era.name}元年` : `${era.name}${eraYear}年`,
      };
    }
  }
  return null;
}

/** 「2019年5月1日」 — paper-style Gregorian rendering. */
export function formatJpFullDate(date: { year: number; month: number; day: number }): string {
  return `${date.year}年${date.month}月${date.day}日`;
}
