import type { Position } from '@/data/resume/work';
import { type DateInput, sortPositions } from '@/lib/career';

import Job, { type JobTier } from './Experience/Job';

interface ExperienceProps {
  data: Position[];
  /** Instant every ongoing tenure is measured to. */
  now: DateInput;
}

/** Year before which a role is treated as student-era. */
const STUDENT_ERA_BEFORE = 2013;

/**
 * Year from an ISO date, read from the string rather than parsed.
 *
 * `new Date('2013-01-01')` is UTC midnight, which `getFullYear()` renders as
 * 2012 anywhere west of Greenwich, so parsing would move the student-era
 * boundary with the reader's timezone.
 */
function isoYear(date: string): number {
  return Number.parseInt(date.slice(0, 4), 10);
}

function isEarlyCareer(job: Position): boolean {
  // A whole word: "International Director" and "Internal Systems" are not
  // internships.
  if (/\bintern(?:ship)?\b/i.test(job.position)) {
    return true;
  }

  return Boolean(job.endDate && isoYear(job.endDate) < STUDENT_ERA_BEFORE);
}

/**
 * Which step of the spine's type scale a role takes. The lead is the one role
 * with the newest substantive, non-side-role start date rather than array
 * position, so reordering the source data cannot change the visual
 * hierarchy, and a side role that began the same day does not share it.
 */
export function tierFor(job: Position, positions: Position[]): JobTier {
  if (isEarlyCareer(job)) return 'early';

  const lead = positions
    .filter(
      (position) =>
        !isEarlyCareer(position) && position.commitment !== 'part-time',
    )
    .sort((a, b) => b.startDate.localeCompare(a.startDate))[0];

  return job === lead ? 'lead' : 'primary';
}

export default function Experience({ data, now }: ExperienceProps) {
  const positions = sortPositions(data);

  return (
    <div className="experience">
      <div className="section-header">
        <h2 className="section-heading">Experience</h2>
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
