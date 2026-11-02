import { describe, expect, it } from 'vitest';

import {
  AGE_MIN_INTERVAL,
  AGE_PRECISION_FULL,
  AGE_PRECISION_STATIC,
  ageAt,
  ageIntervalFor,
  agePlaceholder,
  BIRTH_DATE,
  MS_PER_YEAR,
  utcDate,
} from '../telemetry';

const COMPACT_PRECISION = 8;

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
