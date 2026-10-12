import Link from 'next/link';

import { smartQuotes } from '@/lib/typography';
import type { PostNeighbours, WritingItem } from '@/lib/writing';

/**
 * The feed, from an article at `/writing/<slug>/`.
 *
 * Document-relative on purpose, the way `/resume/` links its JSON: the page may
 * be published below a repository base path, and a root-relative href to a
 * file-like route would escape it. Next only rewrites the hrefs it owns, so a
 * native link has to carry its own way out.
 */
const FEED_HREF = '../../feed.xml';

interface NeighbourProps {
  item: WritingItem;
  label: string;
}

function Neighbour({ item, label }: NeighbourProps) {
  const title = smartQuotes(item.title);

  return (
    <Link
      href={item.url}
      className="post-onward-neighbour"
      // The label sits above the title as a line of its own, and browsers do
      // not agree on how to join two blocks into one name: with a visually
      // hidden separator, one read "Newer : Notes…" and another "Newer:Notes…".
      // The name is stated instead. It is the visible text, in order, with
      // the pause between its two parts written in.
      aria-label={`${label}: ${title}`}
    >
      <span className="post-onward-label">{label}</span>
      <span className="post-onward-title">{title}</span>
    </Link>
  );
}

/**
 * Where to go once an essay ends.
 *
 * An article used to finish and the page simply stopped: no way back to the
 * list, no neighbouring essay, no feed. This is the whole of that — links
 * only, so it works before any script loads. It is a sibling of the article
 * rather than part of it, which keeps the reading-progress bar measuring the
 * essay and not its navigation.
 */
export default function PostOnward({ newer, older }: PostNeighbours) {
  return (
    <nav className="post-onward" aria-label="More writing">
      {(newer || older) && (
        <div className="post-onward-neighbours">
          {newer && <Neighbour item={newer} label="Newer" />}
          {older && <Neighbour item={older} label="Older" />}
        </div>
      )}
      <div className="post-onward-index">
        <Link href="/writing/" className="post-onward-link">
          <span aria-hidden="true">←</span> All writing
        </Link>
        <a
          href={FEED_HREF}
          className="post-onward-link"
          title="RSS Feed"
          aria-label="RSS Feed"
        >
          RSS
        </a>
      </div>
    </nav>
  );
}
