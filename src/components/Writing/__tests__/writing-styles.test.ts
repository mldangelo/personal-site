import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

/**
 * How the index and an article are set is decided in a stylesheet jsdom never
 * loads, so these read the rules themselves. They hold the decisions the pages
 * once had the other way round — a title in three voices, dates as tracked
 * capitals, eighty characters to a line — and nothing else; whether the result
 * is any good still takes a browser and a pair of eyes.
 */

const STYLES = join(process.cwd(), 'app/styles');
const read = (file: string) => readFileSync(join(STYLES, file), 'utf8');

const WRITING_CSS = read('pages/writing.css');

interface Rule {
  /** The `@media` prelude the rule sits in, or null at the top level. */
  media: string | null;
  selectors: string[];
  declarations: Map<string, string>;
}

/**
 * Every rule in a stylesheet, with the media query around it. Comments are
 * stripped first so a selector cannot pick up prose from the comment above it.
 */
function parseRules(css: string): Rule[] {
  const rules: Rule[] = [];

  const walk = (source: string, media: string | null): void => {
    let depth = 0;
    let preludeStart = 0;
    let bodyStart = 0;

    for (let index = 0; index < source.length; index += 1) {
      if (source[index] === '{') {
        if (depth === 0) bodyStart = index + 1;
        depth += 1;
      } else if (source[index] === '}') {
        depth -= 1;
        if (depth !== 0) continue;

        const prelude = source.slice(preludeStart, bodyStart - 1).trim();
        const body = source.slice(bodyStart, index);
        preludeStart = index + 1;

        if (prelude.startsWith('@media')) {
          walk(body, prelude.replace(/\s+/g, ' '));
          continue;
        }

        rules.push({
          media,
          // A comma separates selectors only outside `:is(h2, h3)`.
          selectors: prelude
            .split(/,(?![^(]*\))/)
            .map((selector) => selector.trim().replace(/\s+/g, ' ')),
          declarations: new Map(
            body
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
              }),
          ),
        });
      }
    }
  };

  walk(css.replace(/\/\*[\s\S]*?\*\//g, ''), null);
  return rules;
}

const RULES = parseRules(WRITING_CSS);

/** The declarations for exactly this selector, in this media query or none. */
function ruleFor(
  selector: string,
  media: string | null = null,
): Map<string, string> {
  const rule = RULES.find(
    (candidate) =>
      candidate.media === media && candidate.selectors.includes(selector),
  );
  if (!rule) {
    throw new Error(`no rule for ${selector}${media ? ` in ${media}` : ''}`);
  }

  return rule.declarations;
}

/** On screens only: a printed article is set the same on any paper. */
const WIDE = '@media screen and (min-width: 736px)';
const NARROW = '@media (max-width: 735px)';

describe('writing styles', () => {
  it('parses the rules it is asserting about', () => {
    // If the parser stopped finding rules, everything below could pass by
    // matching nothing.
    expect(RULES.length).toBeGreaterThan(60);
    expect(RULES.some((rule) => rule.media === WIDE)).toBe(true);
    expect(RULES.some((rule) => rule.media === '@media print')).toBe(true);
  });

  /**
   * 18px in the 640px reading column ran to about 80 characters a line and up
   * to 96. The token, not a literal, so the size stays on the scale.
   */
  it('sets long-form prose at the reading size once the column is its full width', () => {
    const token = read('tokens/typography.css').match(
      /--text-reading:\s*([^;]+);/,
    )?.[1];

    expect(token).toBe('1.25rem');
    expect(ruleFor('.prose').get('font-size')).toBe('var(--text-md)');
    expect(ruleFor('.prose', WIDE).get('font-size')).toBe(
      'var(--text-reading)',
    );
  });

  it('steps the article title up with the prose, to the size page titles take', () => {
    expect(ruleFor('.post-title').get('font-size')).toBe('var(--text-2xl)');
    expect(ruleFor('.post-title', WIDE).get('font-size')).toBe(
      'var(--text-3xl)',
    );
  });

  it('never sets the standfirst smaller than the prose it introduces', () => {
    expect(ruleFor('.post-description').get('font-size')).toBe(
      'var(--text-md)',
    );
    expect(ruleFor('.post-description', WIDE).get('font-size')).toBe(
      'var(--text-lg)',
    );
  });

  /**
   * One essay title was Newsreader on the homepage, bold Inter on the index,
   * and the heaviest Inter on its own page.
   */
  it('sets a title in the reading face at one weight, wherever it appears', () => {
    for (const selector of ['.writing-title', '.post-title']) {
      const title = ruleFor(selector);

      expect(title.get('font-family'), selector).toBe('var(--font-body)');
      expect(title.get('font-weight'), selector).toBe(
        'var(--font-weight-medium)',
      );
    }

    const sectionTitle = RULES.find(
      (rule) =>
        rule.selectors.includes('.prose h2') &&
        rule.selectors.includes('.prose h3'),
    )?.declarations;

    expect(sectionTitle?.get('font-family')).toBe('var(--font-body)');
    expect(sectionTitle?.get('font-weight')).toBe('var(--font-weight-medium)');
    // Inherited from the page, so the block cannot pick a second face.
    expect(ruleFor('.post-onward-title').has('font-family')).toBe(false);
    expect(ruleFor('.post-onward-title').get('font-weight')).toBe(
      'var(--font-weight-medium)',
    );
  });

  it('lets the lead of the index differ from the rest by a size and nothing else', () => {
    const featured = RULES.filter((rule) =>
      rule.selectors.some((selector) => selector.includes('--featured')),
    );

    expect(featured.length).toBeGreaterThan(0);
    for (const rule of featured) {
      expect([...rule.declarations.keys()], rule.selectors[0]).toEqual([
        'font-size',
      ]);
    }
    expect([
      ruleFor('.writing-item--featured .writing-title').get('font-size'),
      ruleFor('.writing-title').get('font-size'),
    ]).toEqual(['var(--text-xl)', 'var(--text-lg)']);
  });

  /**
   * The shared section heading drops a size below 736px. A lead title that did
   * not follow it would be larger than the heading of its own section.
   */
  it('steps the index titles down where the shared section heading does', () => {
    const sectionHeader = parseRules(read('components/section-header.css'));
    const heading = (media: string | null) =>
      sectionHeader
        .find(
          (rule) =>
            rule.media === media && rule.selectors.includes('.section-heading'),
        )
        ?.declarations.get('font-size');

    expect(heading(null)).toBe(
      ruleFor('.writing-item--featured .writing-title').get('font-size'),
    );
    expect(heading(NARROW)).toBe(
      ruleFor('.writing-item--featured .writing-title', NARROW).get(
        'font-size',
      ),
    );
    expect(ruleFor('.writing-title', NARROW).get('font-size')).toBe(
      'var(--text-md)',
    );
  });

  /**
   * Dates, sources, the fence's language, and figure captions were 11px mono,
   * most of it in tracked capitals.
   */
  it('sets no small tracked capitals', () => {
    for (const rule of RULES) {
      const values = [...rule.declarations.values()];

      expect(rule.declarations.has('text-transform'), rule.selectors[0]).toBe(
        false,
      );
      expect(values, rule.selectors[0]).not.toContain('var(--tracking-label)');
      expect(values, rule.selectors[0]).not.toContain('var(--tracking-wide)');
      expect(values, rule.selectors[0]).not.toContain('var(--text-2xs)');
    }
  });

  it('keeps mono for data: a caption is a sentence, so it is not', () => {
    const mono = RULES.filter(
      (rule) => rule.declarations.get('font-family') === 'var(--font-mono)',
    ).flatMap((rule) => rule.selectors);

    expect(mono.sort()).toEqual(
      [
        '.post-date',
        '.post-onward-label',
        '.prose-fence-lang',
        '.writing-date',
        '.writing-source',
      ].sort(),
    );
    expect(ruleFor('.prose-figcaption').get('font-size')).toBe(
      'var(--text-base)',
    );
  });

  /**
   * Type sizes are tokens, so nothing lands off the scale — with one
   * exception, on purpose: inline code is sized against the text it sits in.
   * Fixed at 14px it was a footnote beside a 28px heading.
   */
  it('sizes inline code against its surroundings and nothing else that way', () => {
    const untokened = RULES.filter((rule) => {
      const size = rule.declarations.get('font-size');
      return size !== undefined && !/^var\(--text-[a-z0-9]+\)$/.test(size);
    });

    expect(untokened.map((rule) => rule.selectors.join(', ')).sort()).toEqual([
      '.prose :is(h2, h3) code',
      '.prose :not(pre) > code',
    ]);

    const inProse = ruleFor('.prose :not(pre) > code').get('font-size') ?? '';
    const inHeading = ruleFor('.prose :is(h2, h3) code').get('font-size') ?? '';

    expect(inProse).toMatch(/^0\.\d+em$/);
    expect(inHeading).toMatch(/^0\.\d+em$/);
    // A step smaller beside display-sized type, where the chip adds weight.
    expect(Number.parseFloat(inHeading)).toBeLessThan(
      Number.parseFloat(inProse),
    );
    // A fence is not inline: it keeps a size of its own.
    expect(ruleFor('.prose pre code').get('font-size')).toBe('var(--text-sm)');
  });

  it('gives each standalone control a 44px target', () => {
    expect(ruleFor('.writing-rss-link').get('min-height')).toBe('2.75rem');
    expect(ruleFor('.post-onward-link').get('min-height')).toBe('2.75rem');
    expect(ruleFor('.post-onward-link').get('min-width')).toBe('2.75rem');
  });

  it('takes the onward links off the printed page', () => {
    expect(ruleFor('.post-onward', '@media print').get('display')).toBe('none');
  });
});
