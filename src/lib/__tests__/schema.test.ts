import { describe, expect, it } from 'vitest';

import type { Post } from '@/lib/posts';
import {
  BLOG_ID,
  blogNode,
  blogPostingNode,
  breadcrumbNode,
  buildGraph,
  collectionPageNode,
  HOME_URL,
  PERSON_ID,
  personNode,
  profilePageNode,
  WEBSITE_ID,
  webPageNode,
  websiteNode,
} from '@/lib/schema';
import { AUTHOR_NAME, SITE_URL } from '@/lib/utils';

const mockPost: Post = {
  slug: 'test-article',
  title: 'Test Article Title',
  date: '2024-01-15',
  description: 'This is a test article description',
  content: 'Article content here',
};

describe('personNode', () => {
  it('is a Person with a stable @id', () => {
    const node = personNode();
    expect(node['@type']).toBe('Person');
    expect(node['@id']).toBe(PERSON_ID);
  });

  it('uses author name and split given/family names', () => {
    const node = personNode();
    expect(node.name).toBe(AUTHOR_NAME);
    expect(node.givenName).toBe('Michael');
    expect(node.familyName).toBe("D'Angelo");
  });

  it('exposes an ImageObject and social sameAs links', () => {
    const node = personNode();
    const image = node.image as Record<string, unknown>;
    expect(image['@type']).toBe('ImageObject');
    expect(image.url).toBe(`${SITE_URL}/images/me.jpg`);
    expect(Array.isArray(node.sameAs)).toBe(true);
    expect((node.sameAs as string[]).length).toBeGreaterThan(0);
  });

  it('includes worksFor and alumniOf', () => {
    const node = personNode();
    const worksFor = node.worksFor as Record<string, unknown>;
    expect(worksFor['@type']).toBe('Organization');
    expect(worksFor.name).toBe('OpenAI');
    const alumniOf = node.alumniOf as Record<string, unknown>[];
    expect(alumniOf[0]['@type']).toBe('CollegeOrUniversity');
  });
});

describe('websiteNode', () => {
  it('is a WebSite that points its publisher at the Person', () => {
    const node = websiteNode();
    expect(node['@type']).toBe('WebSite');
    expect(node['@id']).toBe(WEBSITE_ID);
    expect(node.url).toBe(HOME_URL);
    expect((node.publisher as Record<string, unknown>)['@id']).toBe(PERSON_ID);
  });
});

describe('profilePageNode', () => {
  it('is a ProfilePage linked to the site and the Person', () => {
    const node = profilePageNode({ url: HOME_URL, name: 'About' });
    expect(node['@type']).toBe('ProfilePage');
    expect(node['@id']).toBe(`${HOME_URL}#webpage`);
    expect((node.isPartOf as Record<string, unknown>)['@id']).toBe(WEBSITE_ID);
    expect((node.mainEntity as Record<string, unknown>)['@id']).toBe(PERSON_ID);
  });

  it('only references a breadcrumb when requested', () => {
    expect(
      profilePageNode({ url: HOME_URL, name: 'Home' }).breadcrumb,
    ).toBeUndefined();
    const withCrumb = profilePageNode({
      url: `${SITE_URL}/about/`,
      name: 'About',
      hasBreadcrumb: true,
    });
    expect((withCrumb.breadcrumb as Record<string, unknown>)['@id']).toBe(
      `${SITE_URL}/about/#breadcrumb`,
    );
  });
});

describe('collectionPageNode', () => {
  it('is a CollectionPage that is about the Person', () => {
    const node = collectionPageNode({
      url: `${SITE_URL}/writing/`,
      name: 'Writing',
    });
    expect(node['@type']).toBe('CollectionPage');
    expect((node.about as Record<string, unknown>)['@id']).toBe(PERSON_ID);
  });
});

describe('blogNode', () => {
  it('is a Blog linking the WebSite, its page, and the Person publisher', () => {
    const node = blogNode('2024-01-15');
    expect(node['@type']).toBe('Blog');
    expect(node['@id']).toBe(BLOG_ID);
    expect((node.isPartOf as Record<string, unknown>)['@id']).toBe(WEBSITE_ID);
    expect((node.mainEntityOfPage as Record<string, unknown>)['@id']).toBe(
      `${SITE_URL}/writing/#webpage`,
    );
    expect((node.publisher as Record<string, unknown>)['@id']).toBe(PERSON_ID);
    expect(node.dateModified).toBe('2024-01-15');
  });

  it('omits dateModified when not provided', () => {
    expect(blogNode().dateModified).toBeUndefined();
  });
});

describe('blogPostingNode', () => {
  it('is a BlogPosting wired to the Person, Blog, and its WebPage', () => {
    const node = blogPostingNode(mockPost);
    const url = `${SITE_URL}/writing/${mockPost.slug}/`;
    expect(node['@type']).toBe('BlogPosting');
    expect(node['@id']).toBe(`${url}#blogposting`);
    expect(node.headline).toBe(mockPost.title);
    expect(node.description).toBe(mockPost.description);
    expect(node.datePublished).toBe(mockPost.date);
    expect(node.dateModified).toBe(mockPost.date);
    expect((node.author as Record<string, unknown>)['@id']).toBe(PERSON_ID);
    expect((node.publisher as Record<string, unknown>)['@id']).toBe(PERSON_ID);
    expect((node.isPartOf as Record<string, unknown>)['@id']).toBe(BLOG_ID);
    expect((node.mainEntityOfPage as Record<string, unknown>)['@id']).toBe(
      `${url}#webpage`,
    );
  });

  it('uses an ImageObject mirroring the OG image with dimensions', () => {
    const image = blogPostingNode(mockPost).image as Record<string, unknown>;
    expect(image['@type']).toBe('ImageObject');
    expect(image.url).toBe(`${SITE_URL}/images/me.jpg`);
    expect(image.width).toBe(1200);
    expect(image.height).toBe(630);
  });
});

describe('webPageNode', () => {
  it('is a WebPage linked to the site', () => {
    const url = `${SITE_URL}/writing/test-article/`;
    const node = webPageNode({ url, name: 'Test Article Title' });
    expect(node['@type']).toBe('WebPage');
    expect(node['@id']).toBe(`${url}#webpage`);
    expect((node.isPartOf as Record<string, unknown>)['@id']).toBe(WEBSITE_ID);
  });
});

describe('breadcrumbNode', () => {
  it('builds an ordered BreadcrumbList anchored to the page', () => {
    const url = `${SITE_URL}/writing/`;
    const node = breadcrumbNode(url, [
      { name: 'Home', url: HOME_URL },
      { name: 'Writing', url },
    ]);
    expect(node['@type']).toBe('BreadcrumbList');
    expect(node['@id']).toBe(`${url}#breadcrumb`);
    const items = node.itemListElement as Record<string, unknown>[];
    expect(items).toHaveLength(2);
    expect(items[0].position).toBe(1);
    expect(items[1].position).toBe(2);
    expect(items[1].item).toBe(url);
  });
});

describe('buildGraph', () => {
  it('wraps nodes in a schema.org @graph document', () => {
    const graph = buildGraph([websiteNode(), personNode()]);
    expect(graph['@context']).toBe('https://schema.org');
    const nodes = graph['@graph'] as Record<string, unknown>[];
    expect(nodes).toHaveLength(2);
    expect(nodes[0]['@id']).toBe(WEBSITE_ID);
    expect(nodes[1]['@id']).toBe(PERSON_ID);
  });
});
