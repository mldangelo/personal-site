import contact from '@/data/contact';
import degrees from '@/data/resume/degrees';
import work from '@/data/resume/work';
import type { Post } from '@/lib/posts';
import {
  AUTHOR_NAME,
  SITE_DESCRIPTION,
  SITE_IMAGE_DIMENSIONS,
  SITE_IMAGE_PATH,
  SITE_URL,
} from '@/lib/utils';

export { SITE_URL } from '@/lib/utils';

/**
 * Centralised JSON-LD (schema.org) graph builders.
 *
 * Every node carries a stable `@id` so crawlers can merge the same entity
 * across pages (e.g. the homepage Person and a blog post's author resolve to
 * one knowledge-graph node). Pages compose these builders into a single
 * `@graph` document via {@link buildGraph}.
 */

// Stable node identifiers, referenced across pages.
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const BLOG_ID = `${SITE_URL}/writing/#blog`;

export const SITE_LANGUAGE = 'en-US';
export const SITE_IMAGE = `${SITE_URL}${SITE_IMAGE_PATH}`;
export const HOME_URL = `${SITE_URL}/`;

// Shared so the /writing metadata and the Blog node stay in sync.
export const WRITING_DESCRIPTION =
  'Articles on AI security, LLM red teaming, and trust & safety.';

type SchemaNode = Record<string, unknown>;

interface Crumb {
  name: string;
  url: string;
}

/** Reference to the canonical Person node. */
export const personRef = () => ({ '@id': PERSON_ID });

/** Reference to the canonical WebSite node. */
export const websiteRef = () => ({ '@id': WEBSITE_ID });

/** Reference to the canonical Blog node. */
export const blogRef = () => ({ '@id': BLOG_ID });

/**
 * The canonical Person entity. Emitted site-wide so every page anchors to the
 * same node; other nodes reference it via {@link personRef} instead of
 * repeating its properties.
 */
export function personNode(): SchemaNode {
  const socialLinks = contact
    .filter((item) => !item.link.startsWith('mailto:'))
    .map((item) => item.link);

  const emailItem = contact.find((item) => item.link.startsWith('mailto:'));
  const email = emailItem?.link.replace('mailto:', '');

  const currentJob = work[0];

  const [givenName, ...familyParts] = AUTHOR_NAME.split(' ');
  const familyName = familyParts.join(' ');

  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: AUTHOR_NAME,
    givenName,
    familyName,
    url: HOME_URL,
    image: {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/#person-image`,
      url: SITE_IMAGE,
      width: SITE_IMAGE_DIMENSIONS.width,
      height: SITE_IMAGE_DIMENSIONS.height,
      caption: AUTHOR_NAME,
    },
    description: SITE_DESCRIPTION,
    jobTitle: currentJob.position,
    ...(email && { email }),
    sameAs: socialLinks,
    worksFor: {
      '@type': 'Organization',
      name: currentJob.name,
      url: currentJob.url,
    },
    alumniOf: degrees.map((degree) => ({
      '@type': 'CollegeOrUniversity',
      name: degree.school,
      url: degree.link,
    })),
  };
}

/**
 * The canonical WebSite entity. Tells crawlers how to name the site in search
 * results. Emitted site-wide alongside {@link personNode}.
 */
export function websiteNode(): SchemaNode {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: HOME_URL,
    name: AUTHOR_NAME,
    alternateName: ['mldangelo.com', 'mldangelo'],
    description: SITE_DESCRIPTION,
    inLanguage: SITE_LANGUAGE,
    publisher: personRef(),
    image: {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/#website-image`,
      url: SITE_IMAGE,
      width: SITE_IMAGE_DIMENSIONS.width,
      height: SITE_IMAGE_DIMENSIONS.height,
      caption: AUTHOR_NAME,
    },
  };
}

/**
 * A BreadcrumbList for a page. `crumbs` should describe the categorisation path
 * ending at the current page. The node id is anchored to the page url.
 */
export function breadcrumbNode(pageUrl: string, crumbs: Crumb[]): SchemaNode {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

interface PageNodeOptions {
  url: string;
  name: string;
  description?: string;
  /** Attaches a `breadcrumb` reference (the BreadcrumbList must also be emitted). */
  hasBreadcrumb?: boolean;
}

function baseWebPage(
  type: string,
  { url, name, description, hasBreadcrumb }: PageNodeOptions,
): SchemaNode {
  return {
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name,
    isPartOf: websiteRef(),
    inLanguage: SITE_LANGUAGE,
    ...(description ? { description } : {}),
    ...(hasBreadcrumb ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
  };
}

/** A WebPage subtype describing a page about a person (e.g. home, about). */
export function profilePageNode(options: PageNodeOptions): SchemaNode {
  return {
    ...baseWebPage('ProfilePage', options),
    mainEntity: personRef(),
  };
}

/** A WebPage subtype for pages that primarily list things (e.g. writing, archive). */
export function collectionPageNode(options: PageNodeOptions): SchemaNode {
  return {
    ...baseWebPage('CollectionPage', options),
    about: personRef(),
  };
}

/** A plain WebPage, used for individual article pages. */
export function webPageNode(options: PageNodeOptions): SchemaNode {
  return baseWebPage('WebPage', options);
}

/**
 * The Blog node — a stepping stone between the WebSite and individual posts.
 * Belongs on the blog index page.
 */
export function blogNode(dateModified?: string): SchemaNode {
  return {
    '@type': 'Blog',
    '@id': BLOG_ID,
    isPartOf: websiteRef(),
    mainEntityOfPage: { '@id': `${SITE_URL}/writing/#webpage` },
    name: `${AUTHOR_NAME}'s Writing`,
    description: WRITING_DESCRIPTION,
    inLanguage: SITE_LANGUAGE,
    ...(dateModified ? { dateModified } : {}),
    publisher: personRef(),
  };
}

/** A BlogPosting for an individual post. */
export function blogPostingNode(post: Post): SchemaNode {
  const url = `${SITE_URL}/writing/${post.slug}/`;

  return {
    '@type': 'BlogPosting',
    '@id': `${url}#blogposting`,
    url,
    mainEntityOfPage: { '@id': `${url}#webpage` },
    isPartOf: blogRef(),
    headline: post.title,
    description: post.description,
    inLanguage: SITE_LANGUAGE,
    datePublished: post.date,
    dateModified: post.date,
    author: personRef(),
    publisher: personRef(),
    image: {
      '@type': 'ImageObject',
      '@id': `${url}#blogposting-image`,
      url: SITE_IMAGE,
      width: SITE_IMAGE_DIMENSIONS.width,
      height: SITE_IMAGE_DIMENSIONS.height,
    },
  };
}

/** Wraps nodes into a single `@graph` JSON-LD document. */
export function buildGraph(nodes: SchemaNode[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}
