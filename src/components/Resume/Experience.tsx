import type { Position } from '@/data/resume/work';
import { type DateInput, sortPositions } from '@/lib/career';

import Job, { type JobTier } from './Experience/Job';

interface ExperienceProps {
  data: Position[];
  /** Instant every ongoing tenure is measured to. */
  now: DateInput;
}

/**
 * A role that ended before this is student-era. Compared as a string, like
 * every ISO date here, so the boundary cannot move with the reader's timezone.
 */
const STUDENT_ERA_BEFORE = '2013';

function isEarlyCareer(job: Position): boolean {
  // A whole word: "International Director" and "Internal Systems" are not
  // internships.
  if (/\bintern(?:ship)?\b/i.test(job.position)) {
    return true;
  }

  return Boolean(job.endDate && job.endDate < STUDENT_ERA_BEFORE);
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
