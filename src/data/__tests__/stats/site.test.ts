import { describe, expect, it } from 'vitest';

import { SOURCE_REPOSITORY } from '@/lib/telemetry';
import data from '../../stats/site';

const REPOSITORY = `https://github.com/${SOURCE_REPOSITORY}`;

describe('site stats data', () => {
  it('keeps only the readings a reader would care about', () => {
    // The page once ran to thirteen rows here, most of them dependency,
    // lockfile, lint, and build-identity counts. A label is pinned as written:
    // it is the first thing a reader reads.
    expect(data.map((stat) => stat.label)).toEqual([
      'GitHub stars',
      'Watchers',
      'Forks',
      'Lines of TypeScript powering this site',
      'Number of spoons',
    ]);
  });

  it('fills every count from a measurement rather than a typed number', () => {
    // A figure typed into this file goes stale; `/stats` once claimed 2,272
    // lines against ~4,400. Only the joke carries a literal.
    for (const stat of data) {
      if (stat.label === 'Number of spoons') {
        expect(stat.value).toBe(0);
      } else {
        expect(stat.key, stat.label).toBeTruthy();
        expect(stat.value, stat.label).toBeUndefined();
      }
    }
  });

  it('links each count into the source repository', () => {
    expect(
      Object.fromEntries(data.map((stat) => [stat.label, stat.link])),
    ).toEqual({
      'GitHub stars': `${REPOSITORY}/stargazers`,
      Watchers: `${REPOSITORY}/watchers`,
      Forks: `${REPOSITORY}/network`,
      'Lines of TypeScript powering this site': REPOSITORY,
      'Number of spoons': undefined,
    });
  });
});
