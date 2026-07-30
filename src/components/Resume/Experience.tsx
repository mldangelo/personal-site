import type { Position } from '@/data/resume/work';
import { type DateInput, sortPositions } from '@/lib/career';

import Job, { type JobTier } from './Experience/Job';

interface ExperienceProps {
  data: Position[];
  /**
   * Instant every ongoing role's tenure is measured to.
   *
   * Optional, and omitting it does read the clock — but exactly once, here,
   * and the reading is then threaded to every role, so the durations on the
   * spine always agree with each other. `app/resume/page.tsx` supplies its own
   * read so they also agree with the headline span above them, and a test can
   * pin the instant instead of racing the clock.
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

/**
 * A student-era job title.
 *
 * Anchored on word boundaries because the bare substring `intern` also appears
 * inside `internal`: `/intern/i` demoted "Internal Tools Engineer" and "Head of
 * Internal Systems" to the student-era tier. The noun form is accepted too, so
 * "Engineering Internship" places itself without another edit here.
 */
const INTERN_TITLE = /\bintern(ship)?\b/i;

function isEarlyCareer(job: Position): boolean {
  if (INTERN_TITLE.test(job.position)) {
    return true;
  }

  return Boolean(job.endDate && isoYear(job.endDate) < STUDENT_ERA_BEFORE);
}

/**
 * How much weight a role should carry on the spine.
 *
 * The lead is the first substantive role in the order the spine actually
 * renders — `sortPositions` owns that order, and this reads it rather than
 * keeping a second, independent notion of "newest".
 *
 * It used to key on the newest `startDate`, which named the same role only
 * while the spine was start-date ordered. Ordering then moved to the end date,
 * and then gained a part-time exception, and nothing tied the two together. The
 * two answers can disagree — an ongoing role outranks a stint that started
 * later but has already closed — and when they do, the heaviest entry on the
 * page sits somewhere in the middle of the list. Two roles beginning in the
 * same month were both handed the lead, for the same reason: a date is not an
 * identity.
 *
 * Deriving the lead from the rendered order rather than from "which role is
 * current" is deliberate. The tier is a claim about the page — the entry at the
 * top of the spine is the one carrying the weight — so it has to follow
 * whatever ordering the spine uses. It also has to survive a current role that
 * is early-career: an ongoing internship is genuinely the current job and must
 * still never lead, so the lead is the first entry the `early` tier declines.
 *
 * `positions` may be handed over in any order; the sort happens here.
 */
export function tierFor(job: Position, positions: Position[]): JobTier {
  if (isEarlyCareer(job)) return 'early';

  const lead = sortPositions(positions).find(
    (position) => !isEarlyCareer(position),
  );

  // Identity, not date equality: two entries that share a date are still two
  // entries, and only the one rendered first leads.
  return job === lead ? 'lead' : 'primary';
}

export default function Experience({
  data,
  // The single fallback read. `Job` requires the instant precisely so this
  // cannot quietly become one read per role.
  now = Date.now(),
}: ExperienceProps) {
  // Without this the spine rendered in whatever order the data file happened
  // to be in, which ran backwards in the middle. `tierFor` reads the same
  // `sortPositions` order, so the entry that renders first is the entry that
  // leads however this list arrives.
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
