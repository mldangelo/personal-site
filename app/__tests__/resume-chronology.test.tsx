import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import work from '@/data/resume/work';
import { sortPositions, totalExperienceYears } from '@/lib/career';
import ResumePage from '../resume/page';

/**
 * Two properties of the resume page that used to be maintained by hand:
 * the order of the experience spine, and the length of the career it claims.
 */
describe('resume chronology', () => {
  it('renders the spine newest first', () => {
    const { container } = render(<ResumePage />);

    const rendered = [...container.querySelectorAll('.job-company')].map(
      (node) => node.textContent,
    );

    expect(rendered).toEqual(sortPositions(work).map((job) => job.name));
  });

  it('states the career span once, derived from the earliest role', () => {
    render(<ResumePage />);

    const years = totalExperienceYears(work, Date.now());
    const summary = screen.getByText(/Engineering leader/);

    expect(summary.textContent).toContain(`${years}+ years`);

    // One number, stated once. Showing the elapsed span next to a
    // months-occupied figure reads as hedging rather than as precision.
    expect(summary.textContent?.match(/\d+\+? years?/g)).toHaveLength(1);
  });

  it('gives every role a tenure derived from its own dates', () => {
    const { container } = render(<ResumePage />);

    const durations = container.querySelectorAll('.daterange-duration');

    expect(durations).toHaveLength(work.length);
    for (const duration of durations) {
      expect(duration.textContent).toMatch(/^(<1 mo|\d+ yr( \d+ mo)?|\d+ mo)$/);
    }
  });
});
