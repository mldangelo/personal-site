import { describe, expect, it } from 'vitest';

import type { Position } from '@/data/resume/work';
import { tierFor } from '../../Resume/Experience';

function role(position: string, startDate: string, endDate?: string): Position {
  return { name: position, position, url: 'https://a.co', startDate, endDate };
}

describe('tierFor', () => {
  it('leads with the newest role regardless of array position', () => {
    const older = role('Older', '2020-01-01');
    const newest = role('Newest', '2026-03-09', '2026-06-01');

    expect(tierFor(newest, [older, newest])).toBe('lead');
    expect(tierFor(older, [older, newest])).toBe('primary');
  });

  it.each([
    ['an intern with the newest date', 'Software Intern', '2027-01-01'],
    ['an intern in any case', 'Research INTERN', '2023-01-01'],
    // `new Date('2013-01-01')` is UTC midnight, which getFullYear() reads as
    // 2012 west of Greenwich. The boundary must not move with the reader.
    ['the last day of the student era', 'Program Manager', '2012-12-31'],
  ])('steps %s down', (_, title, date) => {
    const entry = role(title, date, date);

    expect(tierFor(entry, [entry])).toBe('early');
  });

  it('keeps the first day after the student era at full weight', () => {
    expect(tierFor(role('Engineer', '2010-01-01', '2013-01-01'), [])).toBe(
      'primary',
    );
  });

  it('keeps a newer part-time side role primary instead of making it lead', () => {
    const currentJob = role('Current Job', '2026-01-01');
    const sideRole: Position = {
      ...role('Side Fund', '2027-01-01'),
      commitment: 'part-time',
    };
    const positions = [sideRole, currentJob];

    expect(tierFor(sideRole, positions)).toBe('primary');
    expect(tierFor(currentJob, positions)).toBe('lead');
  });
});
