/**
 * Telemetry — the measured values the site reports about itself.
 *
 * These are the numbers the hero readout and the stats page both draw from,
 * so a value is defined once and can never disagree with itself across pages.
 */

/** Birth date used for the live age readout (ISO format, local time). */
export const BIRTH_DATE = '1990-02-05T09:24:00';

/** Milliseconds in an average year, accounting for leap years. */
export const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.2421897;

/** Year the first computer arrived in the bedroom. See `src/data/about.ts`. */
export const COMPUTING_SINCE = 1993;

/** Countries visited to date. */
export const COUNTRIES_VISITED = 53;

/** Current home city. */
export const CURRENT_CITY = 'New York, NY';

/** Decimal places used by the stats page — absurd precision, on purpose. */
export const AGE_PRECISION_FULL = 11;

/** Decimal places used by the hero readout, sized to fit its column. */
export const AGE_PRECISION_HERO = 8;

/** How often the age readout advances, in milliseconds. */
export const AGE_UPDATE_INTERVAL = 25;

/**
 * Age in years at a given instant, fixed to `precision` decimal places.
 *
 * Takes `now` rather than reading the clock so the result is deterministic
 * and testable.
 */
export function ageAt(now: number, precision: number): string {
  const birthTime = new Date(BIRTH_DATE).getTime();
  return ((now - birthTime) / MS_PER_YEAR).toFixed(precision);
}

/**
 * A same-width placeholder for an age readout, used for the first paint so
 * the surrounding layout does not shift when the real value arrives.
 */
export function agePlaceholder(precision: number): string {
  return `--.${'-'.repeat(precision)}`;
}
