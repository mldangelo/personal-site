import sharp from 'sharp';
import { beforeAll, describe, expect, it } from 'vitest';

import { CARD_SIZE, readCardColors } from '../og-inputs.mjs';
import { readoutTop, TOP_RULE } from '../og-layout.mjs';
import { assertCardGeometry, inkBands } from '../og-measure.mjs';

const READOUT_TOP = readoutTop(CARD_SIZE);
const LAST_ROW = CARD_SIZE.height - 1;

let paper = '';

beforeAll(async () => {
  // The card is painted with the light `@theme` tokens; a PNG has no theme.
  const colors = (await readCardColors(process.cwd())) as { paper: string };
  paper = colors.paper;
});

/** A card-shaped PNG with the given rows painted in ink and the rest paper. */
function cardFixture(inkRows: [number, number][]): Promise<Buffer> {
  const { width, height } = CARD_SIZE;
  const rows = (rowHeight: number, background: string) => ({
    create: { width, height: rowHeight, channels: 3 as const, background },
  });

  return sharp(rows(height, paper))
    .composite(
      inkRows.map(([start, end]) => ({
        input: rows(end - start + 1, '#000'),
        top: start,
        left: 0,
      })),
    )
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
