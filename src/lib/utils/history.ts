import type { HistoryAction, HistoryCategory, JpDate } from '@/lib/schema/rirekisho-schema';

/** Action options per category — drives the row's action Select. */
export const ACTION_OPTIONS: Record<HistoryCategory, readonly HistoryAction[]> = {
  education: ['入学', '転学', '退学', '卒業'],
  work: ['入社', '退社', '異動'],
} as const;

/** Default action when adding a row or after a category switch. */
export function defaultActionFor(category: HistoryCategory): HistoryAction {
  return category === 'education' ? '入学' : '入社';
}

/**
 * Factory for new rows. `today` injected for determinism (RULES §9).
 * Generates its own stable `id` (schema requires it; RHF's field.id is for keys only).
 */
export function createEmptyHistoryEntry(
  category: HistoryCategory,
  today: Date,
): {
  id: string;
  date: JpDate;
  category: HistoryCategory;
  name: string;
  nameFurigana: string;
  action: HistoryAction;
  detail: string;
} {
  return {
    id: crypto.randomUUID(),
    date: { year: today.getFullYear(), month: today.getMonth() + 1 },
    category,
    name: '',
    nameFurigana: '',
    action: defaultActionFor(category),
    detail: '',
  };
}

/**
 * Row numbers (1-based, for user display) whose date comes BEFORE the
 * previous row's date. Month-level comparison; same month = not inverted.
 * Feature §8 Step 2: warning is NON-blocking.
 */
export function findOutOfOrderRows(
  history: ReadonlyArray<{ date: JpDate }>,
): number[] {
  const rows: number[] = [];
  for (let i = 1; i < history.length; i += 1) {
    const prev = history[i - 1];
    const curr = history[i];
    if (!prev || !curr) continue;
    const inverted =
      curr.date.year < prev.date.year ||
      (curr.date.year === prev.date.year && curr.date.month < prev.date.month);
    if (inverted) rows.push(i + 1);
  }
  return rows;
}

/** A row with any content requires delete confirmation (DESIGN §6.4). */
export function hasRowContent(entry: {
  name: string;
  nameFurigana?: string;
  detail?: string;
}): boolean {
  return (
    entry.name.trim() !== '' ||
    (entry.nameFurigana?.trim() ?? '') !== '' ||
    (entry.detail?.trim() ?? '') !== ''
  );
}
