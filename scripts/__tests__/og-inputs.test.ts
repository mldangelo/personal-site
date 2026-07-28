import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

import { getAllPosts, getPostSlugs } from '@/lib/posts';
import { formatDate } from '@/lib/utils';
import {
  countProseWords,
  countReferences,
  formatCardDate,
  postCardPath,
  readPostCards,
} from '../og-inputs.mjs';

interface PostCard {
  slug: string;
  path: string;
  title: string;
  description: string;
  date: string;
  dateLabel: string;
  readout: { label: string; value: string }[];
}

const ROOT = process.cwd();
const CARD_DIRECTORY = join(ROOT, 'public', 'og', 'writing');
const LEDGER = join(ROOT, 'public', 'og.meta.json');

let cards: PostCard[] = [];

beforeAll(async () => {
  cards = (await readPostCards(ROOT)) as PostCard[];
});

/**
 * The card set is derived from `content/writing/` by a plain Node script, which
 * cannot import `isPublished` from `src/lib/posts.ts`. These tests are what
 * holds the two readers together: a card generated for a draft would sit in
 * `public/`, publicly fetchable, with the unpublished title rendered into it.
 */
describe('share card inputs', () => {
  it('generates a card for exactly the posts the site publishes', () => {
    expect(cards.map((card) => card.slug)).toEqual(getPostSlugs());
  });

  it('leaves drafts out of the card set, the ledger, and public/', () => {
    const drafts = readdirSync(join(ROOT, 'content', 'writing'))
      .filter((file) => file.endsWith('.md'))
      .map((file) => file.replace(/\.md$/, ''))
      .filter((slug) => !getPostSlugs().includes(slug));
    const ledger = readFileSync(LEDGER, 'utf8');

    // The fixture this protects against is real: one post in the repository is
    // a draft, so an empty list here means the test has stopped proving
    // anything.
    expect(drafts.length).toBeGreaterThan(0);

    for (const slug of drafts) {
      expect(cards.map((card) => card.slug)).not.toContain(slug);
      expect(ledger).not.toContain(slug);
      expect(existsSync(join(CARD_DIRECTORY, `${slug}.png`))).toBe(false);
    }
  });

  it('holds a committed card at the path each post links to', () => {
    for (const card of cards) {
      expect(card.path).toBe(postCardPath(card.slug));
      expect(existsSync(join(CARD_DIRECTORY, `${card.slug}.png`))).toBe(true);
    }
    expect(readdirSync(CARD_DIRECTORY).sort()).toEqual(
      cards.map((card) => `${card.slug}.png`).sort(),
    );
  });

  it('prints the same date the post header prints', () => {
    for (const post of getAllPosts()) {
      const card = cards.find((entry) => entry.slug === post.slug);
      expect(card?.dateLabel).toBe(formatDate(post.date));
    }
  });

  it('formats a date without drifting a day west of Greenwich', () => {
    expect(formatCardDate('2026-01-08')).toBe('January 8, 2026');
  });

  it('carries the title and description of its post', () => {
    for (const post of getAllPosts()) {
      const card = cards.find((entry) => entry.slug === post.slug);
      expect(card?.title).toBe(post.title);
      expect(card?.description).toBe(post.description);
    }
  });

  it('measures a readout for every card', () => {
    for (const card of cards) {
      expect(card.readout.map((cell) => cell.label)).toEqual([
        'Words',
        'References',
        'Reading time',
      ]);
      for (const cell of card.readout) {
        expect(cell.value).toMatch(/\d/);
      }
    }
  });
});

describe('post measurements', () => {
  it('counts prose words, not code, URLs, or markup', () => {
    // The heading mark is not a word; the heading's own words are.
    expect(countProseWords('# Title\n\nTwo words here.')).toBe(4);
    expect(countProseWords('One\n\n```js\nconst ignored = "words";\n```')).toBe(
      1,
    );
    expect(countProseWords('Inline `const ignored = 1` code')).toBe(2);
    expect(
      countProseWords('A [link](https://example.com/very/long/path)'),
    ).toBe(2);
    expect(countProseWords('- one\n- two\n\n> quoted')).toBe(3);
    expect(countProseWords('![alt text](/images/a.png)')).toBe(0);
  });

  it('counts distinct outbound sources', () => {
    expect(
      countReferences('[a](https://one.example) [b](https://two.example)'),
    ).toBe(2);
    expect(
      countReferences(
        '[a](https://one.example) again [b](https://one.example)',
      ),
    ).toBe(1);
    expect(countReferences('[internal](/writing/post/)')).toBe(0);
    expect(countReferences('![remote](https://one.example/a.png)')).toBe(0);
    expect(countReferences('```md\n[in code](https://one.example)\n```')).toBe(
      0,
    );
  });
});
