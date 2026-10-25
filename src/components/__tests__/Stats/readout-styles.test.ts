import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

/**
 * How `/stats` looks is decided in stylesheets jsdom never loads. These hold
 * only the decisions that span rules and would regress silently — which
 * colour may appear where, and which values may wrap — across every
 * stylesheet, not one file. Whether the page looks right still takes a
 * browser.
 */

const STYLES = join(process.cwd(), 'app/styles');

/** Every rule in every stylesheet that names a stats class. */
const RULES = readdirSync(STYLES, { recursive: true, encoding: 'utf8' })
  .filter((file) => file.endsWith('.css'))
  .flatMap((file) => {
    const css = readFileSync(join(STYLES, file), 'utf8').replace(
      /\/\*[\s\S]*?\*\//g,
      '',
    );
    return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((match) => ({
      selectors: match[1].split(',').map((selector) => selector.trim()),
      body: match[2],
    }));
  })
  .filter((rule) =>
    rule.selectors.some((selector) => /\.stats?-/.test(selector)),
  );

/** The selectors of every stats rule whose body matches `pattern`. */
function selectorsDeclaring(pattern: RegExp): string[] {
  return RULES.filter((rule) => pattern.test(rule.body)).flatMap(
    (rule) => rule.selectors,
  );
}

describe('stats readout styles', () => {
  it('finds the rules it asserts about', () => {
    // If the reader stopped finding rules, everything below would pass by
    // matching nothing.
    expect(RULES.length).toBeGreaterThan(12);
  });

  it('keeps amber for the one value that is live', () => {
    expect(selectorsDeclaring(/--color-signal/)).toEqual([
      ".stat-readout-value[data-live='true']",
    ]);
  });

  /**
   * Beside an amber age, blue numbers read as a second data colour. A linked
   * value is ink over a rule, and the accent answers only the pointer and the
   * keyboard. The rule is then the only sign of a link at rest, so it is drawn
   * in `--color-control-border`, which `contrast.test.ts` holds to 3:1.
   */
  it('marks a link at rest with a visible rule, not the accent', () => {
    expect(selectorsDeclaring(/--color-accent/)).toEqual([
      '.stat-table-link:hover',
      '.stat-table-link:focus-visible',
    ]);
    expect(selectorsDeclaring(/--color-control-border/)).toContain(
      '.stat-table-link',
    );
  });

  /**
   * With no widths declared, a value's column hugs its widest value and the
   * label has the rest. That only holds while values cannot break: letting
   * them wrap on a phone split "29 packages" to spare a long label.
   */
  it('lets only a value marked too long wrap', () => {
    expect(
      selectorsDeclaring(/(?:^|;)\s*width\s*:/).filter((selector) =>
        /\.stat-table-(?:label|value)/.test(selector),
      ),
    ).toEqual([]);
    expect(selectorsDeclaring(/white-space\s*:\s*normal/)).toEqual([
      '.stat-table-value--long',
    ]);
  });

  it('leaves no rule for markup the page no longer renders', () => {
    expect(
      RULES.flatMap((rule) => rule.selectors).filter((selector) =>
        /stat-provenance|stats-section-title|stat-table-label-text|stat-table-caption|stats-source-note/.test(
          selector,
        ),
      ),
    ).toEqual([]);
  });
});
