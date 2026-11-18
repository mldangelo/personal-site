#!/usr/bin/env node
/**
 * Generates the share cards: `public/og.png` for the site, plus one card per
 * published post under `public/og/writing/`.
 *
 * These are scripts rather than `app/opengraph-image.tsx` routes because the
 * site deploys to GitHub Pages. Next's metadata routes emit an extensionless
 * file (`out/opengraph-image`), which Pages serves as application/octet-stream
 * — and OpenGraph scrapers reject non-image content types. A real .png in
 * `public/` sidesteps that, and lets every page reference one stable path
 * instead of relying on metadata-file inheritance, which a route-level
 * `openGraph` object silently replaces.
 *
 * Run with `npm run og`. The output is committed, so ordinary builds neither
 * render cards nor fetch fonts. `npm run og:check` validates the ledger and
 * performs one fresh, byte-for-byte render so an edited image and edited digest
 * cannot masquerade as generator output.
 *
 * Drafts never get a card — see `readPostCards` in `og-inputs.mjs`.
 */
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { basename, join } from 'node:path';
import { createElement as h } from 'react';
import { fontCoverage, uncoveredCharacters } from './lib/font-coverage.mjs';
import { loadFont } from './lib/fonts.mjs';
import { requireSharp } from './lib/image-renderer.mjs';
import {
  HOME_CARD_PATH,
  imageDigest,
  LEDGER_PATH,
  POST_CARD_DIRECTORY,
  publicFile,
  readCardInputs,
} from './og-inputs.mjs';
import {
  DESCRIPTION_GAP,
  DESCRIPTION_LINE_HEIGHT,
  DESCRIPTION_SIZE,
  DESCRIPTION_WIDTH,
  PADDING_TOP,
  PADDING_X,
  READOUT_RULE,
  readoutTop,
  TITLE_GAP,
  TITLE_LINE_HEIGHT,
  TITLE_TRACKING,
  TOP_RULE,
  titleFontSize,
  WORD_BREAK,
} from './og-layout.mjs';
import { assertCardGeometry } from './og-measure.mjs';

// `next/og` ships as CommonJS with no ESM export condition, so it has to be
// required rather than imported.
const { ImageResponse } = createRequire(import.meta.url)('next/og');

const root = process.cwd();

// The stats page reads the same profile file, so the cards cannot silently
// drift from the public facts elsewhere on the site.
const {
  profile,
  profileSnapshot,
  size,
  fonts: fontSources,
  colors,
  posts,
  renderer,
  generatorDigest,
} = await readCardInputs(root);

const { ink, paper, body, graphite, accent, hairline } = colors;

await requireSharp();

/* ---------------------------------------------------------------------------
 * Layout.
 *
 * satori lays a card out but reports nothing back, so a post title one line
 * taller than the card expects would silently collide with the readout rule.
 * The title size is therefore chosen up front from an estimate, and every
 * number that estimate assumes is the same constant the styles use.
 * ------------------------------------------------------------------------- */
/**
 * The site card reports selected static profile facts.
 *
 * The live age is deliberately absent: a card is baked ahead of time, so a
 * ticking value would be frozen and quietly wrong. For the same reason no card
 * carries amber — nothing on a PNG is live, and the signal colour only means
 * something while that stays true. The post cards follow the same rule: their
 * measured readouts do not drift merely because time passes, and the ledger
 * makes a later edit to a published post require regeneration.
 */
const READOUT = [
  { label: 'Countries visited', value: String(profile.countriesVisited) },
  { label: 'Computing since', value: String(profile.computingSince) },
  { label: 'Based in', value: profile.currentCity },
];

const [FIRST_NAME, ...REST_OF_NAME] = profile.name.split(' ');
const AUTHOR = profile.name.replace("'", '’');

function readoutCell(cell, index) {
  return h(
    'div',
    {
      key: cell.label,
      style: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        padding: index === 0 ? '26px 32px 40px 0' : '26px 32px 40px',
        borderLeft: index === 0 ? 'none' : `1px solid ${hairline}`,
      },
    },
    h(
      'span',
      {
        style: {
          fontFamily: 'Mono',
          fontSize: 17,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: graphite,
          marginBottom: 14,
        },
      },
      cell.label,
    ),
    h(
      'span',
      { style: { fontFamily: 'Mono', fontSize: 30, color: ink } },
      cell.value,
    ),
  );
}

/**
 * The frame every card shares: paper, a heavy ink rule opening the card, and a
 * readout row closed off by a second ink rule.
 */
