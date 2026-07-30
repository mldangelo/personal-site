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
 * Run with `npm run og`. The output is committed: a card changes only when the
 * design or the facts on it change, so builds stay deterministic and do not
 * depend on Google Fonts being reachable from CI. `npm run og:check` is what
 * fails CI when a committed card no longer matches the repository.
 *
 * Drafts never get a card — see `readPostCards` in `og-inputs.mjs`.
 */
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { createElement as h } from 'react';

import {
  assertCardFontDigest,
  HOME_CARD_PATH,
  imageDigest,
  LEDGER_PATH,
  POST_CARD_DIRECTORY,
  publicFile,
  readCardInputs,
} from './og-inputs.mjs';

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
  generatorDigest,
} = await readCardInputs(root);

const { ink, paper, body, graphite, accent, hairline } = colors;

/* ---------------------------------------------------------------------------
 * Layout.
 *
 * satori lays a card out but reports nothing back, so a post title one line
 * taller than the card expects would silently collide with the readout rule.
 * The title size is therefore chosen up front from an estimate, and every
 * number that estimate assumes is the same constant the styles use.
 * ------------------------------------------------------------------------- */
const PADDING_X = 80;
const PADDING_TOP = 72;
/** The heavy rule that opens a card. A hairline divides within one. */
const TOP_RULE = 10;
const READOUT_RULE = 2;
/** Readout label, value, and the row's own padding. */
const READOUT_HEIGHT = 122;
/** Mono 25 at satori's default line height. */
const BYLINE_HEIGHT = 30;
const TITLE_GAP = 28;
const TITLE_LINE_HEIGHT = 1.02;
const DESCRIPTION_GAP = 26;
const DESCRIPTION_SIZE = 30;
const DESCRIPTION_LINE_HEIGHT = 1.4;
/** Prose wants a narrower measure than the card is wide. */
const DESCRIPTION_WIDTH = 880;
/** Slack, so a line the estimate misjudges still has somewhere to go. */
const BOTTOM_GAP = 44;

const CONTENT_WIDTH = size.width - PADDING_X * 2;
const TEXT_HEIGHT =
  size.height -
  TOP_RULE -
  PADDING_TOP -
  READOUT_HEIGHT -
  BYLINE_HEIGHT -
  TITLE_GAP -
  DESCRIPTION_GAP -
  BOTTOM_GAP;

/**
 * The site card reports selected static profile facts.
 *
 * The live age is deliberately absent: a card is baked ahead of time, so a
 * ticking value would be frozen and quietly wrong. For the same reason no card
 * carries amber — nothing on a PNG is live, and the signal colour only means
 * something while that stays true. The post cards follow the same rule: their
 * readouts are counted from the post, which does not change after publication.
 */
const READOUT = [
  { label: 'Countries visited', value: String(profile.countriesVisited) },
  { label: 'Computing since', value: String(profile.computingSince) },
  { label: 'Based in', value: profile.currentCity },
];

const [FIRST_NAME, ...REST_OF_NAME] = profile.name.split(' ');
const AUTHOR = profile.name.replace("'", '’');

/** Fetches one exact TTF and refuses any response whose bytes have changed. */
async function loadCardFont(source) {
  const response = await fetch(source.url);
  if (!response.ok) {
    throw new Error(
      `Failed to download ${source.family} ${source.weight}: ${response.status}`,
    );
  }

  const data = Buffer.from(await response.arrayBuffer());
  assertCardFontDigest(source, data);

  return {
    name: source.name,
    data,
    weight: source.weight,
    style: source.style,
  };
}

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
          fontWeight: 800,
          letterSpacing: '-0.045em',
          lineHeight: 0.92,
          color: ink,
          display: 'flex',
          flexDirection: 'column',
        },
      },
      h('span', {}, FIRST_NAME),
      h('span', {}, REST_OF_NAME.join(' ').replace("'", '’')),
    ),
    monoLine(profile.employer, profile.focus, { marginTop: 34 }),
  );
}

