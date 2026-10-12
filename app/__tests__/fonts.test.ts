import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { brotliDecompressSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';

/**
 * Which variation axes the font files in `app/fonts.ts` really carry.
 *
 * The site's type depends on two things a file name cannot promise. The
 * weight tokens only render as distinct weights while every family is
 * variable, and the homepage name and the page titles are only drawn in
 * Inter's display cut while its file carries the optical-size axis. Swapping
 * that file for its weight-only sibling changes no markup and fails no build:
 * the name just goes back to being the 14px text cut scaled up.
 *
 * `next/font/local` is a build-time transform, so the source is read as text
 * and the files it names are opened directly.
 */

const APP = join(process.cwd(), 'app');
const SOURCE = readFileSync(join(APP, 'fonts.ts'), 'utf8');

interface Instance {
  name: string;
  file: string;
  weight: [number, number];
}

const INSTANCES: Instance[] = [
  ...SOURCE.matchAll(/export const (\w+) = localFont\(\{([\s\S]*?)\}\);/g),
].map(([, name, body]) => {
  const src = /src:\s*'([^']+)'/.exec(body)?.[1];
  const weight = /weight:\s*'(\d+) (\d+)'/.exec(body);
  if (!src || !weight) {
    throw new Error(`Cannot read src and weight of ${name} in app/fonts.ts`);
  }

  return {
    name,
    file: join(APP, src),
    weight: [Number(weight[1]), Number(weight[2])],
  };
});

/** Positions in WOFF2's list of known tags. */
const FVAR = 47;
const GLYF = 10;
const LOCA = 11;
const HMTX = 3;

/**
 * Variation axes of a WOFF2 file, as `tag -> [min, max]`, read from `fvar`.
 * WOFF2 keeps all of a font's tables in one Brotli stream behind a directory
 * of variable-length entries, so the directory is walked to find the offset.
 */
function variationAxes(file: string): Record<string, [number, number]> {
  const data = readFileSync(file);
  if (data.toString('latin1', 0, 4) !== 'wOF2') {
    throw new Error(`${file} is not a WOFF2 file`);
  }

  const entryCount = data.readUInt16BE(12);
  const compressedSize = data.readUInt32BE(20);
  let cursor = 48;

  const base128 = (): number => {
    let value = 0;
    for (let index = 0; index < 5; index += 1) {
      const byte = data[cursor];
      cursor += 1;
      value = value * 128 + (byte % 128);
      if (byte < 128) return value;
    }
    throw new Error(`${file} has a malformed directory`);
  };

  let offset = 0;
  let fvar: { offset: number; length: number } | undefined;

  for (let entry = 0; entry < entryCount; entry += 1) {
    const flags = data[cursor];
    cursor += 1;
    const tag = flags % 64;
    const version = Math.floor(flags / 64);
    if (tag === 63) cursor += 4;

    const length = base128();
    // `glyf` and `loca` are stored re-encoded at version 0, `hmtx` at
    // version 1, and only a re-encoded entry carries a second length.
    const reencoded =
      tag === GLYF || tag === LOCA
        ? version === 0
        : tag === HMTX && version === 1;
    const stored = reencoded ? base128() : length;

    if (tag === FVAR) fvar = { offset, length };
    offset += stored;
  }

  if (!fvar) return {};

  const tables = brotliDecompressSync(
    data.subarray(cursor, cursor + compressedSize),
  );
  const view = tables.subarray(fvar.offset, fvar.offset + fvar.length);
  const axesOffset = view.readUInt16BE(4);
  const axisCount = view.readUInt16BE(8);
  const axisSize = view.readUInt16BE(10);
  const axes: Record<string, [number, number]> = {};

  for (let axis = 0; axis < axisCount; axis += 1) {
    const at = axesOffset + axis * axisSize;
    // Fixed 16.16: minimum, default, maximum.
    axes[view.toString('latin1', at, at + 4)] = [
      view.readInt32BE(at + 4) / 65536,
      view.readInt32BE(at + 12) / 65536,
    ];
  }

  return axes;
}

describe('font files', () => {
  it('finds every instance in app/fonts.ts', () => {
    expect(INSTANCES.map(({ name }) => name)).toEqual([
      'inter',
      'newsreader',
      'jetbrainsMono',
      'newsreaderItalic',
    ]);
  });

  it.each(INSTANCES)(
    '$name is variable across the weight range it declares',
    ({ file, weight }) => {
      expect(variationAxes(file).wght).toEqual(weight);
    },
  );

  // 14 is the text cut the site always had; 32 and up is the display cut.
  it('loads Inter with its optical-size axis, so display sizes get the display cut', () => {
    const inter = INSTANCES.find(({ name }) => name === 'inter');

    expect(inter && variationAxes(inter.file).opsz).toEqual([14, 32]);
  });
});
