export interface InsertionDecision {
  /** Value to write after the flow resolves (unchanged if confirm needed). */
  value: string;
  needsConfirm: boolean;
}

/**
 * Inserting the example must NEVER silently overwrite user text
 * (FEATURE §8: non-empty target → confirm first). Whitespace counts as empty.
 */
export function resolveInsertion(current: string, example: string): InsertionDecision {
  const needsConfirm = current.trim() !== '';
  return { value: needsConfirm ? current : example, needsConfirm };
}
