/**
 * Full-width (全角) ASCII variants + full-width space → half-width.
 * IME users type '１２３－４５６７'; validators and the paper expect ASCII.
 * Must run on BLUR only in UI (FEATURE §7) — but schema preprocesses too,
 * so validation can never be bypassed by a paste-without-blur.
 */
export function normalizeWidth(input: string): string {
  return input.replace(/[\uFF01-\uFF5E\u3000]/g, (ch) =>
    ch === '\u3000' ? ' ' : String.fromCharCode(ch.charCodeAt(0) - 0xfee0),
  );
}

export function toDigits(input: string): string {
  return normalizeWidth(input).replace(/\D/g, '');
}

/** '１２３４５６７' → '123-4567'. Pass-through unless exactly 7 digits. */
export function formatPostal(input: string): string {
  const digits = toDigits(input);
  return digits.length === 7 ? `${digits.slice(0, 3)}-${digits.slice(3)}` : input;
}
