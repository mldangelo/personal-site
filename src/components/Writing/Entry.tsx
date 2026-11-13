import Link from 'next/link';

import { smartQuotes } from '@/lib/typography';
import { formatDate } from '@/lib/utils';
import type { WritingItem } from '@/lib/writing';

interface EntryProps {
  item: WritingItem;
}

/**
 * One row of the writing register: the same row as /projects and /speaking,
 * with the date and source in the gutter and the title in the reading face.
 * /writing lists every item with it, and the end of each post its neighbours.
 */
export default function Entry({ item }: EntryProps) {
  const content = (
    <>
      <div className="project-entry-meta">
        {item.date && (
          <time className="project-dates" dateTime={item.date}>
            {formatDate(item.date)}
          </time>
        )}
        {item.isExternal && (
          <span className="project-entry-role">{item.source}</span>
        )}
      </div>
      <div className="project-entry-body">
        <h3 className="project-entry-title">
          {smartQuotes(item.title)}
          {item.isExternal && (
            <span className="project-entry-external" aria-hidden="true">
              ↗
            </span>
          )}
        </h3>
        <p className="project-entry-desc">{smartQuotes(item.description)}</p>
        {item.isExternal && (
          // The arrow is decorative, so the warning has to be spoken.
          <span className="sr-only"> (opens in a new tab)</span>
        )}
      </div>
    </>
  );

  if (item.isExternal) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="project-entry"
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={item.url} className="project-entry">
      {content}
    </Link>
  );
}
