import Link from 'next/link';
import { useId } from 'react';

import type { WritingItem } from '@/lib/writing';

import Entry from './Entry';

interface KeepReadingProps {
  posts: WritingItem[];
}

/**
 * Where a post leaves its reader: the posts either side of it, as rows of the
 * /writing register, and the way to the whole list.
 *
 * It follows the article rather than closing it, so the reading progress bar
 * fills when the post ends. The heading's id comes from `useId`, because a
 * post's own heading ids are slugs of the author's words and could take any
 * fixed one.
 */
export default function KeepReading({ posts }: KeepReadingProps) {
  const headingId = useId();

  if (posts.length === 0) return null;

  return (
    <nav className="post-more" aria-labelledby={headingId}>
      <div className="section-header">
        <h2 id={headingId} className="section-heading">
          Keep reading
        </h2>
        <Link href="/writing/" className="post-more-all">
          All writing <span aria-hidden="true">→</span>
        </Link>
      </div>
      <ol className="projects-register">
        {posts.map((post) => (
          <li key={post.url}>
            <Entry item={post} />
          </li>
        ))}
      </ol>
    </nav>
  );
}
