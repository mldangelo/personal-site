import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  countDirectDependencies,
  countInstalledNonDevPackages,
  countLintRules,
  countLockedPackages,
} from '../manifest';

let root: string;

function write(name: string, contents: unknown) {
  const full = join(root, name);
  mkdirSync(join(full, '..'), { recursive: true });
  writeFileSync(
    full,
    typeof contents === 'string' ? contents : JSON.stringify(contents),
  );
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'manifest-'));
});

afterEach(() => {
  rmSync(root, { recursive: true, force: true });
});

describe('countDirectDependencies', () => {
  it('counts runtime and tooling dependencies together', () => {
    write('package.json', {
      dependencies: { next: '^16', react: '^19' },
      devDependencies: { vitest: '^4' },
    });

    expect(countDirectDependencies(root)).toBe(3);
  });

  it('counts zero when a manifest declares neither field', () => {
    write('package.json', { name: 'bare' });

    expect(countDirectDependencies(root)).toBe(0);
  });

  it('returns null rather than a guess when package.json is absent', () => {
    expect(countDirectDependencies(root)).toBeNull();
  });

  it('returns null rather than throwing on unparseable JSON', () => {
    write('package.json', '{ not json');

    expect(countDirectDependencies(root)).toBeNull();
  });

  it('reports a plausible figure for this repository', () => {
    expect(countDirectDependencies()).toBeGreaterThan(10);
  });
});

describe('countInstalledNonDevPackages', () => {
  it('counts the installed non-development tree for this build platform', () => {
    write('node_modules/.package-lock.json', {
      packages: {
        'node_modules/next': {},
        'node_modules/@next/swc-darwin-arm64': { optional: true },
        'node_modules/semver': { devOptional: true },
        'node_modules/vitest': { dev: true },
      },
    });

    expect(countInstalledNonDevPackages(root)).toBe(3);
  });

  it('does not count the root project as a dependency of itself', () => {
    write('node_modules/.package-lock.json', {
      packages: { '': { name: 'root' } },
    });

    expect(countInstalledNonDevPackages(root)).toBe(0);
  });

  it('returns null when npm has no installed-tree lockfile', () => {
    expect(countInstalledNonDevPackages(root)).toBeNull();
  });

  it('reports a plausible figure for this build', () => {
    expect(countInstalledNonDevPackages()).toBeGreaterThan(10);
  });
});

describe('countLockedPackages', () => {
  it('counts every package location resolved in the lockfile', () => {
    write('package-lock.json', {
      packages: {
        '': { name: 'root' },
        'node_modules/next': {},
        'node_modules/react': {},
        'node_modules/vitest': { dev: true },
      },
    });

    expect(countLockedPackages(root)).toBe(3);
  });

  it('does not count the root project as a dependency of itself', () => {
    write('package-lock.json', { packages: { '': { name: 'root' } } });

    expect(countLockedPackages(root)).toBe(0);
  });

  it('includes every platform variant because this is a lockfile count', () => {
    write('package-lock.json', {
      packages: {
        '': {},
        'node_modules/next': {},
        'node_modules/@next/swc-darwin-arm64': { optional: true },
        'node_modules/@next/swc-linux-x64-gnu': { optional: true },
        'node_modules/both-ways': { devOptional: true },
      },
    });

    expect(countLockedPackages(root)).toBe(4);
  });

  it('returns null when there is no lockfile to read', () => {
    // A fork that installs with pnpm has none; that row is dropped rather
    // than filled in with a number from somewhere else.
    expect(countLockedPackages(root)).toBeNull();
  });

  it('returns null when the lockfile has no packages map', () => {
    write('package-lock.json', { lockfileVersion: 1 });

    expect(countLockedPackages(root)).toBeNull();
  });

  it('reports plausible figures for this repository', () => {
    expect(countLockedPackages()).toBeGreaterThan(100);
  });
});

describe('countLintRules', () => {
  it('counts rules opted into by name', () => {
    write('biome.json', {
      linter: {
        rules: {
          preset: 'none',
          style: { useConst: 'error', noVar: 'warn' },
          suspicious: { noExplicitAny: 'error' },
        },
      },
    });

    expect(countLintRules(root)).toBe(3);
  });

  it('ignores rules switched off', () => {
    write('biome.json', {
      linter: {
        rules: {
          style: { useConst: 'error', useBlockStatements: 'off' },
          suspicious: { noVar: { level: 'off' } },
        },
      },
    });

    expect(countLintRules(root)).toBe(1);
  });

  it('folds overrides in as a union rather than double-counting', () => {
    // The TypeScript override adds rules the base config does not enable, and
    // a rule relaxed for config files is still enforced everywhere else.
    write('biome.json', {
      linter: { rules: { style: { useConst: 'error' } } },
      overrides: [
        { linter: { rules: { style: { useConst: 'error', noVar: 'error' } } } },
        { linter: { rules: { style: { useConst: 'off' } } } },
        { includes: ['*.css'] },
      ],
    });

    expect(countLintRules(root)).toBe(2);
  });

  it('returns null when biome.json is absent', () => {
    expect(countLintRules(root)).toBeNull();
  });

  it('reports a plausible figure for this repository', () => {
    // The preset is "none", so every rule is named and the count means
    // something rather than tracking whichever Biome release is installed.
    expect(countLintRules()).toBeGreaterThan(10);
  });
});
