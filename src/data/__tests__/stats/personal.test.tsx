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
    // Age value is a React element
    expect(ageStat!.value).toBeDefined();
  });

  it('has a countries visited stat', () => {
    const countriesStat = data.find((s) => s.key === 'countries');

    expect(countriesStat).toBeDefined();
    expect(countriesStat!.label).toBe('Countries visited');
    expect(countriesStat!.value).toBe(53);
    expect(countriesStat!.link).toContain('google.com/maps');
  });

  it('has a current location stat', () => {
    const locationStat = data.find((s) => s.key === 'location');

    expect(locationStat).toBeDefined();
    expect(locationStat!.label).toBe('Current city');
    expect(locationStat!.value).toBe('New York, NY');
  });

  it('Age component renders and updates', () => {
    const ageStat = data.find((s) => s.key === 'age');
    const AgeComponent = () => <>{ageStat!.value}</>;

    render(<AgeComponent />);

    // Advance timer to trigger age calculation
    act(() => {
      vi.advanceTimersByTime(50);
    });

    // The age should be a number with decimal places
    const textContent = document.body.textContent || '';
    expect(textContent).toMatch(/\d+\.\d+/);
  });
});
