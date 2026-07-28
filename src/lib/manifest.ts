import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Counts read out of this repository's manifests at build time.
 *
 * The sibling of `src/lib/loc.ts`, and for the same reason: `/stats` used to
 * assert `Number of linter warnings: 0` from a string literal with the comment
 * "enforced via github workflow" beside it. A page whose entire premise is
 * measurement cannot carry a figure nobody re-checks, so the dependency and
 * lint-rule figures are taken from `package.json`, `package-lock.json`, and
 * `biome.json` on every build.
 *
 * Every function returns `null` rather than a guess when its manifest is
 * missing or unreadable — a fork that installs with pnpm has no
 * `package-lock.json`, and dropping that one row is honest where inventing a
 * number is not. `resolveReadings` omits rows whose measurement is `null`.
 *
 * Server-only: these read the filesystem and must not be imported into a
 * client component.
 */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readJsonObject(path: string): Record<string, unknown> | null {
  if (!existsSync(path)) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(readFileSync(path, 'utf8'));
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function countKeys(value: unknown): number {
  return isRecord(value) ? Object.keys(value).length : 0;
}

/**
 * Packages this repository names itself, runtime and tooling together.
 *
 * This is the figure a forker is actually asking for when they want to know
 * how much they are taking on: what the project chose, before resolution
 * pulls in everything those choices imply.
 */
export function countDirectDependencies(
  cwd: string = process.cwd(),
): number | null {
  const manifest = readJsonObject(join(cwd, 'package.json'));

  if (!manifest) {
    return null;
  }

  return countKeys(manifest.dependencies) + countKeys(manifest.devDependencies);
}

export interface LockedPackageCounts {
  /**
   * Packages reachable from `dependencies` on any platform, so what a
   * production install actually contains.
   */
  production: number;
  /**
   * Every package the lockfile resolves — production, tooling, and the
   * platform-specific binaries only one machine ever installs.
   */
  total: number;
}

/**
 * Counts from `package-lock.json`.
 *
 * npm marks a package `dev` when it is only reachable through
 * `devDependencies`, `devOptional` when it is reachable both ways, and
 * `optional` for the per-platform binaries (`@next/swc-*`, `sharp`'s
 * prebuilds) where a given install takes one and skips the rest. The
 * production figure excludes all three: counting every platform's binary
 * would report a tree no machine has.
 */
export function countLockedPackages(
  cwd: string = process.cwd(),
): LockedPackageCounts | null {
  const lockfile = readJsonObject(join(cwd, 'package-lock.json'));

  if (!lockfile || !isRecord(lockfile.packages)) {
    return null;
  }

  let production = 0;
  let total = 0;

  for (const [path, entry] of Object.entries(lockfile.packages)) {
    // The empty key is the root project, not a dependency of it.
    if (path === '') {
      continue;
    }

    total += 1;

    if (!isRecord(entry)) {
      continue;
    }

    if (
      entry.dev === true ||
      entry.devOptional === true ||
      entry.optional === true
    ) {
      continue;
    }

    production += 1;
  }

  return { production, total };
}

function collectEnabledRules(linter: unknown, into: Set<string>): void {
  if (!isRecord(linter) || !isRecord(linter.rules)) {
    return;
  }

  for (const [group, groupRules] of Object.entries(linter.rules)) {
    // `rules.preset` is a string, not a group of rules. `"style": "error"`
    // group shorthand is likewise not a rule list; this config does not use
    // it, and skipping it undercounts rather than inventing names.
    if (!isRecord(groupRules)) {
      continue;
    }

    for (const [rule, severity] of Object.entries(groupRules)) {
      const off =
        severity === 'off' || (isRecord(severity) && severity.level === 'off');

      if (!off) {
        into.add(`${group}/${rule}`);
      }
    }
  }
}

/**
 * Lint rules this repository turns on, counted from `biome.json`.
 *
 * The preset is `"none"`, so every rule is opted into by name and the count is
 * meaningful rather than a property of whichever Biome release is installed.
 * Overrides are folded in as a union: the TypeScript override adds three rules
 * the base config does not enable, and a rule switched `off` for config files
 * is still enforced everywhere else, so it still counts.
 */
export function countLintRules(cwd: string = process.cwd()): number | null {
  const config = readJsonObject(join(cwd, 'biome.json'));

  if (!config) {
    return null;
  }

  const enabled = new Set<string>();
  collectEnabledRules(config.linter, enabled);

  if (Array.isArray(config.overrides)) {
    for (const override of config.overrides) {
      if (isRecord(override)) {
        collectEnabledRules(override.linter, enabled);
      }
    }
  }

  return enabled.size;
}
