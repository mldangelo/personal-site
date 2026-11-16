import { astToMarkdown, parser, RuleType } from 'markdown-to-jsx/markdown';

const COMMENT = /<!--[\s\S]*?-->/g;
/** A code span: a run of backticks, then the same run, not part of a longer one. */
const CODE_SPAN = /(`+)[\s\S]*?(?<!`)\1(?!`)/g;

const isNode = (value) =>
  value !== null && typeof value === 'object' && 'type' in value;

/** Inline Markdown without its comments, leaving code spans as written. */
function stripInlineComments(text) {
  let result = '';
  let last = 0;
  for (const match of text.matchAll(CODE_SPAN)) {
    result += text.slice(last, match.index).replace(COMMENT, '') + match[0];
    last = match.index + match[0].length;
  }
  return result + text.slice(last).replace(COMMENT, '');
}

/**
 * Markdown as a reader may see it: without HTML comments, or reference
 * definitions. The renderers are client components, so the source they are
 * given travels in every page's payload, and a note an author hid in a
 * comment, or in a definition nothing cites, is one download away even
 * though no page shows it.
 *
 * Server-side only: it loads a second entry of the Markdown library. A source
 * with nothing to remove comes back unchanged. Otherwise it is rewritten from
 * its parse, which states each used reference inline, so a definition stays
 * only where text kept as written still cites it: a footnote's body, or a raw
 * HTML block's.
 *
 * @param {string} source
 * @returns {string}
 */
export function publishedMarkdown(source) {
  /** Text the rewrite reproduces as written rather than from its parse. */
  const verbatim = [];
  let removed = false;

  // Children are arrays of nodes; list items and table rows nest them deeper.
  function prune(items) {
    return items
      .filter((item) => {
        if (isNode(item) && item.type === RuleType.htmlComment) {
          removed = true;
          return false;
        }
        return true;
      })
      .map((item) => {
        if (Array.isArray(item)) return prune(item);
        if (!isNode(item)) return item;
        for (const [key, value] of Object.entries(item)) {
          if (Array.isArray(value)) item[key] = prune(value);
        }
        // Raw HTML is written back from its source, where a comment is a
        // comment to the browser too.
        if (item.type === RuleType.htmlBlock) {
          for (const key of ['text', 'h']) {
            if (typeof item[key] !== 'string') continue;
            const kept = item[key].replace(COMMENT, '');
            if (kept !== item[key]) removed = true;
            item[key] = kept;
            verbatim.push(kept.toLowerCase());
          }
        }
        return item;
      });
  }

  const ast = prune(parser(source));
  const refs =
    ast.find((node) => node.type === RuleType.refCollection)?.refs ?? {};

  for (const [label, ref] of Object.entries(refs)) {
    if (!label.startsWith('^')) continue;
    const kept = stripInlineComments(ref.target);
    if (kept !== ref.target) removed = true;
    ref.target = kept;
    verbatim.push(kept.toLowerCase());
  }

  for (const label of Object.keys(refs)) {
    const cited =
      label.startsWith('^') ||
      verbatim.some((text) => text.includes(`[${label.toLowerCase()}]`));
    if (!cited) {
      delete refs[label];
      removed = true;
    }
  }

  return removed ? astToMarkdown(ast) : source;
}
