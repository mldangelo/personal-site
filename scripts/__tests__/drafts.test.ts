/**
 * The one rule three readers have to agree on.
 *
 * `isPublished` in `src/lib/posts.ts` decides what the site renders, and a plain
 * Node build script cannot import it, so `scripts/og-inputs.mjs` reimplements
 * the rule and `scripts/verify-export.mjs` imports that reimplementation. This
 * file is what holds them together.
 *
 * They disagreed. Both scripts skipped a post only when `draft === true`, while
 * `validatePostFrontmatter` throws for any `draft` that is not a boolean — so a
 * quoted `draft: 'true'`, a plausible typo, failed the site build outright while
 * `npm run og:check` told the author to commit a share card for it. The fix is
 * not to copy the app's validator into a script; it is to make the scripts
 * refuse anything that is not an explicit, unambiguous "published", so a
 * malformed flag can never produce a published artifact.
 */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import matter from 'gray-matter';
import { afterAll, describe, expect, it } from 'vitest';

import { validatePostFrontmatter } from '@/lib/posts';
import { isDraftFrontmatter, readPostCards } from '../og-inputs.mjs';

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

function createFixture() {
  const root = mkdtempSync(join(tmpdir(), 'draft-predicate-'));
  fixtureRoots.push(root);
  mkdirSync(join(root, 'content', 'writing'), { recursive: true });

  for (const entry of CASES) {
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

describe('the draft predicate the build scripts share', () => {
  it.each(CASES)('reads $name as draft: $isDraft', (entry) => {
    expect(isDraftFrontmatter(frontmatterOf(entry))).toBe(entry.isDraft);
  });

  it('treats frontmatter with no draft key at all as published', () => {
    expect(isDraftFrontmatter({})).toBe(false);
  });

  /**
   * `draft:` with nothing after it parses as null, which is neither a boolean
   * the site accepts nor an absent key, so it is withheld like any other
   * malformed value.
   */
  it('withholds an empty draft value', () => {
    expect(isDraftFrontmatter(matter('---\ndraft:\n---\n').data)).toBe(true);
  });

  it.each(CASES)(
    'never publishes what the site refuses to build: $name',
    (entry) => {
      const data = frontmatterOf(entry);
      const source = `content/writing/${entry.slug}.md`;

      if (entry.appRefuses) {
        expect(() => validatePostFrontmatter(data, source)).toThrow(
          '"draft" must be a boolean when provided',
        );
        // The site will not build this file. The scripts must therefore not
        // produce an artifact for it either — declining is the safe side of a
        // disagreement, publishing is not.
        expect(isDraftFrontmatter(data)).toBe(true);
        return;
      }

      // Where the site accepts the value, the two readers must land on exactly
      // the same answer: `isPublished` is `!post.draft` outside `next dev`.
      const frontmatter = validatePostFrontmatter(data, source);
      expect(Boolean(frontmatter.draft)).toBe(isDraftFrontmatter(data));
    },
  );
});

describe('readPostCards', () => {
  it('generates a card only for the unambiguously published cases', async () => {
    const cards = (await readPostCards(createFixture())) as { slug: string }[];

    expect(cards.map((card) => card.slug).sort()).toEqual(
      CASES.filter((entry) => !entry.isDraft)
        .map((entry) => entry.slug)
        .sort(),
    );
  });
});
