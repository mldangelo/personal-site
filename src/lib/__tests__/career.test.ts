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
});

describe('currentPosition', () => {
  // Between jobs, the footer and the Person data must not name the employer
  // just left: the side role still going is the one held.
  it('falls back to an ongoing side role, never a role that has ended', () => {
    expect(
      currentPosition([sideFund, role('Left', '2022-01-01', '2026-01-01')])
        ?.name,
    ).toBe('Side fund');
    expect(
      currentPosition([role('Left', '2022-01-01', '2026-01-01')]),
    ).toBeUndefined();
  });
});

describe('monthsBetween', () => {
  it.each([
    // Eleven months and thirty days is not a year.
    ['a partial month, truncated', '2020-01-01', '2020-12-31', 11],
    ['a full year', '2020-01-01', '2021-01-01', 12],
    // A month from the 31st ends on the last day of a shorter month.
    ['to the end of a shorter month', '2021-01-31', '2021-02-28', 1],
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
    [0, '<1 mo', 'less than 1 month'],
    [1, '1 mo', '1 month'],
    [12, '1 yr', '1 year'],
    [26, '2 yr 2 mo', '2 years 2 months'],
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
  ])('reads %s', (_, positions, years) => {
    expect(careerSpanYears(positions, NOW)).toBe(years);
  });
});
