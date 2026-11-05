import type { Project } from '@/data/projects';
import { formatMonthYear } from '@/lib/utils';

type DateRangeProps = Pick<Project, 'date' | 'endDate' | 'ongoing'>;

/**
 * The dates themselves, shared with the résumé's date line, to the month
 * because several archive entries share a year.
 *
 * One-off entries render a single date; ranges render both ends; live work
 * renders `Present` in amber through `.daterange-present`, so the one meaning
 * of `--color-signal` is defined in a single place.
 */
export function DateSpan({ date, endDate, ongoing }: DateRangeProps) {
  const isRange = ongoing === true || Boolean(endDate);

  return (
    <>
      <time dateTime={date}>{formatMonthYear(date)}</time>
      {isRange && (
        <>
          {/* The dash is decorative, so without the spoken "to" a screen
              reader runs the two dates together as "July 2024 Present". */}
          <span className="daterange-sep" aria-hidden="true">
            –
          </span>
          <span className="sr-only"> to </span>
          {endDate ? (
            <time dateTime={endDate}>{formatMonthYear(endDate)}</time>
          ) : (
            <span className="daterange-present">Present</span>
          )}
        </>
      )}
    </>
  );
}

/** A project's dates, as one reading in the gutter. */
export default function DateRange(props: DateRangeProps) {
  return (
    <span className="project-dates">
      <DateSpan {...props} />
    </span>
  );
}
