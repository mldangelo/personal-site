import { createElement, isValidElement } from 'react';
import { describe, expect, it } from 'vitest';

import {
  formatReading,
  resolveReadings,
  type StatDeclaration,
} from '../readings';

describe('formatReading', () => {
  it('separates thousands so magnitude reads at a glance', () => {
    // `5411` shipped unformatted next to `53` in an identical mono cell, which
    // made the two typographically interchangeable. These literals also pin
    // the locale: a build host set to de-DE publishes `5.411`, so an
    // unpinned `toLocaleString()` fails here rather than silently shipping.
    expect(formatReading(5411)).toBe('5,411');
    expect(formatReading(1663)).toBe('1,663');
  });

  it('leaves small counts alone', () => {
    expect(formatReading(53)).toBe('53');
    expect(formatReading(0)).toBe('0');
  });
});

describe('resolveReadings', () => {
  it('fills a keyed row from the measurements for this build', () => {
    const declarations: StatDeclaration[] = [
      { key: 'source_lines', label: 'Lines', link: 'https://example.com' },
    ];

    expect(resolveReadings(declarations, { source_lines: 5411 })).toEqual([
      { label: 'Lines', value: '5,411', link: 'https://example.com' },
    ]);
  });

  it('drops a row whose measurement could not be taken', () => {
    // A reading that could not be taken leaves one fewer row, not a wrong one.
    const declarations: StatDeclaration[] = [
      { key: 'missing', label: 'Missing' },
      { key: 'lines', label: 'Lines' },
    ];

    const readings = resolveReadings(declarations, {
      missing: null,
      lines: 12,
    });

    expect(readings.map((reading) => reading.label)).toEqual(['Lines']);
  });

  it('formats a literal value the same way as a measured one', () => {
    const declarations: StatDeclaration[] = [
      { label: 'Number of spoons', value: 0 },
    ];

    expect(resolveReadings(declarations)[0].value).toBe('0');
  });

  it('passes a string measurement through as written', () => {
    // A floor such as "1,695+" is already formatted by whoever took it.
    const declarations: StatDeclaration[] = [{ key: 'stars', label: 'Stars' }];

    expect(resolveReadings(declarations, { stars: '1,695+' })[0].value).toBe(
      '1,695+',
    );
  });

  it('passes a React element through untouched', () => {
    const element = createElement('span', null, 'live');
    const declarations: StatDeclaration[] = [
      { key: 'age', label: 'Current age', value: element },
    ];

    const [reading] = resolveReadings(declarations);

    expect(isValidElement(reading.value)).toBe(true);
    expect(reading.value).toBe(element);
  });

  it('accepts an element as the measurement for a keyed row', () => {
    // The age is a reading whose current value only a browser can take, so the
    // server supplies the client leaf that carries it rather than a string. A
    // declaration that names the key and no value is what keeps the element
    // out of the data file.
    const element = createElement('span', null, '36.42');
    const declarations: StatDeclaration[] = [
      { key: 'age', label: 'Current age' },
    ];

    const [reading] = resolveReadings(declarations, { age: element });

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
});
