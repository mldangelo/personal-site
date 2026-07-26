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

/** Published on-site posts and selected external writing, newest first. */
export function getWritingItems(): WritingItem[] {
  const internal: WritingItem[] = getAllPosts().map((post) => ({
    title: post.title,
    url: `/writing/${post.slug}/`,
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
