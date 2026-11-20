import { describe, expect, it } from 'vitest';

import courses from '../resume/courses';
import { skills } from '../resume/skills';
import { getAppearances } from '../speaking';

const unique = (values: readonly unknown[]) =>
  new Set(values).size === values.length;

describe('data the site publishes', () => {
  it('has no duplicate entries', () => {
    expect(unique(courses.map((course) => course.number))).toBe(true);
    expect(unique(getAppearances().map((entry) => entry.link))).toBe(true);
  });

  // A skill with no category belongs to no group, so the résumé would drop it.
  it('files every skill under at least one category', () => {
    for (const skill of skills) {
      expect(skill.category.length).toBeGreaterThan(0);
    }
  });

  it('dates every appearance with a real calendar day', () => {
    for (const { date } of getAppearances()) {
      expect(new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10)).toBe(
        date,
      );
    }
  });
});
