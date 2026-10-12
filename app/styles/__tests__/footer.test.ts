import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * What the footer's layout promises, held on the source because jsdom lays
 * nothing out: it sits on the page's own rails, every link is a full-size
 * target wherever a finger might be doing the pointing, and nothing in it is
 * centred. Each was wrong before this file existed — the footer padded itself
 * a second time below 641px and sat 16px inside the page above it, its
 * "Explore" links were 23px tall, and on a phone the whole thing was centred
 * under pages that are not.
 */

const STYLES_DIR = resolve(__dirname, '..');
const WIDE = '(min-width: 736px)';

interface Rule {
  /** The enclosing `@media` prelude, or '' for a rule that always applies. */
  media: string;
  selectors: string[];
  declarations: Map<string, string>;
}

interface Chunk {
  prelude: string;
  body: string;
}

const squeeze = (text: string) => text.trim().replace(/\s+/g, ' ');

/** The outermost `prelude { body }` pairs of a stylesheet or an at-rule body. */
function chunks(css: string): Chunk[] {
  const found: Chunk[] = [];
  let depth = 0;
  let start = 0;
  let open = 0;

  for (let index = 0; index < css.length; index += 1) {
    if (css[index] === '{') {
      if (depth === 0) open = index;
      depth += 1;
    } else if (css[index] === '}') {
      depth -= 1;
      if (depth === 0) {
        found.push({
          prelude: squeeze(css.slice(start, open)),
          body: css.slice(open + 1, index),
        });
        start = index + 1;
      }
    }
  }

  return found;
}

function toRule({ prelude, body }: Chunk, media: string): Rule {
  const declarations = new Map<string, string>();
  for (const entry of body.split(';')) {
    const colon = entry.indexOf(':');
    if (colon !== -1) {
      declarations.set(
        entry.slice(0, colon).trim(),
        squeeze(entry.slice(colon + 1)),
      );
    }
  }

  return { media, selectors: prelude.split(',').map(squeeze), declarations };
}

function rulesIn(file: string): Rule[] {
  const css = readFileSync(join(STYLES_DIR, file), 'utf8').replace(
    /\/\*[\s\S]*?\*\//g,
    '',
  );

  return chunks(css).flatMap((chunk) =>
    chunk.prelude.startsWith('@media')
      ? chunks(chunk.body).map((inner) => toRule(inner, chunk.prelude))
      : [toRule(chunk, '')],
  );
}

/** True for a rule that applies from 736px whatever is doing the pointing. */
const fromWide = ({ media }: Rule) =>
  media.replace('screen and ', '') === `@media ${WIDE}`;

/** The left and right padding a `padding` shorthand resolves to. */
function sidesOf(padding: string | undefined): string | undefined {
  const [top, right = top, , left = right] = padding?.split(' ') ?? [];

  return right === left ? right : undefined;
}

/**
 * The side padding a selector ends up with: below 736px, or from it. Read from
 * `padding-inline` or from the `padding` shorthand, whichever the rule uses.
 */
function gutter(
  rules: Rule[],
  selector: string,
  wide: boolean,
): string | undefined {
  let value: string | undefined;
  for (const rule of rules) {
    const applies = rule.media === '' || (wide && fromWide(rule));
    if (applies && rule.selectors.includes(selector)) {
      value =
        rule.declarations.get('padding-inline') ??
        sidesOf(rule.declarations.get('padding')) ??
        value;
    }
  }

  return value;
}

const rem = (value: string | undefined) =>
  value?.endsWith('rem') ? Number.parseFloat(value) : Number.NaN;

const footer = rulesIn('layout/footer.css');
const page = rulesIn('layout/page.css');

describe('footer layout', () => {
  it('reads these stylesheets the way the checks below assume', () => {
    expect(sidesOf('2rem 1.5rem')).toBe('1.5rem');
    expect(sidesOf('1rem')).toBe('1rem');
    expect(sidesOf('1rem 2rem 3rem 4rem')).toBeUndefined();
    expect(gutter(page, '.page-main', false)).toBe('1.5rem');
    expect(gutter(page, '.page-main', true)).toBe('2rem');
  });

  it('sits on the same rails as the page above it, at every width', () => {
    const measure = (rules: Rule[], selector: string) =>
      rules
        .find((rule) => rule.media === '' && rule.selectors.includes(selector))
        ?.declarations.get('max-width');

    expect(measure(footer, '.footer-content')).toBe('var(--measure-page)');
    expect(measure(footer, '.footer-content')).toBe(
      measure(page, '.page-main'),
    );
    for (const wide of [false, true]) {
      expect(gutter(footer, '.footer-content', wide)).toBe(
        gutter(page, '.page-main', wide),
      );
    }
  });

  // The second layer of side padding is what set the footer inside the page.
  it('adds no side padding outside those rails', () => {
    const padded = footer
      .filter((rule) => rule.selectors.includes('.site-footer-new'))
      .flatMap((rule) => [...rule.declarations.keys()])
      .filter((property) =>
        /^padding(?:-inline(?:-start|-end)?|-left|-right)?$/.test(property),
      );

    expect(padded).toEqual([]);
  });

  it('makes every link a 44px target unless a mouse is doing the pointing', () => {
    const always = footer.filter(
      (rule) => rule.media === '' && rule.selectors.includes('.footer-link'),
    );
    const last = (property: string) =>
      always
        .findLast((rule) => rule.declarations.has(property))
        ?.declarations.get(property);

    // Padding makes the height: the type stays the size it is.
    expect(
      rem(last('line-height')) + 2 * rem(last('padding-block')),
    ).toBeGreaterThanOrEqual(2.75);

    // The short labels are widened to the same size where they can be hit.
    expect(
      footer
        .find((rule) => rule.selectors.includes('.footer-link::after'))
        ?.declarations.get('min-width'),
    ).toBe('2.75rem');

    // Whatever makes a link shorter needs a wide screen and a fine pointer,
    // so a tablet in the wide layout keeps the full targets.
    const shorter = footer.filter(
      (rule) =>
        rule.media !== '' &&
        rule.selectors.includes('.footer-link') &&
        ['padding', 'padding-block', 'line-height', 'min-height'].some(
          (property) => rule.declarations.has(property),
        ),
    );

    expect(shorter.length).toBeGreaterThan(0);
    for (const rule of shorter) {
      expect(rule.media).toContain(WIDE);
      expect(rule.media).toContain('(pointer: fine)');
    }
  });

  it('centres nothing', () => {
    const ALIGNMENT =
      /^(?:text-align|justify-(?:content|items|self)|align-(?:items|self)|place-(?:content|items|self))$/;
    const centred = footer.flatMap((rule) =>
      [...rule.declarations]
        .filter(
          ([property, value]) =>
            ALIGNMENT.test(property) && /\bcenter\b/.test(value),
        )
        .map(
          ([property, value]) =>
            `${rule.selectors.join(', ')} { ${property}: ${value} }`,
        ),
    );

    expect(centred).toEqual([]);
  });
});
