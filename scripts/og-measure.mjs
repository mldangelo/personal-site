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
 * Sharp is already required by the card generator. Reuse its pixel decoder
 * rather than maintaining a second PNG parser; geometry is still checked
 * independently against the finished image.
 */

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
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

/**
 * Rows carrying ink, grouped into the unbroken bands a reader sees as elements.
 *
 * Bands rather than a per-row map because the interesting facts are where a
 * band starts and ends: the top rule is the first, the readout row — closed off
 * by its own rule and held open by the hairlines between its cells — is the
 * last, and copy that overflows into the readout merges the two.
 */
export async function inkBands(image, paper) {
  if (!image.subarray(0, 8).equals(SIGNATURE)) {
    throw new Error('Rendered card is not a PNG');
  }
  const { default: sharp } = await import('sharp');
  const { data: pixels, info } = await sharp(image)
    .toColourspace('srgb')
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const stride = width * channels;
  const [red, green, blue] = parseColor(paper);
  const bands = [];
  let start;

  for (let y = 0; y < height; y += 1) {
    let inked = false;
    for (let x = 0; x < width && !inked; x += 1) {
      const offset = y * stride + x * channels;
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
export async function assertCardGeometry(
  image,
  { size, paper, topRule, readoutTop },
) {
  const bands = await inkBands(image, paper);
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
