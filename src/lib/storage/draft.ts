import { z } from 'zod';
import { DRAFT_VERSION, rirekishoSchema, type RirekishoData } from '@/lib/schema/rirekisho-schema';

const DRAFT_KEY = 'rirekisho-draft';
const BACKUP_KEY = 'rirekisho-draft-backup';

export const envelopeSchema = z.object({
  version: z.number(),
  savedAt: z.string(),
  data: rirekishoSchema,
  lastStep: z.number().int().min(1).max(5).optional(),
});

export interface LoadedDraft {
  data: RirekishoData;
  savedAt: string;
  lastStep: number;
}

export function isStorageAvailable(): boolean {
  try {
    localStorage.setItem('__rk_probe', '1');
    localStorage.removeItem('__rk_probe');
    return true;
  } catch {
    return false;
  }
}

/** Invalid or version-mismatched drafts are backed up, never silently destroyed. */
export function loadDraft(): LoadedDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const result = envelopeSchema.safeParse(JSON.parse(raw));
    if (!result.success || result.data.version !== DRAFT_VERSION) {
      localStorage.setItem(BACKUP_KEY, raw);
      return null;
    }
    return {
      data: result.data.data,
      savedAt: result.data.savedAt,
      lastStep: result.data.lastStep ?? 1,
    };
  } catch {
    return null;
  }
}

export type SaveError = 'QUOTA_EXCEEDED';

export function saveDraft(data: RirekishoData, lastStep: number): void | SaveError {
  try {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ version: DRAFT_VERSION, savedAt: new Date().toISOString(), data, lastStep }),
    );
  } catch {
    return 'QUOTA_EXCEEDED';
  }
}

export function updateLastStep(lastStep: number): void {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    const parsed = envelopeSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...parsed.data, lastStep }));
  } catch {
    return;
  }
}

export function exportDraftToJson(data: RirekishoData): string {
  return JSON.stringify({ version: DRAFT_VERSION, savedAt: new Date().toISOString(), data }, null, 2);
}

/** SEC-07: remove every trace of app data. */
export function clearAllDraftData(): void {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key?.startsWith('rirekisho-')) keys.push(key);
  }
  keys.forEach((key) => localStorage.removeItem(key));
}
