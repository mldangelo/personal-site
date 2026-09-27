import { describe, expect, it } from 'vitest';

import writing from '../writing';

describe('writing data', () => {
  it('has no placeholder upstream articles', () => {
    expect(writing).toEqual([]);
  });
});
