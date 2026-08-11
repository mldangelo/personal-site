import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import work from '@/data/resume/work';
import { careerSpanYears, monthsBetween, sortPositions } from '@/lib/career';
import ResumePage from '../resume/page';

const FROZEN_NOW = new Date(2026, 6, 28, 12, 0, 0);

/**
 * A second instant, years later, used to prove the career span follows the
 * clock. `careerSpanYears` reads 15 at `FROZEN_NOW` — the exact literal this
 * page used to hard-code — so a single instant cannot tell derivation from a
 * coincidence.
 */
const MUCH_LATER = new Date(2031, 0, 1, 12, 0, 0);

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
    const summaryAt = (instant: Date) => {
      vi.setSystemTime(instant);
      const { container, unmount } = render(<ResumePage />);
      const text =
        container.querySelector('.resume-summary')?.textContent ?? '';
      unmount();

      return text;
    };

    const early = summaryAt(FROZEN_NOW);
    const late = summaryAt(MUCH_LATER);

    expect(early).toContain(
      `career spanning ${careerSpanYears(work, FROZEN_NOW.getTime())}+ years across`,
    );
    expect(late).toContain(
      `career spanning ${careerSpanYears(work, MUCH_LATER.getTime())}+ years across`,
    );

    // The figure moved with the clock, so it cannot be a literal.
    expect(late).not.toEqual(early);

    // And it is still stated exactly once, not repeated somewhere else in the
    // paragraph where the two copies could disagree.
    for (const summary of [early, late]) {
      expect(summary.match(/\d+\+? years?/g)).toHaveLength(1);
    }
  });

  it('labels every abbreviated tenure for non-visual readers', () => {
    const { container } = render(<ResumePage />);

    const durations = [...container.querySelectorAll('.daterange-duration')];
    const positions = sortPositions(work);

    expect(durations).toHaveLength(work.length);
    durations.forEach((duration, index) => {
      // An ongoing tenure was measured at build time, so it is hedged; a
      // closed one is exact and must not be. Below a month the abbreviation is
      // already an upper bound ("<1 mo"), so hedging it would bracket the value
      // from both sides — that pairing must never appear.
      const position = positions[index];
      const wholeMonths = monthsBetween(
        position.startDate,
        position.endDate ?? FROZEN_NOW.getTime(),
      );
      const hedged = !position.endDate && wholeMonths >= 1;
      const hedge = hedged ? '\\+' : '';
      const longHedge = hedged ? ' or more' : '';

      expect(
        duration.querySelector('[aria-hidden="true"]')?.textContent,
      ).toMatch(new RegExp(`^(<1 mo|\\d+ yr( \\d+ mo)?|\\d+ mo)${hedge}$`));
      expect(duration.querySelector('.sr-only')?.textContent).toMatch(
        new RegExp(
          `^Duration: (less than 1 month|\\d+ years?( \\d+ months?)?|\\d+ months?)${longHedge}$`,
        ),
      );
    });
  });
});
