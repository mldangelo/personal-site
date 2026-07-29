import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join, posix } from 'node:path';
import { describe, expect, it } from 'vitest';

import profile from '@/data/profile.json';
import { readColorToken } from '@/lib/tokens';

/**
 * Keeps the committed icon set bound to the inputs that produced it, the way
 * `check-og.mjs` keeps the share card bound to its own.
 *
 * The set this replaced was generated once by an online tool and then went
 * stale in place: it still carried `#2e59ba` long after the palette moved to
 * `#1b2fbf`, and nothing anywhere noticed. These assertions are what makes
 * that a failing test rather than a thing someone eventually spots.
 */

const root = process.cwd();
const META_PATH = join(root, 'scripts', 'icons.meta.json');

type IconsMeta = {
  inputs: {
    accent: string;
    onAccent: string;
    backgroundLight: string;
    backgroundDark: string;
    monogram: string;
    name: string;
  };
  generatorDigest: string;
  files: Record<string, string>;
};

const meta: IconsMeta = JSON.parse(readFileSync(META_PATH, 'utf8'));

const STALE =
  'Run `npm run icons` and commit the regenerated icon set plus scripts/icons.meta.json.';

/** Width and height from a PNG's IHDR chunk, which is always first. */
function pngSize(bytes: Buffer): { width: number; height: number } {
  expect(bytes.readUInt32BE(0)).toBe(0x89504e47);
  expect(bytes.toString('ascii', 12, 16)).toBe('IHDR');

  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

describe('generated icon set', () => {
  it('records the accent the palette currently declares', () => {
    expect(meta.inputs.accent).toBe(readColorToken('--color-accent', 'light'));
    expect(meta.inputs.onAccent).toBe(
      readColorToken('--color-on-accent', 'light'),
    );
  });

  it('records the page background both themes currently declare', () => {
    expect(meta.inputs.backgroundLight).toBe(
      readColorToken('--color-bg-alt', 'light'),
    );
    expect(meta.inputs.backgroundDark).toBe(
      readColorToken('--color-bg-alt', 'dark'),
    );
  });

  it('derives the monogram from the profile name rather than hardcoding it', () => {
    expect(meta.inputs.name).toBe(profile.name);
    expect(meta.inputs.monogram).toBe(
      profile.name
        .split(/[\s'’-]+/)
        .filter(Boolean)
        .map((word) => word[0].toUpperCase())
        .slice(0, 2)
        .join(''),
    );
  });

  it('was produced by the committed generator', () => {
    const source = readFileSync(
      join(root, 'scripts', 'generate-icons.mjs'),
      'utf8',
    );
    const digest = createHash('sha256')
      .update(source)
      .update('\0')
      .update(JSON.stringify(meta.inputs))
      .digest('hex');

    expect(digest, STALE).toBe(meta.generatorDigest);
  });

  it.each(Object.keys(meta.files))('has not been hand-edited: %s', (path) => {
    const digest = createHash('sha256')
      .update(readFileSync(join(root, path)))
      .digest('hex');

    expect(digest, STALE).toBe(meta.files[path]);
  });

  /**
   * The ledger is committed, so its keys have to mean the same thing on every
   * platform `npm run icons` might be run from. They are forward-slash literals
   * in the generator today; deriving one with `join` instead would write
   * backslashed keys from a Windows regeneration, and the committed file would
   * then resolve to nothing everywhere else.
   */
  it('keys the ledger by forward-slash path on every platform', () => {
    for (const path of Object.keys(meta.files)) {
      expect(path).not.toContain('\\');
      expect(path).toBe(posix.normalize(path));
    }
  });

  /**
   * Next reads these dimensions off the files themselves and puts them in the
   * `sizes` attribute of the `<link>` tags it emits, so the wrong size here is
   * a wrong promise in every page's `<head>`.
   */
  it.each([
    ['app/icon.png', 96],
    ['app/apple-icon.png', 180],
    ['public/images/icons/icon-192.png', 192],
    ['public/images/icons/icon-512.png', 512],
    ['public/images/icons/icon-maskable-512.png', 512],
  ])('emits %s as a square %ipx png', (path, size) => {
    expect(pngSize(readFileSync(join(root, path)))).toEqual({
      width: size,
      height: size,
    });
  });

  /**
   * `/favicon.ico` is fetched by convention with no HTML reference, so a
   * malformed container fails silently in exactly the place nobody looks.
   */
  it('packs favicon.ico as two png entries at 16 and 32', () => {
    const ico = readFileSync(join(root, 'app', 'favicon.ico'));

    expect(ico.readUInt16LE(0)).toBe(0); // reserved
    expect(ico.readUInt16LE(2)).toBe(1); // type: icon
    expect(ico.readUInt16LE(4)).toBe(2);

    const entries = [0, 1].map((index) => {
      const at = 6 + index * 16;
      const length = ico.readUInt32LE(at + 8);
      const offset = ico.readUInt32LE(at + 12);

      return {
        declared: ico[at],
        image: ico.subarray(offset, offset + length),
      };
    });

    expect(entries.map((entry) => entry.declared)).toEqual([16, 32]);

    for (const entry of entries) {
      const { width, height } = pngSize(entry.image);
      expect(width).toBe(entry.declared);
      expect(height).toBe(entry.declared);
    }
  });
});

describe('generated web app manifest', () => {
  const manifest = JSON.parse(
    readFileSync(join(root, 'app', 'manifest.json'), 'utf8'),
  );

  it('carries the current light page background as its theme colour', () => {
    expect(manifest.theme_color).toBe(
      readColorToken('--color-bg-alt', 'light'),
    );
    expect(manifest.background_color).toBe(manifest.theme_color);
  });

  it('names the site from the shared profile', () => {
    expect(manifest.name).toBe(profile.name);
    expect(manifest.short_name).toBe(meta.inputs.monogram);
  });

  /**
   * Every `src` is relative to the manifest's own url, so a fork served under
   * a repository basePath resolves them without the generator knowing the
   * prefix. A leading slash — which is what the deleted manifest used — breaks
   * that. The paths also have to name files that exist, since the deleted
   * manifest's did not once the art moved.
   *
   * Both sides of the containment check are url-shaped strings, so the key is
   * built with `posix.join` rather than `join`. `join` is `win32.join` on
   * Windows and normalises the separators to backslashes, which would miss a
   * ledger key that is correct — a red test against a green manifest, on the
   * one platform this repository's contributors are least likely to be able to
   * reproduce.
   */
  it('points every icon at a committed file by relative path', () => {
    expect(manifest.icons.length).toBeGreaterThan(0);

    for (const icon of manifest.icons) {
      expect(icon.src.startsWith('/')).toBe(false);
      expect(icon.src.startsWith('http')).toBe(false);
      expect(Object.keys(meta.files)).toContain(posix.join('public', icon.src));
    }
  });

  it('offers a maskable icon so android does not badge the mark', () => {
    expect(
      manifest.icons.some((icon: { purpose?: string }) =>
        icon.purpose?.split(' ').includes('maskable'),
      ),
    ).toBe(true);
  });
});
