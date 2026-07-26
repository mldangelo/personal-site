import { describe, expect, it } from 'vitest';

import type { Position } from '@/data/resume/work';
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
  it('leads with the newest role', () => {
    expect(tierFor(position({ position: 'Co-founder & CTO' }), 0)).toBe('lead');
  });

  it('never promotes an internship to lead, even at index 0', () => {
    // Position in the array is a weak signal; an internship is early-career
    // regardless of where it happens to sit.
    expect(
      tierFor(position({ position: 'Software Engineering Intern' }), 0),
    ).toBe('early');
  });

  it('reads the year from the ISO string rather than parsing to local time', () => {
    // `new Date('2013-01-01')` is UTC midnight, which getFullYear() renders
    // as 2012 anywhere west of Greenwich — moving the student-era boundary
    // with the reader's timezone.
    expect(
      tierFor(position({ position: 'Engineer', endDate: '2013-01-01' }), 3),
    ).toBe('primary');
    expect(
      tierFor(position({ position: 'Engineer', endDate: '2012-12-31' }), 3),
    ).toBe('early');
  });

  it('steps internships down to the tail of the timeline', () => {
    expect(tierFor(position({ position: 'Avionics Intern' }), 3)).toBe('early');
    expect(
      tierFor(position({ position: 'Software Engineering Intern' }), 5),
    ).toBe('early');
  });

  it('matches the intern rule case-insensitively', () => {
    expect(tierFor(position({ position: 'Research INTERN' }), 2)).toBe('early');
  });

  it('steps student-era roles down even when not titled intern', () => {
    expect(
      tierFor(
        position({ position: 'Program Manager', endDate: '2012-05-01' }),
        6,
      ),
    ).toBe('early');
  });

  it('keeps substantive roles at full weight', () => {
    expect(tierFor(position({ position: 'Co-founder & CTO' }), 1)).toBe(
      'primary',
    );
  });

  it('treats an ongoing role as primary when it is not the newest', () => {
    expect(
      tierFor(position({ position: 'Co-founder', endDate: undefined }), 2),
    ).toBe('primary');
  });
});
