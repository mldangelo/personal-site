import { astToMarkdown, parser, RuleType } from 'markdown-to-jsx/markdown';

const isNode = (value) =>
  value !== null && typeof value === 'object' && 'type' in value;

/**
 * Markdown as a reader may see it: without HTML comments, or reference
 * definitions that nothing uses. The renderers are client components, so the
 * source they are given travels in every page's payload, and a note an author
 * hid in a comment is one download away even though no page shows it.
 *
 * Server-side only: it loads a second entry of the Markdown library. A source
 * with nothing to remove comes back unchanged; otherwise it is rewritten from
 * its parse, which states each used reference inline.
 *
 * @param {string} source
 * @returns {string}
 */
export function publishedMarkdown(source) {
  const usedTargets = new Set();
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
        if (item.type === RuleType.link || item.type === RuleType.image) {
          usedTargets.add(item.target);
        }
        for (const [key, value] of Object.entries(item)) {
          if (Array.isArray(value)) item[key] = prune(value);
        }
        return item;
      });
  }

  const ast = prune(parser(source));
  const refs =
    ast.find((node) => node.type === RuleType.refCollection)?.refs ?? {};
  // Footnote text is parsed only when rendered, so a reference counts as
  // used wherever its label appears in one.
  const footnotes = Object.entries(refs)
    .filter(([label]) => label.startsWith('^'))
    .map(([, { target }]) => target.toLowerCase());

  for (const [label, { target }] of Object.entries(refs)) {
    const used =
      label.startsWith('^') ||
      usedTargets.has(target) ||
      footnotes.some((text) => text.includes(`[${label.toLowerCase()}]`));
    if (!used) {
      delete refs[label];
      removed = true;
    }
  }

  return removed ? astToMarkdown(ast) : source;
}
