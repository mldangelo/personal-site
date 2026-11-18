import { countSourceLines } from '../../lib/loc';
import { SOURCE_REPOSITORY } from '../../lib/telemetry';
import Table from './Table';

const COUNTS = ['stargazers_count', 'subscribers_count', 'forks'] as const;
const REPOSITORY = `https://github.com/${SOURCE_REPOSITORY}`;

type CountKey = (typeof COUNTS)[number];
type GitHubCounts = Record<CountKey, number>;

/**
 * Counts recorded on 2026-11-15, for builds that cannot reach the GitHub API —
 * anonymous requests from CI are rate limited. They are shown as floors
 * ("1,600+") rather than passed off as fetched, so no caveat is needed beside
 * them. Refresh them now and then.
 */
const LAST_KNOWN: GitHubCounts = {
  stargazers_count: 1698,
  subscribers_count: 23,
  forks: 977,
};

/**
 * Every count can also fall, when an account or a fork is deleted, so a floor
 * is the recorded count rounded down to two significant figures, and never
 * finer than tens. A few departures since the recording leave it true.
 */
function floorOf(count: number): number {
  const step = Math.max(10, 10 ** (String(count).length - 2));
  return Math.floor(count / step) * step;
}

/** The locale is pinned so a published figure cannot depend on the build host. */
function formatCount(count: number): string {
  return count.toLocaleString('en-US');
}

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

/**
 * Fetch the repository's public counts at build time, or `null` if they cannot
 * be read. Static export requires a cacheable request; the Pages workflow
 * avoids restoring Next's cache so each deployment attempts a fresh read.
 */
async function fetchGitHubCounts(): Promise<GitHubCounts | null> {
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
      return null;
    }

    const data: unknown = await response.json();
    if (!isGitHubCounts(data)) {
      console.warn('GitHub API returned malformed counts, using floors');
      return null;
    }
    return data;
  } catch (error) {
    console.warn('Failed to fetch GitHub counts, using floors:', error);
    return null;
  }
}

/**
 * Site statistics are fully server-rendered and add no client JavaScript.
 *
 * A row belongs here when someone would be interested in the number, not
 * because it can be counted.
 */
export default async function SiteStats() {
  const fetched = await fetchGitHubCounts();
  const count = (key: CountKey) =>
    fetched
      ? formatCount(fetched[key])
      : `${formatCount(floorOf(LAST_KNOWN[key]))}+`;

  return (
    <Table
      data={[
        {
          label: 'GitHub stars',
          value: count('stargazers_count'),
          // GitHub shows the stargazer and watcher lists only to signed-in
          // visitors and answers everyone else with a 404. The repository page
          // shows both counts to anyone.
          link: REPOSITORY,
          linkLabel: 'on GitHub',
        },
        {
          label: 'Watchers',
          value: count('subscribers_count'),
          link: REPOSITORY,
          linkLabel: 'on GitHub',
        },
        {
          label: 'Forks',
          value: count('forks'),
          link: `${REPOSITORY}/network`,
          linkLabel: 'on GitHub',
        },
        {
          label: 'Lines of TypeScript powering this site',
          value: formatCount(countSourceLines()),
          link: REPOSITORY,
          linkLabel: 'on GitHub',
        },
        { label: 'Number of spoons', value: '0' },
      ]}
    />
  );
}
