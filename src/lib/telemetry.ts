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

/** Characters shown for a build SHA; links retain the complete hash. */
export const SHORT_SHA_LENGTH = 7;

/**
 * Source location used by local builds that have no CI identity.
 *
 * This fallback is only for source links. It is never used to invent the
 * "Built from commit" reading.
 */
export const DEFAULT_SOURCE_REPOSITORY = 'mldangelo/personal-site';

const COMMIT_SHA = /^[0-9a-f]{40}$/i;
const REPOSITORY_NAME = /^[a-z0-9](?:[a-z0-9-]{0,38})\/[a-z0-9._-]{1,100}$/i;

export interface BuildIdentity {
  repository: string;
  sha: string;
}

function parseBuildIdentity(
  shaValue: string | undefined,
  repositoryValue: string | undefined,
): BuildIdentity | null {
  const sha = (shaValue ?? '').trim();
  const repository = (repositoryValue ?? '').trim();

  if (!COMMIT_SHA.test(sha) || !REPOSITORY_NAME.test(repository)) {
    return null;
  }

  return { repository, sha };
}

/**
 * The repository and commit checked out for this build.
 *
 * Explicit `BUILD_*` values form one pair. If either is present, both must be
 * valid; a partial explicit identity never borrows a value from the runner.
 * Otherwise GitHub Actions' own pair is used. Local builds return `null`.
 */
export function buildIdentity(): BuildIdentity | null {
  const hasExplicitIdentity =
    process.env.BUILD_SHA !== undefined ||
    process.env.BUILD_REPOSITORY !== undefined;

  return hasExplicitIdentity
    ? parseBuildIdentity(process.env.BUILD_SHA, process.env.BUILD_REPOSITORY)
    : parseBuildIdentity(process.env.GITHUB_SHA, process.env.GITHUB_REPOSITORY);
}

/** The exact commit checked out for this build, if the build identifies one. */
export function builtCommit(): string | null {
  return buildIdentity()?.sha ?? null;
}

/** Link the current build reading to its full commit in the same repository. */
export function builtCommitUrl(value: unknown): string {
  const identity = buildIdentity();
  const sha = String(value).trim();

  if (!identity || sha !== identity.sha) {
    throw new Error('Cannot link a commit outside the current build identity');
  }

  return `https://github.com/${identity.repository}/commit/${identity.sha}`;
}

/**
 * Link to a file at the exact build commit.
 *
 * Local builds have no immutable revision to name, so their links use the
 * upstream main branch without claiming that it produced a deployed artifact.
 */
export function buildSourceFileUrl(path: string): string {
  const identity = buildIdentity();
  const repository = identity?.repository ?? DEFAULT_SOURCE_REPOSITORY;
  const revision = identity?.sha ?? 'main';

  return `https://github.com/${repository}/blob/${revision}/${path}`;
}

/** Link to the complete source tree that the build measured. */
export function buildSourceTreeUrl(): string {
  const identity = buildIdentity();
  const repository = identity?.repository ?? DEFAULT_SOURCE_REPOSITORY;
  const revision = identity?.sha ?? 'main';

  return `https://github.com/${repository}/tree/${revision}`;
}
