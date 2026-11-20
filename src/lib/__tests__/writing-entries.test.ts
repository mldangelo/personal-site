import { afterEach, expect, it, vi } from 'vitest';

import type { WritingEntry } from '@/data/writing';
import { getAllPosts } from '@/lib/posts';
import { SITE_URL } from '@/lib/utils';
import { getWritingItems } from '../writing';

const data = vi.hoisted(() => ({ entries: [] as WritingEntry[] }));
vi.mock('@/data/writing', () => ({
  get default() {
    return data.entries;
  },
}));

const entry = (url: string, date = '2026-01-15'): WritingEntry => ({
  title: `Entry at ${url}`,
  url,
  date,
  description: 'A description.',
});

afterEach(() => {
  data.entries = [];
});

// Each would publish wrong: a date rolled into March, or two feed items with
// one guid.
it.each([
  [
    'an impossible date',
    () => [entry('https://a.example/', '2026-02-30')],
    /real YYYY-MM-DD/,
  ],
  [
    'one address twice',
    () => [
      entry('https://a.example/'),
      entry('https://a.example/', '2025-01-01'),
    ],
    /lists https:\/\/a\.example\/ twice/,
  ],
  [
    "a post's own address",
    () => [entry(`${SITE_URL}/writing/${getAllPosts()[0]?.slug}/`)],
    /twice/,
  ],
])('stops the build on %s', (_, entries, message) => {
  data.entries = entries();

  expect(() => getWritingItems()).toThrow(message);
});
