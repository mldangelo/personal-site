import { describe, expect, it } from 'vitest';

import type { Position } from '@/data/resume/work';
import work from '@/data/resume/work';
import {
  careerSpanYears,
  currentPosition,
  formatDuration,
  monthsBetween,
  sortPositions,
} from '../career';

/** A fixed instant, so every figure derived from "now" is pinned. */
const NOW = new Date('2026-07-28T12:00:00Z').getTime();

function position(overrides: Partial<Position> = {}): Position {
  return {
    name: 'Acme Corp',
    position: 'Senior Engineer',
    url: 'https://acme.com',
    startDate: '2020-01-01',
    endDate: '2023-01-01',
    ...overrides,
  };
}

function byName(positions: Position[]): string[] {
  return positions.map((entry) => entry.name);
}

describe('sortPositions', () => {
  it('orders newest end date first', () => {
    const ordered = sortPositions([
      position({ name: 'Middle', endDate: '2018-01-01' }),
      position({ name: 'Oldest', endDate: '2011-06-01' }),
      position({ name: 'Newest', endDate: '2026-03-09' }),
    ]);

    expect(byName(ordered)).toEqual(['Newest', 'Middle', 'Oldest']);
  });

  it('prefers recency of involvement when start and end disagree', () => {
    const ordered = sortPositions([
      position({
        name: 'Later but shorter',
        startDate: '2015-09-01',
        endDate: '2016-06-01',
      }),
      position({
        name: 'Earlier but recent',
        startDate: '2014-01-01',
        endDate: '2022-01-01',
      }),
    ]);

    expect(byName(ordered)).toEqual([
      'Earlier but recent',
      'Later but shorter',
    ]);
  });

  it('places an ongoing full-time role ahead of a closed role', () => {
    const ordered = sortPositions([
      position({
        name: 'Closed',
        startDate: '2020-01-01',
        endDate: '2026-07-01',
      }),
      position({
        name: 'Ongoing',
        startDate: '2017-04-01',
        endDate: undefined,
      }),
    ]);

    expect(byName(ordered)).toEqual(['Ongoing', 'Closed']);
  });

  it('places an open-ended side role by its start rather than at the top', () => {
    const ordered = sortPositions([
      position({
        name: 'Side fund',
        startDate: '2017-04-01',
        endDate: undefined,
        commitment: 'part-time',
      }),
      position({ name: 'Later job', endDate: '2023-01-01' }),
    ]);

    expect(byName(ordered)).toEqual(['Later job', 'Side fund']);
  });

  it('does not mutate the array it is given', () => {
    const input = [
      position({ name: 'Older', startDate: '2014-01-01' }),
      position({ name: 'Newer', startDate: '2020-01-01' }),
    ];
    const snapshot = byName(input);

    const ordered = sortPositions(input);

    expect(byName(input)).toEqual(snapshot);
    expect(ordered).not.toBe(input);
  });
});

describe('currentPosition', () => {
  it('finds the ongoing role wherever it sits in the array', () => {
    // A job change recorded the natural way: close the old role, append the
    // new one. Indexing `work[0]` reports the old employer here.
    const found = currentPosition([
      position({ name: 'Previous', startDate: '2019-01-01' }),
      position({
        name: 'Appended last',
        startDate: '2026-01-01',
        endDate: undefined,
      }),
    ]);

    expect(found?.name).toBe('Appended last');
  });

  it('does not promote an open-ended side role over a primary career', () => {
    const found = currentPosition([
      position({
        name: 'Side fund',
        startDate: '2017-04-01',
        endDate: undefined,
        commitment: 'part-time',
      }),
      position({
        name: 'Day job',
        startDate: '2022-01-01',
        endDate: undefined,
      }),
    ]);

    expect(found?.name).toBe('Day job');
  });

  it('falls back to the most recent involvement between jobs', () => {
    const found = currentPosition([
      position({
        name: 'Side fund',
        startDate: '2017-04-01',
        endDate: undefined,
        commitment: 'part-time',
      }),
      position({ name: 'Just ended', startDate: '2022-01-01' }),
    ]);

    expect(found?.name).toBe('Just ended');
  });

  it('names the same role the spine leads with', () => {
    expect(currentPosition(work)).toBe(sortPositions(work)[0]);
  });

  it('reports nothing for an empty career rather than throwing', () => {
    expect(currentPosition([])).toBeUndefined();
  });
});

describe('monthsBetween', () => {
  it('counts whole months between two ISO dates', () => {
    expect(monthsBetween('2014-01-01', '2022-01-01')).toBe(96);
    expect(monthsBetween('2013-06-01', '2013-09-01')).toBe(3);
  });

  it('truncates a partial month rather than rounding it up', () => {
    // Eleven months and thirty days is not a year.
    expect(monthsBetween('2020-01-01', '2020-12-31')).toBe(11);
    expect(monthsBetween('2020-01-01', '2021-01-01')).toBe(12);
  });

  it('measures to an epoch-millisecond instant', () => {
    expect(monthsBetween('2026-03-09', NOW)).toBe(4);
  });

  it('reports nothing for a reversed range instead of a negative tenure', () => {
    expect(monthsBetween('2022-01-01', '2014-01-01')).toBe(0);
  });
});

describe('formatDuration', () => {
  it.each([
    [-5, '<1 mo', 'less than 1 month'],
    [0, '<1 mo', 'less than 1 month'],
    [1, '1 mo', '1 month'],
    [11, '11 mo', '11 months'],
    [12, '1 yr', '1 year'],
    [13, '1 yr 1 mo', '1 year 1 month'],
    [20, '1 yr 8 mo', '1 year 8 months'],
    [26, '2 yr 2 mo', '2 years 2 months'],
    [95, '7 yr 11 mo', '7 years 11 months'],
    [96, '8 yr', '8 years'],
  ])('renders %i months as "%s" and "%s"', (months, short, long) => {
    expect(formatDuration(months)).toBe(short);
    expect(formatDuration(months, true)).toBe(long);
  });
});

describe('careerSpanYears', () => {
  it('reads the earliest start regardless of array order', () => {
    const positions = [
      position({ startDate: '2020-01-01' }),
      position({ startDate: '2006-01-01' }),
      position({ startDate: '2014-01-01' }),
    ];

    expect(careerSpanYears(positions, NOW)).toBe(20);
  });

  it('does not round a partial year up', () => {
    expect(careerSpanYears([position({ startDate: '2011-08-01' })], NOW)).toBe(
      14,
    );
  });

  it('returns zero for no positions rather than throwing', () => {
    expect(careerSpanYears([], NOW)).toBe(0);
  });

  it('advances on its own as the clock moves', () => {
    const laterYear = new Date('2027-07-28T12:00:00Z').getTime();

    expect(careerSpanYears(work, laterYear)).toBe(
      careerSpanYears(work, NOW) + 1,
    );
  });
});