function cardShell(readout, ...children) {
  return h(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: paper,
        padding: `${PADDING_TOP}px ${PADDING_X}px 0`,
        borderTop: `${TOP_RULE}px solid ${ink}`,
      },
    },
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column' } },
      ...children,
    ),
    h(
      'div',
      {
        style: { display: 'flex', borderTop: `${READOUT_RULE}px solid ${ink}` },
      },
      ...readout.map(readoutCell),
    ),
  );
}

/** The mono line under a name or over a title: accent, em dash, graphite. */
function monoLine(lead, trail, style = {}) {
  return h(
    'div',
    {
      style: {
        fontFamily: 'Mono',
        fontSize: 25,
        letterSpacing: '0.02em',
        color: graphite,
        display: 'flex',
        ...style,
      },
    },
    h('span', { style: { color: accent } }, lead),
    // Satori collapses a leading space in a flex child, so the gap before the
    // em dash is set as spacing rather than as whitespace.
    h('span', { style: { marginLeft: '0.5em' } }, `— ${trail}`),
  );
}

function siteCard() {
  return cardShell(
    READOUT,
    h(
      'div',
      {
        style: {
          fontFamily: 'Display',
          fontSize: 128,
          fontWeight: 500,
          letterSpacing: '-0.045em',
          lineHeight: 0.92,
          color: ink,
          display: 'flex',
          flexDirection: 'column',
          // A name too long for a line wraps where it can be seen, rather
          // than running off the card's edge, where nothing would notice.
          wordBreak: WORD_BREAK,
        },
      },
      h('span', {}, FIRST_NAME),
      h('span', {}, REST_OF_NAME.join(' ').replace("'", '’')),
    ),
    monoLine(profile.employer, profile.focus, { marginTop: 34 }),
  );
}

