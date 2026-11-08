import { join } from 'node:path';

import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

import type { Post } from '@/lib/posts';
import {
  BLOG_ID,
  blogNode,
  blogPostingNode,
  breadcrumbNode,
  collectionPageNode,
  HOME_URL,
  PERSON_ID,
  personNode,
  profilePageNode,
  sectionPageNodes,
  WEBSITE_ID,
  webPageNode,
  websiteNode,
} from '@/lib/schema';
import {
  SHARE_IMAGE_DIMENSIONS,
  SHARE_IMAGE_PATH,
  SITE_IMAGE_DIMENSIONS,
  SITE_IMAGE_PATH,
  SITE_URL,
} from '@/lib/utils';

const mockPost: Post = {
  slug: 'test-article',
  title: 'Test Article Title',
  date: '2024-01-15',
  description: 'This is a test article description',
  content: 'Article content here',
};

const POST_URL = `${SITE_URL}/writing/${mockPost.slug}/`;
const WRITING_URL = `${SITE_URL}/writing/`;
const ABOUT_URL = `${SITE_URL}/about/`;

const ref = (id: string) => ({ '@id': id });

describe('schema nodes', () => {
  // The `@id` references are what hold the published graph together.
  it.each([
    ['WebSite', websiteNode(), { publisher: ref(PERSON_ID) }],
    [
      'ProfilePage',
      profilePageNode({ url: ABOUT_URL, name: 'About', hasBreadcrumb: true }),
      {
        ...ref(`${ABOUT_URL}#webpage`),
        isPartOf: ref(WEBSITE_ID),
        mainEntity: ref(PERSON_ID),
        breadcrumb: ref(`${ABOUT_URL}#breadcrumb`),
      },
    ],
    [
      'CollectionPage',
      collectionPageNode({ url: WRITING_URL, name: 'Writing' }),
      { about: ref(PERSON_ID) },
    ],
    [
      'WebPage',
      webPageNode({ url: POST_URL, name: mockPost.title }),
      { ...ref(`${POST_URL}#webpage`), isPartOf: ref(WEBSITE_ID) },
    ],
    [
      'Blog',
      blogNode(),
      {
        ...ref(BLOG_ID),
        isPartOf: ref(WEBSITE_ID),
        mainEntityOfPage: ref(`${WRITING_URL}#webpage`),
        publisher: ref(PERSON_ID),
      },
    ],
    [
      'BlogPosting',
      blogPostingNode(mockPost),
      {
        ...ref(`${POST_URL}#blogposting`),
        author: ref(PERSON_ID),
        publisher: ref(PERSON_ID),
        isPartOf: ref(BLOG_ID),
        mainEntityOfPage: ref(`${POST_URL}#webpage`),
      },
    ],
  ])('%s links to the rest of the graph', (type, node, links) => {
    expect(node).toMatchObject({ '@type': type, ...links });
  });

  it('references a breadcrumb only when requested', () => {
    expect(
      profilePageNode({ url: HOME_URL, name: 'Home' }).breadcrumb,
    ).toBeUndefined();
  });

  it('dates the blog only when given a date', () => {
    expect(blogNode('2024-01-15').dateModified).toBe('2024-01-15');
    expect(blogNode().dateModified).toBeUndefined();
  });

  it('splits the name and declares the portrait at its real size', async () => {
    const { width, height } = await sharp(
      join(process.cwd(), 'public', SITE_IMAGE_PATH),
    ).metadata();

    expect(SITE_IMAGE_DIMENSIONS).toEqual({ width, height });
    expect(personNode()).toMatchObject({
      givenName: 'Michael',
      familyName: "D'Angelo",
      image: { url: `${SITE_URL}/images/me.jpg`, ...SITE_IMAGE_DIMENSIONS },
    });
  });

  it('mirrors the share image on a post unless given an article image', () => {
    expect(blogPostingNode(mockPost).image).toMatchObject({
      url: `${SITE_URL}${SHARE_IMAGE_PATH}`,
      ...SHARE_IMAGE_DIMENSIONS,
    });

    const image = { url: `${SITE_URL}/a.png`, width: 1117, height: 812 };

    expect(
      blogPostingNode(mockPost, { ...image, alt: 'A screenshot' }).image,
    ).toMatchObject({
      ...image,
      caption: 'A screenshot',
    });
  });

  it('numbers a breadcrumb trail in order', () => {
    const { itemListElement } = breadcrumbNode(WRITING_URL, [
      { name: 'Home', url: HOME_URL },
      { name: 'Writing', url: WRITING_URL },
    ]);

    expect(itemListElement).toMatchObject([
      { position: 1, item: HOME_URL },
      { position: 2, item: WRITING_URL },
    ]);
  });
});

describe('sectionPageNodes', () => {
  it('links a section page to a breadcrumb ending at that page', () => {
    const [page, breadcrumb] = sectionPageNodes(
      collectionPageNode,
      '/writing/',
      'Writing',
      'Essays',
    );
    const url = `${SITE_URL}/writing/`;

    expect(page).toMatchObject({
      '@type': 'CollectionPage',
      url,
      description: 'Essays',
      breadcrumb: { '@id': breadcrumb['@id'] },
    });
    expect(breadcrumb['@id']).toBe(`${url}#breadcrumb`);
  });
});
