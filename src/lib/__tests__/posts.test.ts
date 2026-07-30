import { describe, expect, it } from 'vitest';

import { getPostBySlug, validatePostFrontmatter } from '../posts';

const validFrontmatter = {
  title: 'A useful title',
  date: '2026-07-25',
  description: 'A useful description.',
};

describe('validatePostFrontmatter', () => {
  it('accepts and trims required fields', () => {
    expect(
      validatePostFrontmatter({
        title: '  A useful title  ',
        date: '2026-07-25',
        description: '  A useful description.  ',
        draft: false,
      }),
    ).toEqual({ ...validFrontmatter, draft: false });
  });

  it.each([
    [{ ...validFrontmatter, title: '' }, '"title"'],
    [{ ...validFrontmatter, description: 42 }, '"description"'],
    [{ ...validFrontmatter, date: 'July 25, 2026' }, '"date"'],
    [{ ...validFrontmatter, date: '2026-02-30' }, '"date"'],
    [{ ...validFrontmatter, draft: 'false' }, '"draft"'],
    [{ ...validFrontmatter, image: 'card.png' }, '"image"'],
    [{ ...validFrontmatter, image: '/card.png' }, '"imageAlt"'],
    [{ ...validFrontmatter, imageAlt: 'A card' }, '"image"'],
  ])('rejects malformed frontmatter %#', (frontmatter, field) => {
    expect(() =>
      validatePostFrontmatter(frontmatter, 'content/writing/example.md'),
    ).toThrow(`Invalid frontmatter in content/writing/example.md: ${field}`);
  });

  it('accepts an explicitly described article image', () => {
    expect(
      validatePostFrontmatter({
        ...validFrontmatter,
        image: '/images/writing/card.png',
        imageAlt: 'A descriptive alternative',
      }),
    ).toEqual({
      ...validFrontmatter,
      image: '/images/writing/card.png',
      imageAlt: 'A descriptive alternative',
    });
  });
});

describe('getPostBySlug', () => {
  it.each(['../package', 'UPPERCASE', 'trailing-', 'two--hyphens'])(
    'rejects an unsafe or noncanonical slug: %s',
    (slug) => {
      expect(getPostBySlug(slug)).toBeNull();
    },
  );
});
