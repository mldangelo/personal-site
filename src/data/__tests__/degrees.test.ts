import { describe, expect, it } from 'vitest';

import degrees from '../resume/degrees';

describe('degrees data', () => {
  it('exports an array of degrees', () => {
    expect(Array.isArray(degrees)).toBe(true);
    expect(degrees.length).toBeGreaterThan(0);
  });

  it('each degree has required properties', () => {
    for (const degree of degrees) {
      expect(degree).toHaveProperty('school');
      expect(degree).toHaveProperty('degree');
      expect(degree).toHaveProperty('link');
      expect(degree).toHaveProperty('year');

      expect(typeof degree.school).toBe('string');
      expect(typeof degree.degree).toBe('string');
      expect(typeof degree.link).toBe('string');
      expect(typeof degree.year).toBe('number');
    }
  });

  it('degree years are reasonable (between 1950 and current year + 10)', () => {
    const currentYear = new Date().getFullYear();

    for (const degree of degrees) {
      expect(degree.year).toBeGreaterThanOrEqual(1950);
      expect(degree.year).toBeLessThanOrEqual(currentYear + 10);
    }
  });

  it('links are valid URLs', () => {
    const urlRegex = /^https?:\/\/.+/;

    for (const degree of degrees) {
      expect(degree.link).toMatch(urlRegex);
    }
  });

  it('degrees are ordered by year (most recent first)', () => {
    for (let i = 0; i < degrees.length - 1; i++) {
      expect(degrees[i].year).toBeGreaterThanOrEqual(degrees[i + 1].year);
    }
  });

  it('has unique school entries', () => {
    const schools = degrees.map((d) => d.school);
    const uniqueSchools = new Set(schools);

    expect(uniqueSchools.size).toBe(schools.length);
  });

  it('each degree has a non-empty degree name', () => {
    for (const degree of degrees) {
      expect(degree.degree.trim().length).toBeGreaterThan(0);
    }
  });
});
