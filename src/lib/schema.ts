import contact from '@/data/contact';
import degrees from '@/data/resume/degrees';
import work from '@/data/resume/work';
import { currentPosition } from '@/lib/career';
import type { Post } from '@/lib/posts';
import {
  AUTHOR_NAME,
  canonicalPostUrl,
  SHARE_IMAGE_DIMENSIONS,
  SHARE_IMAGE_PATH,
  SITE_DESCRIPTION,
  SITE_IMAGE_DIMENSIONS,
  SITE_IMAGE_PATH,
  SITE_URL,
} from '@/lib/utils';

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

const SITE_LANGUAGE = 'en-US';
const SITE_IMAGE = `${SITE_URL}${SITE_IMAGE_PATH}`;
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
const PERSON_REF = { '@id': PERSON_ID };

/** Reference to the canonical WebSite node. */
const WEBSITE_REF = { '@id': WEBSITE_ID };

/** Reference to the canonical Blog node. */
const BLOG_REF = { '@id': BLOG_ID };

/** The portrait, under an `@id` of its own for each node that shows it. */
function portraitImage(id: string): SchemaNode {
  return {
    '@type': 'ImageObject',
    '@id': `${SITE_URL}/#${id}`,
    url: SITE_IMAGE,
    width: SITE_IMAGE_DIMENSIONS.width,
    height: SITE_IMAGE_DIMENSIONS.height,
    caption: AUTHOR_NAME,
  };
}

/**
 * The canonical Person entity. Emitted site-wide so every page anchors to the
 * same node; other nodes reference it via {@link PERSON_REF} instead of
 * repeating its properties.
 */
export function personNode(): SchemaNode {
  const socialLinks = contact
    .filter((item) => !item.link.startsWith('mailto:'))
    .map((item) => item.link);

  const emailItem = contact.find((item) => item.link.startsWith('mailto:'));
  const email = emailItem?.link.replace('mailto:', '');

  const currentJob = currentPosition(work);

  const [givenName, ...familyParts] = AUTHOR_NAME.split(' ');
  const familyName = familyParts.join(' ');

  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: AUTHOR_NAME,
    givenName,
    familyName,
    url: HOME_URL,
    image: portraitImage('person-image'),
    description: SITE_DESCRIPTION,
    ...(currentJob && { jobTitle: currentJob.position }),
    ...(email && { email }),
    sameAs: socialLinks,
    ...(currentJob && {
      worksFor: {
        '@type': 'Organization',
        name: currentJob.name,
        url: currentJob.url,
      },
    }),
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
    publisher: PERSON_REF,
    image: portraitImage('website-image'),
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

interface ArticleImage {
  url: string;
  width: number;
  height: number;
  alt?: string;
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
    isPartOf: WEBSITE_REF,
    inLanguage: SITE_LANGUAGE,
    ...(description ? { description } : {}),
    ...(hasBreadcrumb ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
  };
}

/** The page node and breadcrumb every top-level section publishes. */
export function sectionPageNodes(
  buildPage: (options: PageNodeOptions) => SchemaNode,
  path: string,
  name: string,
  description: string,
): [SchemaNode, SchemaNode] {
  const url = `${SITE_URL}${path}`;

  return [
    buildPage({ url, name, description, hasBreadcrumb: true }),
    breadcrumbNode(url, [
      { name: 'Home', url: HOME_URL },
      { name, url },
    ]),
  ];
}

/** A WebPage subtype describing a page about a person (e.g. home, about). */
export function profilePageNode(options: PageNodeOptions): SchemaNode {
  return {
    ...baseWebPage('ProfilePage', options),
    mainEntity: PERSON_REF,
  };
}

/** A WebPage subtype for pages that primarily list things (e.g. writing, archive). */
export function collectionPageNode(options: PageNodeOptions): SchemaNode {
  return {
    ...baseWebPage('CollectionPage', options),
    about: PERSON_REF,
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
    isPartOf: WEBSITE_REF,
    mainEntityOfPage: { '@id': `${SITE_URL}/writing/#webpage` },
    name: `${AUTHOR_NAME}'s Writing`,
    description: WRITING_DESCRIPTION,
    inLanguage: SITE_LANGUAGE,
    ...(dateModified ? { dateModified } : {}),
    publisher: PERSON_REF,
  };
}

/** A BlogPosting for an individual post. */
export function blogPostingNode(
  post: Post,
  articleImage?: ArticleImage,
): SchemaNode {
  const url = canonicalPostUrl(post.slug);
  const image = articleImage ?? {
    url: `${SITE_URL}${SHARE_IMAGE_PATH}`,
    width: SHARE_IMAGE_DIMENSIONS.width,
    height: SHARE_IMAGE_DIMENSIONS.height,
  };

  return {
    '@type': 'BlogPosting',
    '@id': `${url}#blogposting`,
    url,
    mainEntityOfPage: { '@id': `${url}#webpage` },
    isPartOf: BLOG_REF,
    headline: post.title,
    description: post.description,
    inLanguage: SITE_LANGUAGE,
    datePublished: post.date,
    dateModified: post.date,
    author: PERSON_REF,
    publisher: PERSON_REF,
    image: {
      '@type': 'ImageObject',
      '@id': `${url}#blogposting-image`,
      url: image.url,
      width: image.width,
      height: image.height,
      ...(image.alt ? { caption: image.alt } : {}),
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
