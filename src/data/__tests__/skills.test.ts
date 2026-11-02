import { describe, expect, it } from 'vitest';

import { categories, skills } from '../resume/skills';

describe('skills data', () => {
  it('exports an array of skills', () => {
    expect(Array.isArray(skills)).toBe(true);
    expect(skills.length).toBeGreaterThan(0);
  });

  it('competency values are between 1 and 5', () => {
    for (const skill of skills) {
      expect(skill.competency).toBeGreaterThanOrEqual(1);
      expect(skill.competency).toBeLessThanOrEqual(5);
    }
  });

  it('each skill has at least one category', () => {
    for (const skill of skills) {
      expect(skill.category.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('skill categories reference valid category names', () => {
    const categoryNames = categories.map((c) => c.name);

    for (const skill of skills) {
      for (const cat of skill.category) {
        expect(categoryNames).toContain(cat);
      }
    }
  });

  // Data quality: categories should be sorted for consistent UI display
  it('skill categories are sorted alphabetically for UI consistency', () => {
    for (const skill of skills) {
      const sorted = [...skill.category].sort();
      expect(skill.category).toEqual(sorted);
    }
  });
});

describe('categories data', () => {
  it('exports an array of categories', () => {
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  // The page lists its groups, and /resume.json its skill sets, in this order.
  it('categories are sorted alphabetically by name', () => {
    const names = categories.map((c) => c.name);
    const sorted = [...names].sort();

    expect(names).toEqual(sorted);
  });

  it('all skill categories are represented', () => {
    const usedCategories = new Set(skills.flatMap((s) => s.category));
    const availableCategories = new Set(categories.map((c) => c.name));

    for (const used of usedCategories) {
      expect(availableCategories.has(used)).toBe(true);
    }
  });

  it('has unique category names', () => {
    const names = categories.map((c) => c.name);
    const uniqueNames = new Set(names);

    expect(uniqueNames.size).toBe(names.length);
  });
});
