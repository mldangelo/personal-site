import { describe, expect, it } from 'vitest';

import { isActiveRoute } from '../routes';

describe('isActiveRoute', () => {
  it('matches exact routes and nested routes', () => {
    expect(isActiveRoute('/writing', '/writing')).toBe(true);
    expect(isActiveRoute('/writing/post-slug', '/writing')).toBe(true);
  });

  it('does not match a route-name prefix', () => {
    expect(isActiveRoute('/aboutness', '/about')).toBe(false);
  });

  it('only marks the homepage for the root route', () => {
    expect(isActiveRoute('/', '/')).toBe(true);
    expect(isActiveRoute('/about', '/')).toBe(false);
  });

  // GitHub Pages serves a page's file by name as well as by its directory.
  it('reads a page opened by its file name as that page', () => {
    expect(isActiveRoute('/index.html', '/')).toBe(true);
    expect(isActiveRoute('/about/index.html', '/about')).toBe(true);
    expect(isActiveRoute('/about/index.html', '/')).toBe(false);
  });
});
