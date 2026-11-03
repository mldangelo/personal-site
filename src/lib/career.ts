import type { Position } from '@/data/resume/work';

/** A `YYYY-MM-DD` date, epoch milliseconds, or a Date. */
export type DateInput = string | number | Date;

/** Sort key for a role that has not ended, so it outranks every real date. */
const ONGOING_END = '9999-12-31';

/** Recency of involvement: an open-ended side role is placed by its start. */
export function timelineKey(position: Position): string {
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

/** A date-only string is a local calendar day, like every other date here. */
function toDate(input: DateInput): Date {
  return typeof input === 'string'
    ? new Date(`${input}T00:00:00`)
    : new Date(input);
}

/** `date` moved on by whole months, held to the last day of a shorter month. */
function addMonths(date: Date, months: number): Date {
  const moved = new Date(date);
  moved.setDate(1);
  moved.setMonth(moved.getMonth() + months);
  const lastDay = new Date(
    moved.getFullYear(),
    moved.getMonth() + 1,
    0,
  ).getDate();
  moved.setDate(Math.min(date.getDate(), lastDay));

  return moved;
}

/** Whole months from `start` to `end`, truncated; a reversed range is 0. */
export function monthsBetween(start: DateInput, end: DateInput): number {
  const from = toDate(start);
  const to = toDate(end);
  const months =
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth());

  return Math.max(0, to < addMonths(from, months) ? months - 1 : months);
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
