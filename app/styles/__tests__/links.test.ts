import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { readColorToken, type Theme } from '@/lib/tokens';

/**
 * The link contract in `base/links.css`: a bare link carries nothing to opt out
 * of, and a link in running text takes one treatment wherever it appears.
 *
 * jsdom resolves neither cascade layers nor media queries, so these read the
 * stylesheets themselves. What a browser computes from them is checked by hand
 * against the export.
 */

const STYLES = join(process.cwd(), 'app', 'styles');

interface Rule {
  file: string;
  /** Enclosing at-rules, outermost first: `@layer base`, `@media screen`. */
  context: string[];
  selectors: string[];
  declarations: Map<string, string>;
}

const squash = (text: string): string => text.trim().replace(/\s+/g, ' ');

/** Every style rule in a stylesheet, however deep its at-rules nest it. */
function parse(css: string, file: string, context: string[] = []): Rule[] {
  const rules: Rule[] = [];
  let cursor = 0;

  while (cursor < css.length) {
    const open = css.indexOf('{', cursor);
    if (open === -1) break;

    let close = open + 1;
    for (let depth = 1; close < css.length && depth > 0; close += 1) {
      if (css[close] === '{') depth += 1;
      else if (css[close] === '}') depth -= 1;
    }

    // Statements such as `@import '…';` can precede the first rule.
    const prelude = squash(css.slice(cursor, open).split(';').pop() ?? '');
    const body = css.slice(open + 1, close - 1);

    if (prelude.startsWith('@')) {
      rules.push(...parse(body, file, [...context, prelude]));
    } else {
      const declarations = new Map<string, string>();
      for (const entry of body.split(';')) {
        const colon = entry.indexOf(':');
        if (colon === -1) continue;
        declarations.set(
          entry.slice(0, colon).trim().toLowerCase(),
          squash(entry.slice(colon + 1)),
        );
      }
      rules.push({
        file,
        context,
        selectors: prelude.split(',').map(squash),
        declarations,
      });
    }

    cursor = close;
  }

  return rules;
}

function stylesheets(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory()
      ? stylesheets(path)
      : entry.name.endsWith('.css')
        ? [path]
        : [];
  });
}

