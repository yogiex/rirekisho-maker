import { describe, expect, it } from 'vitest';
import { createDefaultDraft, DRAFT_VERSION, type RirekishoData } from '@/lib/schema/rirekisho-schema';
import { importDraftFile } from '@/lib/storage/import';

function validDraft(): RirekishoData {
  return {
    ...createDefaultDraft(new Date()),
    furigana: 'さんとそ',
    fullName: 'ブディ・サントソ',
    dateOfBirth: { year: 2000, month: 1, day: 15 },
    postalCode: '123-4567',
    prefecture: '東京都',
    address: '新宿区1-1',
    phone: '090-1234-5678',
    email: 'a@b.co',
  };
}

function envelopeText(data: unknown, version: number = DRAFT_VERSION): string {
  return JSON.stringify({ version, savedAt: new Date().toISOString(), data });
}

function makeFile(content: string | ArrayBuffer): File {
  return new File([content], 'draft.json', { type: 'application/json' });
}

function injectKey(json: string, rawKeyValue: string): string {
  const marker = '"data":{';
  const idx = json.indexOf(marker);
  return json.slice(0, idx + marker.length) + rawKeyValue + ',' + json.slice(idx + marker.length);
}

describe('importDraftFile', () => {
  it('accepts a valid draft', async () => {
    const r = await importDraftFile(makeFile(envelopeText(validDraft())));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.fullName).toBe('ブディ・サントソ');
  });

  it('rejects files larger than 2MB', async () => {
    const r = await importDraftFile(makeFile(new ArrayBuffer(3 * 1024 * 1024)));
    expect(r).toEqual({ ok: false, reason: 'FILE_TOO_LARGE' });
  });

  it('rejects malformed JSON', async () => {
    const r = await importDraftFile(makeFile('{"version":1,'));
    expect(r).toEqual({ ok: false, reason: 'INVALID_JSON' });
  });

  it('rejects non-envelope JSON', async () => {
    const r = await importDraftFile(makeFile(JSON.stringify(validDraft())));
    expect(r).toEqual({ ok: false, reason: 'INVALID_JSON' });
  });

  it('rejects version mismatch before field validation', async () => {
    const r = await importDraftFile(makeFile(envelopeText({ garbage: true }, 999)));
    expect(r).toEqual({ ok: false, reason: 'VERSION_MISMATCH' });
  });

  it('rejects katakana furigana', async () => {
    const r = await importDraftFile(makeFile(envelopeText({ ...validDraft(), furigana: 'サントソ' })));
    expect(r).toEqual({ ok: false, reason: 'INVALID_FIELDS' });
  });

  it('strips __proto__ pollution payload', async () => {
    const text = injectKey(envelopeText(validDraft()), '"__proto__":{"isAdmin":true}');
    expect(text).toContain('"__proto__"');
    const r = await importDraftFile(makeFile(text));
    expect(r.ok).toBe(true);
    expect(({} as { isAdmin?: unknown }).isAdmin).toBeUndefined();
    if (r.ok) {
      expect(Object.prototype.hasOwnProperty.call(r.data, 'isAdmin')).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(r.data, '__proto__')).toBe(false);
      expect((r.data as { isAdmin?: unknown }).isAdmin).toBeUndefined();
    }
  });

  it('strips constructor.prototype pollution payload', async () => {
    const text = injectKey(envelopeText(validDraft()), '"constructor":{"prototype":{"polluted":1}}');
    const r = await importDraftFile(makeFile(text));
    expect(r.ok).toBe(true);
    expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
    if (r.ok) {
      expect(Object.prototype.hasOwnProperty.call(r.data, 'polluted')).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(r.data, 'constructor')).toBe(false);
      expect((r.data as { polluted?: unknown }).polluted).toBeUndefined();
    }
  });
});
