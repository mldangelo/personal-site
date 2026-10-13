import { isValidElement, type ReactElement } from 'react';

/**
 * Where a reading on `/stats` came from.
 *
 * The page mixes three very different kinds of claim, and it used to render
 * them identically: a count taken from the working tree at build time, a
 * number fetched from the GitHub API, and a fact typed into
 * `src/data/profile.json`. They are not equally trustworthy and they do not
 * go stale the same way, so every reading declares which it is, and the page
 * sets the readings of one kind in one table under a caption that says so.
 */
export type ReadingSource = 'measured' | 'github' | 'profile';

/**
 * The caption over each table of readings.
 *
 * A tag used to repeat this under every row: three rows about me, three tags
 * reading "Profile". The source is said once now, above the rows it covers.
 */
export const SOURCE_CAPTIONS: Record<ReadingSource, string> = {
  measured: 'Measured from this build’s checkout',
  github: 'From GitHub, fetched at build time',
  profile: 'From my profile',
};

/**
 * The caption over readings that declare no source. A row that measures
 * nothing cannot sit under any caption above without claiming that it did.
 */
export const UNSOURCED_CAPTION = 'Not measured';

/** What to call a group of readings, given where they came from. */
export function captionFor(source: ReadingSource | undefined): string {
  return source ? SOURCE_CAPTIONS[source] : UNSOURCED_CAPTION;
}

/**
 * A row as declared in `src/data/stats/*`.
 *
 * `key` names the measurement that fills the row. A measured site reading must
 * not also carry a `value`: the literal would hide a missing measurement and
 * could drift. Profile readings may use `key` with a maintained value so
 * callers can replace it deliberately; when both exist, the supplied
 * measurement wins.
 */
export interface StatDeclaration {
  key?: string;
  label: string;
  value?: ReactElement | number | string;
  /**
   * Where the value points. A function when the target depends on the
   * measurement — the build commit links to itself — so that every URL on
   * the page still lives in the declaration rather than in the component that
   * happens to take the reading.
   */
  link?: string | ((value: unknown) => string);
  source?: ReadingSource;
  /**
   * Appended after the formatted count, and only where it tells the reader
   * something the label does not. `53 countries` beside `Countries visited`
   * is noise; `29 packages` beside `Direct dependencies` is useful.
   */
  unit?: string;
  format?: (value: unknown) => string | ReactElement;
}

/** A row resolved for rendering: no functions, no unresolved keys. */
export interface Reading {
  label: string;
  value: ReactElement | string;
  link?: string;
  source?: ReadingSource;
}

/**
 * A value supplied for a keyed row by whoever took the reading.
 *
 * An element is a measurement too: the server supplies the live-age client
 * leaf for the keyed age row rather than storing React in the data module.
 */
export type Measurement = ReactElement | number | string | null | undefined;

/**
 * A count, formatted so it reads as an instrument rather than as a digit soup.
 *
 * `5411` and `53` were typographically interchangeable in an identical
 * `--text-2xl` mono cell. A thousands separator restores the magnitude at a
 * glance, and the locale is pinned so the figure the site publishes cannot
 * depend on the locale of whichever machine ran the build.
 */
export function formatReading(count: number, unit?: string): string {
  const formatted = count.toLocaleString('en-US');

  return unit ? `${formatted} ${unit}` : formatted;
}

function resolveValue(
  raw: NonNullable<Measurement>,
  unit?: string,
  format?: (value: unknown) => string | ReactElement,
): ReactElement | string {
  if (format) {
    return format(raw);
  }

  if (typeof raw === 'number') {
    return formatReading(raw, unit);
  }

  if (isValidElement(raw)) {
    return raw;
  }

  return String(raw);
}

/**
 * Resolve declared rows against the measurements taken for this build.
 *
 * This lived inline in `src/components/Stats/Site.tsx`, which meant the
 * personal table went through a different path and had no provenance at all.
 * Both sections resolve here now, so a source only has to be described once.
 *
 * A measurement of `null` drops its row rather than printing a placeholder:
 * a fork with no lockfile should show one fewer reading, not a wrong one.
 */
export function resolveReadings(
  declarations: readonly StatDeclaration[],
  measurements: Readonly<Record<string, Measurement>> = {},
): Reading[] {
  const readings: Reading[] = [];

  for (const declaration of declarations) {
    const raw =
      declaration.key && declaration.key in measurements
        ? measurements[declaration.key]
        : declaration.value;

    if (raw === null || raw === undefined) {
      continue;
    }

    readings.push({
      label: declaration.label,
      value: resolveValue(raw, declaration.unit, declaration.format),
      link:
        typeof declaration.link === 'function'
          ? declaration.link(raw)
          : declaration.link,
      source: declaration.source,
    });
  }

  return readings;
}

/** Readings that share a source, in the order they were declared. */
export interface ReadingGroup {
  /** Absent for readings that declare no source. */
  source?: ReadingSource;
  readings: Reading[];
}

/**
 * Gather resolved readings by source, so each source is captioned once.
 *
 * Groups come out in the order their source first appears and rows keep their
 * declared order. Grouping by source rather than by run means a declaration
 * added out of sequence joins its own table instead of opening a second one
 * under the same caption.
 */
export function groupBySource(readings: readonly Reading[]): ReadingGroup[] {
  const groups = new Map<ReadingSource | undefined, Reading[]>();

  for (const reading of readings) {
    const group = groups.get(reading.source);

    if (group) {
      group.push(reading);
    } else {
      groups.set(reading.source, [reading]);
    }
  }

  return Array.from(groups, ([source, group]) => ({
    source,
    readings: group,
  }));
}
