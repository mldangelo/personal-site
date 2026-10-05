import dayjs from 'dayjs';

import type { Position } from '@/data/resume/work';

/** Anything dayjs accepts: an ISO date string, epoch milliseconds, or a Date. */
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

export function monthsBetween(start: DateInput, end: DateInput): number {
  return Math.max(0, dayjs(end).diff(dayjs(start), 'month'));
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
