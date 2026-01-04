import initialData from '../../data/stats/site';
import Table from './Table';

type GitHubCacheKey =
  | 'stargazers_count'
  | 'subscribers_count'
  | 'forks'
  | 'open_issues_count'
  | 'pushed_at';

interface GitHubData {
  stargazers_count: number;
  subscribers_count: number;
  forks: number;
  open_issues_count: number;
  pushed_at: string;
}

// Static fallback values used when GitHub API is unavailable
// Note: pushed_at is intentionally old to indicate stale data
const FALLBACK_DATA: GitHubData = {
  stargazers_count: 1500,
  subscribers_count: 20,
  forks: 900,
  open_issues_count: 0,
  pushed_at: '2024-01-01T00:00:00Z',
};

/**
 * Fetch GitHub stats at build time.
 * Uses static fallback if API is unavailable (rate limit, offline, etc.)
 */
async function fetchGitHubStats(): Promise<GitHubData> {
  try {
    const response = await fetch(
      'https://api.github.com/repos/mldangelo/personal-site',
      {
        headers: { Accept: 'application/vnd.github.v3+json' },
        next: { revalidate: false },
      },
    );

    if (!response.ok) {
      console.warn(`GitHub API returned ${response.status}, using fallback`);
      return FALLBACK_DATA;
    }

    const data = await response.json();
    return {
      stargazers_count: data.stargazers_count,
      subscribers_count: data.subscribers_count,
      forks: data.forks,
      open_issues_count: data.open_issues_count,
      pushed_at: data.pushed_at,
    };
  } catch (error) {
    console.warn('Failed to fetch GitHub stats, using fallback:', error);
    return FALLBACK_DATA;
  }
}

/**
 * Site statistics component - fetches GitHub data at build time.
 * Server component, no client-side JavaScript shipped.
 */
export default async function SiteStats() {
  const githubData = await fetchGitHubStats();

  // Apply formatting and resolve values - functions can't be serialized in RSC
  const data = initialData.map((field) => {
    const rawValue =
      field.key && field.key in githubData
        ? (githubData[field.key as GitHubCacheKey] ?? field.value)
        : field.value;

    // Apply format function if present, otherwise use raw value
    const value = field.format ? field.format(rawValue) : rawValue;

    // Return only serializable properties (no functions)
    return {
      label: field.label,
      value,
      link: field.link,
    };
  });

  return <Table data={data} />;
}
