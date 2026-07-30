import type { Position } from '@/data/resume/work';

import Job, { type JobTier } from './Experience/Job';

interface ExperienceProps {
  data: Position[];
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
 * The lead is derived from the newest substantive start date, not array
 * position. This keeps reordering the source data from silently changing the
 * visual hierarchy while still letting ongoing side roles remain primary.
 */
export function tierFor(job: Position, positions: Position[]): JobTier {
  if (isEarlyCareer(job)) return 'early';

  const newestStartDate = positions
    .filter((position) => !isEarlyCareer(position))
    .map((position) => position.startDate)
    .sort((a, b) => b.localeCompare(a))[0];

  if (job.startDate === newestStartDate) {
    return 'lead';
  }

  return 'primary';
}

export default function Experience({ data }: ExperienceProps) {
  return (
    <div className="experience">
      <div className="title">
        <h2>Experience</h2>
      </div>
      <div className="experience-spine">
        {data.map((job) => (
          <Job
            data={job}
            key={`${job.name}-${job.position}`}
            tier={tierFor(job, data)}
          />
        ))}
      </div>
    </div>
  );
}
