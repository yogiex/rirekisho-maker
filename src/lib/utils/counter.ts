/**
 * A-13: counts UTF-16 units — identical to Zod `max()` semantics, so the live
 * counter can never disagree with validation (emoji = 2, JP chars = 1).
 */
export function countChars(value: string): number {
  return value.length;
}

/** Destructive at ≥95% of the limit (DESIGN §6.2). 95% of 400 = 380. */
export function isNearLimit(value: string, max: number): boolean {
  return value.length >= Math.floor(max * 0.95);
}
