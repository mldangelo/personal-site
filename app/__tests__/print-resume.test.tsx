import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import contact from '@/data/contact';
import profile from '@/data/profile.json';
import courses from '@/data/resume/courses';
import degrees from '@/data/resume/degrees';
import work from '@/data/resume/work';
import ResumePage from '../resume/page';

/**
 * The resume is the page people print, and print output is the one surface no
 * test can look at. These assertions cover it structurally instead: that the
 * href-reveal rule reaches every resume link that needs it, that nothing later
 * in the cascade can neutralise it, and that the printed contact block carries
 * the details a paper resume is expected to carry.
 */

const PRINT_CSS = readFileSync(
  join(process.cwd(), 'app/styles/print.css'),
  'utf8',
);

interface Rule {
  selectors: string[];
  declarations: string;
}

/**
 * Rules inside the `@media print` block, in source order. Comments are
 * stripped first so a selector list cannot pick up prose from the comment
 * above it, and order is preserved because the cascade questions here are
 * order questions.
 */
function printRules(css: string): Rule[] {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const block = stripped.slice(stripped.indexOf('@media print'));

  return [...block.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((match) => ({
    selectors: match[1]
      .split(',')
      .map((selector) => selector.trim().replace(/\s+/g, ' '))
      .filter(Boolean),
    declarations: match[2],
  }));
}

const RULES = printRules(PRINT_CSS);

const revealIndex = RULES.findIndex((rule) =>
  rule.declarations.includes('attr(href)'),
);
const resetIndex = RULES.findIndex(
  (rule) =>
    rule.selectors.length === 1 &&
    rule.selectors[0] === 'a' &&
    rule.declarations.includes('background-image'),
);

describe('print: revealing link destinations', () => {
  it('parses the print rules it is asserting about', () => {
    // If the parser stops finding rules the rest of this file quietly passes
    // by matching nothing, so pin the two rules everything else depends on.
    expect(RULES.length).toBeGreaterThan(20);
    expect(revealIndex).toBeGreaterThanOrEqual(0);
    expect(resetIndex).toBeGreaterThanOrEqual(0);
  });

  it.each([
    // The identifying link on each professional or education entry.
    ".job-company[href^='http']::after",
    ".degree-container .school a[href^='http']::after",
    // Already covered, and must stay covered.
    ".about-content a[href^='http']::after",
    ".prose a[href^='http']::after",
  ])('reveals %s', (selector) => {
    expect(RULES[revealIndex].selectors).toContain(selector);
  });

  it('does not reveal hrefs the reader can already read', () => {
    // `.resume-print-contact` prints the readable URL as its link text, so
    // revealing the href there would print every address twice. Role
    // summaries are prose: three citation URLs inside one sentence of 10pt
    // serif cost more legibility than they return.
    const revealed = RULES[revealIndex].selectors.join(' ');

    expect(revealed).not.toContain('resume-print-contact');
    expect(revealed).not.toContain('course-container');
    expect(revealed).not.toContain('.summary');
    expect(revealed).not.toContain('.points');
  });

  it('reveals hrefs before the global anchor reset', () => {
    // Belt and braces rather than a live conflict: the reset declares only
    // `color` and `background-image`, neither of which is `content`, and
    // `background-image` does not inherit into a pseudo-element. Keeping the
    // order pinned means a future `a` rule cannot quietly win.
    expect(revealIndex).toBeLessThan(resetIndex);
    expect(RULES[resetIndex].declarations).not.toContain('content');
  });

  it('lets nothing later re-declare or hide the revealed URLs', () => {
    const surfaces =
      /job-company|degree-container|course-container|about-content|prose/;

    const clobbering = RULES.slice(revealIndex + 1).filter(
      (rule) =>
        rule.selectors.some(
          (selector) => selector.includes('::after') && surfaces.test(selector),
        ) && /(?:^|[;\s])(?:content|display)\s*:/.test(rule.declarations),
    );

    expect(clobbering).toEqual([]);
  });

  it('keeps course links clickable without dumping raw URLs onto paper', () => {
    const revealed = RULES[revealIndex].selectors.join(' ');
    const { container } = render(<ResumePage />);

    expect(revealed).not.toContain('course-container');
    expect(PRINT_CSS).not.toMatch(
      /\.course-container\s+a\[href\^=['"]http['"]\]::after/,
    );
    expect(
      container.querySelectorAll('.course-container a[href]'),
    ).toHaveLength(courses.length);
  });
});

describe('print: screen chrome', () => {
  it('suppresses the skip link', () => {
    const hidden = RULES.find(
      (rule) =>
        rule.selectors.includes('.skip-link') &&
        /(?:^|[;\s])display\s*:\s*none(?:\s*!important)?\s*;/.test(
          rule.declarations,
        ),
    );

    expect(hidden).toBeDefined();
  });
});

describe('print: resume link data', () => {
  // `[href^='http']` is what selects the links above, so a relative or
  // missing URL in the data silently prints with no destination.
  const links = [
    ...work.map((job) => job.url),
    ...degrees.map((degree) => degree.link),
    ...courses.map((course) => course.link),
  ];

  it('gives every company, school and course an absolute http(s) URL', () => {
    expect(links.length).toBe(work.length + degrees.length + courses.length);
    for (const link of links) {
      expect(link).toMatch(/^https?:\/\/\S+$/);
    }
  });

  it('carries no session-scoped or unprintable URLs', () => {
    for (const link of links) {
      // A `jsessionid` is bound to a server session that expired years ago;
      // the CME 302 link was one, at 131 characters.
      expect(link.toLowerCase()).not.toContain('jsessionid');
      expect(link.length).toBeLessThanOrEqual(80);
    }
  });
});

describe('print: contact block', () => {
  function contactBlock() {
    const { container } = render(<ResumePage />);
    const block = container.querySelector('.resume-print-contact');

    expect(block).not.toBeNull();
    return block as HTMLElement;
  }

  it('carries location, site, email, GitHub and LinkedIn', () => {
    const text = contactBlock().textContent ?? '';

    expect(text).toContain(profile.currentCity);
    expect(text).toContain(profile.email);
    expect(text).toContain('mldangelo.com');
    expect(text).toContain('github.com/mldangelo');
    expect(text).toContain('linkedin.com/in/');
  });

  it('links to the same destinations the footer does', () => {
    // Single-sourced from `src/data/contact.ts` rather than retyped, so the
    // printed header cannot drift from the on-screen links.
    const hrefs = [...contactBlock().querySelectorAll('a')].map((a) =>
      a.getAttribute('href'),
    );

    for (const label of ['GitHub', 'LinkedIn']) {
      const expected = contact.find((entry) => entry.label === label)?.link;

      expect(expected).toBeTruthy();
      expect(hrefs).toContain(expected);
    }
  });

  it('wraps to a line that opens with an address, not a dot', () => {
    // Five entries no longer fit one line on A4 or Letter, so the block wraps.
    // A non-breaking space before each dot removes the break opportunity on
    // that side, leaving the one after it.
    const separators = [
      ...contactBlock().querySelectorAll('[aria-hidden="true"]'),
    ];

    expect(separators).toHaveLength(4);
    for (const separator of separators) {
      expect(separator.textContent).toBe('\u00a0· ');
    }
  });

  it('prints addresses without their protocol', () => {
    // The link text is what a reader retypes, so it reads as an address
    // rather than as a URL. `mailto:` must not leak into it either.
    for (const anchor of contactBlock().querySelectorAll('a')) {
      expect(anchor.textContent ?? '').not.toMatch(/^(?:https?:\/\/|mailto:)/);
      expect(anchor.getAttribute('href')).toMatch(/^(?:https?:\/\/|mailto:)/);
    }
  });
});
