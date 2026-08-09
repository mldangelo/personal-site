import type { StatRow } from '@/components/ui/table';
import githubActivityData from '@/data/stats/github';
import initialData from '@/data/stats/site';
import { SOURCE_REPO as REPO_URL } from '@/lib/site';
import { countSourceLines } from '@/lib/source-size';

const REPO_API = 'https://api.github.com/repos/adase11/personal-site';
const GRAPHQL_API = 'https://api.github.com/graphql';
const GITHUB_LOGIN = 'adase11';

/**
 * Merges live GitHub repo numbers onto the static row definitions. Runs on the
 * server and is revalidated hourly, so the figures are in the HTML rather than
 * fetched by the client.
 *
 * Any failure — network, rate limit, unexpected shape — falls back to the
 * static rows. A flaky third-party API must not fail the build or the page.
 */
export const getSiteStats = async (): Promise<StatRow[]> => {
  const [repo, sourceLines] = await Promise.all([
    fetchRepo(),
    countSourceLines()
  ]);

  const rows = repo
    ? initialData.map((row) =>
        row.key && Object.hasOwn(repo, row.key)
          ? { ...row, value: String(repo[row.key]) }
          : row
      )
    : initialData;

  return [
    ...rows,
    {
      label: 'Lines of source powering this website',
      value: sourceLines.toLocaleString('en-US'),
      link: `${REPO_URL}/graphs/contributors`
    }
  ];
};

const fetchRepo = async (): Promise<Record<string, unknown> | null> => {
  try {
    const res = await fetch(REPO_API, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 3600 }
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
};

const CONTRIBUTIONS_QUERY = `
  query($login: String!) {
    user(login: $login) {
      createdAt
      followers { totalCount }
      repositories(privacy: PUBLIC, isFork: false) { totalCount }
      contributionsCollection {
        contributionCalendar { totalContributions }
        totalCommitContributions
        totalPullRequestContributions
      }
    }
  }
`;

/**
 * Profile-level GitHub activity (contribution graph total, commits, PRs,
 * followers, etc.) via the GraphQL API's contributionsCollection, which has
 * no REST equivalent. GraphQL requires auth even for public data, so this
 * needs a GITHUB_TOKEN env var (a token with no scopes is enough); without
 * one, or on any failure, callers fall back to the static rows.
 */
export const getGithubActivity = async (): Promise<StatRow[]> => {
  const profile = await fetchProfile();

  return profile
    ? githubActivityData.map((row) =>
        row.key && Object.hasOwn(profile, row.key)
          ? { ...row, value: String(profile[row.key]) }
          : row
      )
    : githubActivityData;
};

const fetchProfile = async (): Promise<Record<string, unknown> | null> => {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch(GRAPHQL_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: { login: GITHUB_LOGIN }
      }),
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;

    const json = await res.json();
    const user = json?.data?.user;
    if (!user) return null;

    return {
      createdAt: user.createdAt,
      followers: user.followers.totalCount,
      publicRepos: user.repositories.totalCount,
      totalContributions:
        user.contributionsCollection.contributionCalendar.totalContributions,
      totalCommitContributions:
        user.contributionsCollection.totalCommitContributions,
      totalPullRequestContributions:
        user.contributionsCollection.totalPullRequestContributions
    };
  } catch {
    return null;
  }
};
