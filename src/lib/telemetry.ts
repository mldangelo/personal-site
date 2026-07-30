import profile from '@/data/profile.json';

/**
 * Measured values shown on the stats page.
 *
 * The facts live in `src/data/profile.json` so that the OG generator, which
 * runs as a plain Node script and cannot import TypeScript, reads exactly the
 * same values.
 */

/**
 * Birth instant, with an explicit offset.
 *
 * Without one this parsed as local time, so the readout shifted by hours
 * depending on where the visitor was — the whole point of the figure is that
 * it is the same measurement for everyone. -05:00 is Buffalo, NY in February.
 */
export const BIRTH_DATE = profile.birthDate;

/** Milliseconds in an average year, accounting for leap years. */
export const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.2421897;

/** Year the first computer arrived in the bedroom. See `src/data/about.ts`. */
export const COMPUTING_SINCE = profile.computingSince;

/** Countries visited to date. */
export const COUNTRIES_VISITED = profile.countriesVisited;

/** Current home city. */
export const CURRENT_CITY = profile.currentCity;

/** Decimal places used by the stats page — absurd precision, on purpose. */
export const AGE_PRECISION_FULL = 11;

/**
 * Decimal places the build itself can honestly claim.
 *
 * The page used to ship `--.-----------` to crawlers, no-JS visitors, and
 * no-JS print renderers because the only reading was the one the browser
 * computed. (A browser printing after hydration already saw the live value.)
 * The server can compute a real one — but only to the precision that survives
 * until the next deploy. One unit at two decimals is
 * `MS_PER_YEAR / 100`, about 3.7 days, so the figure stays true for roughly a
 * deploy cycle; the remaining nine digits of `AGE_PRECISION_FULL` would be
 * nine digits of fiction the moment the build finished. The reading is labelled
 * with the build date for the same reason.
 */
export const AGE_PRECISION_STATIC = 2;

/** Fastest the readout is allowed to advance, in milliseconds. */
export const AGE_MIN_INTERVAL = 25;

/**
 * How often the build clock advances, in milliseconds.
 *
 * A thousand times the age readout's floor, deliberately. The eleven-decimal
 * age is the one absurdly precise reading on the page and a second one would
 * dilute it; this reading only has to be visibly alive, and a second is the
 * smallest unit it displays.
 */
export const BUILD_CLOCK_INTERVAL = 1000;

/**
 * How often a readout at `precision` decimal places actually changes.
 *
 * The last displayed digit is worth `MS_PER_YEAR / 10^precision` ms, so at
 * eight decimals the value only moves about every 316ms. Ticking at a fixed
 * 25ms scheduled roughly twelve React renders per visible change, all of them
 * painting an identical string.
 *
 * This derivation only bites below about nine decimals. At
 * `AGE_PRECISION_FULL` the last digit turns over every ~0.32ms, so the floor
 * always wins and the timer runs at `AGE_MIN_INTERVAL` — 40 ticks a second,
 * every one of them a genuinely different string. That cadence is deliberate;
 * the blur is the point of the readout. It is affordable because `useLiveAge`
 * assigns the reading to a text node rather than routing it through React
 * state, so the cost of a tick is one `textContent` write and nothing else.
 */
export function ageIntervalFor(precision: number): number {
  const msPerDigit = MS_PER_YEAR / 10 ** precision;

  return Math.max(AGE_MIN_INTERVAL, Math.floor(msPerDigit));
}

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
 * A same-width placeholder for an age readout.
 *
 * Still the right content for a readout with no server-side value to show —
 * fixed-width and digit-free, so it cannot be mistaken for a measurement. The
 * stats page no longer needs it: it renders the build-time reading instead and
 * lets the client upgrade the precision.
 */
export function agePlaceholder(precision: number): string {
  return `--.${'-'.repeat(precision)}`;
}

/**
 * The UTC calendar date of an instant, as `YYYY-MM-DD`.
 *
 * Deliberately not `toLocaleDateString` or a `dayjs` format: both read the
 * host's timezone, and every date this page publishes is produced on a build
 * machine rather than in the reader's browser. A CI runner in UTC and a laptop
 * in New York must not disagree about what day the build ran.
 */
