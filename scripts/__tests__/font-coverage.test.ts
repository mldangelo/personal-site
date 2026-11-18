import { describe, expect, it } from 'vitest';

import { fontCoverage, uncoveredCharacters } from '../lib/font-coverage.mjs';

/** A font file holding only a `cmap` table with the given subtable. */
function fontWith(subtable: Buffer): Buffer {
  const cmap = Buffer.concat([
    Buffer.from([0, 0, 0, 1, 0, 3, 0, 10, 0, 0, 0, 12]),
    subtable,
  ]);
  const directory = Buffer.alloc(28);
  directory.writeUInt16BE(1, 4);
  directory.write('cmap', 12, 'ascii');
  directory.writeUInt32BE(28, 20);
  directory.writeUInt32BE(cmap.length, 24);
  return Buffer.concat([directory, cmap]);
}

/** Format 4: one segment for A–Z, then the closing 0xFFFF segment. */
function basicLatin(): Buffer {
  const words = [
    4, 0, 0, 4, 0, 0, 0, 0x5a, 0xffff, 0, 0x41, 0xffff, 0, 1, 0, 0,
  ];
  const table = Buffer.alloc(words.length * 2);
  words.forEach((word, index) => table.writeUInt16BE(word, index * 2));
  return table;
}

/** Format 12: one group covering 𠮷 (U+20BB7). */
function supplementary(): Buffer {
  const table = Buffer.alloc(28);
  table.writeUInt16BE(12, 0);
  table.writeUInt32BE(1, 12);
  table.writeUInt32BE(0x20bb7, 16);
  table.writeUInt32BE(0x20bb7, 20);
  table.writeUInt32BE(1, 24);
  return table;
}

/**
 * Format 4 with one segment, a–c, mapped through `glyphIdArray`, where b is a
 * hole (glyph 0), and one segment, X, whose delta maps it to glyph 0.
 */
function withHoles(): Buffer {
  // format, length, language, segCountX2 (3 segments), search fields
  const header = [4, 0, 0, 6, 0, 0, 0];
  const ends = [0x63, 0x58, 0xffff];
  const starts = [0x61, 0x58, 0xffff];
  const deltas = [0, 0x10000 - 0x58, 1];
  // a–c read the glyph array, which follows the offsets: 3 words, then 2.
  const rangeOffsets = [6, 0, 0];
  const glyphs = [7, 0, 9];
  const words = [
    ...header,
    ...ends,
    0,
    ...starts,
    ...deltas,
    ...rangeOffsets,
    ...glyphs,
  ];
  const table = Buffer.alloc(words.length * 2);
  words.forEach((word, index) => table.writeUInt16BE(word & 0xffff, index * 2));
  return table;
}

describe('font coverage', () => {
  // A code point inside a range can still map to `.notdef`, which draws
  // nothing.
  it('requires a real glyph, not just a code point inside a range', () => {
    const covers = fontCoverage(fontWith(withHoles()));

    expect([0x61, 0x62, 0x63, 0x58].map(covers)).toEqual([
      true,
      false,
      true,
      false,
    ]);
  });

  const latin = fontCoverage(fontWith(basicLatin()));
  const rare = fontCoverage(fontWith(supplementary()));

  it('reads the characters a font maps, in both table formats', () => {
    expect([latin(0x41), latin(0x5a), latin(0x61)]).toEqual([
      true,
      true,
      false,
    ]);
    expect([rare(0x20bb7), rare(0x41)]).toEqual([true, false]);
  });

  // next/og fetches an unpinned font for these, or draws nothing.
  it('names each character no font covers, once, ignoring spaces', () => {
    expect(uncoveredCharacters('AB 出典 A 出', [latin, rare])).toEqual([
      '出',
      '典',
    ]);
    expect(uncoveredCharacters('A 𠮷', [latin, rare])).toEqual([]);
  });
});
