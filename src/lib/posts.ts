import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

export interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  draft?: boolean;
  /** Optional article-specific share image in public/. */
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
  if (!isRecord(value)) {
    throw frontmatterError(source, 'must be a YAML object');
  }

  const title = requiredText(value.title, 'title', source);
  const date = requiredText(value.date, 'date', source);
  const description = requiredText(value.description, 'description', source);

  if (!isCalendarDate(date)) {
    throw frontmatterError(
      source,
      '"date" must be a real calendar date in YYYY-MM-DD format',
    );
  }

  if (value.draft !== undefined && typeof value.draft !== 'boolean') {
    throw frontmatterError(source, '"draft" must be a boolean when provided');
  }

  const image =
    value.image === undefined
      ? undefined
      : requiredText(value.image, 'image', source);
  const imageAlt =
    value.imageAlt === undefined
      ? undefined
      : requiredText(value.imageAlt, 'imageAlt', source);

  if (image && (!image.startsWith('/') || image.startsWith('//'))) {
    throw frontmatterError(
      source,
      '"image" must be a root-relative path in public/',
    );
  }
  if (image && !imageAlt) {
    throw frontmatterError(
      source,
      '"imageAlt" is required when "image" is provided',
    );
  }
  if (imageAlt && !image) {
    throw frontmatterError(
      source,
      '"image" is required when "imageAlt" is provided',
    );
  }

  return {
    title,
    date,
    description,
    ...(value.draft === undefined ? {} : { draft: value.draft }),
    ...(image === undefined ? {} : { image }),
    ...(imageAlt === undefined ? {} : { imageAlt }),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requiredText(value: unknown, field: string, source: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw frontmatterError(source, `"${field}" must be a non-empty string`);
  }
  return value.trim();
}

function isCalendarDate(value: string): boolean {
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!parts) {
    return false;
  }

  const [, year, month, day] = parts;
  const parsed = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day)),
  );
  return (
    parsed.getUTCFullYear() === Number(year) &&
    parsed.getUTCMonth() === Number(month) - 1 &&
    parsed.getUTCDate() === Number(day)
  );
}

function frontmatterError(source: string, message: string): TypeError {
  return new TypeError(`Invalid frontmatter in ${source}: ${message}`);
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
