const hiraganaRegex = /[\u3041-\u3096]/g;

export function toKatakana(t: string): string {
  return t.replace(hiraganaRegex, (x) => String.fromCharCode(x.charCodeAt(0) + 0x60));
}
