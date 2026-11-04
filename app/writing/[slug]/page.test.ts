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

const DRAFT_SLUG = 'zz-draft-preview-fixture';
const DRAFT_TITLE = 'A Draft Held Back From Publication';
const POSTS_DIRECTORY = join(process.cwd(), 'content/writing');
const DRAFT_FILE = join(POSTS_DIRECTORY, `${DRAFT_SLUG}.md`);
const DRAFT_SOURCE = [
  '---',
  `title: '${DRAFT_TITLE}'`,
  "date: '2026-01-08'",
  "description: 'Unpublished while it is being written.'",
  'draft: true',
  // Both images are absent from `public/`: a draft may name images that have
  // not been committed yet, and the page must still render.
  `image: '/images/writing/${DRAFT_SLUG}/absent.png'`,
  "imageAlt: 'A screenshot not yet committed'",
  '---',
  '',
  `![Screenshot](/images/writing/${DRAFT_SLUG}/absent.png)`,
  '',
].join('\n');

type Read = (path: unknown, options?: unknown) => unknown;

/**
 * The draft exists only in this suite's view of `content/writing/`. Suites in
 * other workers read that directory at the same time, so a real file there
 * would join their post sets, or vanish between their listing and their read.
 */
beforeAll(() => {
  const readdirSync = fs.readdirSync as Read;
  const readFileSync = fs.readFileSync as Read;

  vi.spyOn(fs, 'readdirSync').mockImplementation(((path, options) => {
    const entries = readdirSync(path, options) as string[];
    return path === POSTS_DIRECTORY
      ? [...entries, `${DRAFT_SLUG}.md`]
      : entries;
  }) as Read as typeof fs.readdirSync);
  vi.spyOn(fs, 'readFileSync').mockImplementation(((path, options) =>
    path === DRAFT_FILE
      ? DRAFT_SOURCE
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
    [
      'shipping-with-claude-code',
      {
        url: '/images/writing/api-costs-july-2025.png',
        width: 1117,
        height: 812,
      },
    ],
    [
      'claude-code-outage',
      { url: '/og/writing/claude-code-outage.png', ...SHARE_IMAGE_DIMENSIONS },
    ],
  ])('publishes the right image for %s', async (slug, { url, ...size }) => {
    expect((await blogPostingFor(slug)).image).toMatchObject({
      url: `${SITE_URL}${url}`,
      ...size,
    });
  });
});
