import { isValidElement, type ReactElement } from 'react';

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
  /** Where the value points. */
  link?: string;
}

/** A row resolved for rendering: no unresolved keys. */
export interface Reading {
  label: string;
  value: ReactElement | string;
  link?: string;
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
export function formatReading(count: number): string {
  return count.toLocaleString('en-US');
}

function resolveValue(raw: NonNullable<Measurement>): ReactElement | string {
  if (typeof raw === 'number') {
    return formatReading(raw);
  }

  if (isValidElement(raw)) {
    return raw;
  }

  return String(raw);
}

/**
 * Resolve declared rows against the measurements taken for this build.
 *
 * Both sections resolve here, so a count is formatted the same way in each.
 * A measurement of `null` drops its row rather than printing a placeholder:
 * a reading that could not be taken should leave one fewer row, not a wrong
 * one.
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
      value: resolveValue(raw),
      link: declaration.link,
    });
  }

  return readings;
}
