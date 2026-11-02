import { describe, expect, it } from 'vitest';

import courses from '../resume/courses';

describe('courses data', () => {
  it('exports an array of courses', () => {
    expect(Array.isArray(courses)).toBe(true);
    expect(courses.length).toBeGreaterThan(0);
  });

  it('course numbers are non-empty', () => {
    for (const course of courses) {
      expect(course.number.trim().length).toBeGreaterThan(0);
    }
  });

  it('course titles are non-empty', () => {
    for (const course of courses) {
      expect(course.title.trim().length).toBeGreaterThan(0);
    }
  });

  it('links are valid URLs', () => {
    const urlRegex = /^https?:\/\/.+/;

    for (const course of courses) {
      expect(course.link).toMatch(urlRegex);
    }
  });

  it('has unique course titles', () => {
    const titles = courses.map((c) => c.title);
    const uniqueTitles = new Set(titles);

    expect(uniqueTitles.size).toBe(titles.length);
  });

  it('has unique course numbers', () => {
    const numbers = courses.map((c) => c.number);
    const uniqueNumbers = new Set(numbers);

    expect(uniqueNumbers.size).toBe(numbers.length);
  });

  it('all courses have valid university names', () => {
    for (const course of courses) {
      expect(course.university.trim().length).toBeGreaterThan(0);
    }
  });
});
