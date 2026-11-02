import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { beforeAll, describe, expect, it } from 'vitest';

import { CARD_SIZE, readCardColors } from '../og-inputs.mjs';
import {
  READOUT_HEIGHT,
  READOUT_RULE,
  readoutTop,
  TOP_RULE,
} from '../og-layout.mjs';
import { assertCardGeometry, inkBands, parseColor } from '../og-measure.mjs';

const ROOT = process.cwd();
const CARD_DIR = join(ROOT, 'public', 'og', 'writing');
const CARDS = [
  join(ROOT, 'public', 'og.png'),
  ...readdirSync(CARD_DIR)
    .filter((name) => name.endsWith('.png'))
    .map((name) => join(CARD_DIR, name)),
];
const READOUT_TOP = readoutTop(CARD_SIZE);
const LAST_ROW = CARD_SIZE.height - 1;

let paper = '';

beforeAll(async () => {
  // The card is painted with the light `@theme` tokens; a PNG has no theme.
  const colors = (await readCardColors(ROOT)) as { paper: string };
  paper = colors.paper;
});

/** A card-shaped PNG with the given rows painted in ink and the rest paper. */
function cardFixture(inkRows: [number, number][]): Promise<Buffer> {
  const { width, height } = CARD_SIZE;
  const color = Buffer.from(parseColor(paper));
  const ink = Buffer.alloc(3);
  const raw = Buffer.alloc(width * height * 3);

  for (let y = 0; y < height; y += 1) {
    const inked = inkRows.some(([start, end]) => y >= start && y <= end);
    for (let x = 0; x < width; x += 1) {
      (inked ? ink : color).copy(raw, (y * width + x) * 3);
    }
  }

  return sharp(raw, { raw: { width, height, channels: 3 } })
    .png()
    .toBuffer();
}

const fits = async (inkRows: [number, number][]) =>
  assertCardGeometry(await cardFixture(inkRows), {
    size: CARD_SIZE,
    paper,
    topRule: TOP_RULE,
    readoutTop: READOUT_TOP,
  });

/**
 * These constants describe where satori actually puts ink, and the whole fit
 * calculation is measured against them.
 */
describe('committed card geometry', () => {
  it.each(CARDS)('matches the budgeted rows in %s', async (path) => {
    const bands = await inkBands(readFileSync(path), paper);
    const readout = bands[bands.length - 1];
    const copy = bands[bands.length - 2];

    expect(bands[0]).toEqual([0, TOP_RULE - 1]);
    expect(readout).toEqual([READOUT_TOP, LAST_ROW]);
    // The readout row, its own rule included, is exactly what was budgeted.
    expect(READOUT_HEIGHT + READOUT_RULE).toBe(CARD_SIZE.height - readout[0]);
    expect(copy[1]).toBeLessThan(READOUT_TOP);
  });
});

describe('rendered card geometry', () => {
  it('accepts a card whose copy stops above the readout', async () => {
    await expect(
      fits([
        [0, TOP_RULE - 1],
        [90, 400],
        [READOUT_TOP, LAST_ROW],
      ]),
    ).resolves.toBeDefined();
  });

  it.each<[string, [number, number][], RegExp]>([
    // The failure satori does not report: the title's last line and the readout
    // rule become one unbroken band of ink.
    [
      'copy that has run into the readout',
      [
        [0, TOP_RULE - 1],
        [90, LAST_ROW],
      ],
      /Copy has run into the readout/,
    ],
    [
      'a readout pushed down the card',
      [
        [0, TOP_RULE - 1],
        [90, 480],
        [559, LAST_ROW],
      ],
      /readout should be the last band of ink/,
    ],
    [
      'a card that does not open with its rule',
      [
        [2, TOP_RULE - 1],
        [90, 400],
        [READOUT_TOP, LAST_ROW],
      ],
      /does not open with its/,
    ],
  ])('rejects %s', async (_name, inkRows, expected) => {
    await expect(fits(inkRows)).rejects.toThrow(expected);
  });

  it('refuses to measure non-PNG input', async () => {
    await expect(
      inkBands(Buffer.from('not a png at all'), paper),
    ).rejects.toThrow(/not a PNG/);
  });
});

describe('card colours', () => {
  it.each([
    ['#f2f1ec', [242, 241, 236]],
    ['#abc', [170, 187, 204]],
    ['rgb(35, 39, 46)', [35, 39, 46]],
    ['rgba(35, 39, 46, 0.14)', [35, 39, 46]],
  ])('reads %s off the token stylesheet', (value, expected) => {
    expect(parseColor(value)).toEqual(expected);
  });
});
