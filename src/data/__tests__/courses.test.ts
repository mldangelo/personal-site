import { describe, expect, it } from 'vitest';

import courses from '../resume/courses';

describe('courses data', () => {
  it('omits unverified transcript courses', () => {
    expect(courses).toEqual([]);
  });
});
