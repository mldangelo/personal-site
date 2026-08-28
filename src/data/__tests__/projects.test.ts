import { describe, expect, it } from 'vitest';

import projects from '../projects';

describe('projects data', () => {
  it('contains no projects without supplied project details', () => {
    expect(projects).toEqual([]);
  });
});
