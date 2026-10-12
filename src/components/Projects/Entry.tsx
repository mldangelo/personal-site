import Image from 'next/image';

import type { Project } from '@/data/projects';
import { smartQuotes } from '@/lib/typography';

import DateRange from './DateRange';
import { externalLinkProps } from './shared';

interface EntryProps {
  data: Project;
}

/**
 * The 16:10 frame a screenshot is cropped to, at twice its largest rendered
 * size. The files themselves run from 1.49:1 to 2.35:1, so these describe the
 * shape every thumbnail shares rather than any one image.
 */
const THUMBNAIL = { width: 240, height: 150 } as const;

/**
 * Where a row sits in the page's hierarchy, read from the data rather than
 * set per entry. Live work leads and finished work follows; the archive sits
 * below both whatever its dates say, so a student project can never be
 * promoted past the work above it.
 */
function tierFor({ status, ongoing }: Project): 'archive' | 'live' | undefined {
  if (status === 'archive') return 'archive';
  return ongoing ? 'live' : undefined;
}

/**
 * One row of the projects register, in either of its two parts.
 *
 * The archive used to be drawn by a second component — picture cards with ink
 * descriptions — while the work above it was small grey rows, so the page's
 * weight ran opposite to its importance. One component now serves both, and
 * the only differences are ones the data states: a size step in the title, and
 * a thumbnail where a screenshot exists. Nothing is invented for a row without
 * one. The row shares the writing index's grammar — a dated gutter, a title,
 * supporting copy, a hairline — so the two lists on the site read as one
 * system.
 *
 * A row with a destination is a single outbound link. A row without one is
 * not a link at all: no arrow, and nothing that responds to a pointer. The
 * missing arrow is the whole statement — it is not also labelled.
 */
export default function Entry({ data }: EntryProps) {
  const { title, subtitle, link, image, date, endDate, ongoing, desc, tech } =
    data;

  const tier = tierFor(data);
  const className = tier
    ? `project-entry project-entry--${tier}`
    : 'project-entry';

  // The link is named after the title a reader sees, so the two are converted
  // together rather than letting a typographic heading sit under an ASCII name.
  const displayTitle = smartQuotes(title);

  const body = (
    <>
      {image && (
        // Decoration beside a row that already carries its own title: empty
        // alt, and loaded only when the row is reached. It comes first in the
        // source because the phone layout sets it beside the lines that
        // follow; the wide layout places it by column, whatever the order.
        <Image
          className="project-entry-thumb"
          src={image}
          alt=""
          width={THUMBNAIL.width}
          height={THUMBNAIL.height}
          loading="lazy"
        />
      )}

      <div className="project-entry-meta">
        <DateRange date={date} endDate={endDate} ongoing={ongoing} />
        {subtitle && (
          <span className="project-entry-role">{smartQuotes(subtitle)}</span>
        )}
      </div>

      <div className="project-entry-body">
        <h3 className="project-entry-title">
          {displayTitle}
          {link && (
            <span className="project-entry-external" aria-hidden="true">
              ↗
            </span>
          )}
        </h3>
        <p className="project-entry-desc">{smartQuotes(desc)}</p>

        {tech && tech.length > 0 && (
          <div className="project-entry-tech">
            {tech.map((item) => (
              <span key={item} className="tech-tag">
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );

  if (!link) {
    return <div className={className}>{body}</div>;
  }

  return (
    <a className={className} {...externalLinkProps(link, displayTitle)}>
      {body}
    </a>
  );
}
