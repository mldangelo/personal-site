import { rmSync, writeFileSync } from 'node:fs';
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

import {
  AUTHOR_NAME,
  SHARE_IMAGE_DIMENSIONS,
  SHARE_IMAGE_PATH,
  SITE_URL,
} from '@/lib/utils';

import PostPage, { generateMetadata } from './page';

/**
 * The draft path is read from `content/writing/` by slug, with no seam to
 * inject a fixture through, so the draft has to be a real file for the length
 * of this suite.
 *
 * It used to be whichever post happened to be unpublished, which made these
 * tests fail the moment that post was published — and the behaviour they pin
 * is not decoration: a draft once shipped carrying `index, follow`. Writing
 * the fixture keeps the guard independent of what the repository publishes.
 *
 * Safe to run alongside the other suites: every reader of the post set
 * (`getPostSlugs`, `getAllPosts`, the card generator, `verify-export`) filters
 * drafts out, so nothing else sees this file.
 */
const DRAFT_SLUG = 'zz-draft-preview-fixture';
const DRAFT_TITLE = 'A Draft Held Back From Publication';
/** Written with a keyboard, as posts are; read with a typographic apostrophe. */
const DRAFT_STANDFIRST = "It isn't published while it is being written.";
const DRAFT_STANDFIRST_READ = 'It isn’t published while it is being written.';
const DRAFT_FILE = join(process.cwd(), 'content/writing', `${DRAFT_SLUG}.md`);

beforeAll(() => {
  writeFileSync(
    DRAFT_FILE,
    [
      '---',
      `title: '${DRAFT_TITLE}'`,
      "date: '2026-01-08'",
      `description: "${DRAFT_STANDFIRST}"`,
      'draft: true',
      '---',
      '',
      'Body copy.',
      '',
      // Deliberately absent from `public/`: a draft may reference an image
      // that has not been committed yet, and the page must still render.
      `![Screenshot](/images/writing/${DRAFT_SLUG}/absent.png)`,
      '',
    ].join('\n'),
  );
});

afterAll(() => {
  rmSync(DRAFT_FILE, { force: true });
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

describe('writing post metadata', () => {
  it('uses a trailing-slash canonical URL for posts', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'claude-code-outage' }),
    });

    expect(metadata.openGraph?.url).toBe(
      `${SITE_URL}/writing/claude-code-outage/`,
    );
  });

  /**
   * The share image is the post's own generated card, even when the post names
   * an article image. `summary_large_image` wants 1200x630, and a screenshot is
   * whatever shape it happens to be — this one is 1117x812.
   */
  it('uses the generated post card for social metadata', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'shipping-with-claude-code' }),
    });

    expect(metadata.openGraph?.images).toEqual([
      {
        url: `${SITE_URL}/og/writing/shipping-with-claude-code.png`,
        width: SHARE_IMAGE_DIMENSIONS.width,
        height: SHARE_IMAGE_DIMENSIONS.height,
        alt: `What I learned shipping 1,000+ PRs with Claude Code — ${AUTHOR_NAME}`,
      },
    ]);
    expect(metadata.twitter?.images).toEqual(metadata.openGraph?.images);
  });

  it('previews a draft without generating or referencing a public draft card', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const slug = DRAFT_SLUG;
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug }),
    });
    const serialized = JSON.stringify(metadata);

    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.alternates).toBeUndefined();
    expect(metadata.openGraph?.url).toBeUndefined();
    expect(serialized).toContain(SHARE_IMAGE_PATH);
    expect(serialized).not.toContain(`/og/writing/${slug}.png`);
  });
});

describe('writing post structured data', () => {
  /**
   * An explicitly selected article image is not thrown away by the card: it
   * moves to the JSON-LD `image`, which is where a representative screenshot
   * belongs and where its real dimensions are wanted.
   */
  it('keeps an explicitly selected article image in the BlogPosting', async () => {
    const blogPosting = await blogPostingFor('shipping-with-claude-code');

    expect(blogPosting.image).toMatchObject({
      url: `${SITE_URL}/images/writing/api-costs-july-2025.png`,
      width: 1117,
      height: 812,
      caption:
        'Anthropic API costs for July 2025 showing $9,986.20 in token usage',
    });
  });

  it('falls back to the post card for a post with no article image', async () => {
    const blogPosting = await blogPostingFor('claude-code-outage');

    expect(blogPosting.image).toMatchObject({
      url: `${SITE_URL}/og/writing/claude-code-outage.png`,
      width: SHARE_IMAGE_DIMENSIONS.width,
      height: SHARE_IMAGE_DIMENSIONS.height,
    });
  });

  it('renders a draft in development when its private images are absent', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const slug = DRAFT_SLUG;
    const markup = renderToStaticMarkup(
      await PostPage({ params: Promise.resolve({ slug }) }),
    );

    expect(markup).toContain(DRAFT_TITLE);
    expect(markup).toContain('width="1200"');
    expect(markup).toContain('height="675"');
    expect(markup).not.toContain(`/og/writing/${slug}.png`);
  });
});

/**
 * The reader gets typographic quotes; everything that is matched on exact text
 * keeps the string the post was written with. `verify-export` compares the
 * exported `<title>` against the feed, and the share-card ledger records the
 * title its image was drawn from.
 */
describe('writing post title', () => {
  const slug = 'eurostar-chatbot-analysis';
  const authored = 'Notes on the Eurostar chatbot "vulnerability" report';

  it('is set with typographic quotes where it is read', async () => {
    const markup = renderToStaticMarkup(
      await PostPage({ params: Promise.resolve({ slug }) }),
    );

    expect(markup).toContain(
      '<h1 class="post-title">Notes on the Eurostar chatbot “vulnerability” report</h1>',
    );
  });

  it('keeps the authored string in metadata and structured data', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug }),
    });
    const blogPosting = await blogPostingFor(slug);

    expect(metadata.title).toBe(authored);
    expect(metadata.openGraph?.title).toBe(authored);
    expect(metadata.twitter?.title).toBe(authored);
    expect(blogPosting.headline).toBe(authored);
  });

  it('sets the standfirst with typographic quotes and leaves the description alone', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const markup = renderToStaticMarkup(
      await PostPage({ params: Promise.resolve({ slug: DRAFT_SLUG }) }),
    );
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: DRAFT_SLUG }),
    });

    expect(markup).toContain(
      `<p class="post-description">${DRAFT_STANDFIRST_READ}</p>`,
    );
    expect(metadata.description).toBe(DRAFT_STANDFIRST);
  });
});
