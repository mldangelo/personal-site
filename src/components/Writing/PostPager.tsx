import Link from 'next/link';

import { smartQuotes } from '@/lib/typography';
import type { WritingItem } from '@/lib/writing';

interface PostPagerProps {
  newer?: WritingItem;
  older?: WritingItem;
}

/** The older and newer post, as the last thing a reader reaches. */
export default function PostPager({ newer, older }: PostPagerProps) {
  if (!newer && !older) return null;

  return (
    <nav className="post-pager" aria-label="Older and newer posts">
      {older && (
        <Link href={older.url} className="post-pager-older">
          <span className="post-pager-label">Older</span>
          <span className="post-pager-title">{smartQuotes(older.title)}</span>
        </Link>
      )}
      {newer && (
        <Link href={newer.url} className="post-pager-newer">
          <span className="post-pager-label">Newer</span>
          <span className="post-pager-title">{smartQuotes(newer.title)}</span>
        </Link>
      )}
    </nav>
  );
}
