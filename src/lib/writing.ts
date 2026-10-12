import externalWriting from '@/data/writing';
import { getAllPosts } from '@/lib/posts';

export interface WritingItem {
  title: string;
  url: string;
  date: string;
  description: string;
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

function externalSource(url: string): string {
  const hostname = new URL(url).hostname.replace(/^www\./, '');

  if (hostname === 'promptfoo.dev') return 'Promptfoo';
  if (hostname === 'linkedin.com') return 'LinkedIn';

  return hostname;
}

/** Where an on-site post lives. The index and a post's neighbours share it. */
function postPath(slug: string): string {
  return `/writing/${slug}/`;
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

  return [...internal, ...external].sort(compareWritingItems);
}

export interface PostNeighbours {
  /** The next essay up the index: published after this one. */
  newer?: WritingItem;
  /** The next essay down the index: published before this one. */
  older?: WritingItem;
}

/**
 * The on-site essays either side of a post, in the order the index lists them.
 *
 * Read from `getWritingItems` rather than from the post files so the two can
 * never disagree: it is the same published-only set, which is what keeps a
 * draft from being linked at the foot of a published essay, and the same
 * comparator, so two posts sharing a date fall the same way round here as
 * they do in the list a reader just came from. External writing is skipped:
 * these are the neighbours of an essay on this site.
 */
export function getPostNeighbours(slug: string): PostNeighbours {
  const essays = getWritingItems().filter((item) => !item.isExternal);
  const index = essays.findIndex((item) => item.url === postPath(slug));

  if (index === -1) {
    return {};
  }

  return { newer: essays[index - 1], older: essays[index + 1] };
}
