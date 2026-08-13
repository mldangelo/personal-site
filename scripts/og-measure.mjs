/**
 * Measures a rendered card, because satori reports nothing about what it drew.
 *
 * `og-layout.mjs` decides a title size from an estimate of how many lines copy
 * will wrap to, and an estimate can be wrong. When it is wrong low, satori
 * quietly draws the title through the readout — no error, no overflow flag,
 * just a committed PNG with half its measurements cropped. The one authority on
 * what actually happened is the image, so the generator decodes each card it
 * renders and refuses to write one whose geometry moved.
 *
 * Deliberately dependency-free: PNG is DEFLATE plus per-scanline filters, both
 * of which `node:zlib` already covers, and the alternative would be reaching for
 * an image library in a path whose whole job is to distrust the renderer.
 */
import { inflateSync } from 'node:zlib';

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
/** 8-bit RGBA, no interlacing: what the pinned renderer emits. */
const BIT_DEPTH = 8;
const COLOR_TYPE = 6;
const CHANNELS = 4;
/** Ignore antialiasing against the paper, count anything a reader would see. */
const INK_THRESHOLD = 8;

/** `#rgb`, `#rrggbb`, or `rgb()/rgba()` — the forms the tokens are allowed. */
export function parseColor(value) {
  const hex = value.trim().match(/^#([0-9a-f]{3,8})$/i)?.[1];
  if (hex) {
    const digits =
      hex.length < 6
        ? [...hex].map((digit) => digit + digit).join('')
        : hex.padEnd(6, '0');
    return [0, 2, 4].map((offset) =>
      Number.parseInt(digits.slice(offset, offset + 2), 16),
    );
  }

  const channels = value
    .trim()
    .match(/^rgba?\(([^()]*)\)$/i)?.[1]
    ?.split(/[\s,/]+/)
    .filter(Boolean)
    .slice(0, 3)
    .map(Number);
  if (channels?.length === 3 && channels.every(Number.isFinite)) {
    return channels;
  }

  throw new Error(`Cannot measure a card painted ${value}`);
}

/** Decodes a non-interlaced 8-bit RGBA PNG into raw pixels. */
export function decodePng(image) {
  if (!image.subarray(0, 8).equals(SIGNATURE)) {
    throw new Error('Rendered card is not a PNG');
  }

  const width = image.readUInt32BE(16);
  const height = image.readUInt32BE(20);
  if (
    image.toString('ascii', 12, 16) !== 'IHDR' ||
    image[24] !== BIT_DEPTH ||
    image[25] !== COLOR_TYPE ||
    image[28] !== 0
  ) {
    throw new Error(
      `Rendered card is not a non-interlaced ${BIT_DEPTH}-bit RGBA PNG; ` +
        'the card measurements assume the pinned renderer’s output',
    );
  }

  const parts = [];
  for (let offset = 8; offset + 8 <= image.length; ) {
    const length = image.readUInt32BE(offset);
    if (image.toString('ascii', offset + 4, offset + 8) === 'IDAT') {
      parts.push(image.subarray(offset + 8, offset + 8 + length));
    }
    offset += length + 12;
  }

  const raw = inflateSync(Buffer.concat(parts));
  const stride = width * CHANNELS;
  if (raw.length !== height * (stride + 1)) {
    throw new Error('Rendered card has a truncated pixel stream');
  }

  const pixels = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y += 1) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));

    for (let x = 0; x < stride; x += 1) {
      const left = x >= CHANNELS ? pixels[y * stride + x - CHANNELS] : 0;
      const up = y > 0 ? pixels[(y - 1) * stride + x] : 0;
      const corner =
        x >= CHANNELS && y > 0 ? pixels[(y - 1) * stride + x - CHANNELS] : 0;
      let value = line[x];

      if (filter === 1) value += left;
      else if (filter === 2) value += up;
      else if (filter === 3) value += (left + up) >> 1;
      else if (filter === 4) {
        const estimate = left + up - corner;
        const toLeft = Math.abs(estimate - left);
        const toUp = Math.abs(estimate - up);
        const toCorner = Math.abs(estimate - corner);
        value +=
          toLeft <= toUp && toLeft <= toCorner
            ? left
            : toUp <= toCorner
              ? up
              : corner;
      } else if (filter !== 0) {
        throw new Error(`Rendered card uses unknown PNG filter ${filter}`);
      }

      pixels[y * stride + x] = value & 0xff;
    }
  }

  return { width, height, stride, pixels };
}

/**
 * Rows carrying ink, grouped into the unbroken bands a reader sees as elements.
 *
 * Bands rather than a per-row map because the interesting facts are where a
 * band starts and ends: the top rule is the first, the readout row — closed off
 * by its own rule and held open by the hairlines between its cells — is the
 * last, and copy that overflows into the readout merges the two.
 */
export function inkBands(image, paper) {
  const { width, height, stride, pixels } = decodePng(image);
  const [red, green, blue] = parseColor(paper);
  const bands = [];
  let start;

  for (let y = 0; y < height; y += 1) {
    let inked = false;
    for (let x = 0; x < width && !inked; x += 1) {
      const offset = y * stride + x * CHANNELS;
      inked =
        Math.abs(pixels[offset] - red) > INK_THRESHOLD ||
        Math.abs(pixels[offset + 1] - green) > INK_THRESHOLD ||
        Math.abs(pixels[offset + 2] - blue) > INK_THRESHOLD;
    }

    if (inked && start === undefined) start = y;
    else if (!inked && start !== undefined) {
      bands.push([start, y - 1]);
      start = undefined;
    }
  }

  if (start !== undefined) bands.push([start, height - 1]);
  return bands;
}

/**
 * Refuses a card whose drawn geometry is not the geometry that was budgeted.
 *
 * The rules bracket every card: ink starts at row 0 and runs the height of the
 * top rule, and the last band is the readout, opening at its own rule and
 * running to the bottom edge. A title one line taller than the estimate joins
 * those bands together; copy tall enough to push the readout down moves the
 * last band's start. Either way the card is cropped, and either way this is the
 * only thing that notices.
 */
export function assertCardGeometry(
  image,
  { size, paper, topRule, readoutTop },
) {
  const bands = inkBands(image, paper);
  const first = bands[0];
  const last = bands[bands.length - 1];

  if (!first || first[0] !== 0 || first[1] !== topRule - 1) {
    throw new Error(
      `The rendered card does not open with its ${topRule}px rule: ink runs ` +
        `${first ? `${first[0]}-${first[1]}` : 'nowhere'}. The card geometry ` +
        'and `og-layout.mjs` disagree.',
    );
  }

  if (!last || last[0] !== readoutTop || last[1] !== size.height - 1) {
    throw new Error(
      `The rendered card's readout should be the last band of ink, at rows ` +
        `${readoutTop}-${size.height - 1}; it is ` +
        `${last ? `${last[0]}-${last[1]}` : 'absent'}. Copy has run into the ` +
        'readout, which satori crops without reporting: shorten the ' +
        'frontmatter copy, or take a size out of `TITLE_SIZES`.',
    );
  }

  return bands;
}
