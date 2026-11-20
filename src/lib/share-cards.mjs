/**
 * Where the share cards `npm run og` generates live, and their size: the
 * generator writes them here and the site's metadata declares them from the
 * same values.
 *
 * Every page points at a card explicitly. Next's `opengraph-image` file
 * convention is not used: a route-level `openGraph` object replaces the
 * inherited one wholesale, and the metadata route emits an extensionless file
 * that GitHub Pages serves as application/octet-stream.
 */

/** Every card is a `summary_large_image`, so every card is this size. */
export const CARD_SIZE = { width: 1200, height: 630 };

/** The site card, which every page but a published post shares. */
export const HOME_CARD_PATH = '/og.png';

/** One card per published post, named after its slug. */
export const POST_CARD_DIRECTORY = '/og/writing';

/** @param {string} slug */
export const postCardPath = (slug) => `${POST_CARD_DIRECTORY}/${slug}.png`;
