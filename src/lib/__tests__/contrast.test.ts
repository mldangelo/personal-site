import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  AA_NON_TEXT,
  AA_TEXT,
  contrastRatio,
  parseHexColor,
  relativeLuminance,
} from '../contrast';

/**
 * This is a floor, not a proof.
 *
 * Every pair below is two flat token values, and a rendered surface on this
 * site is often not flat: `body::before` lays paper grain over the page, the
 * header composites through a `backdrop-filter`, and the hero portrait is
 * blended with `mix-blend-mode: multiply`. Any of those sits between the two
 * colours a pair describes, so this file can be entirely green while a real
 * surface fails. It exists to stop a token from being edited back below its
 * threshold, and it deliberately does not enumerate the stylesheet — a
 * whole-stylesheet contrast harness would report pairs that never touch and
 * miss the composited ones that do.
 */

const STYLES = join(process.cwd(), 'app', 'styles');

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

describe('contrastRatio', () => {
  it('anchors at the extremes of the scale', () => {
    expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 5);
    expect(contrastRatio('#1b2fbf', '#1b2fbf')).toBeCloseTo(1, 5);
  });

  it('is symmetric', () => {
    expect(contrastRatio('#bc770a', '#fcfbf9')).toBeCloseTo(
      contrastRatio('#fcfbf9', '#bc770a'),
      10,
    );
  });

  it('reproduces the WCAG reference luminances', () => {
    expect(relativeLuminance('#000000')).toBeCloseTo(0, 10);
    expect(relativeLuminance('#ffffff')).toBeCloseTo(1, 10);
    expect(relativeLuminance('#808080')).toBeCloseTo(0.2159, 4);
  });
});

describe('parseHexColor', () => {
  it('accepts opaque shorthand and longhand hex', () => {
    expect(parseHexColor('#abc')).toEqual([0xaa, 0xbb, 0xcc]);
    expect(parseHexColor('bc770a')).toEqual([188, 119, 10]);
  });

  it('rejects alpha instead of assigning a false opaque contrast score', () => {
    expect(() => parseHexColor('#0000')).toThrow(/explicit backdrop/);
    expect(() => parseHexColor('#00000000')).toThrow(/explicit backdrop/);
    expect(() => parseHexColor('#bc770aff')).toThrow(/explicit backdrop/);
    expect(() => contrastRatio('#00000000', '#ffffff')).toThrow(
      /explicit backdrop/,
    );
  });

  it('throws rather than scoring an unparseable colour as black', () => {
    expect(() => parseHexColor('rgba(35, 39, 46, 0.14)')).toThrow();
    expect(() => parseHexColor('#12345')).toThrow();
  });
});

describe('--color-signal-mark', () => {
  // "Present" carries the meaning in text, so this redundant dot is not a
  // WCAG 1.4.11 requirement. The design still sets a 3:1 floor.
  it('clears 3:1 on both light backdrops', () => {
    const mark = lightToken('--color-signal-mark');

    expect(contrastRatio(mark, lightToken('--color-bg'))).toBeCloseTo(3.51, 2);
    expect(contrastRatio(mark, lightToken('--color-bg-alt'))).toBeCloseTo(
      3.21,
      2,
    );
    expect(
      contrastRatio(mark, lightToken('--color-bg-alt')),
    ).toBeGreaterThanOrEqual(AA_NON_TEXT);
  });

  it('clears 3:1 on both dark backdrops', () => {
    const mark = darkToken('--color-signal-mark');

    expect(contrastRatio(mark, darkToken('--color-bg'))).toBeCloseTo(8.45, 2);
    expect(contrastRatio(mark, darkToken('--color-bg-alt'))).toBeCloseTo(
      8.96,
      2,
    );
  });

  it('pins the value it replaced, which failed on both', () => {
    // #e8930c shipped as the current-role marker for the life of the design.
    expect(contrastRatio('#e8930c', '#fcfbf9')).toBeCloseTo(2.36, 2);
    expect(contrastRatio('#e8930c', '#f2f1ec')).toBeCloseTo(2.16, 2);
  });
});

