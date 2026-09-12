import type { LicenseEntry } from '@/lib/schema/rirekisho-schema';

export function createEmptyLicenseEntry(today: Date): LicenseEntry {
  return {
    id: crypto.randomUUID(),
    date: { year: today.getFullYear(), month: today.getMonth() + 1 },
    name: '',
    issuer: '',
  };
}

export function hasLicenseContent(entry: { name: string; issuer?: string }): boolean {
  return entry.name.trim() !== '' || (entry.issuer?.trim() ?? '') !== '';
}
