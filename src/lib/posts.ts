import fs from 'node:fs';
import path from 'node:path';

import { parseFrontmatter } from './frontmatter.mjs';
import { listPostFiles } from './post-files.mjs';

import { validatePostFrontmatterData } from './post-frontmatter.mjs';

interface PostFrontmatter {
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

export interface Post extends PostFrontmatter {
  slug: string;
  content: string;
}

const postsDirectory = path.join(process.cwd(), 'content/writing');

/**
 * Drafts are visible while running `next dev` and never anywhere else.
 *
 * Every reader of a post — static params, lookup, metadata, RSS, sitemap, and
 * the index — must go through this. Filtering in the list helpers alone would
 * still export a draft through `generateStaticParams`.
 */
function isPublished(post: Post): boolean {
  return !post.draft || process.env.NODE_ENV === 'development';
}

/** Reads a post off disk without considering draft status. */
function readPost({
  slug,
  path: fullPath,
}: {
  slug: string;
  path: string;
}): Post {
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = parseFrontmatter(fileContents);
  // A TypeScript assertion on parsed YAML does not protect a static build:
  // malformed YAML would become `undefined` metadata, an invalid sort key, or
  // a truthy string masquerading as `draft`. The error names the file.
  const frontmatter = validatePostFrontmatterData(
    data,
    path.relative(process.cwd(), fullPath),
  ) as PostFrontmatter;

  return { ...frontmatter, slug, content };
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
  return getAllPosts().find((post) => post.slug === slug) ?? null;
}

function readPublishedPosts(): Post[] {
  return listPostFiles(postsDirectory)
    .map(readPost)
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

  // Copy: a caller sorting a shared reference would reorder everyone's view.
  return [...cachedPosts];
}
