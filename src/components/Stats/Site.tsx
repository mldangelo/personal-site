import declarations from '../../data/stats/site';
import { countSourceLines } from '../../lib/loc';
import {
  formatReading,
  type Measurement,
  resolveReadings,
} from '../../lib/readings';
import { SOURCE_REPOSITORY } from '../../lib/telemetry';
import Table from './Table';

const COUNTS = ['stargazers_count', 'subscribers_count', 'forks'] as const;

type GitHubCounts = Record<(typeof COUNTS)[number], number>;

/**
 * Counts recorded on 2026-10-25, for builds that cannot reach the GitHub API —
 * anonymous requests from CI are rate limited. They are shown as floors
 * ("1,695+") rather than passed off as fetched: counts like these mostly grow,
 * so a floor stays true without a caveat beside it. Refresh them now and then.
 */
const LAST_KNOWN: GitHubCounts = {
  stargazers_count: 1695,
  subscribers_count: 23,
  forks: 978,
};

/** Narrow untrusted JSON before any formatter can observe it. */
function isGitHubCounts(value: unknown): value is GitHubCounts {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const data = value as Record<string, unknown>;
  return COUNTS.every(
    (key) =>
      typeof data[key] === 'number' &&
      Number.isSafeInteger(data[key]) &&
      data[key] >= 0,
  );
}

function lastKnownFloors(): Record<string, Measurement> {
  return Object.fromEntries(
    COUNTS.map((key) => [key, `${formatReading(LAST_KNOWN[key])}+`]),
  );
}

/**
 * Fetch the repository's public counts at build time. Static export requires
 * a cacheable request; the Pages workflow avoids restoring Next's cache so
 * each deployment attempts a fresh read.
 */
async function fetchGitHubCounts(): Promise<Record<string, Measurement>> {
  try {
    const token = process.env.GITHUB_TOKEN;
    const response = await fetch(
      `https://api.github.com/repos/${SOURCE_REPOSITORY}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        next: { revalidate: false },
      },
    );

    if (!response.ok) {
      console.warn(`GitHub API returned ${response.status}, using floors`);
      return lastKnownFloors();
    }

    const data: unknown = await response.json();
    if (!isGitHubCounts(data)) {
      console.warn('GitHub API returned malformed counts, using floors');
      return lastKnownFloors();
    }
    return Object.fromEntries(COUNTS.map((key) => [key, data[key]]));
  } catch (error) {
    console.warn('Failed to fetch GitHub counts, using floors:', error);
    return lastKnownFloors();
  }
}

/** Site statistics are fully server-rendered and add no client JavaScript. */
export default async function SiteStats() {
  const readings = resolveReadings(declarations, {
    ...(await fetchGitHubCounts()),
    source_lines: countSourceLines(),
  });

  return <Table data={readings} />;
}
