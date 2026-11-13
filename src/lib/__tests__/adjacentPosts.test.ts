import { describe, expect, it, vi } from 'vitest';

import { getAdjacentPosts } from '../writing';

vi.mock('@/lib/posts', () => ({
  getAllPosts: () =>
    [
      ['newest', '2026-07-01'],
      ['middle', '2026-05-01'],
      ['oldest', '2026-01-01'],
    ].map(([slug, date]) => ({
      slug,
      date,
      title: slug,
      description: '',
      content: '',
    })),
}));

// Dated between `newest` and `middle`, so it would be a neighbour if writing
// elsewhere were not left out.
vi.mock('@/data/writing', () => ({
  default: [
    {
      title: 'Elsewhere',
      url: 'https://example.com/elsewhere',
      date: '2026-06-01',
      description: '',
    },
  ],
}));

const neighbours = (slug: string) =>
  getAdjacentPosts(slug).map((item) => item.url);

describe('getAdjacentPosts', () => {
  it('pairs the next newer post with the next older, skipping writing elsewhere', () => {
    expect(neighbours('middle')).toEqual([
      '/writing/newest/',
      '/writing/oldest/',
    ]);
  });

  it('offers one neighbour at either end and none for an unknown post', () => {
    expect(neighbours('newest')).toEqual(['/writing/middle/']);
    expect(neighbours('oldest')).toEqual(['/writing/middle/']);
    expect(neighbours('missing')).toEqual([]);
  });
});
