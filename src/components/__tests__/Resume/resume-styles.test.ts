import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

/**
 * How the résumé reads is decided in stylesheets jsdom never loads, so these
 * read the rules themselves. They hold the decisions the page once had the
 * other way round — the role and the dates as 11px tracked capitals in grey,
 * the bullets in the secondary ink, a tier that changed weight — and the ones
 * a screenshot cannot show, such as a bullet mark that was on the screen and
 * in no PDF. Whether the result is any good still takes a browser.
 */

const read = (file: string) => readFileSync(join(process.cwd(), file), 'utf8');

const CARDS_CSS = read('app/styles/components/cards.css');
const TAGS_CSS = read('app/styles/components/tags.css');
const RESUME_CSS = read('app/styles/pages/resume.css');
const PRINT_CSS = read('app/styles/print.css');
const FORCED_COLORS_CSS = read('app/styles/forced-colors.css');
const ENTRY_CSS = read('app/tailwind.css');

interface Rule {
  /** The `@media` condition the rule sits under, or '' at the top level. */
  media: string;
  selectors: string[];
  declarations: Map<string, string>;
}

/**
 * Every style rule in a stylesheet, with the media query it sits under.
 * Comments are stripped first so a selector cannot pick up prose from the
 * comment above it.
 */
function rulesOf(css: string): Rule[] {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules: Rule[] = [];
  const pattern = /(@media[^{]+)\{|([^{}@]+)\{([^{}]*)\}|\}/g;
  let media = '';

  for (const match of stripped.matchAll(pattern)) {
    if (match[1]) {
      media = match[1].replace(/^@media/, '').trim();
    } else if (match[2] !== undefined) {
      rules.push({
        media,
        selectors: match[2]
          .split(',')
          .map((selector) => selector.trim().replace(/\s+/g, ' '))
          .filter(Boolean),
        declarations: new Map(
          match[3]
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
    } else {
      // A closing brace with no rule in front of it ends the media block.
      media = '';
    }
  }

  return rules;
}

/** Selectors that belong to the résumé's sections. */
const RESUME_SELECTOR =
  /\.(?:jobs-container|job-|daterange|summary|points|degree-container|course|skill-|resume-note|experience-spine)/;

const isResumeRule = (rule: Rule) =>
  rule.selectors.some((selector) => RESUME_SELECTOR.test(selector));

const SCREEN_RULES = [
  ...rulesOf(CARDS_CSS),
  ...rulesOf(TAGS_CSS),
  ...rulesOf(RESUME_CSS),
].filter((rule) => isResumeRule(rule) && rule.media !== 'print');

const PRINT_RULES = rulesOf(PRINT_CSS).filter(isResumeRule);

/**
 * What the rules naming exactly this selector declare between them, later
 * rules over earlier ones as the cascade would have it. On screen only the
 * rules outside any media query count: the base, not an override of it.
 */
function ruleFor(selector: string, rules: Rule[] = SCREEN_RULES) {
  const matching = rules.filter(
    (candidate) =>
      candidate.selectors.includes(selector) &&
      (rules !== SCREEN_RULES || candidate.media === ''),
  );
  if (matching.length === 0) throw new Error(`no rule for ${selector}`);

  return new Map(matching.flatMap((rule) => [...rule.declarations]));
}

describe('résumé styles', () => {
  it('parses the rules it is asserting about', () => {
    // If the parser stopped finding rules, everything below could pass by
    // matching nothing.
    expect(SCREEN_RULES.length).toBeGreaterThan(30);
    expect(PRINT_RULES.length).toBeGreaterThan(10);
    expect(SCREEN_RULES.flatMap((rule) => rule.selectors)).toContain(
      '.job-position',
    );
  });

  /**
   * 634 of the page's characters were 11px tracked capitals, and they were
   * the role and the dates. Nothing a reader has to read is transformed,
   * label-tracked, or set at the annotation size.
   */
  it('sets no small tracked capitals', () => {
    for (const rule of SCREEN_RULES) {
      const values = [...rule.declarations.values()];

      expect(rule.declarations.has('text-transform'), rule.selectors[0]).toBe(
        false,
      );
      expect(values, rule.selectors[0]).not.toContain('var(--tracking-label)');
      expect(values, rule.selectors[0]).not.toContain('var(--tracking-wide)');
      expect(values, rule.selectors[0]).not.toContain('var(--text-2xs)');
    }
  });

  it('sets the role to be read at a glance', () => {
    const role = ruleFor('.job-position');

    expect(role.get('font-family')).toBe('var(--font-display)');
    expect(role.get('font-size')).toBe('var(--text-sm)');
    expect(role.get('font-weight')).toBe('var(--font-weight-medium)');
    expect(role.get('color')).toBe('var(--color-fg)');
  });

  it('sets dates as data: mono, 12px, in the case they were written', () => {
    const dates = ruleFor('.daterange');

    expect(dates.get('font-family')).toBe('var(--font-mono)');
    expect(dates.get('font-size')).toBe('var(--text-xs)');
    expect(dates.has('letter-spacing')).toBe(false);
  });

  /**
   * The projects register borrows these two classes for its own date ranges,
   * so their names and what they do are not this file's alone to change.
   */
  it('keeps Present in the signal colour and the dash quiet', () => {
    expect(ruleFor('.daterange-present').get('color')).toBe(
      'var(--color-signal)',
    );
    expect(ruleFor('.daterange-sep').get('color')).toBe(
      'var(--color-border-alt)',
    );
  });

  /** Amber means a live value. It is not spent on anything else here. */
  it('spends the signal colour on nothing but a role still in progress', () => {
    const signalled = SCREEN_RULES.filter((rule) =>
      [...rule.declarations.values()].some((value) =>
        value.includes('--color-signal'),
      ),
    ).flatMap((rule) => rule.selectors);

    expect(signalled).toEqual([
      '.daterange-present',
      '.jobs-container--current .job-marker',
    ]);
  });

  /** Education titles were Inter regular beside experience titles in bold. */
  it('titles a degree and a company with one rule', () => {
    const title = SCREEN_RULES.find((rule) =>
      rule.selectors.includes('.jobs-container header h3'),
    );

    expect(title?.selectors).toContain('.degree-container .degree');
    expect(title?.declarations.get('font-family')).toBe('var(--font-body)');
    expect(title?.declarations.get('font-weight')).toBe(
      'var(--font-weight-medium)',
    );
  });

  describe('tiers', () => {
    const tiered = SCREEN_RULES.filter((rule) =>
      rule.selectors.some((selector) =>
        /\.jobs-container--(?:lead|early)\b/.test(selector),
      ),
    );

    it('steps the company name down the type scale', () => {
      expect([
        ruleFor('.jobs-container--lead').get('--job-title'),
        ruleFor('.jobs-container').get('--job-title'),
        ruleFor('.jobs-container--early').get('--job-title'),
      ]).toEqual(['var(--text-xl)', 'var(--text-lg)', 'var(--text-md)']);
      expect(ruleFor('.jobs-container header h3').get('font-size')).toBe(
        'var(--job-title)',
      );
    });

    /**
     * A tier is a step in size and spacing. The lead used to take the black
     * weight as well, and the early tier a lighter ink.
     */
    it('lets a tier change sizes and spacing, never face, weight, or ink', () => {
      expect(tiered.length).toBeGreaterThanOrEqual(5);

      for (const rule of tiered) {
        for (const property of [
          'font-family',
          'font-weight',
          'font-style',
          'color',
          'letter-spacing',
          'opacity',
        ]) {
          expect(
            rule.declarations.has(property),
            `${rule.selectors[0]} sets ${property}`,
          ).toBe(false);
        }
      }
    });

    it('keeps the early tier at 14px or more', () => {
      const sizes = tiered
        .filter((rule) =>
          rule.selectors.some((selector) => selector.includes('--early')),
        )
        .map((rule) => rule.declarations.get('font-size'))
        .filter(Boolean);

      expect(sizes.length).toBeGreaterThan(0);
      for (const size of sizes) {
        expect(['var(--text-sm)', 'var(--text-base)']).toContain(size);
      }
    });
  });

  /** Summary and bullets were the secondary grey: the body read as an aside. */
  it('sets summaries and bullets in ink', () => {
    expect(ruleFor('.summary').get('color')).toBe('var(--color-fg)');

    const greyed = SCREEN_RULES.filter(
      (rule) =>
        rule.selectors.some((selector) =>
          /\.summary$|\.points li$/.test(selector),
        ) && rule.declarations.get('color') === 'var(--color-fg-light)',
    );

    expect(greyed).toEqual([]);
  });

  /**
   * Browsers leave backgrounds off a printed page unless asked for them, so a
   * dash drawn as a filled box was on the screen and in no PDF.
   */
  it('draws the bullet dash with a border, which prints', () => {
    const dash = ruleFor('.jobs-container .points li::before');

    expect(dash.get('border-top')).toMatch(/solid/);
    expect(dash.has('background')).toBe(false);
    expect(dash.has('background-color')).toBe(false);
  });

  it('makes a company or school link unmistakable under pointer and keyboard', () => {
    const active = SCREEN_RULES.find((rule) =>
      rule.selectors.includes('.job-company:focus-visible'),
    );

    expect(active?.selectors).toEqual(
      expect.arrayContaining([
        '.job-company:hover',
        '.degree-container .school a:hover',
        '.degree-container .school a:focus-visible',
      ]),
    );
    expect(active?.declarations.get('color')).toBe('var(--color-accent)');
    expect(active?.declarations.get('text-decoration')).toBe('underline');
  });

  describe('courses', () => {
    it('aligns code and title on the first baseline, in a 44px target', () => {
      const row = ruleFor('.course-container a');

      expect(row.get('align-items')).toBe('baseline');
      expect(row.get('min-height')).toBe('2.75rem');
    });
  });

  describe('skills', () => {
    it('labels a group in the display face, as written', () => {
      const title = ruleFor('.skill-group-title');

      expect(title.get('font-family')).toBe('var(--font-display)');
      expect(title.get('font-size')).toBe('var(--text-ui)');
      expect(title.get('color')).toBe('var(--color-fg-light)');
    });

    /**
     * Deep and working used to differ by a step of weight at 12px. Depth is
     * the order of the list now, and one tier takes one fainter tone.
     */
    it('gives the familiar tier the fainter ink and no other tier a look', () => {
      const tiers = SCREEN_RULES.filter((rule) =>
        rule.selectors.some((selector) => /\.skill-tag--/.test(selector)),
      );

      expect(tiers.map((rule) => rule.selectors)).toEqual([
        ['.skill-tag--familiar'],
      ]);
      expect([...tiers[0].declarations]).toEqual([
        ['color', 'var(--color-fg-light)'],
      ]);
    });

    it('lets a tag answer the pointer no more than any other word', () => {
      const interactive = SCREEN_RULES.flatMap((rule) => rule.selectors).filter(
        (selector) => /\.skill-[\w-]*:(?:hover|focus|active)/.test(selector),
      );

      expect(interactive).toEqual([]);
    });

    it('leaves no rule, stylesheet, or import behind for the filter', () => {
      const everywhere = [
        CARDS_CSS,
        TAGS_CSS,
        RESUME_CSS,
        PRINT_CSS,
        FORCED_COLORS_CSS,
        ENTRY_CSS,
      ].join('\n');

      expect(everywhere).not.toMatch(/skillbutton|skill-button|skill-bar/);
      expect(PRINT_CSS).not.toMatch(/\[hidden\]/);
      expect(
        existsSync(join(process.cwd(), 'app/styles/components/skill-bar.css')),
      ).toBe(false);
    });
  });

  /**
   * A sheet of paper can be narrower than the one-column breakpoint in CSS
   * pixels. A printed résumé keeps its gutter, so those layouts are for
   * screens, not for every medium.
   */
  it('keeps the one-column layouts off paper', () => {
    const narrow = SCREEN_RULES.filter((rule) =>
      /max-width:\s*760px/.test(rule.media),
    );

    expect(narrow.length).toBeGreaterThan(3);
    for (const rule of narrow) {
      expect(rule.media, rule.selectors[0]).toMatch(/^screen and /);
    }
  });

  describe('on paper', () => {
    it('sets role and dates in points, smaller than the copy they label', () => {
      const points = (selector: string, property = 'font-size') =>
        Number.parseFloat(ruleFor(selector, PRINT_RULES).get(property) ?? '');

      const copy = points('.summary');

      expect(ruleFor('.summary', PRINT_RULES).get('font-size')).toMatch(/pt$/);
      expect(points('.job-position')).toBeLessThan(copy);
      expect(points('.daterange')).toBeLessThan(points('.job-position'));
      expect(points('.daterange')).toBeGreaterThanOrEqual(8);
    });

    it('keeps every company under the 14pt section heading', () => {
      const sizes = [
        '.jobs-container--lead header h3',
        '.jobs-container--primary header h3',
        '.jobs-container--early header h3',
      ].map((selector) =>
        Number.parseFloat(
          ruleFor(selector, PRINT_RULES).get('font-size') ?? '',
        ),
      );

      expect(sizes).toEqual([...sizes].sort((a, b) => b - a));
      expect(sizes[0]).toBeLessThan(14);
    });

    /**
     * A role may run on to the next page, but only between two bullets: a
     * company name once ended a page with its role at the top of the next.
     */
    it('breaks a long role between bullets and nowhere else', () => {
      const whole = PRINT_RULES.find(
        (rule) =>
          rule.selectors.includes('.jobs-container header') &&
          rule.declarations.get('break-inside') === 'avoid',
      );
      const attached = PRINT_RULES.find(
        (rule) =>
          rule.selectors.includes('.jobs-container header') &&
          rule.declarations.get('break-after') === 'avoid',
      );

      expect(ruleFor('.jobs-container', PRINT_RULES).get('break-inside')).toBe(
        'auto',
      );
      expect(whole?.selectors).toEqual(
        expect.arrayContaining(['.summary', '.jobs-container .points li']),
      );
      expect(attached?.selectors).toContain('.summary');
    });

    /**
     * On screen a course row's wash hangs half a rem outside the column on
     * each side. Anything wider than the sheet makes the browser scale every
     * page down to fit it, and with that overhang the résumé printed 1% small.
     */
    it('takes back the overhang that would make the browser scale the page down', () => {
      expect(ruleFor('.course-container a').get('margin')).toMatch(/-/);
      expect(ruleFor('.course-container a', PRINT_RULES).get('margin')).toBe(
        '0',
      );
    });

    it('drops the sentence about a tone that paper cannot show', () => {
      expect(
        ruleFor('.skill-tier-legend-tone', PRINT_RULES).get('display'),
      ).toBe('none');
    });
  });
});
