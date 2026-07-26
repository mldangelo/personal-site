import { describe, expect, it } from 'vitest';

import {
  AGE_MIN_INTERVAL,
  AGE_PRECISION_FULL,
  AGE_PRECISION_HERO,
  ageAt,
  ageIntervalFor,
  agePlaceholder,
  BIRTH_DATE,
  MS_PER_YEAR,
} from '../telemetry';

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
    expect(ageAt(now, AGE_PRECISION_HERO).split('.')[1]).toHaveLength(
      AGE_PRECISION_HERO,
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
    expect(ageIntervalFor(AGE_PRECISION_HERO)).toBeGreaterThan(300);
    expect(ageIntervalFor(AGE_PRECISION_HERO)).toBeLessThan(320);
  });

  it('never schedules faster than the minimum interval', () => {
    expect(ageIntervalFor(AGE_PRECISION_FULL)).toBe(AGE_MIN_INTERVAL);
    expect(ageIntervalFor(20)).toBe(AGE_MIN_INTERVAL);
  });
});

describe('agePlaceholder', () => {
  it('matches the width of a real reading so the layout cannot shift', () => {
    const birthTime = new Date(BIRTH_DATE).getTime();
    const reading = ageAt(birthTime + MS_PER_YEAR * 36, AGE_PRECISION_HERO);

    expect(agePlaceholder(AGE_PRECISION_HERO)).toHaveLength(reading.length);
  });

  it('contains no digits, so it cannot be mistaken for a value', () => {
    expect(agePlaceholder(AGE_PRECISION_FULL)).not.toMatch(/\d/);
  });
});
