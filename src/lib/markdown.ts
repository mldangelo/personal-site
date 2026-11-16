import { type MarkdownToJSX, RuleType } from 'markdown-to-jsx/react';
import { createElement } from 'react';

import { prefixSrcset } from './site-url.mjs';

import { smartQuotes } from './typography';
import { BASE_PATH, withBasePath } from './utils';

/** Raw HTML elements whose text is code, kept exactly as written. */
const RAW_CODE_TAGS = new Set(['code', 'kbd', 'pre', 'samp', 'var']);
let rawCodeDepth = 0;

/**
 * The `renderRule` every Markdown renderer here shares: typographic quotes in
 * the text a reader sees.
 *
 * Quotes are set per text node, after parsing. Converting the source string
 * instead reaches inside the markup: an anchor whose `href` is quoted with
 * apostrophes would get a typographic one in its address. Code spans and
 * fenced blocks are other rule types, so they pass through as written.
 *
 * Kept apart from `typography.ts`, which components that render no Markdown
 * import, so that importing `smartQuotes` never pulls in `markdown-to-jsx`.
 */
export const smartQuotesRule: NonNullable<
  MarkdownToJSX.Options['renderRule']
> = (next, node) => {
  // Raw HTML code is parsed as ordinary text nodes, so it is skipped by tag:
  // `<code>{"ok":true}</code>` copied with curly quotes no longer parses.
  // Rendering is synchronous and depth-first, so a counter tracks the nesting.
  if (node.type === RuleType.htmlBlock && RAW_CODE_TAGS.has(node.tag)) {
    rawCodeDepth += 1;
    try {
      return next();
    } finally {
      rawCodeDepth -= 1;
    }
  }
  return node.type === RuleType.text && rawCodeDepth === 0
    ? smartQuotes(node.text)
    : next();
};

/** Element props that hold a single URL the browser fetches or follows. */
const URL_PROPS = ['href', 'src', 'poster', 'action', 'formAction'];

/**
 * The `createElement` every Markdown renderer here shares: the base path on
 * each root-relative URL an element carries, since Next prefixes none of an
 * element's own attributes. Markdown links and images arrive here as `a` and
 * `img`, and raw HTML with React's prop names (`srcSet`, `formAction`).
 *
 * An override component is passed by identity, not by tag name, and gets its
 * props as written: `PostContent`'s image measures a file by its path under
 * `public/` before prefixing it.
 */
export const createElementWithBasePath: NonNullable<
  MarkdownToJSX.Options['createElement']
> = (tag, props, ...children) => {
  if (typeof tag !== 'string' || !props) {
    return createElement(tag, props, ...children);
  }

  const prefixed: Record<string, unknown> = { ...props };
  for (const name of URL_PROPS) {
    const value = prefixed[name];
    if (typeof value === 'string') prefixed[name] = withBasePath(value);
  }
  if (typeof prefixed.srcSet === 'string') {
    prefixed.srcSet = prefixSrcset(BASE_PATH, prefixed.srcSet);
  }

  return createElement(tag, prefixed, ...children);
};

/**
 * An image source that names a file under `public/`: root-relative, and not
 * protocol-relative.
 */
export function isRootLocalImage(src: string): boolean {
  return src.startsWith('/') && !src.startsWith('//');
}
