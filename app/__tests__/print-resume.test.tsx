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
 * Structural checks for the printed resume. Actual Letter and A4 PDFs still
 * need visual inspection because a DOM test cannot measure paper layout.
 */

const PRINT_CSS = readFileSync(
  join(process.cwd(), 'app/styles/print.css'),
  'utf8',
);
const RESUME_CSS = readFileSync(
  join(process.cwd(), 'app/styles/pages/resume.css'),
  'utf8',
);
const TAILWIND_CSS = readFileSync(
  join(process.cwd(), 'app/tailwind.css'),
  'utf8',
);

interface Rule {
  selectors: string[];
  declarations: string;
}

/**
 * Rules inside the `@media print` block. Comments are stripped first so a
 * selector list cannot pick up prose from the comment above it.
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

describe('print: revealing link destinations', () => {
  it('parses the print rules it is asserting about', () => {
    // If the parser stops finding rules the rest of this file could quietly
    // pass by matching nothing, so pin the rule everything else depends on.
    expect(RULES.length).toBeGreaterThan(20);
    expect(revealIndex).toBeGreaterThanOrEqual(0);
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

describe('print: stylesheet and paper-width constraints', () => {
  it('loads print overrides after every other stylesheet', () => {
    const imports = [...TAILWIND_CSS.matchAll(/@import\s+['"]([^'"]+)['"]/g)];

    expect(imports.at(-1)?.[1]).toBe('./styles/print.css');
  });

  it('lets both course columns shrink at A4 width', () => {
    const courseListRule = RESUME_CSS.match(
      /\.resume-page \.courses \.course-list\s*\{([^}]*)\}/,
    )?.[1];

    expect(courseListRule).toContain(
      'grid-template-columns: repeat(2, minmax(0, 1fr))',
    );
  });

  it('forces a light page canvas even when the saved theme is dark', () => {
    const themeRule = RULES.find((rule) =>
      rule.selectors.includes("[data-theme='dark']"),
    );

    expect(themeRule?.declarations).toMatch(/color-scheme\s*:\s*light/);
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
  // Job and degree links are printed as text; course links remain PDF
  // annotations. All three need absolute destinations.
  const links = [
    ...work.map((job) => job.url),
    ...degrees.map((degree) => degree.link),
    ...courses.map((course) => course.link),
  ];

  it('gives every company, school and course an absolute http(s) URL', () => {
    expect(links.length).toBe(work.length + degrees.length + courses.length);
    for (const link of links) {
      const url = new URL(link);

      expect(['http:', 'https:']).toContain(url.protocol);
      expect(url.hostname).not.toBe('');
    }
  });

  it('carries no session-scoped URLs', () => {
    for (const link of links) {
      // A `jsessionid` is bound to a server session that expired years ago;
      // the old CME 302 destination carried one.
      expect(link.toLowerCase()).not.toContain('jsessionid');
    }
  });

  it.each([
    ['Arthena', 'https://www.ycombinator.com/companies/arthena'],
    [
      'Planetary Resources',
      'https://en.wikipedia.org/wiki/Planetary_Resources',
    ],
  ])('uses a stable destination for retired company %s', (name, expected) => {
    expect(work.find((position) => position.name === name)?.url).toBe(expected);
  });

  it.each([
    [
      'CME 302',
      'Numerical Linear Algebra',
      'https://bulletin.stanford.edu/courses/1057521',
    ],
    [
      'CME 306',
      'Numerical Solution of Partial Differential Equations',
      'https://web.stanford.edu/class/cme306/',
    ],
    [
      'CME 308',
      'Stochastic Methods in Engineering',
      'https://web.stanford.edu/class/cme308/',
    ],
    [
      'CS 265',
      'Randomized Algorithms and Probabilistic Analysis',
      'https://web.stanford.edu/class/cs265/',
    ],
  ])('keeps %s aligned with Stanford records', (number, title, link) => {
    expect(courses.find((course) => course.number === number)).toMatchObject({
      title,
      link,
    });
  });

  it('uses canonical HTTPS company URLs where the site publishes one', () => {
    expect(work.find((position) => position.name === 'Smile ID')?.url).toBe(
      'https://smile.id',
    );
    expect(
      work.find((position) => position.name === 'Skeptical Investments')?.url,
    ).toBe('https://skepticalinvestments.biz');
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

    for (const id of ['github', 'linkedin'] as const) {
      const expected = contact.find((entry) => entry.id === id)?.link;

      expect(expected).toBeTruthy();
      expect(hrefs).toContain(expected);
    }
  });

  it('wraps only between complete entries without dangling punctuation', () => {
    const block = contactBlock();
    const blockRule = RULES.find((rule) =>
      rule.selectors.includes('.resume-print-contact'),
    );
    const itemRule = RULES.find((rule) =>
      rule.selectors.includes('.resume-print-contact > *'),
    );

    expect(block.children).toHaveLength(5);
    expect(block.querySelector('[aria-hidden="true"]')).toBeNull();
    expect(blockRule?.declarations).toMatch(/display\s*:\s*flex/);
    expect(blockRule?.declarations).toMatch(/flex-wrap\s*:\s*wrap/);
    expect(blockRule?.declarations).toMatch(/column-gap\s*:\s*0\.75rem/);
    expect(itemRule?.declarations).toMatch(/white-space\s*:\s*nowrap/);
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
