import { describe, expect, it } from 'vitest';

import { isActiveRoute } from '../routes';

describe('isActiveRoute', () => {
  it('matches exact routes and nested routes', () => {
    expect(isActiveRoute('/projects', '/projects')).toBe(true);
    expect(isActiveRoute('/projects/', '/projects')).toBe(true);
    expect(isActiveRoute('/projects/current', '/projects')).toBe(true);
  });

  it('does not match a route-name prefix', () => {
    expect(isActiveRoute('/aboutness', '/about')).toBe(false);
    expect(isActiveRoute('/stats-old', '/stats')).toBe(false);
  });

  it('only marks the homepage for the root route', () => {
    expect(isActiveRoute('/', '/')).toBe(true);
    expect(isActiveRoute('/about', '/')).toBe(false);
    expect(isActiveRoute(null, '/')).toBe(false);
  });
});
