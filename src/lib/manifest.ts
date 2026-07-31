import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Counts read out of this repository's manifests at build time.
 *
 * The sibling of `src/lib/loc.ts`, and for the same reason: `/stats` used to
 * assert `Number of linter warnings: 0` from a string literal with the comment
 * "enforced via github workflow" beside it. A page whose entire premise is
 * measurement cannot carry a figure nobody re-checks, so the dependency and
 * lint-rule figures are taken from `package.json`,
 * `node_modules/.package-lock.json`, `package-lock.json`, and `biome.json` on
 * every build.
 *
 * Every function returns `null` rather than a guess when its manifest is
 * missing or unreadable — a fork that installs with pnpm has neither npm
 * lockfile, and dropping the affected rows is honest where inventing numbers
 * is not. `resolveReadings` omits rows whose measurement is `null`.
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

/**
 * Non-development package locations present in this build's installed tree.
 *
 * npm's hidden lockfile describes the actual `node_modules` tree, so it
 * includes compatible optional packages for this build platform and excludes
 * incompatible binaries. Only `dev: true` entries are removed: npm documents
 * `devOptional` as a package that is also an optional dependency of a non-dev
 * dependency, so excluding it would undercount the non-development tree.
 */
export function countInstalledNonDevPackages(
  cwd: string = process.cwd(),
): number | null {
  const lockfile = readJsonObject(
    join(cwd, 'node_modules', '.package-lock.json'),
  );

  if (!lockfile || !isRecord(lockfile.packages)) {
    return null;
  }

  let count = 0;

  for (const [path, entry] of Object.entries(lockfile.packages)) {
    if (path === '' || !isRecord(entry) || entry.dev === true) {
      continue;
    }

    count += 1;
  }

  return count;
}

/**
 * Every package location resolved in `package-lock.json`.
 *
 * This deliberately makes no claim about what one machine installs: the
 * lockfile includes tooling and mutually exclusive platform binaries.
 */
export function countLockedPackages(
  cwd: string = process.cwd(),
): number | null {
  const lockfile = readJsonObject(join(cwd, 'package-lock.json'));

  if (!lockfile || !isRecord(lockfile.packages)) {
    return null;
  }

  return Object.keys(lockfile.packages).filter((path) => path !== '').length;
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
