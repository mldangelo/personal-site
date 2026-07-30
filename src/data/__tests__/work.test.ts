import { describe, expect, it } from 'vitest';

import { sortPositions, timelineKey } from '@/lib/career';
import work from '../resume/work';

/** Exactly `YYYY-MM-DD`, which is what makes a string comparison chronological. */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

describe('work data', () => {
  it('exports an array of positions', () => {
    expect(Array.isArray(work)).toBe(true);
    expect(work.length).toBeGreaterThan(0);
  });

  it('each position has required properties', () => {
    for (const job of work) {
      expect(job).toHaveProperty('name');
      expect(job).toHaveProperty('position');
      expect(job).toHaveProperty('url');
      expect(job).toHaveProperty('startDate');

      expect(typeof job.name).toBe('string');
      expect(typeof job.position).toBe('string');
      expect(typeof job.url).toBe('string');
      expect(typeof job.startDate).toBe('string');
    }
  });

  it('startDate is a valid date string', () => {
    for (const job of work) {
      const date = new Date(job.startDate);
      expect(date.toString()).not.toBe('Invalid Date');
    }
  });

  it('endDate is valid when present', () => {
    for (const job of work) {
      if (job.endDate) {
        const date = new Date(job.endDate);
        expect(date.toString()).not.toBe('Invalid Date');
      }
    }
  });

  it('endDate is after startDate when present', () => {
    for (const job of work) {
      if (job.endDate) {
        const start = new Date(job.startDate);
        const end = new Date(job.endDate);
        expect(end.getTime()).toBeGreaterThan(start.getTime());
      }
    }
  });

  it('urls are valid', () => {
    const urlRegex = /^https?:\/\/.+/;

    for (const job of work) {
      expect(job.url).toMatch(urlRegex);
    }
  });

  // Resume should show at least one current/active position
  it('has at least one current position (no endDate)', () => {
    const currentJobs = work.filter((job) => !job.endDate);
    expect(currentJobs.length).toBeGreaterThanOrEqual(1);
  });

  it('highlights are arrays when present', () => {
    for (const job of work) {
      if (job.highlights) {
        expect(Array.isArray(job.highlights)).toBe(true);
        expect(job.highlights.length).toBeGreaterThan(0);
      }
    }
  });

  it('uses the supported commitment value when present', () => {
    for (const job of work) {
      if (job.commitment) {
        expect(job.commitment).toBe('part-time');
      }
    }
  });

  it('has positions from different years', () => {
    const years = work.map((job) => new Date(job.startDate).getFullYear());
    const uniqueYears = new Set(years);

    // Resume should contain work from multiple years
    expect(uniqueYears.size).toBeGreaterThan(1);
  });

  it('company names are non-empty', () => {
    for (const job of work) {
      expect(job.name.trim().length).toBeGreaterThan(0);
    }
  });

  /**
   * The spine is ordered by `sortPositions`, which compares the ISO strings
   * directly — exact for `YYYY-MM-DD`, and free of the timezone trap that
   * parsing to a `Date` reintroduces. A date written any other way (`2014/01`,
   * `Jan 2014`) would still parse but would sort wrongly and silently, so the
   * format itself is the invariant worth pinning.
   */
  it('dates are written as plain ISO calendar dates', () => {
    for (const job of work) {
      expect(job.startDate).toMatch(ISO_DATE);

      if (job.endDate) {
        expect(job.endDate).toMatch(ISO_DATE);
      }
    }
  });

  /**
   * The rendered timeline must run one way. Source order is deliberately not
   * load-bearing — `Experience` sorts before mapping — so this asserts the
   * ordered result rather than the literal array, and fails if a future entry
   * carries a date the comparator cannot place.
   */
  it('sorts into a strictly reverse-chronological timeline', () => {
    const ordered = sortPositions(work);

    expect(ordered).toHaveLength(work.length);

    for (let i = 1; i < ordered.length; i += 1) {
      const previous = ordered[i - 1];
      const current = ordered[i];

      expect(
        timelineKey(current).localeCompare(timelineKey(previous)),
      ).toBeLessThanOrEqual(0);

      // Where two roles have the same timeline key, the later start comes
      // first.
      if (timelineKey(current) === timelineKey(previous)) {
        expect(
          current.startDate.localeCompare(previous.startDate),
        ).toBeLessThanOrEqual(0);
      }
    }
  });
});
