/**
 * Scroll to + focus the first invalid field. Select-based fields don't carry
 * `name` on their trigger, so FormItems that wrap them add data-field.
 */
export function focusFirstError(error: { issues: { path: (string | number)[] }[] }): void {
  const name = error.issues[0]?.path.join('.') ?? '';
  if (!name) return;
  const el =
    document.querySelector<HTMLElement>(`[name="${name}"]`) ??
    document.querySelector<HTMLElement>(`[data-field="${name}"]`);
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el?.focus({ preventScroll: true });
}
