import dayjs from 'dayjs';

import type { Position } from '@/data/resume/work';
import {
  type DateInput,
  monthsBetween,
  positionDuration,
  positionDurationLong,
} from '@/lib/career';

import JobSummary from './JobSummary';

/** How much weight a role carries on the timeline spine. */
export type JobTier = 'lead' | 'primary' | 'early';

interface JobProps {
  data: Position;
  tier?: JobTier;
  /**
   * Instant an ongoing role is measured to. Required so the parent owns the
   * one clock read shared by the whole spine.
   */
  now: DateInput;
}

export default function Job({ data, tier = 'primary', now }: JobProps) {
  const { name, position, url, startDate, endDate, summary, highlights } = data;
  const isCurrent = !endDate;
  // Derived from the dates rather than written out per role, so it cannot
  // contradict the range beside it.
  //
  // An ongoing tenure is measured to the instant the page was built, and this
  // is a static export with no scheduled rebuild, so by the time it is read it
  // is a floor rather than a fact. It carries the same `+` the career span in
  // the resume header does. A closed role is exact and takes no hedge.
  //
  // Below a month there is no floor to raise: `formatDuration` reports an
  // upper bound ("<1 mo"), and hedging that would announce "less than 1 month
  // or more", which brackets the value from both sides at once. A role in its
  // first month is left unhedged until there is a whole month to stand on.
  const hedged = isCurrent && monthsBetween(startDate, now) >= 1;
  const duration = `${positionDuration(data, now)}${hedged ? '+' : ''}`;
  const durationLong = `${positionDurationLong(data, now)}${
    hedged ? ' or more' : ''
  }`;

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
