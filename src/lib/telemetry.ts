import profile from '@/data/profile.json';

/**
 * Measured values shown on the stats page.
 *
 * The profile facts live in JSON so the site and the standalone OG generator
 * read the same values.
 */

/** Birth instant, including Buffalo's UTC offset. */
export const BIRTH_DATE = profile.birthDate;

/** Milliseconds in an average Gregorian year. */
export const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.2421897;

/** Year the first computer arrived in the bedroom. */
export const COMPUTING_SINCE = profile.computingSince;

/** Countries visited to date. */
export const COUNTRIES_VISITED = profile.countriesVisited;

/** Current home city. */
export const CURRENT_CITY = profile.currentCity;

/** Decimal places used by the live age. The excessive precision is deliberate. */
export const AGE_PRECISION_FULL = 11;

/**
 * Decimal places used for the server-rendered age snapshot.
 *
 * Two decimals give the snapshot roughly 3.65-day resolution. Its date note,
 * rather than an assumed deployment cadence, is what keeps the value honest.
 */
export const AGE_PRECISION_STATIC = 2;

/** Fastest the live age is allowed to advance, in milliseconds. */
export const AGE_MIN_INTERVAL = 25;

/**
 * Match the timer to the last displayed digit, with a floor that prevents
 * excessively fast scheduling.
 */
export function ageIntervalFor(precision: number): number {
  const msPerDigit = MS_PER_YEAR / 10 ** precision;

  return Math.max(AGE_MIN_INTERVAL, Math.floor(msPerDigit));
}

/** Age in years at a given instant, fixed to `precision` decimal places. */
export function ageAt(now: number, precision: number): string {
  const birthTime = new Date(BIRTH_DATE).getTime();
  return ((now - birthTime) / MS_PER_YEAR).toFixed(precision);
}

/** A same-width, digit-free fallback for an age with no server value. */
export function agePlaceholder(precision: number): string {
  return `--.${'-'.repeat(precision)}`;
}

/** Format an instant as a host-timezone-independent UTC date. */
export function utcDate(at: number): string {
  return new Date(at).toISOString().slice(0, 10);
}

/**
 * The repository this site is built from. The GitHub readings on `/stats`
 * describe it and its rows link into it, so a fork changes
 * this one constant.
 */
export const SOURCE_REPOSITORY = 'mldangelo/personal-site';
