import { z } from 'zod';
import { DRAFT_VERSION, rirekishoSchema, type RirekishoData } from '@/lib/schema/rirekisho-schema';

export const MAX_IMPORT_BYTES = 2 * 1024 * 1024;

export type ImportFailureReason =
  | 'FILE_TOO_LARGE'
  | 'INVALID_JSON'
  | 'VERSION_MISMATCH'
  | 'INVALID_FIELDS';

export type ImportResult =
  | { ok: true; data: RirekishoData }
  | { ok: false; reason: ImportFailureReason };

const looseEnvelopeSchema = z.object({
  version: z.number(),
  savedAt: z.string(),
  data: z.unknown(),
});

export async function importDraftFile(file: File): Promise<ImportResult> {
  if (file.size > MAX_IMPORT_BYTES) return { ok: false, reason: 'FILE_TOO_LARGE' };

  let raw: unknown;
  try {
    raw = JSON.parse(await file.text());
  } catch {
    return { ok: false, reason: 'INVALID_JSON' };
  }

  const envelope = looseEnvelopeSchema.safeParse(raw);
  if (!envelope.success) return { ok: false, reason: 'INVALID_JSON' };
  if (envelope.data.version !== DRAFT_VERSION) return { ok: false, reason: 'VERSION_MISMATCH' };

  const parsed = rirekishoSchema.safeParse(envelope.data.data);
  if (!parsed.success) return { ok: false, reason: 'INVALID_FIELDS' };

  return { ok: true, data: parsed.data };
}
