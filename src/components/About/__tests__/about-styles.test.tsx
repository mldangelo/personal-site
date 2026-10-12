import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import { render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { aboutMarkdown } from '@/data/about';
import AboutContent from '../Sections';

/**
 * How the About page looks is decided in stylesheets jsdom never loads, so
 * these read the rules themselves: the page's own for what it declares, and
 * every stylesheet the site ships for what a link ends up with once they have
 * all had their say. Whether the result is any good still takes a browser.
 */

const ENTRY = join(process.cwd(), 'app/tailwind.css');

/** Later layers win, and anything outside a layer beats them all. */
const LAYERS = ['base', 'components', 'utilities'];
const UNLAYERED = LAYERS.length;

type Specificity = [number, number, number];

interface Rule {
  /** Path as `app/tailwind.css` imports it. */
  file: string;
  selectors: string[];
  declarations: [property: string, value: string][];
  /** Index into `LAYERS`, or `UNLAYERED`. */
  layer: number;
  /** The `@media` condition around the rule, if any. */
  media: string | null;
  /** Position in the cascade: import order, then source order. */
  order: number;
}

/** Split on top-level commas only, so `:is(p, li)` stays one selector. */
function splitSelectors(list: string): string[] {
  const selectors: string[] = [];
  let depth = 0;
  let current = '';

  for (const char of list) {
    if (char === '(') depth += 1;
    if (char === ')') depth -= 1;

    if (char === ',' && depth === 0) {
      selectors.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  return [...selectors, current]
    .map((selector) => selector.trim().replace(/\s+/g, ' '))
    .filter(Boolean);
}

function readDeclarations(body: string): Rule['declarations'] {
  return body
    .split(';')
    .map((declaration) => declaration.trim())
    .filter(Boolean)
    .map((declaration): [string, string] => {
      const colon = declaration.indexOf(':');

      return [
        declaration.slice(0, colon).trim(),
        declaration
          .slice(colon + 1)
          .trim()
          .replace(/\s+/g, ' '),
      ];
    });
}

/** Style rules of one stylesheet, with the layer and media query around each. */
function readRules(
  css: string,
  context: Pick<Rule, 'file' | 'layer' | 'media'>,
  into: Rule[],
): void {
  let index = 0;

  while (index < css.length) {
    const open = css.indexOf('{', index);
    const semicolon = css.indexOf(';', index);

    if (open === -1) return;

    // A statement with no braces of its own, such as `@import`.
    if (semicolon !== -1 && semicolon < open) {
      index = semicolon + 1;
      continue;
    }

    let depth = 1;
    let close = open + 1;

    for (; depth > 0 && close < css.length; close += 1) {
      if (css[close] === '{') depth += 1;
      if (css[close] === '}') depth -= 1;
    }

    const prelude = css.slice(index, open).trim().replace(/\s+/g, ' ');
    const body = css.slice(open + 1, close - 1);
    const layer = /^@layer\s+([\w-]+)/.exec(prelude);
    const media = /^@media (.+)$/.exec(prelude);

    if (layer) {
      readRules(body, { ...context, layer: LAYERS.indexOf(layer[1]) }, into);
    } else if (media) {
      readRules(body, { ...context, media: media[1] }, into);
    } else if (!prelude.startsWith('@')) {
      into.push({
        ...context,
        selectors: splitSelectors(prelude),
        declarations: readDeclarations(body),
        order: into.length,
      });
    }

    index = close;
  }
}

/** Every rule the site ships, in the order `app/tailwind.css` imports it. */
function siteRules(): Rule[] {
  const withoutComments = (path: string) =>
    readFileSync(path, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const rules: Rule[] = [];

  for (const [, file] of withoutComments(ENTRY).matchAll(
    /@import\s+['"](\.[^'"]+)['"]/g,
  )) {
    readRules(
      withoutComments(resolve(dirname(ENTRY), file)),
      { file, layer: UNLAYERED, media: null },
      rules,
    );
  }

  return rules;
}

function compare(a: readonly number[], b: readonly number[]): number {
  for (const [index, value] of a.entries()) {
    if (value !== b[index]) return value - b[index];
  }

  return 0;
}

function specificity(selector: string): Specificity {
  const total: Specificity = [0, 0, 0];
  const functional = /:(where|is|not|has)\(((?:[^()]|\([^()]*\))*)\)/;
  let rest = selector;

  // `:where()` weighs nothing; the others weigh their heaviest argument.
  for (
    let found = functional.exec(rest);
    found;
    found = functional.exec(rest)
  ) {
    if (found[1] !== 'where') {
      const heaviest = splitSelectors(found[2])
        .map(specificity)
        .sort(compare)
        .at(-1);

      for (const [index, value] of (heaviest ?? []).entries()) {
        total[index] += value;
      }
    }

    rest = rest.replace(found[0], ' ');
  }

  const count = (pattern: RegExp, column: 0 | 1 | 2) => {
    rest = rest.replace(pattern, () => {
      total[column] += 1;
      return ' ';
    });
  };

  count(/\[[^\]]*\]/g, 1);
  count(/#[\w-]+/g, 0);
  count(/\.[\w-]+/g, 1);
  count(/::[\w-]+/g, 2);
  count(/:[\w-]+(?:\([^()]*\))?/g, 1);
  count(/[a-zA-Z][\w-]*/g, 2);

  return total;
}

/** The longhands a link's look comes down to, read out of their shorthands. */
function longhands([property, value]: [string, string]): [string, string][] {
  if (property === 'text-decoration') {
    return [
      ['text-decoration-line', value.split(' ')[0]],
      ['text-decoration-color', 'currentcolor'],
    ];
  }

  if (property === 'background') {
    return [
      ['background-image', /gradient|url\(/.test(value) ? value : 'none'],
    ];
  }

  return [[property, value]];
}

const RULES = siteRules();

/**
 * What the stylesheets, taken together, give one element: for each property,
 * the declaration from the heaviest layer, then the most specific matching
 * selector, then the last in source order. Rules inside a media query are left
 * out, so this is the default screen at desktop width.
 *
 * jsdom never reports `:hover`, so a hovered element is matched by dropping
 * the pseudo-class from the selector while still counting it in the weight.
 */
function cascade(
  element: Element,
  hovered: boolean,
  rules: Rule[] = RULES,
): Map<string, string> {
  const winners = new Map<string, { rank: number[]; value: string }>();

  for (const rule of rules) {
    if (rule.media !== null) continue;

    const matching = rule.selectors.filter((selector) => {
      if (selector.includes('::')) return false;

      try {
        return element.matches(
          hovered ? selector.replaceAll(':hover', '') : selector,
        );
      } catch {
        // A selector jsdom cannot parse is one it cannot be matching.
        return false;
      }
    });

    const heaviest = matching.map(specificity).sort(compare).at(-1);

    if (!heaviest) continue;

    const rank = [rule.layer, ...heaviest, rule.order];

    for (const [property, value] of rule.declarations.flatMap(longhands)) {
      const current = winners.get(property);

      if (!current || compare(rank, current.rank) >= 0) {
        winners.set(property, { rank, value });
      }
    }
  }

  return new Map(
    [...winners].map(([property, { value }]) => [property, value]),
  );
}

/** The four properties that decide whether a link reads as one, and once. */
function linkLook(element: Element | null, hovered = false) {
  if (!element) throw new Error('no such link');

  const styles = cascade(element, hovered);

  return {
    color: styles.get('color'),
    line: styles.get('text-decoration-line'),
    lineColor: styles.get('text-decoration-color'),
    backgroundImage: styles.get('background-image'),
  };
}

function renderPage(theme: 'light' | 'dark') {
  document.documentElement.setAttribute('data-theme', theme);

  const { container } = render(
    <section className="about-page">
      <AboutContent markdown={aboutMarkdown} />
    </section>,
  );
  const find = (selector: string) => container.querySelector(selector);

  return {
    proseLinks: {
      'a paragraph': find('.about-intro p a'),
      'a list of sentences': find('.about-section--compact li a'),
      'a log entry': find('.about-section--log .log-entry a'),
      'the list of names': find('.about-section--links li a'),
    },
    headingLink: find('.about-section-heading-link'),
    navLink: find('.about-section-nav-link'),
  };
}

afterEach(() => {
  document.documentElement.removeAttribute('data-theme');
});

describe('the cascade reader', () => {
  it('reads the stylesheets it is asserting about', () => {
    // If the parser stopped finding rules, everything below could pass by
    // matching nothing.
    const files = new Set(RULES.map((rule) => rule.file));
    const layers = new Set(RULES.map((rule) => rule.layer));

    expect(RULES.length).toBeGreaterThan(400);
    expect(files).toContain('./styles/base/links.css');
    expect(files).toContain('./styles/dark-mode.css');
    expect(files).toContain('./styles/pages/content.css');
    expect(layers).toContain(LAYERS.indexOf('base'));
    expect(layers).toContain(UNLAYERED);
  });

  it('weighs selectors the way a browser does', () => {
    expect(specificity('.about-content a')).toEqual([0, 1, 1]);
    expect(specificity("[data-theme='dark'] p a:hover")).toEqual([0, 2, 2]);
    expect(specificity('.button:not(.button-secondary)')).toEqual([0, 2, 0]);
    expect(specificity(':where(.theme-portrait) img')).toEqual([0, 0, 1]);
    expect(specificity('.log-entry::after')).toEqual([0, 1, 1]);
    expect(specificity('li:nth-child(2n + 1) > a')).toEqual([0, 1, 2]);
  });

  it('settles a property the way a browser does', () => {
    const rules: Rule[] = [];

    readRules(
      `@layer base { p a:hover { color: layered; } }
       .box a { color: outside; }
       @media print { .box a { color: printed; } }
       a { color: later; }`,
      { file: 'inline', layer: UNLAYERED, media: null },
      rules,
    );

    const { container } = render(
      <div className="box">
        <p>
          <a href="/">link</a>
        </p>
      </div>,
    );
    const link = container.querySelector('a') as Element;

    // A layer loses to anything outside it however heavy its selector, weight
    // beats source order, and a media query is not the default screen.
    expect(cascade(link, true, rules).get('color')).toBe('outside');
    expect(cascade(link, false, rules).get('color')).toBe('outside');
  });
});

describe('about page links', () => {
  /**
   * They were ink with a hairline underline; in a paragraph the global `p a`
   * gradient drew a second line under it, and dark-mode.css restated that
   * gradient at a weight the page's own rule did not reach.
   */
  it.each(['light', 'dark'] as const)(
    'look the same in a paragraph and in every list, in the %s theme',
    (theme) => {
      const { proseLinks } = renderPage(theme);

      for (const [where, link] of Object.entries(proseLinks)) {
        expect(linkLook(link), `${where}, at rest`).toEqual({
          color: 'var(--color-accent)',
          line: 'underline',
          lineColor: 'var(--color-accent-underline)',
          backgroundImage: 'none',
        });
        expect(linkLook(link, true), `${where}, hovered`).toEqual({
          color: 'var(--color-accent-hover)',
          line: 'underline',
          lineColor: 'var(--color-accent)',
          backgroundImage: 'none',
        });
      }
    },
  );

  it.each(['light', 'dark'] as const)(
    'leave the section nav and the heading links alone, in the %s theme',
    (theme) => {
      const { headingLink, navLink } = renderPage(theme);

      // Neither is prose: no underline of either kind, at rest or hovered.
      for (const hovered of [false, true]) {
        expect(linkLook(navLink, hovered)).toMatchObject({
          line: 'none',
          backgroundImage: 'none',
        });
        expect(linkLook(headingLink, hovered)).toMatchObject({
          color: 'inherit',
          line: 'none',
          backgroundImage: 'none',
        });
      }
    },
  );
});

describe('about page type', () => {
  /**
   * The page's own rules. The section nav's are left out: a row of controls is
   * set by other rules than a page of reading.
   */
  const page = RULES.filter(
    (rule) =>
      rule.file === './styles/pages/content.css' &&
      rule.selectors.some(
        (selector) =>
          /\.(?:about|log-entry)\b/.test(selector) &&
          !selector.includes('section-nav'),
      ),
  );

  /** The rule declared for exactly this selector, under this media query. */
  function ruleFor(selector: string, media: string | null = null) {
    const rule = page.find(
      (candidate) =>
        candidate.media === media && candidate.selectors.includes(selector),
    );

    if (!rule) throw new Error(`no rule for ${selector}`);

    return new Map(rule.declarations);
  }

  it('finds the rules it is asserting about', () => {
    expect(page.length).toBeGreaterThan(25);
  });

  it('leaves the section heading to the shared section header', () => {
    const headings = page.filter((rule) =>
      rule.selectors.includes('.about-section h2'),
    );

    // One for each height the sticky bar above it takes. All either may say
    // is where a jump to the heading parks it.
    expect(headings.map((rule) => rule.media)).toEqual([
      null,
      '(max-width: 735px)',
    ]);
    for (const rule of headings) {
      expect(rule.declarations.map(([property]) => property)).toEqual([
        'scroll-margin-top',
      ]);
    }
  });

  it('sets the intro as a lede, a step above the body at each width', () => {
    expect(ruleFor('.about-intro p').get('font-size')).toBe('var(--text-lg)');
    expect(
      ruleFor('.about-intro p', '(max-width: 735px)').get('font-size'),
    ).toBe('var(--text-md)');
  });

  it('reads sentences down one column and names across three', () => {
    const columned = page
      .filter((rule) =>
        rule.declarations.some(([property]) => property.startsWith('column')),
      )
      .flatMap((rule) => rule.selectors);

    expect(columned).toEqual(['.about-section--links ul']);
    // A count and a width: as many columns as hold a name, up to the count.
    expect(ruleFor('.about-section--links ul').get('columns')).toMatch(
      /^3 [\d.]+em$/,
    );
  });
});
