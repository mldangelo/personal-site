import type { Position } from '@/data/resume/work';
import { type DateInput, sortPositions } from '@/lib/career';

import Job, { type JobTier } from './Experience/Job';

interface ExperienceProps {
  data: Position[];
  /**
   * Instant every ongoing role's tenure is measured to. A caller can supply a
   * shared value for determinism; otherwise this component reads the clock
   * once and threads that value to every role.
   */
  now?: DateInput;
}

/** Year before which a role is treated as student-era. */
const STUDENT_ERA_BEFORE = 2013;

/**
 * Year from an ISO date, read from the string rather than parsed.
 *
 * `new Date('2013-01-01')` is UTC midnight, which `getFullYear()` renders as
 * 2012 anywhere west of Greenwich — so the student-era boundary moved with
 * the reader's timezone.
 */
function isoYear(date: string): number {
  return Number.parseInt(date.slice(0, 4), 10);
}

function isEarlyCareer(job: Position): boolean {
  if (/intern/i.test(job.position)) {
    return true;
  }

  return Boolean(job.endDate && isoYear(job.endDate) < STUDENT_ERA_BEFORE);
}

/**
 * How much weight a role should carry on the spine.
 *
 * The lead is derived from the newest substantive, non-side-role start date,
 * not array position. This keeps reordering the source data from silently
 * changing the visual hierarchy while ensuring a newly added part-time
 * engagement cannot outrank the primary career.
 */
export function tierFor(job: Position, positions: Position[]): JobTier {
  if (isEarlyCareer(job)) return 'early';
  if (job.commitment === 'part-time') return 'primary';

  const newestStartDate = positions
    .filter(
      (position) =>
        !isEarlyCareer(position) && position.commitment !== 'part-time',
    )
    .map((position) => position.startDate)
    .sort((a, b) => b.localeCompare(a))[0];

  if (job.startDate === newestStartDate) {
    return 'lead';
  }

  return 'primary';
}

export default function Experience({
  data,
  // The single fallback read. `Job` requires the resulting instant so this
  // cannot quietly become one read per role.
  now = Date.now(),
}: ExperienceProps) {
  // `tierFor` was written not to depend on array position; sorting here is the
  // other half of that decision. Without it the spine rendered in whatever
  // order the data file happened to be in, which ran backwards in the middle.
  const positions = sortPositions(data);

  return (
    <div className="experience">
      <div className="title">
        <h2>Experience</h2>
      </div>
      <div className="experience-spine">
        {positions.map((job) => (
          <Job
            data={job}
            key={`${job.name}-${job.position}`}
            now={now}
            tier={tierFor(job, positions)}
          />
        ))}
      </div>
    </div>
  );
}
