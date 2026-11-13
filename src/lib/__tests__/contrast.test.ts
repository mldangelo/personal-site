import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * WCAG 2.2 contrast for opaque sRGB hex, so token pairs are checked rather than
 * eyeballed. It lives here because nothing ships it: in `src/lib` it would count
 * toward the source-line figure on /stats.
 */

/** SC 1.4.3, normal-size body text. */
const AA_TEXT = 4.5;
/** SC 1.4.11, non-text graphics and UI component boundaries. */
const AA_NON_TEXT = 3;

/**
 * Anything but `#rrggbb` throws: a translucent colour has no luminance until it
 * is composited, and dropping the alpha would score transparent black as opaque
 * black.
 */
function relativeLuminance(hex: string): number {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) {
    throw new Error(`Not an opaque sRGB hex colour: ${hex}`);
  }

  const [r, g, b] = (hex.slice(1).match(/../g) ?? []).map((pair) => {
    const c = Number.parseInt(pair, 16) / 255;

    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);

  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

const STYLES = join(process.cwd(), 'app', 'styles');

function readTokens(file: string): Map<string, string> {
  const css = readFileSync(join(STYLES, file), 'utf8');

  return new Map(
    Array.from(css.matchAll(/(--color-[\w-]+)\s*:\s*([^;]+);/g), (match) => [
      match[1],
      match[2].trim(),
    ]),
  );
}

const light = readTokens('tokens/colors.css');
const dark = readTokens('dark-mode.css');

/** Token value, following `var(--x)` indirection within the same theme. */
function resolve(theme: Map<string, string>, name: string): string {
  let value = theme.get(name) ?? light.get(name);

  for (let hops = 0; value?.startsWith('var(') && hops < 4; hops += 1) {
    const referenced = value.slice(4, -1).trim();
    value = theme.get(referenced) ?? light.get(referenced);
  }

  if (!value) {
    throw new Error(`No such token: ${name}`);
  }

  return value;
}

const PAPER = ['--color-bg-alt'];

/** Foreground, the backdrops it must read against, and the floor. */
const PAIRINGS: [string, string[], number][] = [
  // Body text, annotations, and links.
  ['--color-fg', PAPER, AA_TEXT],
  ['--color-fg-bold', PAPER, AA_TEXT],
  ['--color-fg-light', PAPER, AA_TEXT],
  ['--color-accent', PAPER, AA_TEXT],
  ['--color-accent-hover', PAPER, AA_TEXT],
  // The live value as text, which is why it is a separate token from the mark.
  ['--color-signal', PAPER, AA_TEXT],
  // "Present" carries the current-role meaning in text, so the redundant mark is
  // not a WCAG 1.4.11 requirement. The design still sets a 3:1 floor.
  ['--color-signal-mark', PAPER, AA_NON_TEXT],
  ['--color-control-border', PAPER, AA_NON_TEXT],
  // The ring's offset puts it against the page.
  ['--color-focus-ring-fill', PAPER, AA_NON_TEXT],
  // A filled control's label, at rest and on hover.
  [
    '--color-on-accent',
    ['--color-accent-fill', '--color-accent-fill-hover'],
    AA_TEXT,
  ],
  // The hero uses this pair in both directions: pale on blue, and blue on the
  // pale button at rest and on hover.
  ['--color-hero', ['--color-on-hero', '--color-on-hero-hover'], AA_TEXT],
];

describe('token contrast', () => {
  it.each(
    PAIRINGS.flatMap(([foreground, backgrounds, floor]) =>
      backgrounds.flatMap((background) =>
        [
          { theme: 'light', tokens: light },
          { theme: 'dark', tokens: dark },
        ].map((entry) => ({ ...entry, foreground, background, floor })),
      ),
    ),
  )(
    '$theme $foreground on $background clears $floor:1',
    ({ tokens, foreground, background, floor }) => {
      expect(
        contrastRatio(resolve(tokens, foreground), resolve(tokens, background)),
      ).toBeGreaterThanOrEqual(floor);
    },
  );

  it('separates the fill ring from the fill that the default ring aliases', () => {
    const fill = resolve(light, '--color-accent-fill');

    expect(
      contrastRatio(resolve(light, '--color-focus-ring-fill'), fill),
    ).toBeGreaterThan(
      contrastRatio(resolve(light, '--color-focus-ring'), fill),
    );
  });

  // A link's ink is about 2:1 against the text beside it, so the translucent
  // underline has to clear 3:1 by itself once composited over paper.
  it.each([
    { theme: 'light', tokens: light },
    { theme: 'dark', tokens: dark },
  ])('$theme link underline clears 3:1 on paper', ({ tokens }) => {
    const accent = resolve(tokens, '--color-accent');
    const share =
      Number(/(\d+)%/.exec(resolve(tokens, '--color-accent-underline'))?.[1]) /
      100;

    for (const surface of PAPER) {
      const paper = resolve(tokens, surface);
      const channel = (hex: string, i: number) =>
        Number.parseInt(hex.slice(i, i + 2), 16);
      const underline = `#${[1, 3, 5]
        .map((i) =>
          Math.round(
            channel(accent, i) * share + channel(paper, i) * (1 - share),
          )
            .toString(16)
            .padStart(2, '0'),
        )
        .join('')}`;

      expect(contrastRatio(underline, paper)).toBeGreaterThanOrEqual(
        AA_NON_TEXT,
      );
    }
  });

  it.each(['#0000', '#bc770aff', 'rgba(35, 39, 46, 0.14)', '#12345'])(
    'refuses to score %s rather than treating it as opaque',
    (colour) => {
      expect(() => contrastRatio(colour, '#ffffff')).toThrow(/opaque/);
    },
  );
});

describe('focus ring declarations', () => {
  it('use the semantic ring tokens instead of palette colours', () => {
    const files = readdirSync(STYLES, { recursive: true })
      .map(String)
      .filter((file) => file.endsWith('.css'));

    for (const file of files) {
      const css = readFileSync(join(STYLES, file), 'utf8');

      for (const [declaration, value] of css
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .matchAll(/outline(?:-color)?\s*:\s*([^;]+);/g)) {
        if (value.trim() !== 'none') {
          expect(value, `${file}: ${declaration}`).toContain(
            'var(--color-focus-ring',
          );
        }
      }
    }
  });
});
