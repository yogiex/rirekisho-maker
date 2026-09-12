const MIN_YEAR = 1900;

/** Descending year list: today → 1900 (matches schema bounds). */
export function buildYearOptions(today: Date): number[] {
  const end = today.getFullYear();
  return Array.from({ length: end - MIN_YEAR + 1 }, (_, i) => end - i);
}

export const YEAR_OPTIONS: number[] = buildYearOptions(new Date());
export const MONTH_OPTIONS: number[] = Array.from({ length: 12 }, (_, i) => i + 1);
export const DAY_OPTIONS: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
