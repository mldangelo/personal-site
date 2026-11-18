import { describe, expect, it } from 'vitest';

import { validatePostFrontmatterData } from '../post-frontmatter.mjs';
import { getPostBySlug } from '../posts';

const validFrontmatter = {
  title: 'A useful title',
  date: '2026-07-25',
  description: 'A useful description.',
};

describe('validatePostFrontmatterData', () => {
  it('accepts and trims required fields', () => {
    expect(
      validatePostFrontmatterData({
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
    [{ ...validFrontmatter, updated: '2026-07-24' }, '"updated"'],
    [{ ...validFrontmatter, updated: '2026-02-30' }, '"updated"'],
    // An unread key would publish without the setting its author meant.
    [{ ...validFrontmatter, Draft: true }, '"Draft" must be spelled "draft"'],
    [{ ...validFrontmatter, tags: ['ai'] }, '"tags" is not a frontmatter key'],
  ])('rejects malformed frontmatter %#', (frontmatter, field) => {
    expect(() =>
      validatePostFrontmatterData(frontmatter, 'content/writing/example.md'),
    ).toThrow(`Invalid frontmatter in content/writing/example.md: ${field}`);
  });

  it('accepts an explicitly described article image', () => {
    expect(
      validatePostFrontmatterData({
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
