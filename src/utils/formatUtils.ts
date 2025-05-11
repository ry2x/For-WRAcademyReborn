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

/**
 * Converts a date string from YYYYMMDD format to YYYY/MM/DD format
 * @param dateString - The date string in YYYYMMDD format
 * @returns Formatted date string in YYYY/MM/DD format or empty string if invalid
 */
export function formatDateWithSlash(dateString: string): string {
  if (!dateString || dateString.length !== 8) {
    return '';
  }

  try {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);

    return `${year}/${month}/${day}`;
  } catch {
    return '';
  }
}
