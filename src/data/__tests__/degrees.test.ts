import { describe, expect, it } from 'vitest';

import degrees from '../resume/degrees';

describe('degrees data', () => {
  it('exports an array of degrees', () => {
    expect(degrees).toEqual([
      expect.objectContaining({
        school: 'University of South Dakota',
        degree: 'Master of Science in Computer Science',
        year: 2024,
      }),
    ]);
  });
});
