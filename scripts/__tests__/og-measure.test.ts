import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { deflateSync } from 'node:zlib';
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
const CARDS = [
  join(ROOT, 'public', 'og.png'),
  ...[
    'claude-code-outage',
    'eurostar-chatbot-analysis',
    'shipping-with-claude-code',
  ].map((slug) => join(ROOT, 'public', 'og', 'writing', `${slug}.png`)),
];

let paper = '';

beforeAll(async () => {
  // The card is painted with the light `@theme` tokens; a PNG has no theme.
  const colors = (await readCardColors(ROOT)) as { paper: string };
  paper = colors.paper;
});

function crc32(bytes: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const header = Buffer.alloc(8);
  header.writeUInt32BE(data.length, 0);
  header.write(type, 4, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([header.subarray(4), data])), 0);
  return Buffer.concat([header, data, crc]);
}

/** A card-shaped PNG with the given rows painted in ink and the rest paper. */
function cardFixture(inkRows: [number, number][]): Buffer {
  const { width, height } = CARD_SIZE;
  const [red, green, blue] = parseColor(paper);
  const raw = Buffer.alloc(height * (width * 4 + 1));

  for (let y = 0; y < height; y += 1) {
    const inked = inkRows.some(([start, end]) => y >= start && y <= end);
    for (let x = 0; x < width; x += 1) {
      const offset = y * (width * 4 + 1) + 1 + x * 4;
      raw[offset] = inked ? 0 : red;
      raw[offset + 1] = inked ? 0 : green;
      raw[offset + 2] = inked ? 0 : blue;
      raw[offset + 3] = 255;
    }
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const fits = (image: Buffer) =>
  assertCardGeometry(image, {
    size: CARD_SIZE,
    paper,
    topRule: TOP_RULE,
    readoutTop: readoutTop(CARD_SIZE),
  });

/**
 * These constants are not free parameters: they describe where satori actually
 * puts ink, and the whole fit calculation is measured against them. `122` was
 * wrong by 22px for long enough to spend half the slack the layout thought it
 * had, and nothing failed, because nothing looked at a card.
 */
describe('committed card geometry', () => {
  it.each(CARDS)('matches the budgeted rows in %s', (path) => {
    const bands = inkBands(readFileSync(path), paper);
    const readout = bands[bands.length - 1];

    expect(bands[0]).toEqual([0, TOP_RULE - 1]);
    expect(readout).toEqual([readoutTop(CARD_SIZE), CARD_SIZE.height - 1]);
    // The readout row, its own rule included, is exactly what was budgeted.
    expect(READOUT_HEIGHT + READOUT_RULE).toBe(CARD_SIZE.height - readout[0]);
  });

  it('leaves the copy clear of the readout on every committed card', () => {
    for (const path of CARDS) {
      const bands = inkBands(readFileSync(path), paper);
      const copy = bands[bands.length - 2];

      expect(copy[1]).toBeLessThan(readoutTop(CARD_SIZE));
    }
  });
});

describe('rendered card geometry', () => {
  it('accepts a card whose copy stops above the readout', () => {
    expect(() =>
      fits(
        cardFixture([
          [0, TOP_RULE - 1],
          [90, 400],
          [readoutTop(CARD_SIZE), CARD_SIZE.height - 1],
        ]),
      ),
    ).not.toThrow();
  });

  it('rejects copy that has run into the readout', () => {
    // The failure satori does not report: the title's last line and the
    // readout rule become one unbroken band of ink.
    expect(() =>
      fits(
        cardFixture([
          [0, TOP_RULE - 1],
          [90, CARD_SIZE.height - 1],
        ]),
      ),
    ).toThrow(/Copy has run into the readout/);
  });

  it('rejects a readout pushed down the card', () => {
    expect(() =>
      fits(
        cardFixture([
          [0, TOP_RULE - 1],
          [90, 480],
          [559, CARD_SIZE.height - 1],
        ]),
      ),
    ).toThrow(/readout should be the last band of ink/);
  });

  it('rejects a card that does not open with its rule', () => {
    expect(() =>
      fits(
        cardFixture([
          [2, TOP_RULE - 1],
          [90, 400],
          [readoutTop(CARD_SIZE), CARD_SIZE.height - 1],
        ]),
      ),
    ).toThrow(/does not open with its/);
  });

  it('refuses to measure anything but the renderer’s own PNG format', () => {
    expect(() => inkBands(Buffer.from('not a png at all'), paper)).toThrow(
      /not a PNG/,
    );
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
