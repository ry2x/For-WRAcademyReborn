const hiraganaRegex = /[\u3041-\u3096]/g;

/**
 * Converts hiragana characters in a string to katakana
 * @param t - The string containing hiragana characters
 * @returns The string with all hiragana characters converted to katakana
 * @example
 * toKatakana("ひらがな") // returns "ヒラガナ"
 */
export function toKatakana(t: string): string {
  return t.replace(hiraganaRegex, (x) => String.fromCharCode(x.charCodeAt(0) + 0x60));
}
