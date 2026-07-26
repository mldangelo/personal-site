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

export function tierFor(job: Position, index: number): JobTier {
  // An internship is never the lead, even if it is the newest entry.
  if (/intern/i.test(job.position)) {
    return 'early';
  }

  if (job.endDate && isoYear(job.endDate) < STUDENT_ERA_BEFORE) {
    return 'early';
  }

  // The data is authored newest-first, so index 0 is the current headline
  // role. Guarded by the checks above so reordering cannot promote a
  // student-era entry to lead.
  if (index === 0) {
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
