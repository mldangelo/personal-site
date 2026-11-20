import { describe, expect, it } from 'vitest';

import profile from '@/data/profile.json';

import {
  AGE_MIN_INTERVAL,
  AGE_PRECISION_FULL,
  ageAt,
  ageIntervalFor,
  MS_PER_YEAR,
  utcDate,
} from '../telemetry';

const COMPACT_PRECISION = 8;

describe('ageAt', () => {
  const birthTime = new Date(profile.birthDate).getTime();

  it('honours the requested precision', () => {
    const now = birthTime + MS_PER_YEAR * 36.5;

    expect(ageAt(now, 0)).toBe('37');
  });
});

describe('ageIntervalFor', () => {
  it('matches the cadence to the displayed precision', () => {
    expect(ageIntervalFor(COMPACT_PRECISION)).toBeGreaterThan(300);
    expect(ageIntervalFor(COMPACT_PRECISION)).toBeLessThan(320);
  });

  it('never schedules faster than the minimum interval', () => {
    expect(ageIntervalFor(AGE_PRECISION_FULL)).toBe(AGE_MIN_INTERVAL);
  });
});

describe('utcDate', () => {
  it('does not depend on the build host timezone', () => {
    expect(utcDate(Date.UTC(2026, 6, 29, 0, 1))).toBe('2026-07-29');
  });
});
