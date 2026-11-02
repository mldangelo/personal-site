import { describe, expect, it } from 'vitest';

import courses from '../resume/courses';
import degrees from '../resume/degrees';
import { categories, skills } from '../resume/skills';
import { getAppearances } from '../speaking';
import writing from '../writing';

const unique = (values: readonly unknown[]) =>
  new Set(values).size === values.length;
const isDescending = (values: readonly string[]) =>
  values.every((value, index) => index === 0 || values[index - 1] >= value);

describe('data the site publishes', () => {
  it('has no duplicate entries', () => {
    expect(unique(courses.map((course) => course.number))).toBe(true);
    expect(unique(degrees.map((degree) => degree.school))).toBe(true);
    expect(unique(categories.map((category) => category.name))).toBe(true);
    expect(unique(writing.map((item) => item.url))).toBe(true);
    expect(unique(getAppearances().map((entry) => entry.link))).toBe(true);
  });

  it('links only to absolute web addresses', () => {
    const links = [
      ...courses.map((course) => course.link),
      ...degrees.map((degree) => degree.link),
      ...writing.map((item) => item.url),
      ...getAppearances().map((entry) => entry.link),
    ];

    for (const link of links) {
      expect(link).toMatch(/^https?:\/\/.+/);
    }
  });

  it('files every skill under a category that exists', () => {
    const names = new Set(categories.map((category) => category.name));

    for (const skill of skills) {
      expect(skill.category.length).toBeGreaterThan(0);
      expect(skill.category.every((name) => names.has(name))).toBe(true);
    }
  });

  it('orders dated writing and appearances newest first', () => {
    const dated = writing.map((item) => item.date).filter(Boolean);

    expect(isDescending(dated)).toBe(true);
    expect(isDescending(getAppearances().map((entry) => entry.date))).toBe(
      true,
    );
  });

  it('dates every appearance with a real calendar day', () => {
    for (const { date } of getAppearances()) {
      expect(new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10)).toBe(
        date,
      );
    }
  });
});
