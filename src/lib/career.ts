import dayjs from 'dayjs';

import type { Position } from '@/data/resume/work';

/**
 * Career chronology — ordering the experience spine and deriving tenure from
 * the dates already present in `src/data/resume/work.ts`.
 *
 * Nothing in here reads the clock. Every function that needs "now" takes it as
 * an argument, mirroring `ageAt()` in `src/lib/telemetry.ts`, so the derived
 * figures are deterministic and a test can pin a fixed instant.
 */

/** Anything dayjs accepts: an ISO date string, epoch milliseconds, or a Date. */
export type DateInput = string | number | Date;

/**
 * Sort key standing in for the end of a role that has not ended.
 *
 * An ongoing full-time role has no `endDate` and should sort ahead of one that
 * has already closed, so it sorts as though it ends later than any real date.
 */
const ONGOING_END = '9999-12-31';

/**
 * Recency key for the rendered career spine.
 *
 * Closed roles are placed by when the work ended. An ongoing full-time role
 * leads. An open-ended side role is placed by when it began: "still active" is
 * true, but it should not permanently outrank every later primary job.
 */
export function timelineKey(position: Position): string {
  if (position.endDate) return position.endDate;

  return position.commitment === 'part-time' ? position.startDate : ONGOING_END;
}

/**
 * Roles by recency of involvement: newest timeline key first, with ties broken
 * by the later start date.
 *
 * End date is primary because long overlapping roles otherwise fall below
 * short roles that merely began later. In the real data, start-date sorting
 * buried the 2014–2022 Arthena tenure below Matroid and Planet.
 *
 * The source array is hand-maintained and had drifted out of sequence, running
 * 2022 → 2017 → 2014 → 2015 → 2014 through the middle, so a section that reads
 * as a timeline was not one. Ordering here rather than in the data file means
 * source order is no longer load-bearing: a new entry can be appended anywhere
 * and still land in the right place.
 *
 * Comparison is on the ISO strings rather than parsed dates. That is exact for
 * `YYYY-MM-DD` and sidesteps the timezone trap documented on `isoYear()` in
 * `src/components/Resume/Experience.tsx`, where UTC midnight reads as the
 * previous day west of Greenwich. `src/data/__tests__/work.test.ts` pins the
 * date format the comparison depends on.
 *
 * Returns a new array; the input is not mutated.
 */
export function sortPositions(positions: Position[]): Position[] {
  return [...positions].sort(
    (a, b) =>
      timelineKey(b).localeCompare(timelineKey(a)) ||
      b.startDate.localeCompare(a.startDate),
  );
}

/**
 * Whole months from `start` to `end`, truncated rather than rounded — a role
 * of eleven months and twenty-nine days has not lasted a year.
 *
 * Clamped at zero so a reversed range reports nothing rather than a negative
 * tenure.
 */
export function monthsBetween(start: DateInput, end: DateInput): number {
  return Math.max(0, dayjs(end).diff(dayjs(start), 'month'));
}

/**
 * A month count as `8 yr`, `3 mo`, or `7 yr 11 mo`.
 *
 * Deliberately abbreviated: this sits in the resume's mono date gutter, where
 * "7 years 11 months" would wrap onto a third line.
 */
export function formatDuration(months: number): string {
  const total = Math.max(0, Math.trunc(months));

  if (total < 1) {
    return '<1 mo';
  }

  const years = Math.floor(total / 12);
  const remainingMonths = total % 12;

  if (years === 0) {
    return `${remainingMonths} mo`;
  }

  if (remainingMonths === 0) {
    return `${years} yr`;
  }

  return `${years} yr ${remainingMonths} mo`;
}

/** A month count written out for an accessible duration label. */
export function formatDurationLong(months: number): string {
  const total = Math.max(0, Math.trunc(months));

  if (total < 1) {
    return 'less than 1 month';
  }

  const years = Math.floor(total / 12);
  const remainingMonths = total % 12;
  const yearText = years === 1 ? '1 year' : `${years} years`;
  const monthText =
    remainingMonths === 1 ? '1 month' : `${remainingMonths} months`;

  if (years === 0) return monthText;
  if (remainingMonths === 0) return yearText;

  return `${yearText} ${monthText}`;
}

/**
 * How long a role lasted, formatted. A role with no `endDate` is measured to
 * `now`, which the caller supplies.
 */
export function positionDuration(position: Position, now: DateInput): string {
  return formatDuration(
    monthsBetween(position.startDate, position.endDate ?? now),
  );
}

/** The same tenure written without abbreviations for assistive technology. */
export function positionDurationLong(
  position: Position,
  now: DateInput,
): string {
  return formatDurationLong(
    monthsBetween(position.startDate, position.endDate ?? now),
  );
}

/**
 * Completed whole years from the earliest role to now.
 *
 * This is elapsed career span, not a sum of active months and not a claim that
 * every month in the interval was spent in a listed role. The public copy uses
 * that exact meaning.
 */
export function careerSpanYears(positions: Position[], now: DateInput): number {
  const earliestStart = positions.reduce<string | null>(
    (earliest, position) =>
      earliest === null || position.startDate.localeCompare(earliest) < 0
        ? position.startDate
        : earliest,
    null,
  );

  if (earliestStart === null) {
    return 0;
  }

  return Math.floor(monthsBetween(earliestStart, now) / 12);
}
