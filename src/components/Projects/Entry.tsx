import type { Project } from '@/data/projects';

import DateRange from './DateRange';
import { externalLinkProps, NoLinkNote } from './shared';

interface EntryProps {
  data: Project;
}

/**
 * One row of the shipped register.
 *
 * Deliberately image-free: none of this work has a screenshot in the repo, and
 * the answer to that is a row that holds on a dated gutter, display type, and a
 * hairline — not invented art. It borrows the writing index's grammar so the
 * two lists on the site read as one system.
 */
export default function Entry({ data }: EntryProps) {
  const { title, subtitle, link, date, endDate, ongoing, desc, tech } = data;

  const className = [
    'project-entry',
    link ? 'project-entry--linked' : 'project-entry--static',
    // Live work leads the register, so it carries a size step. Derived from
    // the data rather than from a per-entry flag.
    ongoing ? 'project-entry--live' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const body = (
    <>
      <div className="project-entry-meta">
        <DateRange date={date} endDate={endDate} ongoing={ongoing} />
        {subtitle && <span className="project-entry-role">{subtitle}</span>}
      </div>

      <div className="project-entry-body">
        <h3 className="project-entry-title">
          {title}
          {link && (
            <span className="project-entry-external" aria-hidden="true">
              ↗
            </span>
          )}
        </h3>
        <p className="project-entry-desc">{desc}</p>

        {tech && tech.length > 0 && (
          <div className="project-entry-tech">
            {tech.map((item) => (
              <span key={item} className="tech-tag">
                {item}
              </span>
            ))}
          </div>
        )}

        {!link && <NoLinkNote />}
      </div>
    </>
  );

  if (!link) {
    return <div className={className}>{body}</div>;
  }

  return (
    <a className={className} {...externalLinkProps(link, title)}>
      {body}
    </a>
  );
}
