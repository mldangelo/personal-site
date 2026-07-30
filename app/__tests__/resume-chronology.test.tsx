import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import work from '@/data/resume/work';
import { careerSpanYears, sortPositions } from '@/lib/career';
import ResumePage from '../resume/page';

/**
 * The instant the whole suite renders against.
 *
 * `ResumePage` reads the clock once during render. A test that reads it again
 * to build its expectation is comparing two instants, and the two disagree by
 * a whole year whenever they straddle the anniversary of the earliest role —
 * `careerSpanYears` steps there. The window is narrow and the failure
 * would be unreproducible, which is the worst shape a test failure comes in,
 * so the clock is frozen and both sides share one reading.
 *
 * Local time, deliberately: dayjs parses the `YYYY-MM-DD` strings in
 * `src/data/resume/work.ts` as local midnight, so pinning a UTC instant would
 * sit a timezone offset away from the dates it is compared against.
 */
const FROZEN_NOW = new Date(2026, 6, 28, 12, 0, 0);

/** The `N+ years` figure the page states, read back out of the summary. */
function statedSpan(container: HTMLElement): number {
  const summary = container.querySelector('.resume-summary')?.textContent ?? '';
  const stated = summary.match(/(\d+)\+ years/);

  expect(stated).not.toBeNull();

  return Number(stated?.[1]);
}

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

    // One number, stated once. Showing the elapsed span next to a
    // months-occupied figure reads as hedging rather than as precision.
    expect(summary?.textContent?.match(/\d+\+? years?/g)).toHaveLength(1);
  });

  /**
   * The span is counted from the clock, not written down — so moving the clock
   * has to move it. This is also what proves the freeze above reaches the page
   * rather than quietly pinning nothing: if `ResumePage` ever stopped reading
   * `Date.now()`, both renders would report the same figure.
   */
  it('counts the span from the clock rather than a fixed value', () => {
    const { container } = render(<ResumePage />);

    vi.setSystemTime(new Date(2031, 6, 28, 12, 0, 0));
    const { container: fiveYearsOn } = render(<ResumePage />);

    expect(statedSpan(fiveYearsOn)).toBe(statedSpan(container) + 5);
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
