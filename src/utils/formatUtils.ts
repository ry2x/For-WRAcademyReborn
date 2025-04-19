/**
 * Determines the floating trend icon based on the given rate
 * @param floatRate - The floating rate as a string or null
 * @returns A string representing the trend icon or an empty string if no trend
 */
export function getIsFloating(floatRate: string | null): string {
  if (!floatRate) return '';

  const float = parseFloat(floatRate);

  if (float > 15) return '⏫';
  if (float < -15) return '⏬';
  if (float > 0) return '🔼';
  if (float < 0) return '🔽';

  return '';
}
