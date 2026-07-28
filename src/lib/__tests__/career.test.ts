import { describe, expect, it } from 'vitest';

import type { Position } from '@/data/resume/work';
import work from '@/data/resume/work';
import {
  formatDuration,
  monthsBetween,
  positionDuration,
  sortPositions,
  timelineKey,
  totalExperienceYears,
} from '../career';

/**
 * A fixed instant, so every figure derived from "now" is pinned. Mirrors the
 * approach `telemetry.test.ts` takes with `ageAt()` — none of these functions
 * read the clock themselves, which is the whole reason they can be tested.
 */
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

/** A real role from `work`, so the pinned figures are about actual data. */
function roleNamed(name: string): Position {
  const found = work.find((entry) => entry.name === name);

  if (!found) {
    throw new Error(`No role named "${name}" in the work data`);
  }

  return found;
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

  it('prefers the end date when start and end disagree', () => {
    // The property the whole ordering turns on, isolated: `Later` starts after
    // `Longer` but finished years earlier, because it ran inside `Longer`'s
    // window. Sorting on the start date puts it first; sorting on the end date
    // — recency of involvement — does not. Reverse this comparator and only
    // this assertion fails.
    const ordered = sortPositions([
      position({
        name: 'Later',
        startDate: '2015-09-01',
        endDate: '2016-06-01',
      }),
      position({
        name: 'Longer',
        startDate: '2014-01-01',
        endDate: '2022-01-01',
      }),
    ]);

    expect(byName(ordered)).toEqual(['Longer', 'Later']);
  });

  it('breaks a shared end date by the later start date', () => {
    // Same end, so the shorter of the two leads.
    const ordered = sortPositions([
      position({
        name: 'Long',
        startDate: '2014-01-01',
        endDate: '2022-01-01',
      }),
      position({
        name: 'Short',
        startDate: '2021-01-01',
        endDate: '2022-01-01',
      }),
    ]);

    expect(byName(ordered)).toEqual(['Short', 'Long']);
  });

  it('places an ongoing role ahead of every closed one, however recent', () => {
    // An ongoing role sorts as though it ends later than any real date, even
    // against a role that started later and closed only days ago.
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

  it('returns real career data in strictly non-increasing timeline order', () => {
    // The source array runs 2022 → 2017 → 2014 → 2015 → 2014 through the
    // middle. Source order is no longer load-bearing, but the rendered order
    // is, so it is pinned here. Ordering is by end date — recency of
    // involvement — except that an open-ended part-time role is placed by when
    // it began, which is what `timelineKey` encodes.
    const keys = sortPositions(work).map(timelineKey);

    for (let i = 1; i < keys.length; i += 1) {
      expect(keys[i].localeCompare(keys[i - 1])).toBeLessThanOrEqual(0);
    }
  });

  it('places a long tenure above the shorter roles that ran inside it', () => {
    // The concrete regression this ordering exists to prevent: by start date,
    // an eight-year co-founder role sorted below a nine-month one and a
    // seven-month internship, because both began later inside its window.
    const order = sortPositions(work).map((entry) => entry.name);

    expect(order.indexOf('Arthena')).toBeLessThan(order.indexOf('Matroid'));
    expect(order.indexOf('Arthena')).toBeLessThan(order.indexOf('Planet'));
  });

  it('leads the real career data with the current OpenAI role', () => {
    expect(sortPositions(work)[0].name).toBe('OpenAI');
  });

  it('places an open-ended part-time role by when it began, not at the top', () => {
    // An angel fund never formally closes. Ranked purely by recency it would
    // outrank every full-time position forever; ranked by when it began it
    // sits among its contemporaries.
    const ordered = sortPositions([
      position({
        name: 'Current Job',
        startDate: '2024-01-01',
        endDate: undefined,
      }),
      position({
        name: 'Old Job',
        startDate: '2019-01-01',
        endDate: '2023-01-01',
      }),
      position({
        name: 'Side Fund',
        startDate: '2017-04-01',
        endDate: undefined,
        commitment: 'part-time',
      }),
    ]);

    expect(byName(ordered)).toEqual(['Current Job', 'Old Job', 'Side Fund']);
  });

  it('still leads with an open-ended full-time role', () => {
    // The part-time rule must not weaken the ordinary case.
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

  it('demotes the real part-time fund below every full-time role it overlapped', () => {
    const order = sortPositions(work).map((entry) => entry.name);
    const fund = order.indexOf('Skeptical Investments');

    for (const name of ['OpenAI', 'Promptfoo', 'Smile ID', 'Arthena']) {
      expect(order.indexOf(name)).toBeLessThan(fund);
    }
    // Still ahead of what genuinely predates it.
    expect(fund).toBeLessThan(order.indexOf('Matroid'));
  });

  it('sorts Arthena above the internship it ran alongside', () => {
    const ordered = byName(sortPositions(work));

    expect(ordered.indexOf('Arthena')).toBeLessThan(
      ordered.indexOf('Planetary Resources'),
    );
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

  it('is the same measurement regardless of the reader (both dates are ISO)', () => {
    expect(monthsBetween('2015-09-01', '2016-06-01')).toBe(9);
  });
});

describe('formatDuration', () => {
  it('renders months alone under a year', () => {
    expect(formatDuration(1)).toBe('1 mo');
    expect(formatDuration(11)).toBe('11 mo');
  });

  it('drops the month component on a whole number of years', () => {
    expect(formatDuration(12)).toBe('1 yr');
    expect(formatDuration(96)).toBe('8 yr');
  });

  it('renders both components otherwise', () => {
    expect(formatDuration(95)).toBe('7 yr 11 mo');
    expect(formatDuration(20)).toBe('1 yr 8 mo');
  });

  it('marks anything under a month rather than printing "0 mo"', () => {
    expect(formatDuration(0)).toBe('<1 mo');
    expect(formatDuration(-5)).toBe('<1 mo');
  });
});

describe('positionDuration', () => {
  it('measures a closed role between its own dates and ignores now', () => {
    expect(positionDuration(roleNamed('Arthena'), NOW)).toBe('8 yr');
  });

  it('measures an ongoing role to the instant it is given', () => {
    const openai = roleNamed('OpenAI');

    expect(openai.endDate).toBeUndefined();
    expect(positionDuration(openai, NOW)).toBe('4 mo');
  });

  it('measures the long-running ongoing side role to the same instant', () => {
    expect(positionDuration(roleNamed('Skeptical Investments'), NOW)).toBe(
      '9 yr 3 mo',
    );
  });

  it('agrees with the range shown beside it', () => {
    // July 2024 – March 2026.
    expect(positionDuration(roleNamed('Promptfoo'), NOW)).toBe('1 yr 8 mo');
  });
});

describe('totalExperienceYears', () => {
  it('counts completed years since the earliest role began', () => {
    // Earliest start in the real data is 2011-06-01.
    expect(totalExperienceYears(work, NOW)).toBe(15);
  });

  it('reads the earliest start regardless of array order', () => {
    const positions = [
      position({ startDate: '2020-01-01' }),
      position({ startDate: '2006-01-01' }),
      position({ startDate: '2014-01-01' }),
    ];

    expect(totalExperienceYears(positions, NOW)).toBe(20);
  });

  it('does not round a partial year up', () => {
    expect(
      totalExperienceYears([position({ startDate: '2011-08-01' })], NOW),
    ).toBe(14);
  });

  it('returns zero for no positions rather than throwing', () => {
    expect(totalExperienceYears([], NOW)).toBe(0);
  });

  it('advances on its own as the clock moves', () => {
    const laterYear = new Date('2027-07-28T12:00:00Z').getTime();

    expect(totalExperienceYears(work, laterYear)).toBe(
      totalExperienceYears(work, NOW) + 1,
    );
  });
});
