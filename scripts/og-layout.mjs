/**
 * Shared, testable geometry for generated share cards.
 *
 * Satori does not report overflow, so copy has to be rejected before render
 * when even the smallest supported title cannot fit above the readout. Every
 * number here is an estimate of what satori will do, so `og-measure.mjs`
 * inspects the rendered pixels afterwards and refuses to write a card whose
 * copy reached the readout anyway.
 */

export const PADDING_X = 80;
export const PADDING_TOP = 72;
/** The heavy rule that opens a card. A hairline divides within one. */
export const TOP_RULE = 10;
export const READOUT_RULE = 2;
/**
 * Readout label, value, and the row's own padding, below the rule.
 *
 * Measured off rendered cards rather than added up from the styles, because
 * only the pixels decide where the row actually begins: satori resolves its own
 * default line box for the label and the value. This was 122 — 22px short of
 * the real row, which quietly spent half of `BOTTOM_GAP` before any title was
 * measured. `readoutTop` is now checked against every rendered card in
 * `og-measure.mjs`, and a test pins it against the committed ones.
 */
export const READOUT_HEIGHT = 142;
/** Mono 25 at satori's default line height. */
export const BYLINE_HEIGHT = 30;
export const TITLE_GAP = 28;
export const TITLE_LINE_HEIGHT = 1.02;
/**
 * Display tracking, in em. Shared rather than restated in the card styles: the
 * line estimate is wrong by 3.5% per character if the two disagree.
 */
export const TITLE_TRACKING = -0.035;
export const DESCRIPTION_GAP = 26;
export const DESCRIPTION_SIZE = 30;
export const DESCRIPTION_LINE_HEIGHT = 1.4;
/** Prose wants a narrower measure than the card is wide. */
export const DESCRIPTION_WIDTH = 880;
/** Slack, so a line the estimate misjudges still has somewhere to go. */
export const BOTTOM_GAP = 44;

/**
 * Character advance as a fraction of point size, by class, for each face.
 *
 * Read out of the `hmtx` tables of the exact TTF files `og-inputs.mjs` pins,
 * then rounded up: capitals and digits are the alphabet mean, lower case is the
 * mean weighted by English letter frequency, and punctuation sits well above
 * its own mean without charging every comma for an em dash. One average across
 * all of it was measurably unsafe —
 * Bricolage 800 sets a capital at 0.674em against 0.549em for typical lower
 * case, so a 0.5em constant calibrated on mixed-case copy under-counted an
 * all-caps title by a whole line, and an under-count is the error that crops a
 * card, since satori reports nothing when copy overflows.
 */
const DISPLAY_ADVANCE = {
  upper: 0.68,
  lower: 0.55,
  digit: 0.61,
  punctuation: 0.45,
  space: 0.24,
};
const BODY_ADVANCE = {
  upper: 0.7,
  lower: 0.48,
  digit: 0.57,
  punctuation: 0.42,
  space: 0.24,
};
/** Satori supports this value and will break only a word that cannot fit. */
export const WORD_BREAK = 'break-word';

function advance(text, advances, tracking) {
  let width = 0;
  for (const character of text) {
    if (/\s/u.test(character)) width += advances.space;
    else if (/\p{Lu}/u.test(character)) width += advances.upper;
    else if (/\p{Nd}/u.test(character)) width += advances.digit;
    else if (/[\p{L}\p{N}]/u.test(character)) width += advances.lower;
    else width += advances.punctuation;
    width += tracking;
  }
  return width;
}

/**
 * Lines the text will occupy, by wrapping it the way satori does.
 *
 * Dividing the whole string by an average line length was the other half of the
 * problem: it says a 34-character all-caps title fits on two lines because the
 * ink would, while greedy wrapping puts the last word on a third. Words are
 * placed one at a time here for the same reason the advances are per class —
 * every approximation is rounded towards more lines, never fewer.
 */
function estimateLines(text, fontSize, width, advances, tracking) {
  const space = (advances.space + tracking) * fontSize;
  let lines = 1;
  let used = 0;

  for (const word of text.split(/\s+/).filter(Boolean)) {
    const wordWidth = advance(word, advances, tracking) * fontSize;
    const needed = used === 0 ? wordWidth : used + space + wordWidth;
    if (needed <= width) {
      used = needed;
      continue;
    }

    if (used > 0) lines += 1;
    used = wordWidth;
    // `word-break: break-word` breaks only a word that cannot fit on a line of
    // its own; every full line it fills is another line of height.
    while (used > width) {
      lines += 1;
      used -= width;
    }
  }

  return lines;
}

/** Supported display sizes, largest first. */
export const TITLE_SIZES = [100, 84, 72, 60, 50];

/** First row of the readout rule, and so the first row copy may not reach. */
export function readoutTop(size) {
  return size.height - READOUT_HEIGHT - READOUT_RULE;
}

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
    readoutTop(size) -
    TOP_RULE -
    PADDING_TOP -
    BYLINE_HEIGHT -
    TITLE_GAP -
    DESCRIPTION_GAP -
    BOTTOM_GAP;
  const descriptionHeight =
    estimateLines(
      post.description,
      DESCRIPTION_SIZE,
      DESCRIPTION_WIDTH,
      BODY_ADVANCE,
      0,
    ) *
    DESCRIPTION_SIZE *
    DESCRIPTION_LINE_HEIGHT;
  const available = textHeight - descriptionHeight;
  const fontSize = TITLE_SIZES.find(
    (candidate) =>
      estimateLines(
        post.title,
        candidate,
        contentWidth,
        DISPLAY_ADVANCE,
        TITLE_TRACKING,
      ) *
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
