import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import courses from '@/data/resume/courses';
import degrees from '@/data/resume/degrees';
import work from '@/data/resume/work';
import ResumePage from '../resume/page';

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

describe('resume print control', () => {
  it('opens the print dialog', () => {
    const print = vi.spyOn(window, 'print').mockImplementation(() => {});
    render(<ResumePage />);

    fireEvent.click(screen.getByRole('button', { name: 'Print / PDF' }));

    expect(print).toHaveBeenCalledOnce();
    print.mockRestore();
  });
});
