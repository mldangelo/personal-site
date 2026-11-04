import { describe, expect, it, vi } from 'vitest';

import type { Position } from '@/data/resume/work';
import {
  careerSpanYears,
  currentPosition,
  formatDuration,
  monthsBetween,
  sortPositions,
} from '../career';

/** A fixed instant, so every figure derived from "now" is pinned. */
const NOW = new Date('2026-07-28T12:00:00Z').getTime();

function role(name: string, startDate: string, endDate?: string): Position {
  return { name, position: 'Eng', url: 'https://a.co', startDate, endDate };
}

const sideFund: Position = {
  ...role('Side fund', '2017-04-01'),
  commitment: 'part-time',
};

describe('sortPositions', () => {
  it.each([
    [
      'newest end date first',
      [
        role('Middle', '2015-01-01', '2018-01-01'),
        role('Oldest', '2010-01-01', '2011-06-01'),
        role('Newest', '2020-01-01', '2026-03-09'),
      ],
      ['Newest', 'Middle', 'Oldest'],
    ],
    [
      'recency of involvement when start and end disagree',
      [
        role('Later start', '2015-09-01', '2016-06-01'),
        role('Later end', '2014-01-01', '2022-01-01'),
      ],
      ['Later end', 'Later start'],
    ],
    [
      'an ongoing full-time role ahead of a closed one',
      [role('Closed', '2020-01-01', '2026-07-01'), role('Open', '2017-04-01')],
      ['Open', 'Closed'],
    ],
    [
      'an open-ended side role by its start, not at the top',
      [sideFund, role('Later job', '2020-01-01', '2023-01-01')],
      ['Later job', 'Side fund'],
    ],
  ])('places %s', (_, positions, expected) => {
    expect(sortPositions(positions).map((entry) => entry.name)).toEqual(
      expected,
    );
  });

  it('does not mutate the array it is given', () => {
    const input = [
      role('Older', '2010-01-01', '2014-01-01'),
      role('Newer', '2015-01-01', '2020-01-01'),
    ];

    expect(sortPositions(input)).not.toBe(input);
    expect(input.map((entry) => entry.name)).toEqual(['Older', 'Newer']);
  });
});

describe('currentPosition', () => {
  it.each([
    // A job change recorded the natural way: close one role, append the next.
    // Indexing `work[0]` would report the employer just left.
    [
      'the ongoing role wherever it sits in the array',
      [role('Old', '2019-01-01', '2023-01-01'), role('Found', '2026-01-01')],
    ],
    [
      'the primary career over an open-ended side role',
      [sideFund, role('Found', '2022-01-01')],
    ],
    [
      'the most recent involvement between jobs',
      [sideFund, role('Found', '2022-01-01', '2023-01-01')],
    ],
  ])('finds %s', (_, positions) => {
    expect(currentPosition(positions)?.name).toBe('Found');
  });

  it('reports nothing for an empty career rather than throwing', () => {
    expect(currentPosition([])).toBeUndefined();
  });
});

describe('monthsBetween', () => {
  it.each([
    ['whole months', '2014-01-01', '2022-01-01', 96],
    // Eleven months and thirty days is not a year.
    ['a partial month, truncated', '2020-01-01', '2020-12-31', 11],
    ['a full year', '2020-01-01', '2021-01-01', 12],
    // A month from the 31st ends on the last day of a shorter month.
    ['to the end of a shorter month', '2021-01-31', '2021-02-28', 1],
    ['to an epoch-millisecond instant', '2026-03-09', NOW, 4],
    ['a reversed range, as no tenure', '2022-01-01', '2014-01-01', 0],
  ])('counts %s', (_, start, end, months) => {
    expect(monthsBetween(start, end)).toBe(months);
  });

  it('counts a whole month across a daylight-saving change at midnight', () => {
    // Paraguay's clocks went from 00:00 to 01:00 on 2017-10-01, so that local
    // midnight never happened: both months below are whole.
    vi.stubEnv('TZ', 'America/Asuncion');
    try {
      expect(monthsBetween('2017-09-15', '2017-10-15')).toBe(1);
      expect(monthsBetween('2017-10-01', '2017-11-01')).toBe(1);
    } finally {
      vi.unstubAllEnvs();
    }
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
    [26, '2 yr 2 mo', '2 years 2 months'],
    [96, '8 yr', '8 years'],
  ])('renders %i months as "%s" and "%s"', (months, short, long) => {
    expect(formatDuration(months)).toBe(short);
    expect(formatDuration(months, true)).toBe(long);
  });
});

describe('careerSpanYears', () => {
  it.each([
    [
      'the earliest start in any order',
      [role('A', '2020-01-01'), role('B', '2006-01-01')],
      20,
    ],
    ['whole years only', [role('A', '2011-08-01')], 14],
    ['zero for no positions', [], 0],
  ])('reads %s', (_, positions, years) => {
    expect(careerSpanYears(positions, NOW)).toBe(years);
  });
});
