export interface JpEra {
  name: string;
  startYear: number;
  startMonth: number;
}

const ERAS: JpEra[] = [
  { name: '令和', startYear: 2019, startMonth: 5 },
  { name: '平成', startYear: 1989, startMonth: 1 },
  { name: '昭和', startYear: 1926, startMonth: 12 },
  { name: '大正', startYear: 1912, startMonth: 7 },
  { name: '明治', startYear: 1868, startMonth: 9 },
];

export function toWareki(year: number, month: number): string {
  for (const era of ERAS) {
    if (year > era.startYear || (year === era.startYear && month >= era.startMonth)) {
      const eraYear = year - era.startYear + 1;
      return `${era.name}${eraYear === 1 ? '元' : eraYear}年`;
    }
  }
  return `${year}年`;
}
