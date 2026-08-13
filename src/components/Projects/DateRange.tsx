import dayjs from 'dayjs';

import type { Project } from '@/data/projects';

/**
 * Month precision, because year precision was hiding the register: four
 * archive entries dated across 2015 all rendered as an identical "2015".
 */
const MONTH_YEAR = 'MMM YYYY';

type DateRangeProps = Pick<Project, 'date' | 'endDate' | 'ongoing'>;

/**
 * A project's dates, as one reading in the gutter.
 *
 * One-off entries render a single date; ranges render both ends; live work
 * renders `Present` in amber, reusing `.daterange-present` from the résumé
 * spine so the one meaning of `--color-signal` is defined in a single place.
 */
export default function DateRange({ date, endDate, ongoing }: DateRangeProps) {
  const isRange = ongoing === true || Boolean(endDate);

  return (
    <span className="project-dates">
      <time dateTime={date}>{dayjs(date).format(MONTH_YEAR)}</time>
      {isRange && (
        <>
          {/* The dash is decorative, so without the spoken "to" a screen
              reader runs the two dates together as "July 2024 Present". */}
          <span className="daterange-sep" aria-hidden="true">
            –
          </span>
          <span className="sr-only"> to </span>
          {endDate ? (
            <time dateTime={endDate}>{dayjs(endDate).format(MONTH_YEAR)}</time>
          ) : (
            <span className="daterange-present">Present</span>
          )}
        </>
      )}
    </span>
  );
}
