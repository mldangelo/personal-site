import dayjs from 'dayjs';

import type { Position } from '@/data/resume/work';
import { type DateInput, formatDuration, monthsBetween } from '@/lib/career';

import JobSummary from './JobSummary';

/** How much weight a role carries on the timeline spine. */
export type JobTier = 'lead' | 'primary' | 'early';

interface JobProps {
  data: Position;
  tier?: JobTier;
  /** Instant an ongoing role is measured to; the parent owns the clock read. */
  now: DateInput;
}

export default function Job({ data, tier = 'primary', now }: JobProps) {
  const { name, position, url, startDate, endDate, summary, highlights } = data;
  const isCurrent = !endDate;
  const months = monthsBetween(startDate, endDate ?? now);
  // An ongoing tenure is a build-time floor, but "<1 mo" is already an upper bound.
  const hedged = isCurrent && months >= 1;
  const duration = `${formatDuration(months)}${hedged ? '+' : ''}`;
  const durationLong = `${formatDuration(months, true)}${hedged ? ' or more' : ''}`;

  return (
    <article
      className={`jobs-container jobs-container--${tier}${
        isCurrent ? ' jobs-container--current' : ''
      }`}
    >
      <span className="job-marker" aria-hidden="true" />

      <p className="daterange">
        <time dateTime={startDate}>{dayjs(startDate).format('MMMM YYYY')}</time>
        {/* The dash is decorative, so a screen reader would otherwise run the
            dates together as "March 2026 Present". */}
        <span className="daterange-sep" aria-hidden="true">
          –
        </span>
        <span className="sr-only"> to </span>
        {endDate ? (
          <time dateTime={endDate}>{dayjs(endDate).format('MMMM YYYY')}</time>
        ) : (
          <span className="daterange-present">Present</span>
        )}
        <span className="daterange-duration">
          <span aria-hidden="true">{duration}</span>
          <span className="sr-only">Duration: {durationLong}</span>
        </span>
      </p>

      <div className="job-body">
        <header>
          <h3>
            <a href={url} className="job-company">
              {name}
            </a>
            <span className="job-position">{position}</span>
          </h3>
        </header>
        {summary ? <JobSummary summary={summary} /> : null}
        {highlights ? (
          <ul className="points">
            {highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
