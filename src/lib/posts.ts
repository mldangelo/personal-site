import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

import { validatePostFrontmatterData } from './post-frontmatter.mjs';

export interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  draft?: boolean;
  /**
   * Optional representative image in public/ — a screenshot or diagram.
   *
   * This is the article image for structured data, not the share card: every
   * published post has a 1200x630 card generated for it by `npm run og`, and
   * that is what `og:image` points at.
   */
  image?: string;
  /** Required whenever `image` is set. */
  imageAlt?: string;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  content: string;
  draft?: boolean;
  image?: string;
  imageAlt?: string;
}

const postsDirectory = path.join(process.cwd(), 'content/writing');

/**
 * Drafts are visible while running `next dev` and never anywhere else.
 *
 * Every reader of a post — static params, lookup, metadata, RSS, sitemap, and
 * the index — must go through this. Filtering in the list helpers alone is
 * what previously exported a full draft with `robots: index, follow`, because
 * `generateStaticParams` was reading filenames directly.
 */
function isPublished(post: Post): boolean {
  return !post.draft || process.env.NODE_ENV === 'development';
}

/** Every Markdown filename, drafts included. Internal to this module. */
function readAllSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''));
}

/** Reads a post off disk without considering draft status. */
function readPost(slug: string): Post | null {
  if (!isSafeSlug(slug)) {
    return null;
  }

  const fullPath = path.join(postsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const frontmatter = validatePostFrontmatter(
    data,
    path.relative(process.cwd(), fullPath),
  );

  return {
    slug,
    title: frontmatter.title,
    date: frontmatter.date,
    description: frontmatter.description,
    content,
    draft: frontmatter.draft,
    image: frontmatter.image,
    imageAlt: frontmatter.imageAlt,
  };
}

function isSafeSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Runtime validation at the filesystem boundary.
 *
 * A TypeScript assertion on gray-matter data does not protect a static build:
 * malformed YAML otherwise becomes `undefined` metadata, an invalid sort key,
 * or a truthy string masquerading as `draft`. Keep this dependency-free and
 * fail with the source filename so editorial mistakes are easy to locate.
 */
export function validatePostFrontmatter(
  value: unknown,
  source = 'post',
): PostFrontmatter {
  return validatePostFrontmatterData(value, source) as PostFrontmatter;
}

/**
 * Slugs that may be built and linked to.
 *
 * Use this for `generateStaticParams` — never the raw filenames.
 */
export function getPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

/**
 * A post, or null when it does not exist or is not publishable.
 *
 * Returning null for a draft is what makes the route `notFound()` rather than
 * render it, so a direct URL cannot reach unpublished writing in production.
 * Resolving against `getAllPosts` rather than re-reading the file keeps this on
 * the same `isPublished` path as every other reader, and means a slug never
 * reaches the filesystem.
 */
export function getPostBySlug(slug: string): Post | null {
  if (!isSafeSlug(slug)) {
    return null;
  }

  return getAllPosts().find((post) => post.slug === slug) ?? null;
}

function readPublishedPosts(): Post[] {
  return readAllSlugs()
    .map(readPost)
    .filter((post): post is Post => post !== null)
    .filter(isPublished)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Parsed posts, held for the life of the process.
 *
 * A static export reaches this from four independent entry points — the
 * sitemap, the feed, the writing index, and `generateStaticParams` — and then
 * twice more per post route, once in `generateMetadata` and once in the page.
 * Uncached, each of those re-walked the directory and re-parsed every file.
 *
 * Skipped under `next dev` so edits to a post appear without a restart, which
 * is also the mode where drafts are visible.
 */
let cachedPosts: Post[] | undefined;

export function getAllPosts(): Post[] {
  if (process.env.NODE_ENV === 'development') {
    return readPublishedPosts();
  }

  cachedPosts ??= readPublishedPosts();

  // Copy: callers have historically sorted the array they were handed, and a
  // shared reference would make that reorder everyone else's view.
  return [...cachedPosts];
}
