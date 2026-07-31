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

import { validatePostFrontmatterData } from '../src/lib/post-frontmatter.mjs';
import { ogProfileSnapshot } from './og-profile.mjs';

/** Every card is a `summary_large_image`, so every card is this size. */
export const CARD_SIZE = { width: 1200, height: 630 };

export const HOME_CARD_PATH = '/og.png';
/** One card per published post, named after its slug. */
export const POST_CARD_DIRECTORY = '/og/writing';
export const LEDGER_PATH = '/og.meta.json';

/**
 * Installed packages whose exact locked bytes can change rendered pixels.
 *
 * `next/og` bundles satori and the OG renderer, React supplies the element
 * tree, and the Node renderer dynamically loads Sharp when it is installed.
 * The lock entries are therefore inputs just as surely as the generator source
 * and fonts are.
 */
export const CARD_RENDERER_PACKAGES = ['next', 'react', 'sharp'];

/**
 * Exact font files used by satori.
 *
 * Google Fonts' family CSS is mutable: resolving "Bricolage Grotesque 800" on
 * two different days can return different bytes under the same generator
 * source. These versioned TTF URLs and their digests make a changed response a
 * hard failure instead of silently redrawing every committed card.
 */
export const CARD_FONTS = [
  {
    name: 'Display',
    family: 'Bricolage Grotesque',
    weight: 800,
    style: 'normal',
    url: 'https://fonts.gstatic.com/s/bricolagegrotesque/v9/3y9U6as8bTXq_nANBjzKo3IeZx8z6up5BeSl5jBNz_19PpbpMXuECpwUxJBOm_OJWiaaD30YfKfjZZoLvZvlyM0.ttf',
    sha256: '50fe1039eb3ff208d027a4867d3f53bd288bba76273a718578f7b3ec0feec388',
  },
  {
    name: 'Mono',
    family: 'JetBrains Mono',
    weight: 500,
    style: 'normal',
    url: 'https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8-qxjPQ.ttf',
    sha256: '3386a05f6ece969e4537de6be894170d20558e82f7d56c8c5d332972ef172160',
  },
  {
    name: 'Body',
    family: 'Newsreader',
    weight: 400,
    style: 'normal',
    url: 'https://fonts.gstatic.com/s/newsreader/v26/cY9qfjOCX1hbuyalUrK49dLac06G1ZGsZBtoBCzBDXXD9JVF438weI_ADA.ttf',
    sha256: 'b8f5e0a8bdd6a12c722ca5635d9da87e77ccbb2d0172112e34e00c4e55f2cd5a',
  },
];

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
  'scripts/og-layout.mjs',
  'scripts/og-profile.mjs',
  'src/lib/post-frontmatter.mjs',
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
  return (
    markdown
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`[^`\n]*`/g, ' ')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      // Restrict this to recognizable HTML. A broad `<[^>]+>` expression also
      // erases technical prose such as `latency < 50ms and throughput > 1k`.
      .replace(
        /<\/?(?:a|abbr|b|blockquote|br|cite|code|del|details|div|em|figcaption|figure|h[1-6]|hr|i|img|kbd|li|mark|ol|p|pre|s|small|span|strong|sub|summary|sup|table|tbody|td|th|thead|tr|ul)(?:\s+[^<>]*?)?\s*\/?>/gi,
        ' ',
      )
      .split(/\s+/)
      .filter((token) => /[\p{L}\p{N}]/u.test(token)).length
  );
}

/**
 * Distinct inline external destinations.
 *
 * A linked image is still a link. The label expression therefore accepts one
 * nested Markdown image, as in `[![chart](/chart.png)](https://example.com)`,
 * while the negative lookbehind keeps the image's own source from counting.
 */
export function countExternalLinks(markdown) {
  const links = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`\n]*`/g, ' ')
    .matchAll(
      /(?<!!)\[(?:[^\[\]]|!\[[^\]]*\]\([^)]*\))*\]\(\s*<?(https?:\/\/[^)\s>]+)>?(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/g,
    );

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
    {
      label: 'External links',
      value: String(countExternalLinks(markdown)),
    },
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

    const slug = file.replace(/\.md$/, '');
    const source = join(CONTENT_DIRECTORY, file);
    assertSafeSlug(slug, source);
    const frontmatter = validatePostFrontmatterData(data, source);

    if (frontmatter.draft === true) continue;

    cards.push({
      slug,
      path: postCardPath(slug),
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
      dateLabel: formatCardDate(frontmatter.date),
      readout: measurePost(content),
    });
  }

  // Newest first, then by slug, so the ledger order is stable across machines.
  return cards.sort(
    (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
  );
}

/** Exact lockfile identities of the packages that render card pixels. */
export async function readCardRenderer(root = process.cwd()) {
  const lockPath = join(root, 'package-lock.json');
  let lock;

  try {
    lock = JSON.parse(await readFile(lockPath, 'utf8'));
  } catch (error) {
    throw new Error(
      'Cannot read the share-card renderer from package-lock.json',
      { cause: error },
    );
  }

  return CARD_RENDERER_PACKAGES.map((name) => {
    const entry = lock?.packages?.[`node_modules/${name}`];
    if (
      typeof entry?.version !== 'string' ||
      typeof entry?.integrity !== 'string'
    ) {
      throw new Error(
        `package-lock.json has no complete node_modules/${name} lock entry for the share-card renderer`,
      );
    }

    return {
      name,
      version: entry.version,
      integrity: entry.integrity,
    };
  });
}

/**
 * Everything the committed cards are derived from.
 *
 * `generate-og.mjs` writes this into the ledger with each rendered image's
 * digest attached; `check-og.mjs` recomputes it and compares.
 */
export async function readCardInputs(root = process.cwd()) {
  const [profile, colors, posts, sources, renderer] = await Promise.all([
    readFile(join(root, 'src/data/profile.json'), 'utf8').then(JSON.parse),
    readCardColors(root),
    readPostCards(root),
    Promise.all(
      GENERATOR_SOURCES.map((source) => readFile(join(root, source), 'utf8')),
    ),
    readCardRenderer(root),
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
    fonts: CARD_FONTS,
    profileSnapshot,
    colors,
    posts,
    renderer,
    generatorDigest,
  };
}

export function imageDigest(image) {
  return createHash('sha256').update(image).digest('hex');
}

export function assertCardFontDigest(font, data) {
  const actual = imageDigest(data);
  if (actual !== font.sha256) {
    throw new Error(
      `${font.family} ${font.weight} from ${font.url} has SHA-256 ${actual}; ` +
        `expected ${font.sha256}. Refusing to generate cards from changed font bytes.`,
    );
  }
}
