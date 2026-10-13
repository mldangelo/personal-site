import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

/**
 * How `/stats` looks is decided in a stylesheet jsdom never loads, so these
 * read the rules themselves. They hold the decisions the page once had the
 * other way round: labels in tracked capitals, a source tag under every row,
 * and linked values in the accent colour beside an amber one. Whether the
 * result is any good still takes a browser.
 */

const CONTENT_CSS = readFileSync(
  join(process.cwd(), 'app/styles/pages/content.css'),
  'utf8',
);

/** Page titles share one weight across the site and are set elsewhere. */
const NOT_THIS_PAGE = /^\.stats-title$/;

interface Rule {
  selectors: string[];
  declarations: Map<string, string>;
}

/**
 * Every rule that styles the stats page, wherever it sits in the file and
 * whatever `@media` block wraps it. Comments are stripped first so a selector
 * cannot pick up prose from the comment above it.
 */
function statsRules(css: string): Rule[] {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '');

  return [...stripped.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .map((match) => ({
      selectors: match[1]
        .split(',')
        .map((selector) => selector.trim().replace(/\s+/g, ' '))
        .filter(Boolean),
      declarations: new Map(
        match[2]
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
    }))
    .filter((rule) =>
      rule.selectors.some(
        (selector) =>
          /\.stats?-/.test(selector) && !NOT_THIS_PAGE.test(selector),
      ),
    );
}

const RULES = statsRules(CONTENT_CSS);
const SELECTORS = RULES.flatMap((rule) => rule.selectors);

/** The first rule declared for exactly this selector, outside any override. */
function ruleFor(selector: string): Map<string, string> {
  const rule = RULES.find((candidate) =>
    candidate.selectors.includes(selector),
  );
  if (!rule) throw new Error(`no rule for ${selector}`);
  return rule.declarations;
}

/** Every rule that sets `property`, as `selector: value`. */
function declaring(property: string): string[] {
  return RULES.filter((rule) => rule.declarations.has(property)).map(
    (rule) =>
      `${rule.selectors.join(', ')}: ${rule.declarations.get(property)}`,
  );
}

describe('stats readout styles', () => {
  it('parses the rules it is asserting about', () => {
    // If the parser stopped finding rules, everything below could pass by
    // matching nothing.
    expect(RULES.length).toBeGreaterThan(12);
    expect(SELECTORS).toContain('.stat-table-link');
    expect(SELECTORS).not.toContain('.stats-title');
  });

  /**
   * "STARS THIS REPOSITORY HAS ON GITHUB" was 13px tracked mono capitals. A
   * label is a phrase to read, so it is set as one.
   */
  it('sets a label as a phrase, in the reading face', () => {
    const label = ruleFor('.stat-table-label');

    expect(label.get('font-family')).toBe('var(--font-body)');
    expect(label.get('font-size')).toBe('var(--text-base)');
    expect(label.get('font-weight')).toBe('var(--font-weight-normal)');
    expect(label.get('color')).toBe('var(--color-fg)');
  });

  /**
   * 43% of the text on this page was 11px. Nothing a reader has to read is
   * transformed, tracked, or set at the annotation size.
   */
  it('sets no small tracked capitals', () => {
    expect(declaring('text-transform')).toEqual([]);
    expect(declaring('letter-spacing')).toEqual([]);
    expect(
      declaring('font-size').filter((size) => size.includes('--text-2xs')),
    ).toEqual([]);
  });

  /** A source is data about the readings, so its caption is mono, at 12px. */
  it('sets a caption as data and a note as a sentence', () => {
    const caption = ruleFor('.stat-table-caption');
    const note = ruleFor('.stats-source-note');

    expect(caption.get('font-family')).toBe('var(--font-mono)');
    expect(caption.get('font-size')).toBe('var(--text-xs)');
    expect(caption.get('color')).toBe('var(--color-fg-light)');
    // The note inherits the reading face; naming a family would be the mono
    // it used to be set in.
    expect(note.has('font-family')).toBe(false);
    expect(note.get('font-size')).toBe('var(--text-sm)');
  });

  /**
   * A linked value was accent blue with nothing under it, so colour was the
   * only sign of a link. It is the ink of every other value, over a rule —
   * and the rule is then the only sign, so it has to be one a reader can
   * find. `--color-control-border` is the token `contrast.test.ts` holds to
   * 3:1 on both page surfaces; the structural hairline measured 1.61:1 here.
   */
  it('draws a linked value in ink over a rule that can be seen', () => {
    const link = ruleFor('.stat-table-link');

    expect(link.get('color')).toBe('inherit');
    expect(link.get('text-decoration')).toBe('underline');
    expect(link.get('text-decoration-color')).toBe(
      'var(--color-control-border)',
    );
    expect(link.get('text-decoration-thickness')).toBe('var(--rule)');
  });

  /**
   * Beside an amber age, blue numbers read as a second data colour: a blue
   * date over a black one looked like a difference between the dates.
   */
  it('lets the accent answer the pointer and nothing else', () => {
    const accented = RULES.filter((rule) =>
      [...rule.declarations.values()].some((value) =>
        value.includes('--color-accent'),
      ),
    );

    expect(accented.flatMap((rule) => rule.selectors)).toEqual([
      '.stat-table-link:hover',
      '.stat-table-link:focus-visible',
    ]);
    expect(accented[0].declarations.get('color')).toBe('var(--color-accent)');
    expect(accented[0].declarations.get('text-decoration-color')).toBe(
      'var(--color-accent)',
    );
  });

  it('keeps amber for the one value that is live', () => {
    const amber = RULES.filter((rule) =>
      [...rule.declarations.values()].some((value) =>
        value.includes('--color-signal'),
      ),
    );

    expect(amber.flatMap((rule) => rule.selectors)).toEqual([
      ".stat-readout-value[data-live='true']",
    ]);
  });

  /**
   * A build that shipped last-known numbers must not look like one that
   * fetched them, and must not borrow the colour that means "live" to say so.
   */
  it('flags a table of last-known numbers in ink, on its caption and its note', () => {
    const caption = ruleFor(
      ".stat-table[data-source='fallback'] .stat-table-caption",
    );
    const note = ruleFor(".stats-source-note[data-source='fallback']");

    expect(caption.get('color')).toBe('var(--color-fg)');
    expect(note.get('color')).toBe('var(--color-fg)');
    expect(note.get('border-left')).toBe(
      'var(--rule-strong) solid var(--color-border-alt)',
    );
  });

  /**
   * The label column was fixed at 40%, which is 137px of a phone. With no
   * widths declared, a value's column hugs its widest value and the label has
   * the rest. That only holds while a value cannot break.
   */
  it('sizes the columns by what is in them', () => {
    const cells = RULES.filter((rule) =>
      rule.selectors.some((selector) =>
        /^\.stat-table-(?:label|value)\b/.test(selector),
      ),
    );

    expect(cells.length).toBeGreaterThanOrEqual(2);
    for (const rule of cells) {
      expect(rule.declarations.has('width'), rule.selectors[0]).toBe(false);
    }
    expect(ruleFor('.stat-table-value').get('white-space')).toBe('nowrap');
    // Only a value marked as too long to fit a phone may wrap. Letting every
    // value wrap made the browser split "29 packages" to spare a long label.
    expect(
      declaring('white-space').filter((rule) => rule.endsWith(': normal')),
    ).toEqual(['.stat-table-value--long: normal']);
  });

  /**
   * Rather than leave a short last line, the note broke the repository's name
   * at its hyphen on every phone from 320px to 370px wide.
   */
  it('keeps a name inside a note in one piece', () => {
    expect(ruleFor('.stats-source-note span').get('white-space')).toBe(
      'nowrap',
    );
  });

  /**
   * On A4 the first page ended on a caption whose rows began overleaf, and
   * elsewhere a note opened a page without the table it is about. Chrome does
   * not honour `break-after` on a caption, so the table is what holds.
   */
  it('keeps a printed table whole, and its note with it', () => {
    expect(declaring('break-inside')).toEqual(['.stat-table: avoid']);
    expect(declaring('break-before')).toEqual(['.stats-source-note: avoid']);
  });

  it('keeps no rule for the row tags or the old section label', () => {
    expect(
      SELECTORS.filter((selector) =>
        /stat-provenance|stats-section-title|stat-table-label-text/.test(
          selector,
        ),
      ),
    ).toEqual([]);
  });
});
