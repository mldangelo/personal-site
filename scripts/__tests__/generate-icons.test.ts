import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join, posix } from 'node:path';
import { describe, expect, it } from 'vitest';
import profile from '@/data/profile.json';
import { readColorToken } from '@/lib/tokens';
import { readImageRenderer } from '../lib/image-renderer.mjs';

/**
 * Keeps the committed icon set bound to the inputs that produced it, the way
 * `check-og.mjs` keeps the share card bound to its own, so stale art is a
 * failing test.
 */

const root = process.cwd();
const meta = JSON.parse(
  readFileSync(join(root, 'scripts', 'icons.meta.json'), 'utf8'),
);

const GENERATED_FILES = [
  'app/apple-icon.png',
  'app/favicon.ico',
  'app/icon.png',
  'app/manifest.json',
  'public/images/icons/icon-192.png',
  'public/images/icons/icon-512.png',
  'public/images/icons/icon-maskable-512.png',
];

const STALE =
  'Run `npm run icons` and commit the regenerated icon set plus scripts/icons.meta.json.';

/** Width and height from a PNG's IHDR chunk, which is always first. */
function pngSize(bytes: Buffer): { width: number; height: number } {
  expect(bytes.readUInt32BE(0)).toBe(0x89504e47);
  expect(bytes.toString('ascii', 12, 16)).toBe('IHDR');

  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

describe('generated icon set', () => {
  it.each([
    ['accent', '--color-accent', 'light'],
    ['onAccent', '--color-on-accent', 'light'],
    ['backgroundLight', '--color-bg-alt', 'light'],
  ] as const)('records %s as the current %s in %s', (input, token, theme) => {
    expect(meta.inputs[input]).toBe(readColorToken(token, theme));
  });

  it('records the current profile name', () => {
    expect(meta.inputs.name).toBe(profile.name);
  });

  it('pins the exact supported font bytes used by the generator', () => {
    expect(meta.inputs.font).toMatchObject({
      name: 'Display',
      family: 'Inter',
      weight: 500,
      style: 'normal',
    });
    expect(meta.inputs.font.url).toMatch(
      /^https:\/\/fonts\.gstatic\.com\/s\/inter\/v\d+\/[^/]+\.ttf$/,
    );
    expect(meta.inputs.font.sha256).toMatch(/^[0-9a-f]{64}$/);
  });

  it('pins every locked package that produces the pixels', async () => {
    expect(meta.inputs.renderer, STALE).toEqual(await readImageRenderer(root));
  });

  it('was produced by the committed generator sources', () => {
    const digest = [
      'scripts/generate-icons.mjs',
      'scripts/lib/fonts.mjs',
      'scripts/lib/image-renderer.mjs',
      'src/lib/color-token.mjs',
    ]
      .reduce(
        (hash, path) =>
          hash
            .update(path)
            .update('\0')
            .update(readFileSync(join(root, path), 'utf8'))
            .update('\0'),
        createHash('sha256'),
      )
      .update(JSON.stringify(meta.inputs))
      .digest('hex');

    expect(digest, STALE).toBe(meta.generatorDigest);
  });

  it('tracks exactly the files this generator owns', () => {
    expect(Object.keys(meta.files).sort()).toEqual([...GENERATED_FILES].sort());
  });

  it('leaves no obsolete files in the manifest icon directory', () => {
    const expected = GENERATED_FILES.filter((path) =>
      path.startsWith('public/images/icons/'),
    )
      .map((path) => posix.basename(path))
      .sort();

    expect(
      readdirSync(join(root, 'public', 'images', 'icons')).sort(),
      'Remove obsolete files from public/images/icons when the generated set changes.',
    ).toEqual(expected);
  });

  it.each(GENERATED_FILES)('has not been hand-edited: %s', (path) => {
    const digest = createHash('sha256')
      .update(readFileSync(join(root, path)))
      .digest('hex');

    expect(digest, STALE).toBe(meta.files[path]);
  });

  // Next reads these dimensions off the files and puts them in the `sizes`
  // attribute of the `<link>` tags it emits on every page.
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

  // `/favicon.ico` is fetched by convention with no HTML reference, so nothing
  // else notices a malformed container.
  it('packs favicon.ico as two png entries at 16 and 32', () => {
    const ico = readFileSync(join(root, 'app', 'favicon.ico'));

    expect(ico.readUInt16LE(0)).toBe(0); // reserved
    expect(ico.readUInt16LE(2)).toBe(1); // type: icon
    expect(ico.readUInt16LE(4)).toBe(2);

    for (const [index, size] of [16, 32].entries()) {
      const at = 6 + index * 16;
      const length = ico.readUInt32LE(at + 8);
      const offset = ico.readUInt32LE(at + 12);

      expect(ico[at]).toBe(size);
      expect(pngSize(ico.subarray(offset, offset + length))).toEqual({
        width: size,
        height: size,
      });
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

  // Every `src` is relative to the manifest's own url, so a fork under a
  // repository basePath resolves them without the generator knowing the prefix.
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
