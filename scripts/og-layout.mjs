/**
 * Shared, testable geometry for generated share cards.
 *
 * Satori does not report overflow, so copy has to be rejected before render
 * when even the smallest supported title cannot fit above the readout.
 */

export const PADDING_X = 80;
export const PADDING_TOP = 72;
/** The heavy rule that opens a card. A hairline divides within one. */
export const TOP_RULE = 10;
export const READOUT_RULE = 2;
/** Readout label, value, and the row's own padding. */
export const READOUT_HEIGHT = 122;
/** Mono 25 at satori's default line height. */
export const BYLINE_HEIGHT = 30;
export const TITLE_GAP = 28;
export const TITLE_LINE_HEIGHT = 1.02;
export const DESCRIPTION_GAP = 26;
export const DESCRIPTION_SIZE = 30;
export const DESCRIPTION_LINE_HEIGHT = 1.4;
/** Prose wants a narrower measure than the card is wide. */
export const DESCRIPTION_WIDTH = 880;
/** Slack, so a line the estimate misjudges still has somewhere to go. */
export const BOTTOM_GAP = 44;

/**
 * Average character advance as a fraction of point size.
 *
 * Measured off a rendered card: Bricolage 800 sits near 0.475em per character
 * in mixed case, and Newsreader is narrower still. Rounding up is deliberate:
 * over-estimating a line's width only steps a title down one size.
 */
const CHARACTER_WIDTH = 0.5;
/** Satori supports this value and will break only a word that cannot fit. */
export const WORD_BREAK = 'break-word';

function estimateLines(text, fontSize, width) {
  const perLine = Math.max(1, width / (fontSize * CHARACTER_WIDTH));
  // Normal words stay intact, so a wrapped line usually ends a little short.
  const averageLines = Math.max(1, Math.ceil(text.length / (perLine * 0.95)));
  // `word-break: break-word` prevents horizontal overflow. Count a long token
  // at a deliberately conservative 1em per code point so its extra wrapped
  // lines are also included in the vertical fit check.
  const tokenLines = text
    .split(/\s+/)
    .reduce(
      (lines, token) =>
        Math.max(lines, Math.ceil(([...token].length * fontSize) / width)),
      1,
    );

  return Math.max(averageLines, tokenLines);
}

/** Supported display sizes, largest first. */
export const TITLE_SIZES = [100, 84, 72, 60, 50];

/**
 * Largest display size that leaves room for the complete title and description.
 *
 * Falling back to the minimum when it does not fit merely turns overflow into
 * a successful build. Reject it instead, with the post named, so a new post
 * cannot publish a card whose copy or readout is cropped.
 */
export function titleFontSize(post, size) {
  const contentWidth = size.width - PADDING_X * 2;
  const textHeight =
    size.height -
    TOP_RULE -
    PADDING_TOP -
    READOUT_HEIGHT -
    BYLINE_HEIGHT -
    TITLE_GAP -
    DESCRIPTION_GAP -
    BOTTOM_GAP;
  const descriptionHeight =
    estimateLines(post.description, DESCRIPTION_SIZE, DESCRIPTION_WIDTH) *
    DESCRIPTION_SIZE *
    DESCRIPTION_LINE_HEIGHT;
  const available = textHeight - descriptionHeight;
  const fontSize = TITLE_SIZES.find(
    (candidate) =>
      estimateLines(post.title, candidate, contentWidth) *
        candidate *
        TITLE_LINE_HEIGHT <=
      available,
  );

  if (fontSize === undefined) {
    throw new Error(
      `The share card for ${post.slug} cannot fit its title and description at the minimum title size. Shorten the frontmatter copy before regenerating cards.`,
    );
  }

  return fontSize;
}
