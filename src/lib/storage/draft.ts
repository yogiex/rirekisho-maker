import { rirekishoSchema, type RirekishoFormData } from '@/lib/schema/rirekisho-schema';
import { DRAFT_VERSION, type RirekishoData } from '@/types/rirekisho';

export interface DraftPayload {
  version: number;
  savedAt: string;
  data: RirekishoFormData;
}

const STORAGE_KEY = 'rirekisho-draft';
const BACKUP_KEY = 'rirekisho-draft-backup';

export function loadDraft(): DraftPayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DraftPayload;
    if (parsed.version !== DRAFT_VERSION) {
      localStorage.setItem(BACKUP_KEY, raw);
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    const result = rirekishoSchema.safeParse(parsed.data);
    if (!result.success) {
      localStorage.setItem(BACKUP_KEY, raw);
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return { ...parsed, data: result.data };
  } catch {
    return null;
  }
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

export function saveDraftDebounced(data: RirekishoFormData, callback?: () => void): void {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      saveDraft(data);
      callback?.();
    } catch {
      // quota exceeded or other error
    }
  }, 800);
}

export function saveDraft(data: RirekishoFormData): void {
  if (typeof window === 'undefined') return;
  try {
    const payload: DraftPayload = {
      version: DRAFT_VERSION,
      savedAt: new Date().toISOString(),
      data,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      throw new Error('QUOTA_EXCEEDED');
    }
    throw e;
  }
}

export function clearDraft(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(BACKUP_KEY);
}

export function exportDraft(data: RirekishoData): Blob {
  const payload = {
    version: DRAFT_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  };
  return new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
}

export async function importDraft(file: File): Promise<RirekishoFormData> {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const result = rirekishoSchema.safeParse(parsed.data);
  if (!result.success) {
    throw new Error(`Invalid data: ${result.error.issues.map(i => i.message).join(', ')}`);
  }
  return result.data;
}
