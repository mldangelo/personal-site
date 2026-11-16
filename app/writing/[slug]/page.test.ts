import fs from 'node:fs';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { getPostBySlug, getPostSlugs } from '@/lib/posts';
import {
  SHARE_IMAGE_DIMENSIONS,
  SHARE_IMAGE_PATH,
  SITE_URL,
} from '@/lib/utils';
import PostPage, { generateMetadata } from './page';

// `npm run og` draws a card for every real post, but none for these fixtures.
vi.mock('@/lib/imageSize', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/imageSize')>();
  return {
    ...actual,
    readImageSize: (path: string) =>
      /^\/og\/writing\/zz-.*-fixture\.png$/.test(path)
        ? { width: 1200, height: 630 }
        : actual.readImageSize(path),
  };
});

const DRAFT_SLUG = 'zz-draft-preview-fixture';
const DRAFT_TITLE = 'A Draft Held Back From Publication';
const POSTS_DIRECTORY = join(process.cwd(), 'content/writing');

const post = (frontmatter: string[], body = 'Text.') =>
  ['---', ...frontmatter, '---', '', body, ''].join('\n');

/** Posts that exist only in this suite, so it passes whatever a fork publishes. */
const FIXTURES: Record<string, string> = {
  [DRAFT_SLUG]: post(
    [
      `title: '${DRAFT_TITLE}'`,
      "date: '2026-01-08'",
      "description: 'Unpublished while it is being written.'",
      'draft: true',
      // Both images are absent from `public/`: a draft may name images that
      // have not been committed yet, and the page must still render.
      `image: '/images/writing/${DRAFT_SLUG}/absent.png'`,
      "imageAlt: 'A screenshot not yet committed'",
    ],
    `![Screenshot](/images/writing/${DRAFT_SLUG}/absent.png)`,
  ),
  'zz-with-image-fixture': post([
    "title: 'A Post With A Screenshot'",
    "date: '2026-01-09'",
    "description: 'Names a representative image.'",
    "image: '/og.png'",
    "imageAlt: 'The site card'",
  ]),
  'zz-without-image-fixture': post([
    "title: 'A Post Without One'",
    "date: '2026-01-10'",
    "description: 'Names no image.'",
  ]),
};
const FIXTURE_FILES = new Map(
  Object.entries(FIXTURES).map(([slug, source]) => [
    join(POSTS_DIRECTORY, `${slug}.md`),
    source,
  ]),
);

type Read = (path: unknown, options?: unknown) => unknown;

/**
 * The fixtures exist only in this suite's view of `content/writing/`. Suites
 * in other workers read that directory at the same time, so a real file there
 * would join their post sets, or vanish between their listing and their read.
 */
beforeAll(() => {
  const readdirSync = fs.readdirSync as Read;
  const readFileSync = fs.readFileSync as Read;

  vi.spyOn(fs, 'readdirSync').mockImplementation(((path, options) => {
    const entries = readdirSync(path, options) as string[];
    return path === POSTS_DIRECTORY
      ? [...entries, ...Object.keys(FIXTURES).map((slug) => `${slug}.md`)]
      : entries;
  }) as Read as typeof fs.readdirSync);
  vi.spyOn(fs, 'readFileSync').mockImplementation(((path, options) =>
    typeof path === 'string' && FIXTURE_FILES.has(path)
      ? FIXTURE_FILES.get(path)
      : readFileSync(path, options)) as Read as typeof fs.readFileSync);
});

afterAll(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

/** The BlogPosting node the rendered page publishes as JSON-LD. */
async function blogPostingFor(slug: string) {
  const markup = renderToStaticMarkup(
    await PostPage({ params: Promise.resolve({ slug }) }),
  );
  const graph = JSON.parse(
    markup.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
    )?.[1] ?? '{}',
  );

  return graph['@graph']?.find(
    (node: { '@type': string }) => node['@type'] === 'BlogPosting',
  );
}

describe('draft preview', () => {
  it('is absent from every published read', () => {
    vi.stubEnv('NODE_ENV', 'production');

    expect(getPostSlugs()).not.toContain(DRAFT_SLUG);
    expect(getPostBySlug(DRAFT_SLUG)).toBeNull();
  });

  it('declares no canonical and no public card', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: DRAFT_SLUG }),
    });
    const serialized = JSON.stringify(metadata);

    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.alternates).toBeUndefined();
    expect(metadata.openGraph?.url).toBeUndefined();
    expect(serialized).toContain(SHARE_IMAGE_PATH);
    expect(serialized).not.toContain(`/og/writing/${DRAFT_SLUG}.png`);
  });

  it('renders in development when its private images are absent', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const markup = renderToStaticMarkup(
      await PostPage({ params: Promise.resolve({ slug: DRAFT_SLUG }) }),
    );

    expect(markup).toContain(DRAFT_TITLE);
    expect(markup).toContain('width="1200"');
    expect(markup).toContain('height="675"');
    expect(markup).not.toContain(`/og/writing/${DRAFT_SLUG}.png`);
  });
});

describe('writing post structured data', () => {
  // The share card replaces an article image only for social metadata: the
  // JSON-LD `image` keeps the representative screenshot and its real dimensions.
  it.each([
    ['zz-with-image-fixture', { url: '/og.png', width: 1200, height: 630 }],
    [
      'zz-without-image-fixture',
      {
        url: '/og/writing/zz-without-image-fixture.png',
        ...SHARE_IMAGE_DIMENSIONS,
      },
    ],
  ])('publishes the right image for %s', async (slug, { url, ...size }) => {
    expect((await blogPostingFor(slug)).image).toMatchObject({
      url: `${SITE_URL}${url}`,
      ...size,
    });
  });
});
