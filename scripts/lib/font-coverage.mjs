/**
 * Which characters a TrueType or OpenType font has glyphs for, read from its
 * `cmap` table. A character no card font covers is fetched by `next/og` from
 * Google Fonts at render time, an unpinned source that can change or fail, and
 * a failed fetch draws nothing without an error, so generation checks first.
 */
export function fontCoverage(data) {
  const font = Buffer.from(data);
  const tables = font.readUInt16BE(4);
  let cmap;
  for (let index = 0; index < tables; index += 1) {
    const record = 12 + index * 16;
    if (font.toString('ascii', record, record + 4) === 'cmap') {
      cmap = font.readUInt32BE(record + 8);
    }
  }
  if (cmap === undefined) return () => false;

  const ranges = [];
  const subtables = font.readUInt16BE(cmap + 2);
  for (let index = 0; index < subtables; index += 1) {
    const offset = cmap + font.readUInt32BE(cmap + 4 + index * 8 + 4);
    const format = font.readUInt16BE(offset);
    if (format === 4) {
      const segments = font.readUInt16BE(offset + 6) / 2;
      const ends = offset + 14;
      const starts = ends + segments * 2 + 2;
      for (let segment = 0; segment < segments; segment += 1) {
        const end = font.readUInt16BE(ends + segment * 2);
        if (end !== 0xffff) {
          ranges.push([font.readUInt16BE(starts + segment * 2), end]);
        }
      }
    } else if (format === 12) {
      const groups = font.readUInt32BE(offset + 12);
      for (let group = 0; group < groups; group += 1) {
        const record = offset + 16 + group * 12;
        ranges.push([font.readUInt32BE(record), font.readUInt32BE(record + 4)]);
      }
    }
  }

  return (codePoint) =>
    ranges.some(([start, end]) => codePoint >= start && codePoint <= end);
}

/** The characters in `text` that none of the fonts covers, each once. */
export function uncoveredCharacters(text, coverages) {
  return [...new Set(text)].filter(
    (character) =>
      /\S/u.test(character) &&
      !coverages.some((covers) => covers(character.codePointAt(0))),
  );
}
