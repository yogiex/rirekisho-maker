import type { RirekishoData } from '@/lib/schema/rirekisho-schema';

export function isDraftEmpty(d: RirekishoData): boolean {
  return (
    !d.photo &&
    d.furigana === '' &&
    d.fullName === '' &&
    d.address === '' &&
    d.history.length === 0 &&
    d.licenses.length === 0
  );
}
