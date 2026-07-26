import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

export interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  draft?: boolean;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  content: string;
  draft?: boolean;
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
  const fullPath = path.join(postsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const frontmatter = data as PostFrontmatter;

  return {
    slug,
    title: frontmatter.title,
    date: frontmatter.date,
    description: frontmatter.description,
    content,
    draft: frontmatter.draft,
  };
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
 */
export function getPostBySlug(slug: string): Post | null {
  const post = readPost(slug);

  if (!post || !isPublished(post)) {
    return null;
  }

  return post;
}

export function getAllPosts(): Post[] {
  return readAllSlugs()
    .map(readPost)
    .filter((post): post is Post => post !== null)
    .filter(isPublished)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
