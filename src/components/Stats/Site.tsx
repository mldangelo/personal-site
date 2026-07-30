import declarations from '../../data/stats/site';
import { countSourceLines } from '../../lib/loc';
import {
  countDirectDependencies,
  countInstalledNonDevPackages,
  countLintRules,
  countLockedPackages,
} from '../../lib/manifest';
import { type Measurement, resolveReadings } from '../../lib/readings';
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
 */
function measureThisBuild(): Record<string, Measurement> {
  return {
    source_lines: countSourceLines(),
    direct_dependencies: countDirectDependencies(),
    installed_non_dev_packages: countInstalledNonDevPackages(),
    locked_packages: countLockedPackages(),
    lint_rules: countLintRules(),
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
          : 'Approximate GitHub readings — API unavailable; fallback refreshed July 25, 2026. Measured readings counted from the working tree of this build.'}
      </p>
    </>
  );
}
