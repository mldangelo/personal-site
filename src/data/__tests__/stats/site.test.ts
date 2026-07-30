import { describe, expect, it } from 'vitest';

import data from '../../stats/site';

describe('site stats data', () => {
  it('exports an array of stats', () => {
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it('each stat has a label', () => {
    for (const stat of data) {
      expect(stat).toHaveProperty('label');
      expect(typeof stat.label).toBe('string');
      expect(stat.label.trim().length).toBeGreaterThan(0);
    }
  });

  it('has GitHub API stats with expected keys', () => {
    const expectedKeys = [
      'stargazers_count',
      'subscribers_count',
      'forks',
      'open_issues_count',
      'pushed_at',
    ];

    // Verify each expected GitHub API key is present
    for (const key of expectedKeys) {
      const stat = data.find((s) => s.key === key);
      expect(stat).toBeDefined();
      expect(stat!.source).toBe('github');
    }
  });

  it('keeps the one row that measures nothing', () => {
    const joke = data.find((s) => s.label.includes('spoons'));

    expect(joke).toBeDefined();
    expect(joke!.key).toBeUndefined();
    // No provenance mark: the joke asserts nothing, so it has no source to
    // name. Every other row does.
    expect(joke!.source).toBeUndefined();
  });

  it('stats with links have valid URLs', () => {
    const statsWithLinks = data.filter((s) => s.link);
    const sha = 'a'.repeat(40);

    for (const stat of statsWithLinks) {
      // A link may be derived from its reading — the deployed commit points at
      // itself — so resolve it the way `resolveReadings` does.
      const href =
        typeof stat.link === 'function' ? stat.link(sha) : stat.link!;

      expect(href, stat.label).toMatch(/^https:\/\//);
    }
  });

  it('pushed_at stat has a format function', () => {
    const pushedAt = data.find((s) => s.key === 'pushed_at');

    expect(pushedAt).toBeDefined();
    expect(pushedAt!.format).toBeDefined();
    expect(typeof pushedAt!.format).toBe('function');
  });

  it('publishes dates in UTC rather than the build host timezone', () => {
    // Was `January 15, 2024` through `dayjs`, which reads the host timezone: the
    // published date depended on which runner produced it, and a runner an hour
    // either side of midnight published a different day. It also has to agree
    // with the build-date row beside it, which is ISO.
    const pushedAt = data.find((s) => s.key === 'pushed_at');

    expect(pushedAt!.format!('2024-01-15T12:00:00Z')).toBe('2024-01-15');
    expect(pushedAt!.format!('2024-01-15T23:59:00Z')).toBe('2024-01-15');
  });

  it('says what produced these bytes, not just when the repo was pushed', () => {
    // `Last updated at` showed GitHub's `pushed_at`, which is the repository's
    // last push on any branch — a claim about the repo dressed up as a claim
    // about the deploy.
    expect(data.find((s) => s.label === 'Last updated at')).toBeUndefined();
    expect(data.find((s) => s.key === 'pushed_at')!.label).toBe(
      'Last push to this repository',
    );

    const commit = data.find((s) => s.key === 'deployed_commit');
    expect(commit).toBeDefined();
    expect(commit!.source).toBe('measured');
    expect(commit!.value).toBeUndefined();

    const built = data.find((s) => s.key === 'built_at');
    expect(built).toBeDefined();
    expect(built!.source).toBe('measured');
    expect(built!.value).toBeUndefined();
  });

  it('links the deployed commit to that exact commit', () => {
    const commit = data.find((s) => s.key === 'deployed_commit');
    const sha = '0123456789abcdef0123456789abcdef01234567';

    expect(typeof commit!.link).toBe('function');
    expect((commit!.link as (v: unknown) => string)(sha)).toBe(
      `https://github.com/mldangelo/personal-site/commit/${sha}`,
    );
    // Shortened for display, but the link keeps the full hash.
    expect(commit!.format!(sha)).toBe('0123456');
  });

  it('declares the lines-of-code stat without hardcoding a count', () => {
    const locStat = data.find((s) => s.label.includes('Lines of TypeScript'));

    expect(locStat).toBeDefined();
    expect(locStat!.link).toContain('github.com');
    // Resolved at build time from the working tree by Site.tsx. A literal
    // here is what let the old figure drift by nearly 2,000 lines.
    expect(locStat!.key).toBe('source_lines');
    expect(locStat!.value).toBeUndefined();
  });

  it('counts dependencies and lint rules rather than typing them in', () => {
    // `Number of linter warnings: '0'` used to sit here with the comment
    // "enforced via github workflow" beside it — a hand-typed number about
    // this codebase, which is the one thing this file must never carry.
    for (const key of [
      'direct_dependencies',
      'installed_non_dev_packages',
      'locked_packages',
      'lint_rules',
    ]) {
      const stat = data.find((s) => s.key === key);

      expect(stat).toBeDefined();
      expect(stat!.source).toBe('measured');
      expect(stat!.value).toBeUndefined();
    }
  });

  it('never hardcodes a value on a measured row', () => {
    // The invariant, stated once: a measured row names a key and nothing else.
    // Anything countable is counted at build.
    for (const stat of data.filter((s) => s.source === 'measured')) {
      expect(stat.key, stat.label).toBeDefined();
      expect(stat.value, stat.label).toBeUndefined();
    }
  });

  it('has no leftover string-typed numbers', () => {
    for (const stat of data) {
      expect(typeof stat.value, stat.label).not.toBe('string');
    }
  });

  it('spells the brand GitHub in every label', () => {
    // Case-sensitive, because a case-insensitive assertion passes against the
    // bug: `Stars this repository has on github` and `Open github issues and
    // pull requests` both shipped, and they were the only lowercase brand in
    // the export.
    for (const stat of data) {
      expect(stat.label, stat.label).not.toContain('github');
    }

    // The keys and URLs keep the API's and the web's own spelling.
    expect(data.some((s) => s.label.includes('GitHub'))).toBe(true);
    expect(data.some((s) => s.key === 'stargazers_count')).toBe(true);
  });

  it('names the fact rather than counting it, except in the joke', () => {
    // `Number of forks` was the `forks` API key with `Number of` bolted on: it
    // named the field, not the fact, and never said what had been forked. The
    // value column is a number on every row, so the prefix told a reader
    // nothing. The joke keeps it — a deadpan inventory line is the punchline.
    const counted = data
      .filter((s) => s.label.startsWith('Number of'))
      .map((s) => s.label);

    expect(counted).toEqual(['Number of spoons']);
  });

  it('does not open a label with a verb a reader could obey', () => {
    // `Open github issues and pull requests` put an imperative at the head of a
    // table row, which is exactly where a control's label sits.
    for (const stat of data) {
      expect(stat.label, stat.label).not.toMatch(/^(Open|Click|View|See)\b/);
    }
  });

  it('units appear only where the label does not already name them', () => {
    for (const stat of data.filter((s) => s.unit)) {
      expect(stat.label.toLowerCase(), stat.label).not.toContain(
        stat.unit!.toLowerCase(),
      );
    }
  });
});
