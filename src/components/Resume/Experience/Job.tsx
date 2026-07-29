import dayjs from 'dayjs';

import type { Position } from '@/data/resume/work';
import { type DateInput, positionDuration } from '@/lib/career';

import JobSummary from './JobSummary';

/** How much weight a role carries on the timeline spine. */
export type JobTier = 'lead' | 'primary' | 'early';

interface JobProps {
  data: Position;
  tier?: JobTier;
  /**
   * Instant an ongoing role is measured to. Required rather than defaulted to
   * `Date.now()`, because a default is one clock read *per role*: a spine of
   * ongoing roles would each measure themselves against their own instant, and
   * the disagreement is invisible until two reads straddle a month boundary.
   * Requiring it is the same contract `positionDuration` in `src/lib/career.ts`
   * sets, for the same reason — the figure stays deterministic and a test can
   * pin it. `Experience` reads the clock once and threads it here.
   */
  now: DateInput;
}

export default function Job({ data, tier = 'primary', now }: JobProps) {
  const { name, position, url, startDate, endDate, summary, highlights } = data;
  const isCurrent = !endDate;
  // Derived from the dates rather than written out per role, so it cannot
  // contradict the range beside it.
  const duration = positionDuration(data, now);

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
        <span className="daterange-duration">{duration}</span>
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
