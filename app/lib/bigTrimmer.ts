// Removes invisible/zero-width Unicode characters and trims whitespace from a string
export function bigTrimmer(input: string | undefined): string {
  if (typeof input !== 'string') return '';
  // Remove invisible/zero-width Unicode characters and trim
  return input.replace(/[\u200B-\u200D\uFEFF\u2060-\u206F]/g, '').trim();
}
