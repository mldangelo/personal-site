import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
  getAllPosts,
  getPostSlugs,
  validatePostFrontmatter,
} from '@/lib/posts';
import { formatDate } from '@/lib/utils';
import { assertFontDigest } from '../lib/fonts.mjs';
import {
  IMAGE_RENDERER_PACKAGES,
  readImageRenderer,
} from '../lib/image-renderer.mjs';
import {
  CARD_FONTS,
  CARD_SIZE,
  countProseWords,
  countUniqueExternalLinks,
  formatCardDate,
  imageDigest,
  readPostCards,
} from '../og-inputs.mjs';
import { TITLE_SIZES, titleFontSize } from '../og-layout.mjs';

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
const base = {
  title: 'Fixture title',
  date: '2026-01-08',
  description: 'Fixture description.',
};
const temporaryRoots: string[] = [];

let cards: PostCard[] = [];

beforeAll(async () => {
  cards = (await readPostCards(ROOT)) as PostCard[];
});

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

function temporaryRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'post-card-'));
  temporaryRoots.push(root);
  return root;
}

function postFixture(frontmatter: Record<string, unknown>): string {
  const root = temporaryRoot();
  const directory = join(root, 'content', 'writing');
  mkdirSync(directory, { recursive: true });
  writeFileSync(
    join(directory, 'example.md'),
    // JSON is valid YAML, and it needs no serializer.
    `---\n${JSON.stringify(frontmatter)}\n---\nFixture body.\n`,
  );
  return root;
}

/**
 * The card set is derived from `content/writing/` by a plain Node script, which
 * cannot import `isPublished` from `src/lib/posts.ts`. These tests hold the two
 * readers together: a card generated for a draft would sit in `public/`,
 * publicly fetchable, with the unpublished title rendered into it.
 */
describe('share card inputs', () => {
  it('generates a card for exactly the posts the site publishes', () => {
    expect(cards.map((card) => card.slug)).toEqual(getPostSlugs());
  });

  it('leaves drafts out of the card set', async () => {
    // The fixture keeps this guard live when the real tree holds no drafts.
    await expect(
      readPostCards(postFixture({ ...base, draft: true })),
    ).resolves.toEqual([]);
  });

  it('prints the title, description, and date of its post', () => {
    for (const post of getAllPosts()) {
      expect(cards.find((card) => card.slug === post.slug)).toMatchObject({
        title: post.title,
        description: post.description,
        dateLabel: formatDate(post.date),
      });
    }
  });

  it('formats a date without drifting a day west of Greenwich', () => {
    expect(formatCardDate('2026-01-08')).toBe('January 8, 2026');
  });

  it('measures a readout for every card', () => {
    for (const card of cards) {
      expect(card.readout.map((cell) => cell.label)).toEqual([
        'Words',
        'Unique external links',
        'Reading time',
      ]);
      for (const cell of card.readout) {
        expect(cell.value).toMatch(/\d/);
      }
    }
  });
});

describe('share card fonts', () => {
  it('rejects changed bytes instead of silently redrawing the cards', () => {
    const data = Buffer.from('fixture font bytes');
    const font = { ...CARD_FONTS[0], sha256: imageDigest(data) };

    expect(() => assertFontDigest(font, data)).not.toThrow();
    expect(() =>
      assertFontDigest({ ...font, sha256: '0'.repeat(64) }, data),
    ).toThrow(/Refusing to generate images from changed font bytes/);
  });
});

describe('share card renderer', () => {
  it('reads each renderer package from the lockfile', async () => {
    const root = temporaryRoot();
    const entry = (name: string) => ({
      version: '1.0.0',
      integrity: `sha512-${name}`,
    });
    writeFileSync(
      join(root, 'package-lock.json'),
      JSON.stringify({
        packages: Object.fromEntries(
          IMAGE_RENDERER_PACKAGES.map((name) => [
            `node_modules/${name}`,
            entry(name),
          ]),
        ),
      }),
    );

    await expect(readImageRenderer(root)).resolves.toEqual(
      IMAGE_RENDERER_PACKAGES.map((name) => ({ name, ...entry(name) })),
    );
  });
});