describe('--color-signal', () => {
  it('stays text-safe at 4.5:1 on both light backdrops', () => {
    const signal = lightToken('--color-signal');

    expect(contrastRatio(signal, lightToken('--color-bg'))).toBeCloseTo(
      5.48,
      2,
    );
    expect(contrastRatio(signal, lightToken('--color-bg-alt'))).toBeCloseTo(
      5.01,
      2,
    );
    expect(
      contrastRatio(signal, lightToken('--color-bg-alt')),
    ).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it('stays text-safe at 4.5:1 on both dark backdrops', () => {
    const signal = darkToken('--color-signal');

    expect(
      contrastRatio(signal, darkToken('--color-bg')),
    ).toBeGreaterThanOrEqual(AA_TEXT);
    expect(
      contrastRatio(signal, darkToken('--color-bg-alt')),
    ).toBeGreaterThanOrEqual(AA_TEXT);
  });
});

describe('--color-focus-ring-fill', () => {
  // The bug this token exists for: an accent ring drawn around an
  // accent-filled control is the fill's own colour.
  it('is what the accent ring on a filled control was not', () => {
    expect(
      contrastRatio(
        lightToken('--color-focus-ring'),
        lightToken('--color-accent-fill'),
      ),
    ).toBeCloseTo(1, 5);

    expect(
      contrastRatio(
        lightToken('--color-focus-ring-fill'),
        lightToken('--color-accent-fill'),
      ),
    ).toBeGreaterThan(1.5);
  });

  it('reads against the page in both themes, which is where the offset puts it', () => {
    for (const [token, surface] of [
      [lightToken('--color-focus-ring-fill'), lightToken('--color-bg')],
      [lightToken('--color-focus-ring-fill'), lightToken('--color-bg-alt')],
      [darkToken('--color-focus-ring-fill'), darkToken('--color-bg')],
      [darkToken('--color-focus-ring-fill'), darkToken('--color-bg-alt')],
    ]) {
      expect(contrastRatio(token, surface)).toBeGreaterThanOrEqual(AA_NON_TEXT);
    }
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

describe('--color-control-border', () => {
  // This is a deliberate 3:1 floor for unfilled control boundaries, not a
  // blanket claim that SC 1.4.11 requires every labelled border. The comments
  // beside these tokens quote these numbers.
  it('clears 3:1 on every surface it is drawn on', () => {
    expect(
      contrastRatio(
        lightToken('--color-control-border'),
        lightToken('--color-bg'),
      ),
    ).toBeCloseTo(4.12, 2);
    expect(
      contrastRatio(
        lightToken('--color-control-border'),
        lightToken('--color-bg-alt'),
      ),
    ).toBeCloseTo(3.77, 2);
    expect(
      contrastRatio(
        darkToken('--color-control-border'),
        darkToken('--color-bg'),
      ),
    ).toBeCloseTo(5.72, 2);
    expect(
      contrastRatio(
        darkToken('--color-control-border'),
        darkToken('--color-bg-alt'),
      ),
    ).toBeCloseTo(6.07, 2);
  });
});

describe('filled controls', () => {
  it('keep their label legible on the fill in both themes', () => {
    expect(
      contrastRatio(
        lightToken('--color-on-accent'),
        lightToken('--color-accent-fill'),
      ),
    ).toBeGreaterThanOrEqual(AA_TEXT);
    expect(
      contrastRatio(
        darkToken('--color-on-accent'),
        darkToken('--color-accent-fill'),
      ),
    ).toBeCloseTo(7.18, 2);
    expect(
      contrastRatio(
        darkToken('--color-on-accent'),
        darkToken('--color-accent-fill-hover'),
      ),
    ).toBeCloseTo(5.76, 2);
  });

  it('pins why the dark accent cannot be a fill, as its comment claims', () => {
    expect(contrastRatio('#ffffff', darkToken('--color-accent'))).toBeCloseTo(
      2.67,
      2,
    );
  });
});
