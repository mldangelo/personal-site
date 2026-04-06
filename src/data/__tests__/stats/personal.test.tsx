import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import data from '../../stats/personal';

describe('personal stats data', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('exports an array of stats', () => {
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it('each stat has required properties', () => {
    for (const stat of data) {
      expect(stat).toHaveProperty('key');
      expect(stat).toHaveProperty('label');
      expect(typeof stat.label).toBe('string');
    }
  });

  it('has an age stat with a React component', () => {
    const ageStat = data.find((s) => s.key === 'age');

    expect(ageStat).toBeDefined();
    expect(ageStat!.label).toBe('Current age');
    expect(ageStat!.value).toBeDefined();
  });

  it('has a countries visited stat without a link', () => {
    const countriesStat = data.find((s) => s.key === 'countries');

    expect(countriesStat).toBeDefined();
    expect(countriesStat!.label).toBe('Countries visited');
    expect(countriesStat!.value).toBe(0);
    expect(countriesStat!.link).toBeUndefined();
  });

  it('has a current location stat', () => {
    const locationStat = data.find((s) => s.key === 'location');

    expect(locationStat).toBeDefined();
    expect(locationStat!.label).toBe('Current city');
    expect(locationStat!.value).toBe('—');
  });

  it('Age component renders and updates', () => {
    const ageStat = data.find((s) => s.key === 'age');
    const AgeComponent = () => <>{ageStat!.value}</>;

    render(<AgeComponent />);

    act(() => {
      vi.advanceTimersByTime(50);
    });

    const textContent = document.body.textContent || '';
    expect(textContent).toMatch(/\d+\.\d+/);
  });
});
