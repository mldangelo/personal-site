/**
 * Everything the two share-card scripts have to agree about.
 *
 * `generate-og.mjs` renders the cards and commits a digest of these inputs
 * alongside them; `check-og.mjs` recomputes the same inputs and fails CI when
 * the committed PNGs no longer match the repository. A fact that only one of
 * them knew about would quietly stop being checked, so every input is derived
 * here, once.
 */
import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import matter from 'gray-matter';

import { ogProfileSnapshot } from './og-profile.mjs';

/** Every card is a `summary_large_image`, so every card is this size. */
export const CARD_SIZE = { width: 1200, height: 630 };

export const HOME_CARD_PATH = '/og.png';
/** One card per published post, named after its slug. */
export const POST_CARD_DIRECTORY = '/og/writing';
export const LEDGER_PATH = '/og.meta.json';

/**
 * The files whose contents decide what a card looks like.
 *
 * The digest covers the generator plus the modules it shares with the checker:
 * a change to any of them has to invalidate the committed PNGs, or CI stops
 * noticing that the images no longer match the code that draws them.
 */
const GENERATOR_SOURCES = [
  'scripts/generate-og.mjs',
  'scripts/og-inputs.mjs',
  'scripts/og-profile.mjs',
];

const CONTENT_DIRECTORY = join('content', 'writing');
const COLOR_TOKENS_FILE = join('app', 'styles', 'tokens', 'colors.css');

/** Words per minute used for the reading-time readout. */
const READING_WORDS_PER_MINUTE = 225;

export function postCardPath(slug) {
  return `${POST_CARD_DIRECTORY}/${slug}.png`;
}

/** Resolves a root-relative public URL to its file on disk. */
export function publicFile(root, publicPath) {
  return join(root, 'public', ...publicPath.split('/').filter(Boolean));
}

/**
 * Card colour role → design token.
 *
 * satori has no cascade, so the generator has to be handed literal colours.
 * These were hand-copied hex literals and drifted: the readout hairline was
 * `rgba(35, 39, 46, 0.18)`, a value no token has — between `--color-border`
 * (0.14) and `--color-border-alt` (0.24). Reading the stylesheet keeps the
 * cards on the site's palette, and folding the resolved values into the card
 * digest makes a token change invalidate the committed PNGs.
 */
const CARD_COLORS = {
  ink: '--color-fg-bold',
  paper: '--color-bg-alt',
  body: '--color-fg',
  graphite: '--color-fg-light',
  accent: '--color-accent',
  /** Divides cells within one section; the rule that opens a section is ink. */
  hairline: '--color-border',
};

/**
 * Literal colours only. `var()` and `color-mix()` need a browser to resolve,
 * so a token that moves to either form fails loudly here rather than painting
 * a card with a value satori silently drops.
 */
const LITERAL_COLOR = /^(?:#[0-9a-f]{3,8}|rgba?\([^()]*\))$/i;

function themeBlock(css) {
  const declaration = css.indexOf('@theme');
  const open = declaration === -1 ? -1 : css.indexOf('{', declaration);
  if (open === -1) {
    throw new Error(`${COLOR_TOKENS_FILE} has no @theme block`);
  }

  let depth = 0;
  for (let index = open; index < css.length; index += 1) {
    if (css[index] === '{') depth += 1;
    else if (css[index] === '}') {
      depth -= 1;
      if (depth === 0) return css.slice(open + 1, index);
    }
  }

  throw new Error(`${COLOR_TOKENS_FILE} has an unterminated @theme block`);
}

/**
 * The colours the cards paint with, resolved from the token stylesheet.
 *
 * Only the light `@theme` block is read: a baked PNG has no theme, and the
 * card is the paper one.
 */
export async function readCardColors(root = process.cwd()) {
  const block = themeBlock(
    await readFile(join(root, COLOR_TOKENS_FILE), 'utf8'),
  );
  const colors = {};

  for (const [role, token] of Object.entries(CARD_COLORS)) {
    const match = block.match(
      new RegExp(`(?:^|[;{\\n])\\s*${token}\\s*:\\s*([^;]+);`),
    );
    const value = match?.[1]?.trim();

    if (!value) {
      throw new Error(`${COLOR_TOKENS_FILE} does not declare ${token}`);
    }
    if (!LITERAL_COLOR.test(value)) {
      throw new Error(
        `${token} is ${value}, which the card generator cannot resolve. ` +
          'Share cards need a literal colour, not var() or color-mix().',
      );
    }

    colors[role] = value;
  }

  return colors;
}

/**
 * Slugs are filenames, and a card path is built from them, so hold them to the
 * same shape `isSafeSlug` in `src/lib/posts.ts` accepts. A post whose slug that
 * function rejects has no route to share anyway.
 */
function assertSafeSlug(slug, file) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(
      `${file} has a slug the site cannot route: ${slug}. Use lowercase words separated by single hyphens.`,
    );
  }
}

