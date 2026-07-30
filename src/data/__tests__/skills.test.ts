import { describe, expect, it } from 'vitest';

import { categories, skills } from '../resume/skills';

describe('skills data', () => {
  it('exports a non-empty array of unique skills', () => {
    expect(skills.length).toBeGreaterThan(0);

    const titles = skills.map(({ title }) => title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it('keeps each skill in one valid display category', () => {
    const categoryNames = categories.map(({ name }) => name);

    for (const skill of skills) {
      expect(typeof skill.title).toBe('string');
      expect(typeof skill.category).toBe('string');
      expect(categoryNames).toContain(skill.category);
    }
  });

  /**
   * Order is the only hierarchy. A skill carries a title and a category and
   * nothing else — no `competency` self-score, and no `featured` flag, which
   * was the same self-rating with two levels instead of five and was set on 16
   * of 27 entries.
   */
  it('publishes no rating alongside a skill', () => {
    for (const skill of skills) {
      expect(Object.keys(skill).sort()).toEqual(['category', 'title']);
    }
  });
});

describe('categories data', () => {
  it('keeps the deliberate editorial order', () => {
    expect(categories.map(({ name }) => name)).toEqual([
      'Agent Systems',
      'AI Security & Evals',
      'ML Systems',
      'Software & Infrastructure',
    ]);
  });

  /**
   * Categories used to carry a `color`, and every one of them got the same
   * `var(--color-accent)`, so the tick it painted on each tag was identical
   * everywhere. The field was decorative and unrelated to the independently
   * derived competency score.
   */
  it('carries nothing but a name', () => {
    for (const category of categories) {
      expect(Object.keys(category)).toEqual(['name']);
    }
  });

  it('represents every category exactly once in the data', () => {
    const names = categories.map(({ name }) => name);
    const usedCategories = new Set(skills.map(({ category }) => category));

    expect(new Set(names).size).toBe(names.length);
    expect(usedCategories).toEqual(new Set(names));
  });

  /**
   * No category name may contain another. `buildSkills` in
   * `src/lib/resumeJson.ts` once matched with `String.includes`, which is
   * substring matching against a single-string category, so a name like
   * `ML Systems Engineering` would have silently swallowed `ML Systems`.
   */
  it('has no name that is a substring of another', () => {
    const names = categories.map(({ name }) => name);

    for (const name of names) {
      const others = names.filter((other) => other !== name);
      expect(others.filter((other) => other.includes(name))).toEqual([]);
    }
  });
});
