import { isValidElement, type ReactElement } from 'react';

/**
 * Where a reading on `/stats` came from.
 *
 * The page mixes three very different kinds of claim, and it used to render
 * them identically: a count taken from the working tree at build time, a
 * number fetched from the GitHub API, and a fact typed into
 * `src/data/profile.json`. They are not equally trustworthy and they do not
 * go stale the same way, so every row says which it is.
 */
export type ReadingSource = 'measured' | 'github' | 'profile';

/** The gutter mark shown for each source. */
export const SOURCE_LABELS: Record<ReadingSource, string> = {
  measured: 'Measured',
  github: 'GitHub',
  profile: 'Profile',
};

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
   * is noise; `29 packages` beside `Dependencies declared directly` is useful.
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
 * Both tables resolve here now, so a source only has to be described once.
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
