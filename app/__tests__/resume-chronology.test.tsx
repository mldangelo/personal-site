import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import work from '@/data/resume/work';
import { careerSpanYears, sortPositions } from '@/lib/career';
import ResumePage from '../resume/page';

const FROZEN_NOW = new Date(2026, 6, 28, 12, 0, 0);

/**
 * Two properties of the resume page that used to be maintained by hand:
 * the order of the experience spine, and the length of the career it claims.
 */
describe('resume chronology', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FROZEN_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the spine newest first', () => {
    const { container } = render(<ResumePage />);

    const rendered = [...container.querySelectorAll('.job-company')].map(
      (node) => node.textContent,
    );

    expect(rendered).toEqual(sortPositions(work).map((job) => job.name));
  });

  it('states the career span once, derived from the earliest role', () => {
    const { container } = render(<ResumePage />);

    const years = careerSpanYears(work, FROZEN_NOW.getTime());
    const summary = container.querySelector('.resume-summary');

    expect(summary?.textContent).toContain(
      `career spanning ${years}+ years across`,
    );

    expect(summary?.textContent?.match(/\d+\+? years?/g)).toHaveLength(1);
  });

  it('labels every abbreviated tenure for non-visual readers', () => {
    const { container } = render(<ResumePage />);

    const durations = container.querySelectorAll('.daterange-duration');

    expect(durations).toHaveLength(work.length);
    for (const duration of durations) {
      expect(
        duration.querySelector('[aria-hidden="true"]')?.textContent,
      ).toMatch(/^(<1 mo|\d+ yr( \d+ mo)?|\d+ mo)$/);
      expect(duration.querySelector('.sr-only')?.textContent).toMatch(
        /^Duration: (less than 1 month|\d+ years?( \d+ months?)?|\d+ months?)$/,
      );
    }
  });
});
