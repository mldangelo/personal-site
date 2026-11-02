import { DateSpan } from '@/components/Projects/DateRange';
import type { Position } from '@/data/resume/work';
import { type DateInput, formatDuration, monthsBetween } from '@/lib/career';
import { smartQuotes } from '@/lib/typography';

import JobSummary from './JobSummary';

/**
 * Where a role sits on the timeline spine. A tier is a step in type size and
 * spacing; the typeface, its weight, and the ink are the same at all three.
 */
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
      <p className="daterange">
        {/* The tick on the spine. It lives in the date line so that it is
            placed against the line it marks, in both layouts and at every
            tier, instead of at an offset measured from the entry. */}
        <span className="job-marker" aria-hidden="true" />
        <DateSpan date={startDate} endDate={endDate} ongoing />
        <span className="daterange-duration">
          <span aria-hidden="true">{duration}</span>
          <span className="sr-only">Duration: {durationLong}</span>
        </span>
      </p>

      <div className="job-body">
        <header>
          <h3>
            <a href={url} className="job-company">
              {smartQuotes(name)}
            </a>
            {/* Only layout separates the two, so a screen reader needs the comma. */}
            <span className="sr-only">, </span>
            <span className="job-position">{smartQuotes(position)}</span>
          </h3>
        </header>
        {summary ? <JobSummary summary={summary} /> : null}
        {highlights ? (
          <ul className="points">
            {highlights.map((highlight) => (
              <li key={highlight}>{smartQuotes(highlight)}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
