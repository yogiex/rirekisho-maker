export function formatPostal(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}`;
}

export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}
