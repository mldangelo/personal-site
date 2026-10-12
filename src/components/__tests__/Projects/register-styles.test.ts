import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

/**
 * How the projects register looks is decided in a stylesheet jsdom never
 * loads, so these read the rules themselves. They hold the decisions the page
 * once had the other way round — picture cards for student projects over small
 * grey rows for the real work — and nothing else; whether the result is any
 * good still takes a browser and a pair of eyes.
 */

const CARDS_CSS = readFileSync(
  join(process.cwd(), 'app/styles/components/cards.css'),
  'utf8',
);

interface Rule {
  selectors: string[];
  declarations: Map<string, string>;
}

/**
 * Every rule that styles the projects page, wherever it sits in the file and
 * whatever `@media` block wraps it. Comments are stripped first so a selector
 * cannot pick up prose from the comment above it.
 */
function registerRules(css: string): Rule[] {
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
      rule.selectors.some((selector) => /\.projects?-/.test(selector)),
    );
}

const RULES = registerRules(CARDS_CSS);
const SELECTORS = RULES.flatMap((rule) => rule.selectors);

/** The first rule declared for exactly this selector, outside any override. */
function ruleFor(selector: string): Map<string, string> {
  const rule = RULES.find((candidate) =>
    candidate.selectors.includes(selector),
  );
  if (!rule) throw new Error(`no rule for ${selector}`);
  return rule.declarations;
}

describe('projects register styles', () => {
  it('parses the rules it is asserting about', () => {
    // If the parser stopped finding rules, everything below could pass by
    // matching nothing.
    expect(RULES.length).toBeGreaterThan(12);
    expect(SELECTORS).toContain('.project-entry');
  });

  /**
   * Hierarchy is a size step in one typeface, read from the data: a tier that
   * also changed weight or colour is how the archive came to out-shout the
   * work above it.
   */
  it('steps the title down by tier', () => {
    const title = ruleFor('.project-entry-title');
    const live = ruleFor('.project-entry--live .project-entry-title');
    const archive = ruleFor('.project-entry--archive .project-entry-title');

    expect(title.get('font-family')).toBe('var(--font-body)');
    expect([
      live.get('font-size'),
      title.get('font-size'),
      archive.get('font-size'),
    ]).toEqual(['var(--text-xl)', 'var(--text-lg)', 'var(--text-md)']);
  });

  it('lets a tier change a size and nothing else', () => {
    const tiered = RULES.filter((rule) =>
      rule.selectors.some((selector) =>
        /\.project-entry--(?:live|archive)\b/.test(selector),
      ),
    );

    expect(tiered.length).toBeGreaterThanOrEqual(2);
    for (const rule of tiered) {
      expect([...rule.declarations.keys()], rule.selectors[0]).toEqual([
        'font-size',
      ]);
    }
  });

  /** They were 14px in the secondary grey, at over a hundred characters. */
  it('sets descriptions as primary copy on a bounded measure', () => {
    const description = ruleFor('.project-entry-desc');

    expect(description.get('font-size')).toBe('var(--text-base)');
    expect(description.get('color')).toBe('var(--color-fg)');
    expect(description.get('max-width')).toMatch(/^\d+ch$/);
  });

  /**
   * A quarter of this page was 11px tracked capitals. Nothing a reader has to
   * read is transformed, label-tracked, or set at the annotation size.
   */
  it('sets no small tracked capitals', () => {
    for (const rule of RULES) {
      const values = [...rule.declarations.values()];

      expect(rule.declarations.has('text-transform'), rule.selectors[0]).toBe(
        false,
      );
      expect(values, rule.selectors[0]).not.toContain('var(--tracking-label)');
      expect(values, rule.selectors[0]).not.toContain('var(--text-2xs)');
    }
  });

  /**
   * The screenshots run from 1.49:1 to 2.35:1. Fitted whole into one frame,
   * each showed a different amount of grey bar; cropped to it, none does.
   */
  it('crops every thumbnail to one frame', () => {
    const thumbnail = ruleFor('.project-entry-thumb');

    expect(thumbnail.get('object-fit')).toBe('cover');
    expect(thumbnail.get('aspect-ratio')).toBe('16 / 10');
  });

  /** A row with no destination must not look as if it had one. */
  it('lets only a linked row answer the pointer', () => {
    const interactive = SELECTORS.filter((selector) =>
      /:(?:hover|focus|active)/.test(selector),
    );

    expect(interactive.length).toBeGreaterThan(0);
    for (const selector of interactive) {
      expect(selector).toMatch(/^a\.project-entry:/);
    }
    for (const rule of RULES) {
      expect(rule.declarations.has('cursor'), rule.selectors[0]).toBe(false);
    }
  });

  it('keeps no rule for the cards the archive used to be', () => {
    expect(
      SELECTORS.filter((selector) =>
        /project-card|projects-grid|project-note/.test(selector),
      ),
    ).toEqual([]);
  });
});
