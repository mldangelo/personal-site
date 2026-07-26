import type { Position } from '@/data/resume/work';

import Job, { type JobTier } from './Experience/Job';

interface ExperienceProps {
  data: Position[];
}

/** Year before which a role is treated as student-era. */
const STUDENT_ERA_BEFORE = 2013;

/**
 * How much weight a role should carry on the spine.
 *
 * The distinction encodes something true rather than decorative: the newest
 * role leads, internships and student-era work read as the tail of the
 * timeline, and everything else sits between. Without it the page renders a
 * decade of work at one uniform weight, which is how the previous card stack
 * lost its hierarchy.
 */
export function tierFor(job: Position, index: number): JobTier {
  if (index === 0) {
    return 'lead';
  }

  if (/intern/i.test(job.position)) {
    return 'early';
  }

  if (job.endDate && new Date(job.endDate).getFullYear() < STUDENT_ERA_BEFORE) {
    return 'early';
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
        {data.map((job, index) => (
          <Job
            data={job}
            key={`${job.name}-${job.position}`}
            tier={tierFor(job, index)}
          />
        ))}
      </div>
    </div>
  );
}