/**
 * Words of prose, with code, URLs, and markup left out.
 *
 * Only tokens containing a letter or digit count, so list bullets, heading
 * marks, and table pipes do not inflate the number.
 */
export function countProseWords(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`\n]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter((token) => /[\p{L}\p{N}]/u.test(token)).length;
}

/** Distinct sources a post links out to. Two links to one URL are one source. */
export function countReferences(markdown) {
  const links = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`\n]*`/g, ' ')
    .matchAll(/(?<!!)\[[^\]]*\]\(\s*(https?:\/\/[^)\s]+)/g);

  return new Set([...links].map((match) => match[1])).size;
}

/**
 * The date exactly as the post header prints it.
 *
 * Noon avoids the timezone shift that makes a UTC-midnight date render as the
 * previous day west of Greenwich — the same reason `formatDate` in
 * `src/lib/utils.ts` parses at noon. A test pins the two together.
 */
export function formatCardDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * The measured readout for a post.
 *
 * These are counted from the post itself for the same reason `/stats` counts
 * its own source: a number typed into a card is a number that goes stale
 * without anything failing.
 */
export function measurePost(markdown) {
  const words = countProseWords(markdown);

  return [
    { label: 'Words', value: words.toLocaleString('en-US') },
    { label: 'References', value: String(countReferences(markdown)) },
    {
      label: 'Reading time',
      value: `${Math.max(1, Math.round(words / READING_WORDS_PER_MINUTE))} min`,
    },
  ];
}

/**
 * The published posts that get a card, newest first.
 *
 * Drafts are excluded unconditionally. `public/` is copied verbatim into the
 * export, so a card for an unpublished post is a publicly fetchable file with
 * that post's title rendered into it — the leak class `verify-export.mjs`
 * exists to catch. `isPublished` in `src/lib/posts.ts` reveals drafts under
 * `next dev`; this deliberately never does, because its output is committed to
 * the repository rather than rendered per request.
 */
export async function readPostCards(root = process.cwd()) {
  const directory = join(root, CONTENT_DIRECTORY);
  const files = (await readdir(directory)).filter((file) =>
    file.endsWith('.md'),
  );
  const cards = [];

  for (const file of files.sort()) {
    const { data, content } = matter(
      await readFile(join(directory, file), 'utf8'),
    );

    if (data.draft === true) continue;

    const slug = file.replace(/\.md$/, '');
    assertSafeSlug(slug, join(CONTENT_DIRECTORY, file));

    if (typeof data.title !== 'string' || data.title.trim() === '') {
      throw new Error(`${join(CONTENT_DIRECTORY, file)} has no title`);
    }
    if (
      typeof data.description !== 'string' ||
      data.description.trim() === ''
    ) {
      throw new Error(`${join(CONTENT_DIRECTORY, file)} has no description`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data.date))) {
      throw new Error(
        `${join(CONTENT_DIRECTORY, file)} has no YYYY-MM-DD date: ${data.date}`,
      );
    }

    cards.push({
      slug,
      path: postCardPath(slug),
      title: data.title.trim(),
      description: data.description.trim(),
      date: String(data.date),
      dateLabel: formatCardDate(String(data.date)),
      readout: measurePost(content),
    });
  }

  // Newest first, then by slug, so the ledger order is stable across machines.
  return cards.sort(
    (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
  );
}

/**
 * Everything the committed cards are derived from.
 *
 * `generate-og.mjs` writes this into the ledger with each rendered image's
 * digest attached; `check-og.mjs` recomputes it and compares.
 */
export async function readCardInputs(root = process.cwd()) {
  const [profile, colors, posts, sources] = await Promise.all([
    readFile(join(root, 'src/data/profile.json'), 'utf8').then(JSON.parse),
    readCardColors(root),
    readPostCards(root),
    Promise.all(
      GENERATOR_SOURCES.map((source) => readFile(join(root, source), 'utf8')),
    ),
  ]);

  const profileSnapshot = ogProfileSnapshot(profile);
  const generatorDigest = sources
    .reduce(
      (digest, source) => digest.update(source).update('\0'),
      createHash('sha256'),
    )
    .update(JSON.stringify(profileSnapshot))
    .digest('hex');

  return {
    profile,
    size: CARD_SIZE,
    profileSnapshot,
    colors,
    posts,
    generatorDigest,
  };
}

export function imageDigest(image) {
  return createHash('sha256').update(image).digest('hex');
}
