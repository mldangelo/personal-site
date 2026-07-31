import { afterEach, describe, expect, it } from 'vitest';

import data from '../../stats/site';

const ENV_KEYS = [
  'BUILD_SHA',
  'BUILD_REPOSITORY',
  'GITHUB_SHA',
  'GITHUB_REPOSITORY',
] as const;
const originalEnvironment = Object.fromEntries(
  ENV_KEYS.map((key) => [key, process.env[key]]),
);

function useBuild(repository: string, sha: string) {
  delete process.env.GITHUB_SHA;
  delete process.env.GITHUB_REPOSITORY;
  process.env.BUILD_SHA = sha;
  process.env.BUILD_REPOSITORY = repository;
}

afterEach(() => {
  for (const key of ENV_KEYS) {
    const value = originalEnvironment[key];

    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

describe('site stats data', () => {
  it('declares every GitHub API reading with provenance', () => {
    for (const key of [
      'stargazers_count',
      'subscribers_count',
      'forks',
      'open_issues_count',
      'pushed_at',
    ]) {
      const stat = data.find((candidate) => candidate.key === key);

      expect(stat, key).toBeDefined();
      expect(stat!.source).toBe('github');
    }
  });

  it('labels pushed_at as repository activity rather than deployment time', () => {
    const pushedAt = data.find((stat) => stat.key === 'pushed_at');

    expect(pushedAt!.label).toBe('Latest repository push (UTC)');
    expect(pushedAt!.link).toBe(
      'https://github.com/mldangelo/personal-site/activity',
    );
    expect(pushedAt!.format!('2024-01-15T00:30:00Z')).toBe('2024-01-15');
    expect(
      data.find((stat) => stat.label === 'Last updated at'),
    ).toBeUndefined();
  });

  it('declares exact build commit and UTC date readings', () => {
    const commit = data.find((stat) => stat.key === 'built_commit');
    const date = data.find((stat) => stat.key === 'built_at');

    expect(commit).toMatchObject({
      label: 'Built from commit',
      source: 'measured',
    });
    expect(commit!.value).toBeUndefined();
    expect(date).toMatchObject({
      label: 'Built on (UTC)',
      source: 'measured',
    });
    expect(date!.value).toBeUndefined();
  });

  it('links the displayed short SHA through the complete build identity', () => {
    const sha = '0123456789abcdef0123456789abcdef01234567';
    useBuild('octocat/personal-site', sha);
    const commit = data.find((stat) => stat.key === 'built_commit');

    expect(commit!.format!(sha)).toBe('0123456');
    expect((commit!.link as (value: unknown) => string)(sha)).toBe(
      `https://github.com/octocat/personal-site/commit/${sha}`,
    );
  });

  it('pins measured source links to the exact fork revision', () => {
    const sha = 'a'.repeat(40);
    useBuild('octocat/personal-site', sha);

    const linkFor = (key: string) => {
      const link = data.find((stat) => stat.key === key)!.link;
      return typeof link === 'function' ? link(1) : link;
    };

    expect(linkFor('source_lines')).toBe(
      'https://github.com/octocat/personal-site/graphs/contributors',
    );
    expect(linkFor('direct_dependencies')).toBe(
      `https://github.com/octocat/personal-site/blob/${sha}/package.json`,
    );
    expect(linkFor('locked_packages')).toBe(
      `https://github.com/octocat/personal-site/blob/${sha}/package-lock.json`,
    );
    expect(linkFor('lint_rules')).toBe(
      `https://github.com/octocat/personal-site/blob/${sha}/biome.json`,
    );
  });

  it('does not link the build-host dependency count to the lockfile', () => {
    expect(
      data.find((stat) => stat.key === 'installed_non_dev_packages')!.link,
    ).toBeUndefined();
  });

  it('never hardcodes a value on a measured row', () => {
    for (const stat of data.filter(
      (candidate) => candidate.source === 'measured',
    )) {
      expect(stat.key, stat.label).toBeDefined();
      expect(stat.value, stat.label).toBeUndefined();
    }
  });

  it('uses units only when the label does not already provide one', () => {
    for (const stat of data.filter((candidate) => candidate.unit)) {
      expect(stat.label.toLowerCase(), stat.label).not.toContain(
        stat.unit!.toLowerCase(),
      );
    }
  });

  it('leaves the spoon joke unmarked because it measures nothing', () => {
    const joke = data.find((stat) => stat.label === 'Number of spoons');

    expect(joke).toMatchObject({ value: 0 });
    expect(joke!.key).toBeUndefined();
    expect(joke!.source).toBeUndefined();
  });
});
