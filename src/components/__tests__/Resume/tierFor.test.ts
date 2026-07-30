import { describe, expect, it } from 'vitest';

import type { Position } from '@/data/resume/work';
import { sortPositions } from '@/lib/career';
import { tierFor } from '../../Resume/Experience';

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

describe('tierFor', () => {
  it('leads with the top substantive role regardless of array position', () => {
    const older = position({
      name: 'Older Corp',
      startDate: '2020-01-01',
    });
    const newest = position({
      name: 'Newest Corp',
      position: 'Co-founder & CTO',
      startDate: '2026-03-09',
    });
    const positions = [older, newest];

    expect(tierFor(newest, positions)).toBe('lead');
    expect(tierFor(older, positions)).toBe('primary');
  });

  /**
   * The lead has to be the entry the spine renders first, and the spine is
   * ordered by `timelineKey` — recency of *involvement* — not by start date.
   * The two disagree here: the brief stint began later, but it has closed and
   * the long role has not, so the long role renders above it. Keying the lead
   * on the newest start date put the heaviest entry second.
   */
  it('leads with the first rendered role when that is not the newest start', () => {
    const ongoing = position({
      name: 'Long Ongoing Co',
      position: 'Co-founder & CTO',
      startDate: '2015-01-01',
      endDate: undefined,
    });
    const laterButClosed = position({
      name: 'Brief Recent Co',
      startDate: '2024-01-01',
      endDate: '2024-06-01',
    });
    const positions = [ongoing, laterButClosed];

    expect(sortPositions(positions)[0]).toBe(ongoing);
    expect(tierFor(ongoing, positions)).toBe('lead');
    expect(tierFor(laterButClosed, positions)).toBe('primary');
  });

  /**
   * `timelineKey` places an open-ended *part-time* role by when it began, so a
   * fund that never formally ends does not park itself above the full-time
   * record. The tier has to honour the same exception: the fund started most
   * recently, but it renders last.
   */
  it('does not lead with an open-ended part-time role that renders below', () => {
    const fund = position({
      name: 'Side Fund',
      position: 'Co-founder',
      startDate: '2026-06-01',
      endDate: undefined,
      commitment: 'part-time',
    });
    const dayJob = position({
      name: 'Current Job',
      startDate: '2018-01-01',
      endDate: undefined,
    });
    const positions = [fund, dayJob];

    expect(sortPositions(positions)[0]).toBe(dayJob);
    expect(tierFor(dayJob, positions)).toBe('lead');
    expect(tierFor(fund, positions)).toBe('primary');
  });

  it('leads exactly one role when two share the newest date', () => {
    const first = position({
      name: 'First Co',
      startDate: '2026-01-01',
      endDate: undefined,
    });
    const second = position({
      name: 'Second Co',
      startDate: '2026-01-01',
      endDate: undefined,
    });
    const positions = [first, second];

    const tiers = positions.map((entry) => tierFor(entry, positions));

    expect(tiers.filter((tier) => tier === 'lead')).toHaveLength(1);
    expect(tierFor(sortPositions(positions)[0], positions)).toBe('lead');
  });

  /**
   * The lead is the first entry the `early` tier declines, not simply the first
   * entry: an ongoing internship is the current role and still must not lead.
   */
  it('skips past an early-career role sitting at the top of the spine', () => {
    const internship = position({
      name: 'Rocket Co',
      position: 'Avionics Intern',
      startDate: '2026-01-01',
      endDate: undefined,
    });
    const realJob = position({
      name: 'Day Job',
      startDate: '2020-01-01',
      endDate: '2025-01-01',
    });
    const positions = [internship, realJob];

    expect(sortPositions(positions)[0]).toBe(internship);
    expect(tierFor(internship, positions)).toBe('early');
    expect(tierFor(realJob, positions)).toBe('lead');
  });

  it('never promotes an internship with the newest date to lead', () => {
    const internship = position({
      position: 'Software Engineering Intern',
      startDate: '2027-01-01',
    });

    expect(tierFor(internship, [internship])).toBe('early');
  });

  it('reads the year from the ISO string rather than parsing to local time', () => {
    // `new Date('2013-01-01')` is UTC midnight, which getFullYear() renders
    // as 2012 anywhere west of Greenwich — moving the student-era boundary
    // with the reader's timezone.
    expect(
      tierFor(position({ position: 'Engineer', endDate: '2013-01-01' }), []),
    ).toBe('primary');
    expect(
      tierFor(position({ position: 'Engineer', endDate: '2012-12-31' }), []),
    ).toBe('early');
  });

  it('steps internships down to the tail of the timeline', () => {
    expect(tierFor(position({ position: 'Avionics Intern' }), [])).toBe(
      'early',
    );
    expect(
      tierFor(position({ position: 'Software Engineering Intern' }), []),
    ).toBe('early');
  });

  it('matches the intern rule case-insensitively', () => {
    expect(tierFor(position({ position: 'Research INTERN' }), [])).toBe(
      'early',
    );
  });

  it('reads the intern rule as a word, not a substring', () => {
    // `/intern/i` matches inside `internal`, which demoted a senior role to the
    // student-era tier.
    const internalTools = position({
      position: 'Internal Tools Engineer',
      startDate: '2024-01-01',
      endDate: undefined,
    });

    expect(tierFor(internalTools, [internalTools])).toBe('lead');
    expect(
      tierFor(position({ position: 'Head of Internal Systems' }), []),
    ).toBe('primary');
  });

  it('still demotes the noun form of the title', () => {
    expect(tierFor(position({ position: 'Engineering Internship' }), [])).toBe(
      'early',
    );
  });

  it('steps student-era roles down even when not titled intern', () => {
    expect(
      tierFor(
        position({ position: 'Program Manager', endDate: '2012-05-01' }),
        [],
      ),
    ).toBe('early');
  });

  it('keeps substantive roles at full weight', () => {
    const newer = position({ name: 'Newer', startDate: '2026-01-01' });
    const role = position({
      name: 'Acme Corp',
      position: 'Co-founder & CTO',
      startDate: '2024-01-01',
    });

    expect(tierFor(role, [newer, role])).toBe('primary');
  });

  /**
   * Two roles still running tie on `timelineKey`, and the tie breaks on the
   * newer start — so the older of the two is primary even though it has not
   * ended either.
   */
  it('treats an ongoing role as primary when another began more recently', () => {
    const older = position({
      name: 'Long Haul Co',
      position: 'Co-founder',
      startDate: '2017-01-01',
      endDate: undefined,
    });
    const newer = position({
      name: 'Current Job',
      startDate: '2026-01-01',
      endDate: undefined,
    });
    const positions = [older, newer];

    expect(tierFor(older, positions)).toBe('primary');
    expect(tierFor(newer, positions)).toBe('lead');
  });
});
