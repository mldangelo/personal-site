import dayjs from 'dayjs';
import type { Project } from '@/data/projects';

interface CellProps {
  data: Project;
}

export default function Cell({ data }: CellProps) {
  const { title, subtitle, link, image, date, desc, tech, featured } = data;

  const hasLink = Boolean(link);

  const cardContent = (
    <>
      {image ? <div className="project-card-image" /> : null}

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

        <time className="project-card-date" dateTime={date}>
          {dayjs(date).format('YYYY')}
        </time>
      </div>
    </>
  );

  return (
    <article
      className={`project-card ${featured ? 'project-card--featured' : ''} ${hasLink ? 'project-card--linked' : 'project-card--static'}`}
    >
      {hasLink ? (
        <a href={link} className="project-card-link" aria-label={title}>
          {cardContent}
        </a>
      ) : (
        <div className="project-card-static">{cardContent}</div>
      )}
    </article>
  );
}