/** Straight quotes are a typewriter artifact; the card is set type. */
function typeset(text) {
  return text
    .replace(/"([^"]*)"/g, '“$1”')
    .replace(/(\w)'(\w)/g, '$1’$2')
    .replace(/'/g, '’');
}

function postCard(post) {
  return cardShell(
    post.readout,
    monoLine(AUTHOR, post.dateLabel),
    h(
      'div',
      {
        style: {
          marginTop: TITLE_GAP,
          fontFamily: 'Display',
          fontSize: titleFontSize(post, size),
          fontWeight: 500,
          letterSpacing: `${TITLE_TRACKING}em`,
          lineHeight: TITLE_LINE_HEIGHT,
          color: ink,
          display: 'block',
          wordBreak: WORD_BREAK,
        },
      },
      typeset(post.title),
    ),
    // The description is prose, so it is the one thing on a card set in the
    // body face.
    h(
      'div',
      {
        style: {
          marginTop: DESCRIPTION_GAP,
          maxWidth: DESCRIPTION_WIDTH,
          fontFamily: 'Body',
          fontSize: DESCRIPTION_SIZE,
          lineHeight: DESCRIPTION_LINE_HEIGHT,
          color: body,
          display: 'block',
          wordBreak: WORD_BREAK,
        },
      },
      typeset(post.description),
    ),
  );
}

// The three type roles are fetched once and reused for every card. The URLs are
// versioned and the bytes checksummed, so this network read cannot silently
// choose a newer font revision.
const fonts = await Promise.all(fontSources.map(loadFont));
const coverages = fonts.map(({ data }) => fontCoverage(data));

/**
 * Renders one card and reads back the geometry it actually drew.
 *
 * `titleFontSize` picks a size from an estimate of how copy will wrap, and
 * satori neither takes instruction from that estimate nor reports when it
 * disagrees. Measuring the rendered rows is what turns "should fit" into
 * "did fit", for the site card and post cards alike.
 */
async function render(element, label, { text, remedy }) {
  const missing = uncoveredCharacters(text.join(' '), coverages);
  if (missing.length > 0) {
    throw new Error(
      `${label}: the card fonts have no glyph for ${missing
        .map(
          (character) =>
            `"${character}" (U+${character.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')})`,
        )
        .join(
          ', ',
        )}. next/og would fetch an unpinned font for it, or draw nothing; add a pinned font that covers it to CARD_FONTS in scripts/og-inputs.mjs.`,
    );
  }

  const response = new ImageResponse(element, { ...size, fonts });
  const image = Buffer.from(await response.arrayBuffer());

  try {
    await assertCardGeometry(image, {
      size,
      paper,
      topRule: TOP_RULE,
      readoutTop: readoutTop(size),
      remedy,
    });
  } catch (error) {
    throw new Error(`${label}: ${error.message}`, { cause: error });
  }

  return image;
}

// Every card is rendered before anything is written. A font fetch or a render
// that fails halfway through would otherwise leave `public/` holding a mixed
// set — some cards from this run, some from the last — with a ledger that
// matches neither.
const readoutText = (readout) =>
  readout.flatMap(({ label, value }) => [label.toUpperCase(), value]);
const rendered = [
  {
    path: HOME_CARD_PATH,
    image: await render(siteCard(), 'The site card', {
      text: [
        '—',
        AUTHOR,
        profile.employer,
        profile.focus,
        ...readoutText(READOUT),
      ],
      remedy: 'shorten the name, employer, or focus in src/data/profile.json',
    }),
  },
];
for (const post of posts) {
  rendered.push({
    slug: post.slug,
    path: post.path,
    image: await render(postCard(post), `The share card for ${post.slug}`, {
      text: [
        '—',
        AUTHOR,
        post.dateLabel,
        typeset(post.title),
        typeset(post.description),
        ...readoutText(post.readout),
      ],
      remedy:
        'shorten the frontmatter copy, or take a size out of `TITLE_SIZES`',
    }),
  });
}

const digests = new Map(
  rendered.map(({ path, image }) => [path, imageDigest(image)]),
);
const ledger = {
  size,
  fonts: fontSources,
  renderer,
  profile: profileSnapshot,
  colors,
  generatorDigest,
  imageDigest: digests.get(HOME_CARD_PATH),
  posts: posts.map((post) => ({
    ...post,
    imageDigest: digests.get(post.path),
  })),
};

if (process.argv.includes('--check')) {
  const mismatches = [];

  for (const { path, image } of rendered) {
    let committed;
    try {
      committed = await readFile(publicFile(root, path));
    } catch {
      mismatches.push(`public${path} is missing`);
      continue;
    }

    if (!committed.equals(image)) {
      mismatches.push(`public${path} does not match a fresh render`);
    }
  }

  if (mismatches.length > 0) {
    console.error(`\nog:render-check: ${mismatches.length} problem(s)\n`);
    for (const mismatch of mismatches) console.error(`  ${mismatch}`);
    console.error('\nRun `npm run og` and commit the generated files.');
    process.exit(1);
  }

  console.log(
    `og:render-check: ${rendered.length} committed card(s) match a fresh render`,
  );
  process.exit(0);
}

// Read before anything is written: it records which cards the last run made.
const previousLedger = await readFile(publicFile(root, LEDGER_PATH), 'utf8')
  .then((text) => JSON.parse(text))
  .catch(() => undefined);

await mkdir(publicFile(root, POST_CARD_DIRECTORY), { recursive: true });
await Promise.all(
  rendered.map(({ path, image }) => writeFile(publicFile(root, path), image)),
);

// A post that becomes a draft, or is renamed, must not leave its card behind:
// `public/` is served verbatim, so a stale card stays fetchable forever. Only
// a card the last run recorded in the ledger is this generator's to delete;
// anything else in the folder is someone's, so it is named and left alone.
const expected = new Set(posts.map((post) => `${post.slug}.png`));
const generated = new Set(
  (previousLedger?.posts ?? []).map(({ path }) => basename(path)),
);
const others = (await readdir(publicFile(root, POST_CARD_DIRECTORY))).filter(
  (file) => !expected.has(file),
);
const stale = others.filter((file) => generated.has(file));
await Promise.all(
  stale.map((file) => rm(join(publicFile(root, POST_CARD_DIRECTORY), file))),
);
for (const file of others.filter((file) => !generated.has(file))) {
  console.warn(
    `Left public${POST_CARD_DIRECTORY}/${file} alone: it is not a card this generator wrote.`,
  );
}

// The ledger is the commit marker for a generation run. Write it only after
// every image and deletion succeeds, so an interrupted run stays visibly stale
// to `npm run og:check` instead of advertising a partially written card set.
await writeFile(
  publicFile(root, LEDGER_PATH),
  `${JSON.stringify(ledger, null, 2)}\n`,
);

console.log(
  `Wrote ${rendered.length} card(s) at ${size.width}x${size.height} plus ` +
    `public${LEDGER_PATH}${stale.length ? `, removed ${stale.length} stale card(s)` : ''}`,
);
for (const { path } of rendered) {
  console.log(`  public${path}`);
}