/**
 * Average character advance as a fraction of point size.
 *
 * Measured off a rendered card: Bricolage 800 sits near 0.475em per character
 * in mixed case, and Newsreader is narrower still. Rounding up is deliberate —
 * over-estimating a line's width only steps a title down one size, while
 * under-estimating it runs the text into the rule below.
 */
const CHARACTER_WIDTH = 0.5;

function estimateLines(text, fontSize, width) {
  const perLine = Math.max(1, width / (fontSize * CHARACTER_WIDTH));
  // Words do not break, so a wrapped line usually ends a little short.
  return Math.max(1, Math.ceil(text.length / (perLine * 0.95)));
}

/**
 * Display size for a post title, chosen from what the description leaves.
 *
 * Titles run from a few words to a full sentence, and one fixed size either
 * shrinks the short ones or overflows the long ones. Deriving the step from the
 * post itself means a new post places itself, the same way `tierFor` does on
 * the resume.
 */
const TITLE_SIZES = [100, 84, 72, 60, 50];

function titleFontSize(post) {
  const descriptionHeight =
    estimateLines(post.description, DESCRIPTION_SIZE, DESCRIPTION_WIDTH) *
    DESCRIPTION_SIZE *
    DESCRIPTION_LINE_HEIGHT;
  const available = TEXT_HEIGHT - descriptionHeight;

  return (
    TITLE_SIZES.find(
      (fontSize) =>
        estimateLines(post.title, fontSize, CONTENT_WIDTH) *
          fontSize *
          TITLE_LINE_HEIGHT <=
        available,
    ) ?? TITLE_SIZES.at(-1)
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
          fontSize: titleFontSize(post),
          fontWeight: 800,
          letterSpacing: '-0.035em',
          lineHeight: TITLE_LINE_HEIGHT,
          color: ink,
          display: 'block',
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
        },
      },
      typeset(post.description),
    ),
  );
}

// The three type roles are fetched once and reused for every card. The URLs are
// versioned and the bytes checksummed in `og-inputs.mjs`, so this network read
// cannot silently choose a newer font revision.
const fonts = await Promise.all(fontSources.map(loadCardFont));

async function render(element) {
  const response = new ImageResponse(element, { ...size, fonts });
  return Buffer.from(await response.arrayBuffer());
}

// Every card is rendered before anything is written. A font fetch or a render
// that fails halfway through would otherwise leave `public/` holding a mixed
// set — some cards from this run, some from the last — with a ledger that
// matches neither.
const rendered = [{ path: HOME_CARD_PATH, image: await render(siteCard()) }];
for (const post of posts) {
  rendered.push({
    slug: post.slug,
    path: post.path,
    image: await render(postCard(post)),
  });
}

const digests = new Map(
  rendered.map(({ path, image }) => [path, imageDigest(image)]),
);
const ledger = {
  size,
  fonts: fontSources,
  profile: profileSnapshot,
  colors,
  generatorDigest,
  imageDigest: digests.get(HOME_CARD_PATH),
  posts: posts.map((post) => ({
    ...post,
    imageDigest: digests.get(post.path),
  })),
};

await mkdir(publicFile(root, POST_CARD_DIRECTORY), { recursive: true });
await Promise.all([
  ...rendered.map(({ path, image }) =>
    writeFile(publicFile(root, path), image),
  ),
  writeFile(
    publicFile(root, LEDGER_PATH),
    `${JSON.stringify(ledger, null, 2)}\n`,
  ),
]);

// A post that becomes a draft, or is renamed, must not leave its card behind:
// `public/` is served verbatim, so a stale card stays fetchable forever.
const expected = new Set(posts.map((post) => `${post.slug}.png`));
const stale = (await readdir(publicFile(root, POST_CARD_DIRECTORY))).filter(
  (file) => !expected.has(file),
);
await Promise.all(
  stale.map((file) =>
    rm(join(publicFile(root, POST_CARD_DIRECTORY), file), { recursive: true }),
  ),
);

console.log(
  `Wrote ${rendered.length} card(s) at ${size.width}x${size.height} plus ` +
    `public${LEDGER_PATH}${stale.length ? `, removed ${stale.length} stale card(s)` : ''}`,
);
for (const { path } of rendered) {
  console.log(`  public${path}`);
}
