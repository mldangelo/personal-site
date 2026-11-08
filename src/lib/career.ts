import type { Position } from '@/data/resume/work';

/** A `YYYY-MM-DD` date, epoch milliseconds, or a Date. */
export type DateInput = string | number | Date;

/** Sort key for a role that has not ended, so it outranks every real date. */
const ONGOING_END = '9999-12-31';

/** Recency of involvement: an open-ended side role is placed by its start. */
function timelineKey(position: Position): string {
  if (position.endDate) return position.endDate;

  return position.commitment === 'part-time' ? position.startDate : ONGOING_END;
}

/** Newest first by end date, not start, so long roles outrank later short ones. */
export function sortPositions(positions: Position[]): Position[] {
  return [...positions].sort(
    (a, b) =>
      timelineKey(b).localeCompare(timelineKey(a)) ||
      b.startDate.localeCompare(a.startDate),
  );
}

/** The job held now, wherever it sits in the array — never `work[0]`. */
export function currentPosition(positions: Position[]): Position | undefined {
  const ordered = sortPositions(positions);

  return (
    ordered.find(
      (position) => !position.endDate && position.commitment !== 'part-time',
    ) ?? ordered[0]
  );
}

/**
 * The calendar day a date names: a date-only string as written, an instant as
 * the local day it falls on. Kept as numbers because a local midnight does not
 * exist everywhere — where daylight saving starts at 00:00 it becomes 01:00,
 * and a month counted to it from midnight is an hour short.
 */
function calendarDay(input: DateInput): [number, number, number] {
  if (typeof input === 'string') {
    const [year, month, day] = input.split('-').map(Number);
    return [year, month - 1, day];
  }
  const date = new Date(input);

  return [date.getFullYear(), date.getMonth(), date.getDate()];
}

/**
 * Whole months from `start` to `end`, truncated; a reversed range is 0. A
 * month from the 31st ends on the last day of a shorter month.
 */
export function monthsBetween(start: DateInput, end: DateInput): number {
  const [fromYear, fromMonth, fromDay] = calendarDay(start);
  const [toYear, toMonth, toDay] = calendarDay(end);
  const months = (toYear - fromYear) * 12 + (toMonth - fromMonth);
  const lastDay = new Date(Date.UTC(toYear, toMonth + 1, 0)).getUTCDate();

  return Math.max(0, toDay < Math.min(fromDay, lastDay) ? months - 1 : months);
}

/** `7 yr 11 mo` for the date gutter, or spelled out for a `.sr-only` label. */
export function formatDuration(months: number, long = false): string {
  const total = Math.max(0, Math.trunc(months));

  if (total < 1) return long ? 'less than 1 month' : '<1 mo';

  const unit = (value: number, short: string, word: string) =>
    long ? `${value} ${word}${value === 1 ? '' : 's'}` : `${value} ${short}`;

  const years = Math.floor(total / 12);
  const remainingMonths = total % 12;
  const parts: string[] = [];

  if (years > 0) parts.push(unit(years, 'yr', 'year'));
  if (remainingMonths > 0) parts.push(unit(remainingMonths, 'mo', 'month'));

  return parts.join(' ');
}

/** Elapsed span since the earliest role began — not summed active experience. */
export function careerSpanYears(positions: Position[], now: DateInput): number {
  const [earliestStart] = positions
    .map((position) => position.startDate)
    .sort((a, b) => a.localeCompare(b));

  return earliestStart ? Math.floor(monthsBetween(earliestStart, now) / 12) : 0;
}
