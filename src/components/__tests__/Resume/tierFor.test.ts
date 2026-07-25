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
  it('leads with the newest role regardless of its shape', () => {
    expect(
      tierFor(position({ position: 'Software Engineering Intern' }), 0),
    ).toBe('lead');
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