export function utcDate(at: number): string {
  return new Date(at).toISOString().slice(0, 10);
}

/**
 * Elapsed time as a clock: `03:12:07`, or `4d 03:12:07` past a day.
 *
 * Clamped at zero. `builtAt` comes from the build machine and `now` from the
 * reader's, so a browser whose clock is a few seconds behind the deploy would
 * otherwise be told the build happens in the future.
 */
export function elapsedSince(builtAt: number, now: number): string {
  const seconds = Math.floor(Math.max(0, now - builtAt) / 1000);
  const pad = (value: number) => String(value).padStart(2, '0');
  const clock = [
    pad(Math.floor(seconds / 3600) % 24),
    pad(Math.floor(seconds / 60) % 60),
    pad(seconds % 60),
  ].join(':');
  const days = Math.floor(seconds / 86400);

  return days > 0 ? `${days}d ${clock}` : clock;
}

/**
 * The widest ordinary form of `elapsedSince`, used to reserve its width.
 *
 * Counted from this string rather than typed as a number, so the reservation
 * cannot drift from the format it is reserving for.
 */
export function elapsedPlaceholder(): string {
  return '--d --:--:--';
}

/** Characters of a commit hash worth showing. Enough to be unambiguous. */
export const SHORT_SHA_LENGTH = 7;

/** Upstream identity used only when a local build supplies no CI repository. */
export const DEFAULT_BUILD_REPOSITORY = 'mldangelo/personal-site';

const COMMIT_SHA = /^[0-9a-f]{40}$/i;
const REPOSITORY_NAME = /^[a-z0-9](?:[a-z0-9-]{0,38})\/[a-z0-9._-]{1,100}$/i;

/**
 * The owner/repository that produced this build.
 *
 * The explicit build input and GitHub runner fallback mirror the commit
 * variables below. A local build has no repository context, so it uses the
 * upstream project. A malformed value supplied by CI is rejected rather than
 * interpolated into a public URL.
 */
export function deployedRepository(): string | null {
  const configured =
    process.env.BUILD_REPOSITORY ?? process.env.GITHUB_REPOSITORY;
  const repository = (configured ?? DEFAULT_BUILD_REPOSITORY).trim();

  return REPOSITORY_NAME.test(repository) ? repository : null;
}

/**
 * The commit that produced this build, or `null` when there is no build to ask.
 *
 * `/stats` used to answer "how fresh is this?" with GitHub's `pushed_at`, which
 * is the repository's last push — a different fact, and one that runs ahead of
 * the deploy whenever a push lands on a branch or a deploy fails. The only
 * honest answer is the commit the running build was cut from.
 *
 * `BUILD_SHA` and `BUILD_REPOSITORY` are set explicitly by the build step in
 * `.github/workflows/node.js.yml`; `GITHUB_SHA` and `GITHUB_REPOSITORY` are the
 * runner defaults and are read as a pair so a fork that never touched the
 * workflow still links its own commit rather than an upstream 404. Off CI —
 * `npm run dev`, a local `npm run build` — there is no commit context, so this
 * returns `null` and `resolveReadings` drops the row rather than inventing one.
 *
 * The shape is checked because an empty or truncated value would otherwise
 * render as a link to a commit that does not exist.
 */
export function deployedCommit(): string | null {
  const sha = (process.env.BUILD_SHA ?? process.env.GITHUB_SHA ?? '').trim();

  return COMMIT_SHA.test(sha) && deployedRepository() ? sha : null;
}

/**
 * Link a validated deployed-commit reading back to the repository that built
 * it. Kept beside the environment parser so the SHA and repository cannot
 * accidentally come from different assumptions.
 */
export function deployedCommitUrl(value: unknown): string {
  const sha = String(value);
  const repository = deployedRepository();

  if (!COMMIT_SHA.test(sha) || !repository) {
    throw new Error('Cannot link an invalid deployed commit');
  }

  return `https://github.com/${repository}/commit/${sha}`;
}
