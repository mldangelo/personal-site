import { describe, expect, it } from 'vitest';

import routes from '../routes';

describe('routes', () => {
  it('exports an array of routes', () => {
    expect(Array.isArray(routes)).toBe(true);
    expect(routes.length).toBeGreaterThan(0);
  });

  it('has correct structure for each route', () => {
    for (const route of routes) {
      expect(route).toHaveProperty('label');
      expect(route).toHaveProperty('path');
      expect(typeof route.label).toBe('string');
      expect(typeof route.path).toBe('string');
    }
  });

  it('has exactly one index route', () => {
    const indexRoutes = routes.filter((r) => r.index);
    expect(indexRoutes.length).toBe(1);
  });

  it('index route points to root path', () => {
    const indexRoute = routes.find((r) => r.index);
    expect(indexRoute?.path).toBe('/');
  });

  it('all paths start with /', () => {
    for (const route of routes) {
      expect(route.path.startsWith('/')).toBe(true);
    }
  });

  it('contains expected navigation routes', () => {
    const paths = routes.map((r) => r.path);

    expect(paths).toContain('/');
    expect(paths).toContain('/about');
    expect(paths).toContain('/resume');
    expect(paths).toContain('/projects');
    expect(paths).toContain('/contact');
  });

  it('has unique paths', () => {
    const paths = routes.map((r) => r.path);
    const uniquePaths = new Set(paths);

    expect(uniquePaths.size).toBe(paths.length);
  });

  it('has unique labels', () => {
    const labels = routes.map((r) => r.label);
    const uniqueLabels = new Set(labels);

    expect(uniqueLabels.size).toBe(labels.length);
  });

  it('non-index routes have non-empty labels for navigation', () => {
    const navRoutes = routes.filter((r) => !r.index);

    for (const route of navRoutes) {
      expect(route.label.trim().length).toBeGreaterThan(0);
    }
  });
});
