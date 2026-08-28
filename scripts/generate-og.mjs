#!/usr/bin/env node
/**
 * Generates the share card at `public/og.png`.
 *
 * This is a script rather than an `app/opengraph-image.tsx` route because the
 * site deploys to GitHub Pages. Next's metadata routes emit an extensionless
 * file (`out/opengraph-image`), which Pages serves as application/octet-stream
 * — and OpenGraph scrapers reject non-image content types. A real .png in
 * `public/` sidesteps that, and lets every page reference one stable path
 * instead of relying on metadata-file inheritance, which a route-level
 * `openGraph` object silently replaces.
 *
 * Run with `npm run og`. The output is committed: the card changes only when
 * the design or the facts on it change, so builds stay deterministic and do
 * not depend on Google Fonts being reachable from CI.
 */
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { createElement as h } from 'react';

import { ogProfileSnapshot } from './og-profile.mjs';

// `next/og` ships as CommonJS with no ESM export condition, so it has to be
// required rather than imported.
const { ImageResponse } = createRequire(import.meta.url)('next/og');

const profile = JSON.parse(
  await readFile(join(process.cwd(), 'src/data/profile.json'), 'utf8'),
);

const OUTPUT = join(process.cwd(), 'public', 'og.png');
const METADATA_OUTPUT = join(process.cwd(), 'public', 'og.meta.json');
const SIZE = { width: 1200, height: 630 };
const PROFILE_SNAPSHOT = ogProfileSnapshot(profile);
const generatorSource = await readFile(new URL(import.meta.url), 'utf8');
const generatorDigest = createHash('sha256')
  .update(generatorSource)
  .update('\0')
  .update(JSON.stringify(PROFILE_SNAPSHOT))
  .digest('hex');

const INK = '#0e1116';
const PAPER = '#f2f1ec';
const GRAPHITE = '#545a63';
const ULTRAMARINE = '#1b2fbf';

/**
 * The card reports only supplied, stable professional identity facts.
 */

const [FIRST_NAME, ...REST_OF_NAME] = profile.name.split(' ');

/**
 * Fetches a font from Google as TTF, which is what satori accepts.
 *
 * Google's CSS endpoint serves woff2 to modern browsers and TTF to older
 * clients, so the request deliberately goes out without a browser User-Agent.
 */
async function loadGoogleFont(family, weight) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}`,
  ).then((response) => response.text());

  const url = css.match(/src:\s*url\((https:\/\/[^)]+)\)/)?.[1];
  if (!url) {
    throw new Error(`No font URL found for ${family} ${weight}`);
  }

  const font = await fetch(url);
  if (!font.ok) {
    throw new Error(`Failed to download ${family}: ${font.status}`);
  }

  return font.arrayBuffer();
}

function card() {
  return h(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: PAPER,
        padding: '72px 80px',
        borderTop: `10px solid ${INK}`,
      },
    },
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column' } },
      h(
        'div',
        {
          style: {
            fontFamily: 'Display',
            fontSize: 128,
            fontWeight: 800,
            letterSpacing: '-0.045em',
            lineHeight: 0.92,
            color: INK,
            display: 'flex',
            flexDirection: 'column',
          },
        },
        h('span', {}, FIRST_NAME),
        h('span', {}, REST_OF_NAME.join(' ').replace("'", '’')),
      ),
      h(
        'div',
        {
          style: {
            marginTop: 34,
            fontFamily: 'Mono',
            fontSize: 25,
            letterSpacing: '0.02em',
            color: GRAPHITE,
            display: 'flex',
          },
        },
        h('span', { style: { color: ULTRAMARINE } }, profile.employer),
        // Satori collapses a leading space in a flex child, so the gap before
        // the em dash is set as spacing rather than as whitespace.
        h('span', { style: { marginLeft: '0.5em' } }, `— ${profile.focus}`),
      ),
    ),
    h('div', { style: { borderTop: `2px solid ${INK}` } }),
  );
}

const [display, mono] = await Promise.all([
  loadGoogleFont('Bricolage+Grotesque', 800),
  loadGoogleFont('JetBrains+Mono', 500),
]);

const response = new ImageResponse(card(), {
  ...SIZE,
  fonts: [
    { name: 'Display', data: display, weight: 800, style: 'normal' },
    { name: 'Mono', data: mono, weight: 500, style: 'normal' },
  ],
});
const image = Buffer.from(await response.arrayBuffer());
const imageDigest = createHash('sha256').update(image).digest('hex');

await Promise.all([
  writeFile(OUTPUT, image),
  writeFile(
    METADATA_OUTPUT,
    `${JSON.stringify(
      {
        size: SIZE,
        profile: PROFILE_SNAPSHOT,
        generatorDigest,
        imageDigest,
      },
      null,
      2,
    )}\n`,
  ),
]);

console.log(
  `Wrote ${OUTPUT} (${SIZE.width}x${SIZE.height}) and ${METADATA_OUTPUT}`,
);
