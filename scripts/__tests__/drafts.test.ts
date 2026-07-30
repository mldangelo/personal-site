/** The TypeScript route reader and plain-Node asset readers share one validator. */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import matter from 'gray-matter';
import { afterAll, describe, expect, it } from 'vitest';

import { validatePostFrontmatterData } from '@/lib/post-frontmatter.mjs';
import { validatePostFrontmatter } from '@/lib/posts';
import { readPostCards } from '../og-inputs.mjs';

interface DraftCase {
  /** The frontmatter as an author would write it. */
  name: string;
  slug: string;
  /** The `draft` line, or null for frontmatter that omits the key entirely. */
  line: string | null;
  /** What every reader must conclude. */
  isDraft: boolean;
  /** Whether `validatePostFrontmatter` refuses the value outright. */
  appRefuses: boolean;
}

const CASES: DraftCase[] = [
  {
    name: 'draft: true',
    slug: 'boolean-true',
    line: 'draft: true',
    isDraft: true,
    appRefuses: false,
  },
  {
    name: 'draft: false',
    slug: 'boolean-false',
    line: 'draft: false',
    isDraft: false,
    appRefuses: false,
  },
  {
    name: "draft: 'true'",
    slug: 'quoted-true',
    line: "draft: 'true'",
    isDraft: true,
    appRefuses: true,
  },
  // The interesting one. A quoted `false` reads as "published" to a human and
  // is refused by the site, so the scripts must withhold rather than guess.
  {
    name: "draft: 'false'",
    slug: 'quoted-false',
    line: "draft: 'false'",
    isDraft: true,
    appRefuses: true,
  },
  {
    name: 'no draft key',
    slug: 'no-key',
    line: null,
    isDraft: false,
    appRefuses: false,
  },
  {
    name: 'draft: 1',
    slug: 'numeric',
    line: 'draft: 1',
    isDraft: true,
    appRefuses: true,
  },
];

/**
 * Matches how the real posts are written: the date is quoted, because YAML
 * parses a bare `2026-01-08` into a `Date` and both readers want the string.
 */
function postSource(entry: DraftCase) {
  return [
    '---',
    `title: Post ${entry.slug}`,
    "date: '2026-01-08'",
    `description: Frontmatter fixture for ${entry.slug}.`,
    ...(entry.line === null ? [] : [entry.line]),
    '---',
    '',
    'Body prose so the card readout has something to measure.',
    '',
  ].join('\n');
}

function frontmatterOf(entry: DraftCase) {
  return matter(postSource(entry)).data;
}

const fixtureRoots: string[] = [];

function createFixture(entries = CASES) {
  const root = mkdtempSync(join(tmpdir(), 'draft-predicate-'));
  fixtureRoots.push(root);
  mkdirSync(join(root, 'content', 'writing'), { recursive: true });

  for (const entry of entries) {
    writeFileSync(
      join(root, 'content', 'writing', `${entry.slug}.md`),
      postSource(entry),
    );
  }

  return root;
}

afterAll(() => {
  for (const root of fixtureRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('the frontmatter validator every post reader shares', () => {
  it.each(CASES)('handles $name identically at both boundaries', (entry) => {
    const data = frontmatterOf(entry);
    const source = `content/writing/${entry.slug}.md`;

    if (entry.appRefuses) {
      expect(() => validatePostFrontmatterData(data, source)).toThrow(
        '"draft" must be a boolean when provided',
      );
      expect(() => validatePostFrontmatter(data, source)).toThrow(
        '"draft" must be a boolean when provided',
      );
      return;
    }

    const shared = validatePostFrontmatterData(data, source);
    expect(validatePostFrontmatter(data, source)).toEqual(shared);
    expect(Boolean(shared.draft)).toBe(entry.isDraft);
  });

  it('rejects an empty draft value', () => {
    const data = matter(
      [
        '---',
        'title: Empty draft value',
        "date: '2026-01-08'",
        'description: The value must still be a boolean.',
        'draft:',
        '---',
      ].join('\n'),
    ).data;

    expect(() => validatePostFrontmatterData(data, 'empty-draft.md')).toThrow(
      '"draft" must be a boolean when provided',
    );
  });
});

describe('readPostCards', () => {
  it('generates cards only for validated, published posts', async () => {
    const validCases = CASES.filter((entry) => !entry.appRefuses);
    const cards = (await readPostCards(createFixture(validCases))) as {
      slug: string;
    }[];

    expect(cards.map((card) => card.slug).sort()).toEqual(
      validCases
        .filter((entry) => !entry.isDraft)
        .map((entry) => entry.slug)
        .sort(),
    );
  });

  it('rejects malformed frontmatter before a draft can be skipped', async () => {
    await expect(readPostCards(createFixture())).rejects.toThrow(
      '"draft" must be a boolean when provided',
    );
  });
});
