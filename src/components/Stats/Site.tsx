import { Fragment } from 'react';

import declarations from '../../data/stats/site';
import { countSourceLines } from '../../lib/loc';
import {
  countDirectDependencies,
  countInstalledNonDevPackages,
  countLintRules,
  countLockedPackages,
} from '../../lib/manifest';
import {
  captionFor,
  groupBySource,
  type Measurement,
  resolveReadings,
} from '../../lib/readings';
import { builtCommit, utcDate } from '../../lib/telemetry';
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
 * The repository every GitHub reading describes. A fork's build reads this one
 * too, so the note under the table names it. Fetching and naming it from one
 * constant is what keeps that note true.
 */
const UPSTREAM = 'mldangelo/personal-site';

/**
 * Last-known upstream values for builds where the GitHub API is unavailable.
 * The table's caption dates this snapshot and its note calls the numbers
 * approximate, so refresh `FALLBACK_REFRESHED` whenever these change.
 */
const FALLBACK_DATA: GitHubData = {
  stargazers_count: 1663,
  subscribers_count: 23,
  forks: 979,
  open_issues_count: 21,
  pushed_at: '2026-07-31T15:44:18Z',
};

/** When `FALLBACK_DATA` was last refreshed, as the page states it. */
const FALLBACK_REFRESHED = 'July 31, 2026';

/** Narrow untrusted JSON before any formatter can observe it. */
function isGitHubData(value: unknown): value is GitHubData {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const data = value as Record<string, unknown>;
  const counts = [
    'stargazers_count',
    'subscribers_count',
    'forks',
    'open_issues_count',
  ];
  if (
    !counts.every(
      (key) =>
        typeof data[key] === 'number' &&
        Number.isSafeInteger(data[key]) &&
        data[key] >= 0,
    )
  ) {
    return false;
  }

  const timestamp = data.pushed_at;
  if (
    typeof timestamp !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}T[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-][0-2]\d:[0-5]\d)$/.test(
      timestamp,
    ) ||
    Number(timestamp.slice(11, 13)) > 23 ||
    !Number.isFinite(Date.parse(timestamp))
  ) {
    return false;
  }
  // Date.parse normalizes impossible days, so check the calendar date too.
  const day = timestamp.slice(0, 10);
  return new Date(`${day}T00:00:00Z`).toISOString().slice(0, 10) === day;
}

/**
 * Fetch public upstream statistics at build time. Static export requires a
 * cacheable request; the Pages workflow avoids restoring Next's cache so each
 * deployment attempts a fresh read.
 */
async function fetchGitHubStats(): Promise<GitHubStatsResult> {
  try {
    const token = process.env.GITHUB_TOKEN;
    const response = await fetch(`https://api.github.com/repos/${UPSTREAM}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      next: { revalidate: false },
    });

    if (!response.ok) {
      console.warn(`GitHub API returned ${response.status}, using fallback`);
      return { data: FALLBACK_DATA, source: 'fallback' };
    }

    const data: unknown = await response.json();
    if (!isGitHubData(data)) {
      console.warn('GitHub API returned malformed statistics, using fallback');
      return { data: FALLBACK_DATA, source: 'fallback' };
    }
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

/** Take every first-hand reading this build can establish. */
function measureThisBuild(): Record<string, Measurement> {
  const builtAt = Date.now();

  return {
    source_lines: countSourceLines(),
    direct_dependencies: countDirectDependencies(),
    installed_non_dev_packages: countInstalledNonDevPackages(),
    locked_packages: countLockedPackages(),
    lint_rules: countLintRules(),
    built_commit: builtCommit(),
    built_at: utcDate(builtAt),
  };
}

/**
 * Site statistics are fully server-rendered and add no client JavaScript.
 *
 * One table per source, each under a caption that names it. Only the GitHub
 * table has two states. A build that could not fetch its numbers says so three
 * times over: in the caption, in the note, and as `data-source="fallback"` on
 * both, because last-known numbers must never pass for fetched ones.
 */
export default async function SiteStats() {
  const githubStats = fetchGitHubStats();
  const measurements = measureThisBuild();
  const { data: githubData, source: fetched } = await githubStats;
  const data = resolveReadings(declarations, {
    ...measurements,
    ...githubData,
  });

  return groupBySource(data).map(({ source, readings }) =>
    source === 'github' ? (
      <Fragment key={source}>
        <Table
          caption={
            fetched === 'github'
              ? captionFor(source)
              : `From GitHub, last known ${FALLBACK_REFRESHED}`
          }
          data={readings}
          source={fetched}
        />
        {/* The spans keep a name and a date in one piece: see content.css. */}
        <p className="stats-source-note" data-source={fetched}>
          {fetched === 'github' ? (
            <>
              These describe the <span>{UPSTREAM}</span> repository.
            </>
          ) : (
            <>
              GitHub’s numbers could not be fetched when this site was built.
              These are approximate: the last counts recorded for{' '}
              <span>{UPSTREAM}</span>, on <span>{FALLBACK_REFRESHED}</span>.
            </>
          )}
        </p>
      </Fragment>
    ) : (
      <Table
        key={source ?? 'unsourced'}
        caption={captionFor(source)}
        data={readings}
        source={source}
      />
    ),
  );
}
