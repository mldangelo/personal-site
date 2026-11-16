import externalWriting, { type WritingEntry } from '@/data/writing';
import { isCalendarDate } from '@/lib/post-frontmatter.mjs';
import { getAllPosts } from '@/lib/posts';
import { SITE_URL } from '@/lib/utils';

export interface WritingItem extends WritingEntry {
  isExternal: boolean;
  source: string;
}

/** Stable newest-first order; undated guides sort by title at the end. */
export function compareWritingItems(a: WritingItem, b: WritingItem): number {
  if (!a.date && !b.date) {
    return a.title.localeCompare(b.title) || a.url.localeCompare(b.url);
  }
  if (!a.date) return 1;
  if (!b.date) return -1;

  return (
    b.date.localeCompare(a.date) ||
    a.title.localeCompare(b.title) ||
    a.url.localeCompare(b.url)
  );
}

/** The route of a post on this site, in its canonical trailing-slash form. */
function postPath(slug: string): string {
  return `/writing/${slug}/`;
}

function externalSource(url: string): string {
  const hostname = new URL(url).hostname.replace(/^www\./, '');

  if (hostname === 'promptfoo.dev') return 'Promptfoo';
  if (hostname === 'linkedin.com') return 'LinkedIn';

  return hostname;
}

/** Published on-site posts and selected external writing, newest first. */
export function getWritingItems(): WritingItem[] {
  const internal: WritingItem[] = getAllPosts().map((post) => ({
    title: post.title,
    url: postPath(post.slug),
    date: post.date,
    description: post.description,
    isExternal: false,
    source: 'On this site',
  }));
  const external: WritingItem[] = externalWriting.map((item) => ({
    ...item,
    isExternal: true,
    source: externalSource(item.url),
  }));

  const items = [...internal, ...external];
  assertDistinctDatedItems(items);
  return items.sort(compareWritingItems);
}

/**
 * Stops the build on an entry the feed and the lists would publish wrong: a
 * date that does not exist, which renders as "Invalid Date" or rolls into
 * another month, or an address listed twice, which gives two items one RSS
 * guid. Posts are checked by their frontmatter; this covers the rest.
 */
function assertDistinctDatedItems(items: WritingItem[]): void {
  const seen = new Set<string>();
  for (const item of items) {
    if (item.date && !isCalendarDate(item.date)) {
      throw new Error(
        `src/data/writing.ts: "${item.title}" has date "${item.date}"; use a real YYYY-MM-DD date`,
      );
    }
    // A post is listed by its path; the feed and an external entry use the
    // absolute address.
    const address = item.isExternal ? item.url : `${SITE_URL}${item.url}`;
    if (seen.has(address)) {
      throw new Error(`Writing lists ${address} twice`);
    }
    seen.add(address);
  }
}

/**
 * The posts either side of one, in the order /writing lists them. Writing
 * elsewhere is left out: these links read on from the end of a post here.
 */
export function getAdjacentPosts(slug: string): {
  newer?: WritingItem;
  older?: WritingItem;
} {
  const posts = getWritingItems().filter((item) => !item.isExternal);
  const index = posts.findIndex((item) => item.url === postPath(slug));

  if (index === -1) return {};

  return { newer: posts[index - 1], older: posts[index + 1] };
}
