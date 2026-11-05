import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import courses from '@/data/resume/courses';
import degrees from '@/data/resume/degrees';
import work from '@/data/resume/work';
import { THEME_CHOICE_ATTRIBUTE } from '@/lib/theme';
import ResumePage from '../resume/page';

const readStyles = (file: string) =>
  readFileSync(join(process.cwd(), 'app/styles', file), 'utf8');

const RESUME_CSS = readStyles('pages/resume.css');

/**
 * The print rules as a sheet jsdom will apply. It evaluates a media list only
 * when the text is literally `all` or `screen`, so `@media print` is dropped
 * whole; the rules are re-emitted without the wrapper.
 */
const PRINT_RULES = Array.from(
  readStyles('print.css')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .matchAll(/[^{}]+\{[^{}]*\}/g),
  (match) => match[0],
).join('\n');

describe('resume header', () => {
  const root = document.documentElement;
  const sheets: HTMLStyleElement[] = [];

  function applyStyles(css: string): void {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    sheets.push(style);
  }

  afterEach(() => {
    for (const sheet of sheets.splice(0)) sheet.remove();
    root.removeAttribute(THEME_CHOICE_ATTRIBUTE);
  });

  // Role queries skip what a stylesheet hides, so these find a control only while
  // a reader, sighted or not, is actually offered it.
  const printButton = () =>
    screen.queryByRole('button', { name: 'Print / PDF' });
  const jsonLink = () => screen.queryByRole('link', { name: 'JSON Resume' });
  const topLevelHeadings = () =>
    screen
      .getAllByRole('heading', { level: 1 })
      .map((heading) => heading.textContent);

  it('offers the print control only once the bootstrap proves scripts ran', () => {
    // Without JavaScript the button is inert, so it must not be shown. The JSON
    // link beside it is a plain anchor and has to survive either way.
    applyStyles(RESUME_CSS);
    render(<ResumePage />);

    expect(printButton()).toBeNull();
    expect(jsonLink()).toBeVisible();

    root.setAttribute(THEME_CHOICE_ATTRIBUTE, 'system');

    expect(printButton()).toBeVisible();
    expect(jsonLink()).toBeVisible();
  });

  it('hands the name the top-level heading on paper, and drops the controls', () => {
    // The tagged PDF a browser saves takes its H1 from the accessibility tree,
    // so hiding the screen title without handing the role on starts that
    // document at H2. The bootstrap's mark keeps the print control on screen, so
    // its absence below is print.css's doing.
    root.setAttribute(THEME_CHOICE_ATTRIBUTE, 'system');
    applyStyles(RESUME_CSS);
    render(<ResumePage />);

    expect(topLevelHeadings()).toEqual(['Resume']);
    expect(printButton()).toBeVisible();

    applyStyles(PRINT_RULES);

    expect(topLevelHeadings()).toEqual(['Michael D’Angelo']);
    expect(printButton()).toBeNull();
    expect(jsonLink()).toBeNull();
  });
});

// Job and degree links are printed as text, and course links remain PDF
// annotations, so all three need destinations that still mean something on paper.
describe('resume link data', () => {
  it('gives every company, school and course a lasting absolute URL', () => {
    for (const link of [
      ...work.map((job) => job.url),
      ...degrees.map((degree) => degree.link),
      ...courses.map((course) => course.link),
    ]) {
      const url = new URL(link);

      expect(['http:', 'https:']).toContain(url.protocol);
      expect(url.hostname).not.toBe('');
      // A `jsessionid` is bound to a server session that has expired.
      expect(link.toLowerCase()).not.toContain('jsessionid');
    }
  });

  it('renders a link for every course', () => {
    const { container } = render(<ResumePage />);

    expect(
      container.querySelectorAll('.course-container a[href]'),
    ).toHaveLength(courses.length);
  });

  // Retired company domains may be unregistered or hijacked.
  it.each([
    ['Arthena', 'https://www.ycombinator.com/companies/arthena'],
    [
      'Planetary Resources',
      'https://en.wikipedia.org/wiki/Planetary_Resources',
    ],
  ])('uses a stable destination for retired company %s', (name, expected) => {
    expect(work.find((position) => position.name === name)?.url).toBe(expected);
  });

  // An old class site is often an archived offering under a title the catalogue
  // has since retired, so a title and its link must come from the same record.
  it.each([
    [
      'CME 302',
      'Numerical Linear Algebra',
      'https://bulletin.stanford.edu/courses/1057521',
    ],
    [
      'CME 306',
      'Computational Methods of Applied Mathematics',
      'https://bulletin.stanford.edu/courses/1174062',
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
  ])('keeps %s aligned with its Stanford record', (number, title, link) => {
    expect(courses.find((course) => course.number === number)).toMatchObject({
      title,
      link,
    });
  });
});
