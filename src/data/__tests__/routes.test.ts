import { describe, expect, it } from 'vitest';

import routes from '../routes';

describe('routes', () => {
  it('has exactly one index route, at the root', () => {
    expect(routes.filter((route) => route.index)).toMatchObject([
      { path: '/' },
    ]);
  });
});
