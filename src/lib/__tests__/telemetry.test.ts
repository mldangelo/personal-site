import { afterEach, describe, expect, it } from 'vitest';

import {
  AGE_MIN_INTERVAL,
  AGE_PRECISION_FULL,
  AGE_PRECISION_STATIC,
  ageAt,
  ageIntervalFor,
  agePlaceholder,
  BIRTH_DATE,
  buildIdentity,
  buildRepositoryUrl,
  buildSourceFileUrl,
  builtCommit,
  builtCommitUrl,
  DEFAULT_SOURCE_REPOSITORY,
  MS_PER_YEAR,
  SHORT_SHA_LENGTH,
  utcDate,
} from '../telemetry';

const COMPACT_PRECISION = 8;
const ENV_KEYS = [
  'BUILD_SHA',
  'BUILD_REPOSITORY',
  'GITHUB_SHA',
  'GITHUB_REPOSITORY',
] as const;
const originalEnvironment = Object.fromEntries(
  ENV_KEYS.map((key) => [key, process.env[key]]),
);

function clearBuildEnvironment() {
  for (const key of ENV_KEYS) {
    delete process.env[key];
  }
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

describe('ageAt', () => {
  const birthTime = new Date(BIRTH_DATE).getTime();

  it('returns zero at the moment of birth', () => {
    expect(ageAt(birthTime, 2)).toBe('0.00');
  });

  it('honours the requested precision', () => {
    const now = birthTime + MS_PER_YEAR * 36.5;

    expect(ageAt(now, 0)).toBe('37');
    expect(ageAt(now, COMPACT_PRECISION).split('.')[1]).toHaveLength(
      COMPACT_PRECISION,
    );
    expect(ageAt(now, AGE_PRECISION_FULL).split('.')[1]).toHaveLength(
      AGE_PRECISION_FULL,
    );
  });

  it('is deterministic for a given instant', () => {
    const now = birthTime + MS_PER_YEAR * 12.345;

    expect(ageAt(now, 6)).toBe(ageAt(now, 6));
  });
});

describe('ageIntervalFor', () => {
  it('matches the cadence to the displayed precision', () => {
    expect(ageIntervalFor(COMPACT_PRECISION)).toBeGreaterThan(300);
    expect(ageIntervalFor(COMPACT_PRECISION)).toBeLessThan(320);
  });

  it('never schedules faster than the minimum interval', () => {
    expect(ageIntervalFor(AGE_PRECISION_FULL)).toBe(AGE_MIN_INTERVAL);
    expect(ageIntervalFor(20)).toBe(AGE_MIN_INTERVAL);
  });
});

describe('agePlaceholder', () => {
  it('reserves the width of a reading at the same precision', () => {
    const reading = ageAt(
      new Date(BIRTH_DATE).getTime() + MS_PER_YEAR * 36,
      COMPACT_PRECISION,
    );

    expect(agePlaceholder(COMPACT_PRECISION)).toHaveLength(reading.length);
  });

  it('cannot be mistaken for a measurement', () => {
    expect(agePlaceholder(AGE_PRECISION_FULL)).not.toMatch(/\d/);
  });
});

describe('AGE_PRECISION_STATIC', () => {
  it('is coarser than the live display and produces a real snapshot', () => {
    const reading = ageAt(new Date(BIRTH_DATE).getTime(), AGE_PRECISION_STATIC);

    expect(AGE_PRECISION_STATIC).toBeLessThan(AGE_PRECISION_FULL);
    expect(reading).toBe('0.00');
    expect(reading).toMatch(/^\d+\.\d{2}$/);
  });
});

describe('utcDate', () => {
  it('does not depend on the build host timezone', () => {
    expect(utcDate(Date.UTC(2026, 6, 28, 23, 59))).toBe('2026-07-28');
    expect(utcDate(Date.UTC(2026, 6, 29, 0, 1))).toBe('2026-07-29');
  });
});

describe('buildIdentity', () => {
  it('uses a complete explicit build pair', () => {
    clearBuildEnvironment();
    const sha = '0123456789abcdef0123456789abcdef01234567';
    process.env.BUILD_SHA = sha;
    process.env.BUILD_REPOSITORY = 'mldangelo/personal-site';

    expect(buildIdentity()).toEqual({
      repository: 'mldangelo/personal-site',
      sha,
    });
    expect(builtCommit()).toBe(sha);
    expect(builtCommitUrl(sha)).toBe(
      `https://github.com/mldangelo/personal-site/commit/${sha}`,
    );
    expect(sha.slice(0, SHORT_SHA_LENGTH)).toBe('0123456');
  });

  it("uses GitHub Actions' complete pair for a fork build", () => {
    clearBuildEnvironment();
    const sha = 'f'.repeat(40);
    process.env.GITHUB_SHA = sha;
    process.env.GITHUB_REPOSITORY = 'octocat/personal-site';

    expect(buildIdentity()).toEqual({
      repository: 'octocat/personal-site',
      sha,
    });
    expect(builtCommitUrl(sha)).toBe(
      `https://github.com/octocat/personal-site/commit/${sha}`,
    );
  });

  it('never fills a partial explicit pair from runner values', () => {
    clearBuildEnvironment();
    process.env.BUILD_SHA = 'a'.repeat(40);
    process.env.GITHUB_SHA = 'b'.repeat(40);
    process.env.GITHUB_REPOSITORY = 'octocat/personal-site';

    expect(buildIdentity()).toBeNull();
    expect(builtCommit()).toBeNull();
  });

  it('rejects incomplete runner and malformed explicit identities', () => {
    clearBuildEnvironment();
    process.env.GITHUB_SHA = 'a'.repeat(40);
    expect(buildIdentity()).toBeNull();

    process.env.BUILD_SHA = 'b'.repeat(40);
    process.env.BUILD_REPOSITORY = 'owner/repo?tab=actions';
    expect(buildIdentity()).toBeNull();
  });

  it('returns null off CI rather than inferring provenance', () => {
    clearBuildEnvironment();

    expect(buildIdentity()).toBeNull();
    expect(builtCommit()).toBeNull();
  });

  it('will not link a different valid-looking SHA', () => {
    clearBuildEnvironment();
    process.env.BUILD_SHA = 'a'.repeat(40);
    process.env.BUILD_REPOSITORY = 'mldangelo/personal-site';

    expect(() => builtCommitUrl('b'.repeat(40))).toThrow(
      /outside the current build identity/i,
    );
  });
});

describe('build source links', () => {
  it('pin CI links to the build repository and full immutable SHA', () => {
    clearBuildEnvironment();
    const sha = 'c'.repeat(40);
    process.env.GITHUB_SHA = sha;
    process.env.GITHUB_REPOSITORY = 'octocat/personal-site';

    expect(buildRepositoryUrl('/graphs/contributors')).toBe(
      'https://github.com/octocat/personal-site/graphs/contributors',
    );
    expect(buildSourceFileUrl('package.json')).toBe(
      `https://github.com/octocat/personal-site/blob/${sha}/package.json`,
    );
  });

  it('uses upstream main only for local source browsing', () => {
    clearBuildEnvironment();

    expect(buildSourceFileUrl('biome.json')).toBe(
      `https://github.com/${DEFAULT_SOURCE_REPOSITORY}/blob/main/biome.json`,
    );
  });
});
