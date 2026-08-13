import Image from 'next/image';

import type { Project } from '@/data/projects';
import { PROJECT_IMAGE } from '@/lib/utils';

import DateRange from './DateRange';
import { externalLinkProps, NoLinkNote } from './shared';

interface CellProps {
  data: Project;
}

/**
 * An archive card.
 *
 * The image is optional: four of these have screenshots and the rest do not, so
 * the card drops the picture frame entirely rather than rendering a broken or
 * invented one.
 */
export default function Cell({ data }: CellProps) {
  const { title, subtitle, link, image, date, endDate, ongoing, desc, tech } =
    data;

  const hasLink = Boolean(link);

  const className = [
    'project-card',
    hasLink ? 'project-card--linked' : 'project-card--static',
    image ? '' : 'project-card--text',
  ]
    .filter(Boolean)
    .join(' ');

  const cardContent = (
    <>
      {image && (
        <div className="project-card-image">
          <Image
            src={image}
            alt=""
            width={PROJECT_IMAGE.width}
            height={PROJECT_IMAGE.height}
            sizes="(max-width: 600px) 100vw, 50vw"
          />
        </div>
      )}

      <div className="project-card-content">
        <header className="project-card-header">
          <h3 className="project-card-title">{title}</h3>
          {hasLink && (
            <span className="project-card-affordance" aria-hidden="true">
              ↗
            </span>
          )}
          {subtitle && <p className="project-card-subtitle">{subtitle}</p>}
        </header>

        <p className="project-card-desc">{desc}</p>

        {tech && tech.length > 0 && (
          <div className="project-card-tech">
            {tech.map((t) => (
              <span key={t} className="tech-tag">
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="project-card-footer">
          <DateRange date={date} endDate={endDate} ongoing={ongoing} />
          {!hasLink && <NoLinkNote />}
        </div>
      </div>
    </>
  );

  return (
    <article className={className}>
      {link ? (
        <a className="project-card-link" {...externalLinkProps(link, title)}>
          {cardContent}
        </a>
      ) : (
        <div className="project-card-static">{cardContent}</div>
      )}
    </article>
  );
}