// Both readers share `post-frontmatter.mjs`, whose rules `posts.test.ts` covers
// field by field. These rows hold the card reader to it, including on a draft,
// which must fail validation before the reader skips it.
describe('share card frontmatter validation', () => {
  it.each([
    [{ ...base, draft: 'true' }, '"draft" must be a boolean'],
    [
      { date: '2026-01-08', description: 'Missing title', draft: true },
      '"title" must be a non-empty string',
    ],
  ])(
    'rejects the same malformed frontmatter as the route reader %#',
    async (frontmatter, message) => {
      expect(() =>
        validatePostFrontmatter(
          frontmatter,
          join('content', 'writing', 'example.md'),
        ),
      ).toThrow(message);
      await expect(readPostCards(postFixture(frontmatter))).rejects.toThrow(
        message,
      );
    },
  );

  it('normalizes valid text exactly as the route reader does', async () => {
    const frontmatter = {
      ...base,
      title: '  Fixture title  ',
      description: '  Fixture description.  ',
      draft: false,
    };
    const [card] = (await readPostCards(
      postFixture(frontmatter),
    )) as PostCard[];
    const { title, date, description } = validatePostFrontmatter(frontmatter);

    expect(card).toMatchObject({ title, date, description });
  });
});

describe('post measurements', () => {
  // The fenced, tilde-fenced, and indented rows are all code blocks to the
  // renderer, so none of them may inflate the words or the reading time.
  it.each<[string, number]>([
    ['# Title\n\nTwo words here.', 4],
    ['Inline `const ignored = 1` code', 2],
    ['A [link](https://example.com/very/long/path)', 2],
    ['- one\n- two\n\n> quoted', 3],
    ['1. one\n  2) two\n> 3. quoted\n\n2026 remains prose', 6],
    ['![alt text](/images/a.png)', 0],
    ['latency < 50ms and throughput > 1k', 5],
    ['<strong>Two words</strong>', 2],
    ['Intro\n\n```js\nconst ignored = "one two three";\n```\n', 1],
    ['Intro\n\n~~~js\nconst ignored = "one two three";\n~~~\n', 1],
    ['Intro\n\n    const ignored = "one two three";\n', 1],
  ])('counts the prose words in %j as %i', (markdown, words) => {
    expect(countProseWords(markdown)).toBe(words);
  });

  const { homepage } = JSON.parse(
    readFileSync(join(ROOT, 'package.json'), 'utf8'),
  );

  it.each<[string, number]>([
    ['[a](https://one.example) [b](https://two.example)', 2],
    ['[a](https://one.example) again [b](https://one.example)', 1],
    ['[internal](/writing/post/)', 0],
    ['![remote](https://one.example/a.png)', 0],
    ['[![chart](/images/chart.png)](https://one.example/report)', 1],
    ['```md\n[in code](https://one.example)\n```', 0],
    ['[a][ref]\n\n[ref]: https://one.example', 1],
    ['[one.example][]\n\n[one.example]: https://one.example', 1],
    ['<https://one.example>', 1],
    ['<a href="https://one.example">raw</a>', 1],
    ['Bare https://one.example link', 1],
    [`[home](${homepage}about/)`, 0],
    ['[write](mailto:someone@example.com)', 0],
  ])('counts the external links in %j as %i', (markdown, links) => {
    expect(countUniqueExternalLinks(markdown)).toBe(links);
  });
});

describe('post card fitting', () => {
  it('finds a supported title size for every published post', () => {
    for (const card of cards) {
      expect(TITLE_SIZES).toContain(titleFontSize(card, CARD_SIZE));
    }
  });

  // Capitals are wider than mixed-case copy, so this title wraps a line further
  // than the same words in sentence case and has to step down to fit.
  it('steps an all-caps title down for the width of its capitals', () => {
    const sizeFor = (slug: string, title: string) =>
      titleFontSize(
        { slug, title, description: 'A short description.' },
        CARD_SIZE,
      );

    expect(sizeFor('caps', 'WHY THE MODEL KEEPS MISSING THE OB')).toBeLessThan(
      sizeFor('sentence', 'Why the model keeps missing the ob'),
    );
  });

  it.each([
    [
      'too-long',
      'A title that keeps going '.repeat(30),
      'A description that cannot fit on the card. '.repeat(30),
      /share card for too-long cannot fit its title and description.*Shorten the frontmatter copy/,
    ],
    [
      'unbreakable',
      'W'.repeat(200),
      'A short description.',
      /share card for unbreakable cannot fit/,
    ],
  ])(
    'rejects %s copy instead of rendering a cropped card',
    (slug, title, description, expected) => {
      expect(() =>
        titleFontSize({ slug, title, description }, CARD_SIZE),
      ).toThrow(expected);
    },
  );
});
