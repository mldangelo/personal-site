import { afterEach, describe, expect, it } from 'vitest';

import {
  AGE_MIN_INTERVAL,
  AGE_PRECISION_FULL,
  AGE_PRECISION_STATIC,
  ageAt,
  ageIntervalFor,
  agePlaceholder,
  BIRTH_DATE,
  BUILD_CLOCK_INTERVAL,
  deployedCommit,
  elapsedPlaceholder,
  elapsedSince,
  MS_PER_YEAR,
  SHORT_SHA_LENGTH,
  utcDate,
} from '../telemetry';

const COMPACT_PRECISION = 8;
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

describe('ageAt', () => {
  const birthTime = new Date(BIRTH_DATE).getTime();

  it('returns zero at the moment of birth', () => {
    expect(ageAt(birthTime, 2)).toBe('0.00');
  });

  it('returns whole years after exact year intervals', () => {
    expect(ageAt(birthTime + MS_PER_YEAR * 36, 4)).toBe('36.0000');
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
  it('matches the width of a real reading so the layout cannot shift', () => {
    const birthTime = new Date(BIRTH_DATE).getTime();
    const reading = ageAt(birthTime + MS_PER_YEAR * 36, COMPACT_PRECISION);

    expect(agePlaceholder(COMPACT_PRECISION)).toHaveLength(reading.length);
  });

  it('contains no digits, so it cannot be mistaken for a value', () => {
    expect(agePlaceholder(AGE_PRECISION_FULL)).not.toMatch(/\d/);
  });
});

describe('AGE_PRECISION_STATIC', () => {
  it('is coarse enough to still be true at the next deploy', () => {
    // The whole justification for the number. One unit at this precision has to
    // be worth more than a deploy cycle, or the reading the build ships is
    // wrong before anyone reads it.
    const msPerUnit = MS_PER_YEAR / 10 ** AGE_PRECISION_STATIC;

    expect(msPerUnit / DAY).toBeGreaterThan(3);
    expect(AGE_PRECISION_STATIC).toBeLessThan(AGE_PRECISION_FULL);
  });

  it('produces a real reading where the placeholder produced none', () => {
    // `out/stats/index.html` shipped `--.-----------` as the site's most
    // distinctive value to every crawler and every printed copy.
    const reading = ageAt(new Date(BIRTH_DATE).getTime(), AGE_PRECISION_STATIC);

    expect(reading).toBe('0.00');
    expect(reading).toMatch(/^\d+\.\d{2}$/);
  });
});

describe('utcDate', () => {
  it('reads the date in UTC, not the host timezone', () => {
    // Every date this page publishes is produced on a build machine. A runner
    // an hour either side of midnight must not publish a different day.
    expect(utcDate(Date.UTC(2026, 6, 28, 23, 59))).toBe('2026-07-28');
    expect(utcDate(Date.UTC(2026, 6, 29, 0, 1))).toBe('2026-07-29');
  });
});

describe('elapsedSince', () => {
  const builtAt = Date.UTC(2026, 6, 28, 12, 0, 0);

  it('reads as a clock, and grows a day field only when it needs one', () => {
    expect(elapsedSince(builtAt, builtAt)).toBe('00:00:00');
    expect(elapsedSince(builtAt, builtAt + 7 * SECOND)).toBe('00:00:07');
    expect(elapsedSince(builtAt, builtAt + 3 * HOUR + 12 * MINUTE)).toBe(
      '03:12:00',
    );
    expect(elapsedSince(builtAt, builtAt + 4 * DAY + 3 * HOUR)).toBe(
      '4d 03:00:00',
    );
  });

  it('does not roll the clock fields into each other', () => {
    // 25 hours is one day and one hour, not 25 in the hour field.
    expect(elapsedSince(builtAt, builtAt + 25 * HOUR)).toBe('1d 01:00:00');
  });

  it('clamps a reader whose clock runs behind the build', () => {
    // `builtAt` comes from the build machine and `now` from the reader's, so a
    // browser a few seconds slow would otherwise be told the build is in the
    // future.
    expect(elapsedSince(builtAt, builtAt - 5 * MINUTE)).toBe('00:00:00');
  });

  it('never outgrows the width reserved for it before 100 days', () => {
    const widest = elapsedSince(builtAt, builtAt + 99 * DAY + 23 * HOUR);

    expect(widest.length).toBeLessThanOrEqual(elapsedPlaceholder().length);
  });
});

describe('BUILD_CLOCK_INTERVAL', () => {
  it('is far coarser than the age readout, so it cannot dilute it', () => {
    // The eleven-decimal age is deliberately the only absurdly precise reading
    // on the page, and a second 40-per-second timer is exactly what the
    // out-of-band write was introduced to avoid.
    expect(BUILD_CLOCK_INTERVAL).toBeGreaterThanOrEqual(1000);
    expect(BUILD_CLOCK_INTERVAL).toBeGreaterThan(AGE_MIN_INTERVAL * 10);
  });
});

describe('deployedCommit', () => {
  const saved = { ...process.env };

  afterEach(() => {
    process.env = { ...saved };
  });

  it('reports the commit the build step handed it', () => {
    const sha = '0123456789abcdef0123456789abcdef01234567';
    process.env.BUILD_SHA = sha;

    expect(deployedCommit()).toBe(sha);
    expect(sha.slice(0, SHORT_SHA_LENGTH)).toBe('0123456');
  });

  it("falls back to the runner's own variable", () => {
    // A fork that never edited the workflow still gets the row.
    delete process.env.BUILD_SHA;
    process.env.GITHUB_SHA = 'f'.repeat(40);

    expect(deployedCommit()).toBe('f'.repeat(40));
  });

  it('returns null off CI so the row drops rather than guessing', () => {
    delete process.env.BUILD_SHA;
    delete process.env.GITHUB_SHA;

    expect(deployedCommit()).toBeNull();
  });

  it('refuses anything that is not a commit hash', () => {
    // An empty or truncated value would render a link to a commit that does not
    // exist, which is worse than showing no row at all.
    for (const value of ['', '   ', 'abc123', 'main', `${'a'.repeat(41)}`]) {
      process.env.BUILD_SHA = value;

      expect(deployedCommit(), value).toBeNull();
    }
  });
});
