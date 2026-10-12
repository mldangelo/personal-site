import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * The résumé and About pages each carry a section index, and it is one design
 * written out twice: once per page stylesheet, under each page's class names.
 * Nothing but this file notices when a change lands on one copy and not the
 * other, which is how the two came apart before: on a phone the résumé's
 * wrapped to a second row while About's scrolled sideways, and only one of
 * them showed which section the reader was in.
 */

const COMMENT = /\/\*[\s\S]*?\*\//g;

function stylesheet(name: string): string {
  return readFileSync(
    resolve(process.cwd(), 'app/styles/pages', name),
    'utf8',
  ).replace(COMMENT, '');
}

const resume = stylesheet('resume.css');
const about = stylesheet('content.css');

/** The part of a stylesheet inside its `@media (max-width: 735px)` blocks. */
function narrow(css: string): string {
  return [...css.matchAll(/@media \(max-width: 735px\) \{([\s\S]*?)\n\}/g)]
    .map((match) => match[1])
    .join('\n');
}

/** Everything outside any `@media` block. */
function wide(css: string): string {
  return css.replace(/@media[^{]*\{[\s\S]*?\n\}/g, '');
}

/** The declarations of the one rule with exactly this selector, in order. */
function declarations(css: string, selector: string): string[] {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const rules = [
    ...css.matchAll(
      new RegExp(`(?:^|\\})\\s*${escaped}\\s*\\{([^}]*)\\}`, 'g'),
    ),
  ];

  if (rules.length !== 1) {
    throw new Error(`Expected one "${selector}" rule, found ${rules.length}`);
  }

  return rules[0][1]
    .split(';')
    .map((declaration) => declaration.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

/** Drop the declarations that are allowed to differ between the two pages. */
function without(list: string[], ...properties: string[]): string[] {
  return list.filter(
    (declaration) =>
      !properties.some((property) => declaration.startsWith(`${property}:`)),
  );
}

describe('the section index is one design on both pages', () => {
  it('pins the same opaque bar under the header', () => {
    const resumeBar = declarations(wide(resume), '.resume-nav');
    const aboutBar = declarations(wide(about), '.about-section-nav');

    // Each page sets its own distance from the copy around the bar.
    expect(without(resumeBar, 'margin')).toEqual(without(aboutBar, 'margin'));
    expect(resumeBar).toEqual(
      expect.arrayContaining([
        'position: sticky',
        'top: var(--header-height)',
        'background: var(--color-bg-alt)',
      ]),
    );
  });

  it('lays the links out in the same single scrolling row', () => {
    const row = declarations(wide(resume), '.resume-nav-row');

    expect(row).toEqual(declarations(wide(about), '.about-section-nav-row'));
    expect(row).toContain('overflow-x: auto');
    // A wrapped second row is what pinned 141px of a phone screen.
    expect(row.join(' ')).not.toContain('wrap');
  });

  it('sets the links in the same type, as 44px targets', () => {
    const resumeLink = declarations(wide(resume), '.resume-nav-link');
    const aboutLink = declarations(
      wide(about),
      '.about-content .about-section-nav-link',
    );

    // `.about-content a` underlines its links; the résumé has no such rule.
    expect(resumeLink).toEqual(without(aboutLink, 'text-decoration'));
    expect(resumeLink).toEqual(
      expect.arrayContaining([
        'min-height: 2.75rem',
        'font-family: var(--font-display)',
        'font-size: var(--text-ui)',
        'font-weight: var(--font-weight-medium)',
        'color: var(--color-fg-light)',
      ]),
    );
    // Sentence case, untracked: uppercase mono ran "I LIKE" into its neighbour.
    expect(resumeLink.join(' ')).not.toMatch(/text-transform|letter-spacing/);
  });

  it('gives hover, focus, and the current link the same treatment', () => {
    expect(
      declarations(
        wide(resume),
        '.resume-nav-link:hover,\n.resume-nav-link:focus-visible',
      ),
    ).toEqual(
      declarations(
        wide(about),
        '.about-content .about-section-nav-link:hover,\n.about-content .about-section-nav-link:focus-visible',
      ),
    );
    expect(declarations(wide(resume), '.resume-nav-link.active')).toEqual(
      declarations(
        wide(about),
        '.about-content .about-section-nav-link.active',
      ),
    );
    expect(
      declarations(wide(resume), '.resume-nav-link.active::after'),
    ).toEqual(
      declarations(wide(about), '.about-section-nav-link.active::after'),
    );
  });

  it('fades and pads the row the same way on a phone', () => {
    const mask = declarations(narrow(resume), '.resume-nav-row');

    expect(mask).toEqual(declarations(narrow(about), '.about-section-nav-row'));
    expect(mask).toHaveLength(1);
    expect(mask[0]).toMatch(/^mask-image: linear-gradient\(/);

    expect(declarations(narrow(resume), '.resume-nav-row::after')).toEqual(
      declarations(narrow(about), '.about-section-nav-row::after'),
    );

    // Each page keeps its own margins; the rest of the bar's phone rule is shared.
    expect(declarations(narrow(resume), '.resume-nav')).toEqual(
      without(declarations(narrow(about), '.about-section-nav'), 'margin'),
    );
  });

  it('keeps the fade off the bar, which has to stay opaque', () => {
    for (const css of [resume, about]) {
      const masked = [
        ...css.matchAll(/([^{}]+)\{[^{}]*mask-image[^{}]*\}/g),
      ].map((match) => match[1].trim());

      expect(masked).toHaveLength(1);
      expect(masked[0]).toMatch(/-row$/);
    }
  });
});
