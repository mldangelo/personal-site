#!/usr/bin/env node
/**
 * Generates the site icon set and `app/manifest.json`.
 *
 * The mark is rendered from the live design tokens, so a change to `--color-accent` cannot leave the icons behind —
 * `scripts/__tests__/generate-icons.test.ts` fails when it does.
 *
 * Run with `npm run icons`. The output is committed, like `public/og.png`, so
 * builds stay deterministic and do not depend on Google Fonts being reachable
 * from CI. Regeneration downloads one exact, versioned TTF and rejects it
 * unless its bytes match the digest pinned in `scripts/lib/fonts.mjs`.
 *
 * What each output is for, and how it is reached:
 *   app/favicon.ico              /favicon.ico — linked by Next and also
 *                                requested directly by clients that do not
 *                                inspect the page's icon links.
 *   app/icon.png                 <link rel="icon" type="image/png"> for the
 *                                browser tab, emitted by Next's file
 *                                convention. Oversized on purpose so a 32px
 *                                tab slot stays crisp at 3x.
 *   app/apple-icon.png           <link rel="apple-touch-icon">, the iOS
 *                                home-screen icon.
 *   public/images/icons/*.png    Referenced only from the manifest, so they
 *                                are deliberately not <link>ed into every
 *                                page's <head>.
 *   app/manifest.json            Next's static manifest convention, which
 *                                emits <link rel="manifest"> itself.
 */
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { createElement as h } from 'react';

import { readColorToken } from '../src/lib/color-token.mjs';
import { DISPLAY_FONT, loadFont } from './lib/fonts.mjs';
import { readImageRenderer, requireSharp } from './lib/image-renderer.mjs';

// `next/og` ships as CommonJS with no ESM export condition, so it has to be
// required rather than imported.
const require = createRequire(import.meta.url);
const { ImageResponse } = require('next/og');
await requireSharp();

const root = process.cwd();
const MANIFEST_ICON_DIR = join(root, 'public', 'images', 'icons');
const META_OUTPUT = join(root, 'scripts', 'icons.meta.json');

/**
 * The monogram, derived from the profile name rather than typed in, so a fork
 * that changes the name gets its own initials.
 */
function monogramFor(name) {
  return name
    .split(/[\s'’-]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .slice(0, 2)
    .join('');
}

/**
 * The mark: the monogram in the display face on a flat accent square.
 *
 * Flat and square on purpose. The design system carries structure with
 * hairlines and near-square corners rather than float, and every platform
 * masks its own corners anyway — iOS rounds the touch icon, Android clips the
 * maskable one — so baking a radius in only fights them.
 *
 * `ratio` is the type size as a fraction of the tile. Small tiles need
 * proportionally larger type to stay legible, and the maskable variant needs
 * smaller type to stay inside Android's 80%-diameter safe circle.
 */
function mark(size, ratio, colors, monogram) {
  return h(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: colors.accent,
      },
    },
    h(
      'div',
      {
        style: {
          display: 'flex',
          fontFamily: DISPLAY_FONT.name,
          fontWeight: DISPLAY_FONT.weight,
          fontSize: Math.round(size * ratio),
          // No optical tracking. The share card tightens the big name to
          // -0.045em, but satori charges that to the layout box without
          // charging it symmetrically, which pushed the ink 1.6% right of
          // centre on a 512px tile. Two capitals do not need the correction.
          letterSpacing: '0',
          color: colors.onAccent,
        },
      },
      monogram,
    ),
  );
}

async function renderPng(size, ratio, colors, monogram, font) {
  const response = new ImageResponse(mark(size, ratio, colors, monogram), {
    width: size,
    height: size,
    fonts: [font],
  });

  return Buffer.from(await response.arrayBuffer());
}

/**
 * Packs PNGs into an ICO container.
 *
 * ~25 lines of header writing instead of a dependency. Every browser that
 * still asks for `/favicon.ico` reads PNG-compressed ICO entries; the format
 * only needs the directory to describe them.
 */
function packIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);

  const directory = Buffer.alloc(16 * entries.length);
  let offset = header.length + directory.length;

  entries.forEach(({ size, png }, index) => {
    const at = index * 16;
    // 0 means 256 in this field, which is why it is a single byte.
    directory[at] = size % 256;
    directory[at + 1] = size % 256;
    directory[at + 2] = 0; // palette entries
    directory[at + 3] = 0; // reserved
    directory.writeUInt16LE(1, at + 4); // colour planes
    directory.writeUInt16LE(32, at + 6); // bits per pixel
    directory.writeUInt32LE(png.length, at + 8);
    directory.writeUInt32LE(offset, at + 12);
    offset += png.length;
  });

  return Buffer.concat([header, directory, ...entries.map((e) => e.png)]);
}