const ALL = stylesheets(STYLES).flatMap((path) =>
  parse(
    readFileSync(path, 'utf8').replace(/\/\*[\s\S]*?\*\//g, ''),
    // Forward slashes on every platform, so `sheet('base/links.css')` holds.
    path.slice(STYLES.length + 1).replace(/\\/g, '/'),
  ),
);

const sheet = (file: string): Rule[] =>
  ALL.filter((rule) => rule.file === file);
const LINKS = sheet('base/links.css');

function rule(rules: Rule[], selector: string): Rule {
  const found = rules.find((candidate) =>
    candidate.selectors.includes(selector),
  );
  if (!found) throw new Error(`No rule for "${selector}"`);
  return found;
}

const pick = (
  from: Rule,
  properties: string[],
): Record<string, string | undefined> =>
  Object.fromEntries(
    properties.map((property) => [property, from.declarations.get(property)]),
  );

/** A selector whose subject is the anchor element: `a`, `p a`, `.x a:hover`. */
const TARGETS_ANCHOR = /(?:^|[\s>+~])a(?:[:.[#][^\s>+~]*)?$/;

describe('the stylesheet parser', () => {
  // Everything below passes by finding nothing if this stops seeing rules.
  it('reads rules through their at-rules', () => {
    const [first, nested] = parse(
      "@import 'x.css'; a { color: red } @layer base { @media screen { p a, p a:hover { COLOR: blue; } } }",
      'sample.css',
    );

    expect(first).toMatchObject({ context: [], selectors: ['a'] });
    expect(nested.context).toEqual(['@layer base', '@media screen']);
    expect(nested.selectors).toEqual(['p a', 'p a:hover']);
    expect(nested.declarations.get('color')).toBe('blue');
    expect(ALL.length).toBeGreaterThan(300);
  });
});

/**
 * The rule this replaced painted an animated accent underline on every `a` as
 * a `background-image`, so navigation, rows, and controls each had to switch
 * it off: twenty-four rules carried a declaration for no other reason, and
 * the mobile menu shipped looking broken for want of one.
 */
describe('bare links', () => {
  it('carry no decoration that a control would have to switch off', () => {
    const bare = rule(LINKS, 'a');

    expect(bare.declarations.get('text-decoration')).toBe('none');
    expect(
      [
        ...bare.declarations.keys(),
        ...rule(LINKS, 'a:hover').declarations.keys(),
      ].filter((property) =>
        /^(?:background|border|box-shadow)/.test(property),
      ),
    ).toEqual([]);
  });

  it('are never underlined with a gradient, in any stylesheet', () => {
    const painted = ALL.filter(
      ({ selectors, declarations }) =>
        selectors.some((selector) => TARGETS_ANCHOR.test(selector)) &&
        [...declarations].some(
          ([property, value]) =>
            property.startsWith('background') && value.includes('gradient'),
        ),
    ).map(({ file, selectors }) => `${file}: ${selectors.join(', ')}`);

    expect(painted).toEqual([]);
  });
});

describe('links in running text', () => {
  const REST = [
    'color',
    'text-decoration',
    'text-decoration-color',
    'text-underline-offset',
  ];
  const HOVER = ['color', 'text-decoration-color'];

  it('take accent ink over a pale rule that firms up on hover', () => {
    expect(pick(rule(LINKS, 'p a'), REST)).toEqual({
      color: 'var(--color-accent)',
      'text-decoration': 'underline',
      'text-decoration-color': 'var(--color-accent-underline)',
      'text-underline-offset': '2px',
    });
    expect(pick(rule(LINKS, 'p a:hover'), HOVER)).toEqual({
      color: 'var(--color-accent-hover)',
      'text-decoration-color': 'var(--color-accent)',
    });
  });

  // Article links were once the only ones on the site that read as links. If
  // the two rules drift apart again, so do an essay and every other page.
  it('look the same in an article as anywhere else', () => {
    const writing = sheet('pages/writing.css');

    expect(pick(rule(writing, '.prose a'), REST)).toEqual(
      pick(rule(LINKS, 'p a'), REST),
    );
    expect(pick(rule(writing, '.prose a:hover'), HOVER)).toEqual(
      pick(rule(LINKS, 'p a:hover'), HOVER),
    );
  });

  // `print.css` stripped the old gradient from every link, so paper never
  // showed an underline here, and the resume is the page people print.
  it('are decorated on screen only', () => {
    const decorated = LINKS.filter(({ selectors }) =>
      selectors.some((selector) => /^p a(?::|$)/.test(selector)),
    );

    expect(decorated).toHaveLength(2);
    for (const { context } of decorated) {
      expect(context).toEqual(['@layer base', '@media screen']);
    }
  });

  // A theme-level `p a` weighs (0,1,2). The dark-mode one outranked
  // class-level link rules in that theme alone, and article prose carried four
  // selectors whose only job was to cancel it.
  it('are not restated by a theme or a mode', () => {
    const restated = [
      'dark-mode.css',
      'forced-colors.css',
      'print.css',
    ].flatMap((file) =>
      sheet(file)
        .flatMap(({ selectors }) => selectors)
        .filter((selector) => /(?:^|\s)p a(?::|$)/.test(selector))
        .map((selector) => `${file}: ${selector}`),
    );

    expect(restated).toEqual([]);
  });

  // Safari before 26.2 reads the `text-decoration` shorthand as the line
  // alone, so a rule that restates the underline without naming a colour keeps
  // the pale accent set above. On the poster that is accent on the accent
  // field: an underline nobody can see. Until the poster's rule names its own
  // colour, the reset has to sit beside the rule that would leak.
  it('do not lend their underline colour to the links on the poster', () => {
    const leaky = sheet('pages/home.css').filter(
      ({ selectors, declarations }) =>
        selectors.some((selector) => selector.includes('.hero-highlight')) &&
        declarations.get('text-decoration') === 'underline' &&
        !declarations.has('text-decoration-color'),
    );
    const reset = LINKS.filter(
      ({ declarations }) =>
        declarations.get('text-decoration-color') === 'currentcolor',
    ).flatMap(({ selectors }) => selectors);

    // Both states: `p a:hover` sets a colour of its own at (0,1,2).
    expect(reset).toEqual(
      expect.arrayContaining(
        leaky.length > 0
          ? ['p .hero-highlight', 'p .hero-highlight:hover']
          : [],
      ),
    );
  });
});

describe('the underline under a link in running text', () => {
  const TOKEN_FILE: Record<Theme, string> = {
    light: 'tokens/colors.css',
    dark: 'dark-mode.css',
  };

  function channels(hex: string): number[] {
    return [1, 3, 5].map((at) => Number.parseInt(hex.slice(at, at + 2), 16));
  }

  function luminance(rgb: number[]): number {
    const [r, g, b] = rgb.map((value) => {
      const channel = value / 255;
      return channel <= 0.03928
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function contrast(a: number[], b: number[]): number {
    const [lighter, darker] = [luminance(a), luminance(b)].sort(
      (x, y) => y - x,
    );
    return (lighter + 0.05) / (darker + 0.05);
  }

  /** How much accent the token mixes over whatever is behind it. */
  function accentShare(theme: Theme): number {
    const declared =
      /--color-accent-underline:\s*color-mix\(in srgb, var\(--color-accent\) (\d+)%, transparent\)/.exec(
        readFileSync(join(STYLES, TOKEN_FILE[theme]), 'utf8'),
      );
    if (!declared) {
      throw new Error(`--color-accent-underline is not a mix in ${theme}`);
    }
    return Number(declared[1]) / 100;
  }

  // A link's ink is about 2:1 against the body text around it, which is not
  // enough to tell them apart by colour. The underline is the cue that does
  // not depend on colour, so it has to be visible in its own right: it
  // shipped at 1.65:1 on light paper.
  it.each([
    ['light', '--color-bg'],
    ['light', '--color-bg-alt'],
    ['dark', '--color-bg'],
    ['dark', '--color-bg-alt'],
  ] as const)('clears 3:1 in the %s theme on %s', (theme, surface) => {
    const accent = channels(readColorToken('--color-accent', theme));
    const paper = channels(readColorToken(surface, theme));
    const share = accentShare(theme);
    const underline = accent.map(
      (value, at) => value * share + paper[at] * (1 - share),
    );

    expect(contrast(underline, paper)).toBeGreaterThanOrEqual(3);
  });
});
