import { createElement, isValidElement } from 'react';
import { describe, expect, it, vi } from 'vitest';

import {
  captionFor,
  formatReading,
  groupBySource,
  type Reading,
  type ReadingSource,
  resolveReadings,
  SOURCE_CAPTIONS,
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

  it('appends a unit when one is given', () => {
    expect(formatReading(301, 'packages')).toBe('301 packages');
  });
});

describe('SOURCE_CAPTIONS', () => {
  it('names all three kinds of claim the page makes', () => {
    // The words a reader is given for each source, so they are pinned as
    // written. Each says how the readings were come by, not just from where:
    // a GitHub count is as old as the build, and says so.
    expect(SOURCE_CAPTIONS).toEqual({
      measured: 'Measured from this build’s checkout',
      github: 'From GitHub, fetched at build time',
      profile: 'From my profile',
    });
  });
});

describe('captionFor', () => {
  it('captions a source with its own words', () => {
    expect(captionFor('profile')).toBe('From my profile');
  });

  it('claims no source for readings that declare none', () => {
    // The spoon count measures nothing. A caption borrowed from a real source
    // would say that it had been counted.
    expect(captionFor(undefined)).toBe('Not measured');
  });
});

describe('groupBySource', () => {
  const reading = (label: string, source?: ReadingSource): Reading => ({
    label,
    value: '1',
    source,
  });

  const shape = (readings: Reading[]) =>
    groupBySource(readings).map((group) => [
      group.source,
      group.readings.map((row) => row.label),
    ]);

  it('gathers readings under the source they declare', () => {
    expect(
      shape([
        reading('Stars', 'github'),
        reading('Forks', 'github'),
        reading('Lines', 'measured'),
      ]),
    ).toEqual([
      ['github', ['Stars', 'Forks']],
      ['measured', ['Lines']],
    ]);
  });

  it('gives a reading declared out of sequence to the table it belongs in', () => {
    // Grouping by run would open a second GitHub table under the same
    // caption, which is the repetition the captions replaced.
    expect(
      shape([
        reading('Stars', 'github'),
        reading('Lines', 'measured'),
        reading('Forks', 'github'),
      ]),
    ).toEqual([
      ['github', ['Stars', 'Forks']],
      ['measured', ['Lines']],
    ]);
  });

  it('sets apart the readings that declare no source', () => {
    expect(
      shape([reading('Lines', 'measured'), reading('Number of spoons')]),
    ).toEqual([
      ['measured', ['Lines']],
      [undefined, ['Number of spoons']],
    ]);
  });

  it('carries each reading through whole', () => {
    const linked: Reading = {
      label: 'Stars',
      value: '1,663',
      link: 'https://example.com',
      source: 'github',
    };

    expect(groupBySource([linked])[0].readings[0]).toBe(linked);
  });

  it('makes no table out of no readings', () => {
    expect(groupBySource([])).toEqual([]);
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

  it('accepts an element as the measurement for a keyed row', () => {
    // The age and the build clock are readings whose current value only a
    // browser can take, so the server supplies the client leaf that carries
    // them rather than a string. A declaration that names the key and no value
    // is what keeps the element out of the data file.
    const element = createElement('span', null, '36.42');
    const declarations: StatDeclaration[] = [
      { key: 'age', label: 'Current age', source: 'profile' },
    ];

    const [reading] = resolveReadings(declarations, { age: element });

    expect(reading.value).toBe(element);
  });

  it('derives a link from the reading when the declaration asks it to', () => {
    // The build commit is the one row whose link target is its own value.
    const declarations: StatDeclaration[] = [
      {
        key: 'built_commit',
        label: 'Built from commit',
        format: (value) => String(value).slice(0, 7),
        link: (value) => `https://example.com/commit/${value}`,
      },
    ];

    const [reading] = resolveReadings(declarations, {
      built_commit: 'abcdef1234567890',
    });

    expect(reading.value).toBe('abcdef1');
    expect(reading.link).toBe('https://example.com/commit/abcdef1234567890');
  });

  it('never calls a link function for a row it is about to drop', () => {
    // Off CI there is no commit, so there is nothing to link to either.
    const link = vi.fn(() => 'https://example.com');
    const declarations: StatDeclaration[] = [
      { key: 'built_commit', label: 'Built from commit', link },
    ];

    expect(resolveReadings(declarations, { built_commit: null })).toEqual([]);
    expect(link).not.toHaveBeenCalled();
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