const profile = JSON.parse(
  await readFile(join(root, 'src/data/profile.json'), 'utf8'),
);
const accent = readColorToken('--color-accent', 'light', root);
const onAccent = readColorToken('--color-on-accent', 'light', root);
const bgLight = readColorToken('--color-bg-alt', 'light', root);

const colors = { accent, onAccent };
const MONOGRAM = monogramFor(profile.name);

/**
 * Every raster the set needs, and the type size each one uses.
 *
 * The 16px entry drops to a single initial: two 800-weight capitals inside 16
 * pixels resolve to a smudge, and one legible letter beats two illegible ones.
 */
const RASTERS = [
  { size: 16, ratio: 0.78, text: MONOGRAM[0] },
  { size: 32, ratio: 0.5 },
  { size: 96, ratio: 0.46 },
  { size: 180, ratio: 0.46 },
  { size: 192, ratio: 0.46 },
  { size: 512, ratio: 0.46 },
  // Android guarantees a centered safe circle with a radius of 40% of the
  // tile. The smaller ratio keeps the complete monogram inside that circle.
  { size: 512, ratio: 0.38, key: 'maskable512' },
];

// Fetched before anything is rendered, so a changed font fails before any
// generated file is written.
const display = await loadFont(DISPLAY_FONT);

const rendered = new Map();
for (const { size, ratio, text, key } of RASTERS) {
  rendered.set(
    key ?? String(size),
    await renderPng(size, ratio, colors, text ?? MONOGRAM, display),
  );
}

const manifest = {
  name: profile.name,
  short_name: MONOGRAM,
  // Relative to the manifest's own URL, so a fork served under a repository
  // basePath resolves these without the generator knowing the prefix.
  start_url: '.',
  scope: '.',
  // Keep basic browser navigation available for this multi-page document.
  display: 'minimal-ui',
  background_color: bgLight,
  theme_color: bgLight,
  icons: [
    {
      src: 'images/icons/icon-192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: 'images/icons/icon-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: 'images/icons/icon-maskable-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
};

const outputs = {
  'app/favicon.ico': packIco([
    { size: 16, png: rendered.get('16') },
    { size: 32, png: rendered.get('32') },
  ]),
  'app/icon.png': rendered.get('96'),
  'app/apple-icon.png': rendered.get('180'),
  'public/images/icons/icon-192.png': rendered.get('192'),
  'public/images/icons/icon-512.png': rendered.get('512'),
  'public/images/icons/icon-maskable-512.png': rendered.get('maskable512'),
  'app/manifest.json': Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`),
};

await mkdir(MANIFEST_ICON_DIR, { recursive: true });
await Promise.all(
  Object.entries(outputs).map(([path, data]) =>
    writeFile(join(root, path), data),
  ),
);

/**
 * Binds the committed art to the inputs that produced it, the way
 * `public/og.meta.json` binds the share card. Unlike that file this one lives
 * beside its generator rather than in `public/`, because nothing serves it.
 */
const generatorSources = await Promise.all(
  [
    ['scripts/generate-icons.mjs', new URL(import.meta.url)],
    ['scripts/lib/fonts.mjs', new URL('./lib/fonts.mjs', import.meta.url)],
    [
      'scripts/lib/image-renderer.mjs',
      new URL('./lib/image-renderer.mjs', import.meta.url),
    ],
    [
      'src/lib/color-token.mjs',
      new URL('../src/lib/color-token.mjs', import.meta.url),
    ],
  ].map(async ([path, url]) => [path, await readFile(url, 'utf8')]),
);
const inputs = {
  accent,
  onAccent,
  backgroundLight: bgLight,
  monogram: MONOGRAM,
  name: profile.name,
  font: DISPLAY_FONT,
  renderer: await readImageRenderer(root),
};

await writeFile(
  META_OUTPUT,
  `${JSON.stringify(
    {
      inputs,
      generatorDigest: generatorSources
        .reduce(
          (digest, [path, source]) =>
            digest.update(path).update('\0').update(source).update('\0'),
          createHash('sha256'),
        )
        .update(JSON.stringify(inputs))
        .digest('hex'),
      files: Object.fromEntries(
        Object.entries(outputs).map(([path, data]) => [
          path,
          createHash('sha256').update(data).digest('hex'),
        ]),
      ),
    },
    null,
    2,
  )}\n`,
);

const total = Object.values(outputs).reduce((sum, d) => sum + d.length, 0);
console.log(
  `Wrote ${Object.keys(outputs).length} files (${total} bytes) for monogram ${MONOGRAM} on ${accent}, plus ${META_OUTPUT}`,
);
