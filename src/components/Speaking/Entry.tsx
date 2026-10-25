import DateRange from '@/components/Projects/DateRange';
import { NEW_TAB_SUFFIX } from '@/components/Projects/shared';
import type { Appearance } from '@/data/speaking';
import { smartQuotes } from '@/lib/typography';

interface EntryProps {
  data: Appearance;
}

/**
 * One row of the speaking register.
 *
 * The same row as Selected work on `/projects` — dated gutter, a mono label
 * beneath it, display title — so it reuses that register's classes instead of
 * restating them, and the two lists cannot drift apart.
 *
 * The new-tab warning is spoken from the row's own text rather than an
 * `aria-label`, which would replace the whole name and drop the place and the
 * host a listener needs to tell two panels apart.
 */
export default function Entry({ data }: EntryProps) {
  const { title, format, date, place, desc, link } = data;

  return (
    <a
      className="project-entry"
      href={link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="project-entry-meta">
        <DateRange date={date} />
        <span className="project-entry-role">{format}</span>
        <span className="project-entry-role">{place}</span>
      </div>

      <div className="project-entry-body">
        <h3 className="project-entry-title">
          {smartQuotes(title)}
          <span className="project-entry-external" aria-hidden="true">
            ↗
          </span>
        </h3>
        <p className="project-entry-desc">{smartQuotes(desc)}</p>
        <span className="sr-only"> {NEW_TAB_SUFFIX}</span>
      </div>
    </a>
  );
}
