import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, it } from 'vitest';

interface LockEntry {
  inBundle?: boolean;
  integrity?: string;
  link?: boolean;
  resolved?: string;
}

// Without a hash, `npm ci` installs whatever the registry or a proxy serves
// under that name and version.
it('pins every installed package to its tarball and hash', () => {
  const { packages } = JSON.parse(
    readFileSync(resolve(process.cwd(), 'package-lock.json'), 'utf8'),
  ) as { packages: Record<string, LockEntry> };

  const unpinned = Object.entries(packages)
    .filter(
      ([path, entry]) =>
        path !== '' &&
        !entry.link &&
        !entry.inBundle &&
        !(entry.resolved && entry.integrity),
    )
    .map(([path]) => path);

  expect(unpinned).toEqual([]);
});
