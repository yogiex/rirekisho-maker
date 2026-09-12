import type { HistoryEntry, JpDate, LicenseEntry } from '@/lib/schema/rirekisho-schema';

export function compareJpDate(a: JpDate, b: JpDate): number {
  if (a.year !== b.year) return a.year - b.year;
  return a.month - b.month;
}

export function sortHistoryStable(history: HistoryEntry[]): HistoryEntry[] {
  return [...history].sort((a, b) => compareJpDate(a.date, b.date));
}

export function sortLicensesStable(licenses: LicenseEntry[]): LicenseEntry[] {
  return [...licenses].sort((a, b) => compareJpDate(a.date, b.date));
}

export function padRows<T>(rows: T[], min: number): (T | null)[] {
  const out: (T | null)[] = [...rows];
  while (out.length < min) out.push(null);
  return out;
}

export function buildExportFilename(today: Date): string {
  const y = String(today.getFullYear()).padStart(4, '0');
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  return `rirekisho-${y}${m}${d}.json`;
}

export function formatCommute(hours: number, minutes: number): string {
  if (hours === 0 && minutes === 0) return '';
  const h = hours > 0 ? `${hours}時間` : '';
  const m = minutes > 0 ? `${minutes}分` : '';
  return `${h}${m}`;
}

export function formatDependents(spouse: boolean, dependents: number): string {
  return `${spouse ? '配偶者あり' : '配偶者なし'}・${dependents}人`;
}
