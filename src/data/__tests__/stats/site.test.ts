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

    for (const stat of statsWithLinks) {
      expect(stat.link).toMatch(/^https:\/\//);
    }
  });

  it('pushed_at stat has a format function', () => {
    const pushedAt = data.find((s) => s.key === 'pushed_at');

    expect(pushedAt).toBeDefined();
    expect(pushedAt!.format).toBeDefined();
    expect(typeof pushedAt!.format).toBe('function');
  });

  it('format function returns formatted date', () => {
    const pushedAt = data.find((s) => s.key === 'pushed_at');
    const formatted = pushedAt!.format!('2024-01-15T12:00:00Z');

    expect(formatted).toBe('January 15, 2024');
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
      'production_packages',
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

  it('units appear only where the label does not already name them', () => {
    for (const stat of data.filter((s) => s.unit)) {
      expect(stat.label.toLowerCase(), stat.label).not.toContain(
        stat.unit!.toLowerCase(),
      );
    }
  });
});
