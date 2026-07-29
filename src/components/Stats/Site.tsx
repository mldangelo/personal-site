import declarations from '../../data/stats/site';
import { countSourceLines } from '../../lib/loc';
import {
  countDirectDependencies,
  countLintRules,
  countLockedPackages,
} from '../../lib/manifest';
import { type Measurement, resolveReadings } from '../../lib/readings';
import { deployedCommit, utcDate } from '../../lib/telemetry';
import BuildClock from './BuildClock';
import Table from './Table';

interface GitHubData {
  stargazers_count: number;
  subscribers_count: number;
  forks: number;
  open_issues_count: number;
  pushed_at: string;
}

interface GitHubStatsResult {
  data: GitHubData;
  source: 'github' | 'fallback';
}

/**
 * Last-known values, used only when the GitHub API is unreachable at build
 * time (rate limit, offline CI). These go stale by definition — refresh them
 * when you notice, and treat a build that logs the warning below as a build
 * that shipped approximate numbers.
 *
 * The note rendered below deliberately carries no date. It used to spell out
 * "fallback refreshed July 25, 2026" — this snapshot's vintage typed a second
 * time, in user-facing copy, free to drift from the numbers it dates and
 * certain to go stale. Nothing here can honestly supply it either: `pushed_at`
 * is the repository's last push as of capture rather than the capture, and the
 * build clock is worse, because this constant exists precisely for builds
 * where the fetch failed and stamping it with the build time would assert a
 * freshness it does not have. The vintage stays where it already was — the
 * `pushed_at` below renders as the "Last push to this repository" row — and
 * the note tells the reader that row is part of the snapshot.
 *
 * Refreshed: 2026-07-25
 */
const FALLBACK_DATA: GitHubData = {
  stargazers_count: 1663,
  subscribers_count: 23,
  forks: 979,
  open_issues_count: 2,
  pushed_at: '2026-07-25T00:00:00Z',
};

/**
 * Fetch GitHub stats at build time.
 * Uses static fallback if API is unavailable (rate limit, offline, etc.)
 *
 * `revalidate: false` is required, not preferred: `output: 'export'` needs
 * every route statically renderable, and an uncached fetch forces the route
 * dynamic — which makes this fall back on every single build.
 *
 * The staleness risk that implies is handled where it actually lives: the
 * Pages workflow does not restore `.next/cache`, so each deploy refetches.
 */
async function fetchGitHubStats(): Promise<GitHubStatsResult> {
  try {
    const token = process.env.GITHUB_TOKEN;
    const response = await fetch(
      'https://api.github.com/repos/mldangelo/personal-site',
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        next: { revalidate: false },
      },
    );

    if (!response.ok) {
      console.warn(`GitHub API returned ${response.status}, using fallback`);
      return { data: FALLBACK_DATA, source: 'fallback' };
    }

    const data = await response.json();
    return {
      data: {
        stargazers_count: data.stargazers_count,
        subscribers_count: data.subscribers_count,
        forks: data.forks,
        open_issues_count: data.open_issues_count,
        pushed_at: data.pushed_at,
      },
      source: 'github',
    };
  } catch (error) {
    console.warn('Failed to fetch GitHub stats, using fallback:', error);
    return { data: FALLBACK_DATA, source: 'fallback' };
  }
}

/**
 * Everything the page asserts about this codebase, counted from the working
 * tree and its manifests rather than typed in. A count that cannot be taken
 * comes back `null` and `resolveReadings` drops its row.
 *
 * Two of these describe the build rather than the tree. `built_at` is the
 * instant this function ran, which under `output: 'export'` is the build; the
 * value is a live client readout because the interesting figure is how long ago
 * that was, and only the reader's browser can know. `deployed_commit` is the
 * commit those bytes came from — `null`, and dropped, off CI.
 */
function measureThisBuild(): Record<string, Measurement> {
  const locked = countLockedPackages();
  const builtAt = Date.now();

  return {
    source_lines: countSourceLines(),
    direct_dependencies: countDirectDependencies(),
    production_packages: locked?.production ?? null,
    locked_packages: locked?.total ?? null,
    lint_rules: countLintRules(),
    deployed_commit: deployedCommit(),
    built_at: <BuildClock builtAt={builtAt} initial={utcDate(builtAt)} />,
  };
}

/**
 * Site statistics component - fetches GitHub data at build time.
 * Server component, no client-side JavaScript shipped.
 */
export default async function SiteStats() {
  // Started before the measurements so the file reads happen during the
  // network round trip rather than after it. The Pages build deliberately runs
  // this fetch uncached every time, so the two costs would otherwise stack.
  const githubStats = fetchGitHubStats();

  const measurements = measureThisBuild();
  const { data: githubData, source } = await githubStats;

  // Resolution — including the `format` functions, which cannot cross the RSC
  // boundary — happens in `src/lib/readings.ts` so both stats tables describe
  // their provenance the same way.
  const data = resolveReadings(declarations, {
    ...measurements,
    ...githubData,
  });

  return (
    <>
      <Table data={data} />
      <p className="stats-source-note" data-source={source}>
        {source === 'github'
          ? 'GitHub readings fetched at build time. Measured readings counted from the working tree of this build.'
          : 'Approximate GitHub readings — API unavailable, so these are last-known values committed to the repository; the push date above is part of that snapshot, not a live reading. Measured readings counted from the working tree of this build.'}
      </p>
    </>
  );
}
