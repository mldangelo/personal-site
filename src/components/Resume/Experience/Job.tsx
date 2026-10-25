import dayjs from 'dayjs';

import type { Position } from '@/data/resume/work';
import { type DateInput, formatDuration, monthsBetween } from '@/lib/career';
import { smartQuotes } from '@/lib/typography';

import JobSummary from './JobSummary';

/**
 * Where a role sits on the timeline spine. A tier is a step in type size and
 * spacing; the typeface, its weight, and the ink are the same at all three.
 */
export type JobTier = 'lead' | 'primary' | 'early';

/**
 * Short months, as the projects register sets them. Spelled out, the ranges
 * were as uneven as the calendar: "January 2014 – January 2022" broke over two
 * lines of the gutter while "March 2026 – Present" sat on one.
 */
const MONTH_YEAR = 'MMM YYYY';

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
        <time dateTime={startDate}>{dayjs(startDate).format(MONTH_YEAR)}</time>
        {/* The dash is decorative, so a screen reader would otherwise run the
            dates together as "Mar 2026 Present". */}
        <span className="daterange-sep" aria-hidden="true">
          –
        </span>
        <span className="sr-only"> to </span>
        {endDate ? (
          <time dateTime={endDate}>{dayjs(endDate).format(MONTH_YEAR)}</time>
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
              {smartQuotes(name)}
            </a>
            {/* Only layout separates the two, so the heading was named as one
                phrase: "UB Nanosatellite Program Program Manager". */}
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
