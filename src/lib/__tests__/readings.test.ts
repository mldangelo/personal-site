import { createElement, isValidElement } from 'react';
import { describe, expect, it } from 'vitest';

import {
  formatReading,
  resolveReadings,
  SOURCE_LABELS,
  type StatDeclaration,
} from '../readings';

describe('formatReading', () => {
  it('separates thousands so magnitude reads at a glance', () => {
    // `5411` shipped unformatted next to `53` in an identical mono cell, which
    // made the two typographically interchangeable.
    expect(formatReading(5411)).toBe('5,411');
    expect(formatReading(1663)).toBe('1,663');
  });

  it('leaves small counts alone', () => {
    expect(formatReading(53)).toBe('53');
    expect(formatReading(0)).toBe('0');
  });

  it('appends a unit when one is given', () => {
    expect(formatReading(301, 'packages')).toBe('301 packages');
  });

  it('pins the locale so the published figure cannot follow the build host', () => {
    // A build machine set to de-DE would otherwise publish "5.411".
    expect(formatReading(5411)).toBe((5411).toLocaleString('en-US'));
    expect(formatReading(5411)).not.toContain('.');
  });
});

describe('SOURCE_LABELS', () => {
  it('names all three kinds of claim the page makes', () => {
    expect(SOURCE_LABELS).toEqual({
      measured: 'Measured',
      github: 'GitHub',
      profile: 'Profile',
    });
  });
});

describe('resolveReadings', () => {
  it('fills a keyed row from the measurements for this build', () => {
    const declarations: StatDeclaration[] = [
      { key: 'source_lines', label: 'Lines', source: 'measured' },
    ];

    expect(resolveReadings(declarations, { source_lines: 5411 })).toEqual([
      { label: 'Lines', value: '5,411', link: undefined, source: 'measured' },
    ]);
  });

  it('appends the declared unit to a measured count', () => {
    const declarations: StatDeclaration[] = [
      { key: 'locked', label: 'Resolved', unit: 'packages' },
    ];

    expect(resolveReadings(declarations, { locked: 301 })[0].value).toBe(
      '301 packages',
    );
  });

  it('drops a row whose measurement could not be taken', () => {
    // A fork with no lockfile shows one fewer reading rather than a wrong one.
    const declarations: StatDeclaration[] = [
      { key: 'locked', label: 'Resolved' },
      { key: 'lines', label: 'Lines' },
    ];

    const readings = resolveReadings(declarations, { locked: null, lines: 12 });

    expect(readings.map((reading) => reading.label)).toEqual(['Lines']);
  });

  it('formats a literal value the same way as a measured one', () => {
    const declarations: StatDeclaration[] = [
      { label: 'Number of spoons', value: 0 },
    ];

    expect(resolveReadings(declarations)[0].value).toBe('0');
  });

  it('applies a declared format function instead of the count formatting', () => {
    const declarations: StatDeclaration[] = [
      {
        key: 'pushed_at',
        label: 'Last updated at',
        format: (value) => `on ${String(value)}`,
      },
    ];

    expect(
      resolveReadings(declarations, { pushed_at: '2026-07-25' })[0].value,
    ).toBe('on 2026-07-25');
  });

  it('passes a React element through untouched', () => {
    const element = createElement('span', null, 'live');
    const declarations: StatDeclaration[] = [
      { key: 'age', label: 'Current age', value: element, source: 'profile' },
    ];

    const [reading] = resolveReadings(declarations);

    expect(isValidElement(reading.value)).toBe(true);
    expect(reading.value).toBe(element);
  });

  it('prefers the measurement over a declared value when both exist', () => {
    // The guard against the failure this whole module exists for: a stale
    // literal must never beat the number counted at build time.
    const declarations: StatDeclaration[] = [
      { key: 'lines', label: 'Lines', value: 2272 },
    ];

    expect(resolveReadings(declarations, { lines: 5411 })[0].value).toBe(
      '5,411',
    );
  });

  it('carries the link and source onto the resolved row', () => {
    const declarations: StatDeclaration[] = [
      {
        key: 'stargazers_count',
        label: 'Stars',
        source: 'github',
        link: 'https://example.com',
      },
    ];

    expect(resolveReadings(declarations, { stargazers_count: 1663 })).toEqual([
      {
        label: 'Stars',
        value: '1,663',
        link: 'https://example.com',
        source: 'github',
      },
    ]);
  });

  it('leaves a row with no source unmarked', () => {
    expect(resolveReadings([{ label: 'Joke', value: 0 }])[0].source).toBe(
      undefined,
    );
  });
});
