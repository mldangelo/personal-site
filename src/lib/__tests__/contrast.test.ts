import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * WCAG 2.2 contrast for opaque sRGB hex, so token pairs are checked rather
 * than eyeballed. It lives here because nothing ships it: in `src/lib` it
 * counted toward the source-line figure on /stats.
 */

/** SC 1.4.3 — normal-size body text. */
const AA_TEXT = 4.5;

/** SC 1.4.11 — non-text graphics and UI component boundaries. */
const AA_NON_TEXT = 3;

/**
 * `#rgb` or `#rrggbb` to 0-255 channels. Alpha-bearing and unparseable values
 * throw rather than resolve: a translucent colour has no luminance until it is
 * composited, and dropping the alpha would score transparent black as opaque
 * black.
 */
function parseHexColor(hex: string): [number, number, number] {
  const body = hex.trim().replace(/^#/, '');

  if ((body.length === 4 || body.length === 8) && /^[0-9a-fA-F]+$/.test(body)) {
    throw new Error(
      `Alpha-bearing hex colours need an explicit backdrop: ${hex}`,
    );
  }

  const expanded =
    body.length === 3
      ? body
          .split('')
          .map((c) => c + c)
          .join('')
      : body;

  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) {
    throw new Error(`Not an opaque sRGB hex colour: ${hex}`);
  }

  return [
    Number.parseInt(expanded.slice(0, 2), 16),
    Number.parseInt(expanded.slice(2, 4), 16),
    Number.parseInt(expanded.slice(4, 6), 16),
  ];
}

function linearize(channel: number): number {
  const c = channel / 255;

  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = parseHexColor(hex);

  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);

  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

const STYLES = join(process.cwd(), 'app', 'styles');
const SURFACES = ['--color-bg', '--color-bg-alt'];

function readTokens(file: string): Map<string, string> {
  const css = readFileSync(join(STYLES, file), 'utf8');
  const tokens = new Map<string, string>();

  for (const [, name, value] of css.matchAll(
    /(--color-[\w-]+)\s*:\s*([^;]+);/g,
  )) {
    tokens.set(name, value.trim());
  }

  return tokens;
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

const lightToken = (name: string) => resolve(light, name);
const darkToken = (name: string) => resolve(dark, name);
const themes = [lightToken, darkToken];

function cssFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory()
      ? cssFiles(path)
      : entry.name.endsWith('.css')
        ? [path]
        : [];
  });
}

/** Every token/surface ratio in both themes, labelled for the failure output. */
function ratiosOnSurfaces(token: string): [string, number][] {
  return themes.flatMap((theme, index) =>
    SURFACES.map((surface): [string, number] => [
      `${index === 0 ? 'light' : 'dark'} ${token} on ${surface}`,
      contrastRatio(theme(token), theme(surface)),
    ]),
  );
}

function below(token: string, threshold: number): string[] {
  return ratiosOnSurfaces(token)
    .filter(([, ratio]) => ratio < threshold)
    .map(([label, ratio]) => `${label}: ${ratio.toFixed(2)}`);
}

describe('parseHexColor', () => {
  it('accepts opaque shorthand and longhand hex', () => {
    expect(parseHexColor('#abc')).toEqual([0xaa, 0xbb, 0xcc]);
    expect(parseHexColor('bc770a')).toEqual([188, 119, 10]);
  });

  it('throws rather than scoring an unusable colour as opaque black', () => {
    expect(() => parseHexColor('#0000')).toThrow(/explicit backdrop/);
    expect(() => parseHexColor('#bc770aff')).toThrow(/explicit backdrop/);
    expect(() => contrastRatio('#00000000', '#ffffff')).toThrow(
      /explicit backdrop/,
    );
    expect(() => parseHexColor('rgba(35, 39, 46, 0.14)')).toThrow();
    expect(() => parseHexColor('#12345')).toThrow();
  });
});

describe('signal tokens', () => {
  // "Present" carries the current-role meaning in text, so the redundant dot
  // is not a WCAG 1.4.11 requirement. The design still sets a 3:1 floor.
  it('keep the mark above 3:1 on every backdrop it is drawn on', () => {
    expect(below('--color-signal-mark', AA_NON_TEXT)).toEqual([]);
  });

  it('keep the text value above 4.5:1, which is why it is a separate token', () => {
    expect(below('--color-signal', AA_TEXT)).toEqual([]);
  });
});

describe('--color-control-border', () => {
  it('clears 3:1 on every surface it is drawn on', () => {
    expect(below('--color-control-border', AA_NON_TEXT)).toEqual([]);
  });
});

describe('--color-focus-ring-fill', () => {
  it('separates from the fill that the default ring aliases', () => {
    const fill = lightToken('--color-accent-fill');

    expect(
      contrastRatio(lightToken('--color-focus-ring-fill'), fill),
    ).toBeGreaterThan(contrastRatio(lightToken('--color-focus-ring'), fill));
  });

  it('reads against the page in both themes, which is where the offset puts it', () => {
    expect(below('--color-focus-ring-fill', AA_NON_TEXT)).toEqual([]);
  });
});

describe('focus ring declarations', () => {
  it('use the semantic ring tokens instead of palette colours', () => {
    const violations = cssFiles(STYLES).flatMap((file) => {
      const css = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
      return [...css.matchAll(/outline(?:-color)?\s*:\s*([^;]+);/g)]
        .filter(([, value]) => {
          const declaration = value.trim();
          return (
            declaration !== 'none' &&
            !declaration.includes('var(--color-focus-ring')
          );
        })
        .map((match) => `${file.replace(`${STYLES}/`, '')}: ${match[0]}`);
    });

    expect(violations).toEqual([]);
  });
});

describe('filled controls', () => {
  it('keep their label legible on the fill and its hover in both themes', () => {
    for (const theme of themes) {
      for (const fill of ['--color-accent-fill', '--color-accent-fill-hover']) {
        expect(
          contrastRatio(theme('--color-on-accent'), theme(fill)),
        ).toBeGreaterThanOrEqual(AA_TEXT);
      }
    }
  });
});
