/**
 * Derives the roll outcome from hope and fear dice results
 * @param hopeResult - The result of the hope die (1-12)
 * @param fearResult - The result of the fear die (1-12)
 * @returns The outcome string: "Critical", "with Hope", or "with Fear"
 */
export function getDiceRollOutcome(
  hopeResult: number,
  fearResult: number,
): string {
  if (hopeResult === fearResult) {
    return "Critical";
  } else if (hopeResult > fearResult) {
    return "with Hope";
  } else {
    return "with Fear";
  }
}
