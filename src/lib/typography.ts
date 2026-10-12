/**
 * Typographic quotes for text a reader sees.
 *
 * Content is authored with the straight quotes a keyboard produces, and the
 * data machines read — `resume.json`, metadata, the feed, the share-card
 * ledger — keeps them, because those consumers match on exact strings. The
 * page should not: a typewriter apostrophe set at display size in the site's
 * own name is the first thing a careful reader notices. So the conversion
 * happens at render, on display strings only.
 */

const LEFT_SINGLE = '\u2018';
const RIGHT_SINGLE = '\u2019';
const LEFT_DOUBLE = '\u201C';
const RIGHT_DOUBLE = '\u201D';

/** Characters a quotation can open after. */
const OPENS_AFTER = /[\s([{\u2014\u2013\-/]/;
const WORD = /[\p{L}\p{N}]/u;
const DIGIT = /\d/;

/**
 * A string that begins mid-word: the tail of a contraction or possessive whose
 * head sits in a neighbouring element, as in `<a>Promptfoo</a>'s`. Markdown
 * hands text over one node at a time, so this is the only context available.
 */
const TAIL_AT_START = /^'(?:s|t|re|ve|ll|d|m|em|n)(?![\p{L}\p{N}])/u;

/** A decade or year elision, as in `'90s` or `'26`. */
const ELIDED_DIGITS = /^'\d\d(?:s)?(?![\p{L}\p{N}])/u;

function singleQuoteFor(text: string, index: number): string {
  const prev = index > 0 ? text[index - 1] : '';
  const next = index < text.length - 1 ? text[index + 1] : '';

  // Inside or after a word it is an apostrophe: don't, parents', 1990's.
  if (prev !== '' && WORD.test(prev)) return RIGHT_SINGLE;

  const rest = text.slice(index);
  if (ELIDED_DIGITS.test(rest)) return RIGHT_SINGLE;

  if (prev === '') {
    if (TAIL_AT_START.test(rest)) return RIGHT_SINGLE;
    return WORD.test(next) ? LEFT_SINGLE : RIGHT_SINGLE;
  }

  const opensHere =
    OPENS_AFTER.test(prev) || prev === '"' || prev === LEFT_DOUBLE;
  return opensHere && WORD.test(next) ? LEFT_SINGLE : RIGHT_SINGLE;
}

/**
 * Replace straight quotes and apostrophes with their typographic forms.
 *
 * Pass it prose, never code: the caller decides what counts as display text.
 * Already-typographic input is returned unchanged, so it is safe to apply
 * twice.
 */
export function smartQuotes(text: string): string {
  if (!text.includes("'") && !text.includes('"')) return text;

  let result = '';
  let doubleOpen = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (char === "'") {
      result += singleQuoteFor(text, index);
      continue;
    }

    if (char !== '"') {
      result += char;
      continue;
    }

    const prev = index > 0 ? text[index - 1] : '';
    const next = index < text.length - 1 ? text[index + 1] : '';

    if (doubleOpen) {
      result += RIGHT_DOUBLE;
      doubleOpen = false;
      continue;
    }

    // An inch mark rather than a quotation: `a 15" display` stays as written.
    if (prev !== '' && DIGIT.test(prev)) {
      result += char;
      continue;
    }

    // At the start of a string a quote opens only if something follows it.
    // Otherwise it closes a quotation that began in an earlier text node.
    const opens =
      prev === ''
        ? next !== '' && !/[\s.,;:!?)\]}]/.test(next)
        : OPENS_AFTER.test(prev) || prev === LEFT_SINGLE || prev === "'";

    if (opens) {
      result += LEFT_DOUBLE;
      doubleOpen = true;
    } else {
      result += RIGHT_DOUBLE;
    }
  }

  return result;
}
