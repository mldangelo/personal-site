/**
 * The monogram, derived from the profile name rather than typed in, so a fork
 * that changes the name gets its own initials: the first grapheme of each of
 * the first two words, never a first UTF-16 unit, which is half of a
 * character outside the Basic Multilingual Plane, such as 𠮷.
 */
export function monogramFor(name) {
  const graphemes = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
  return name
    .split(/[\s'’-]+/)
    .filter(Boolean)
    .map((word) => [...graphemes.segment(word)][0].segment.toUpperCase())
    .slice(0, 2)
    .join('');
}
