import { type MarkdownToJSX, RuleType } from 'markdown-to-jsx';

import { smartQuotes } from './typography';

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
> = (next, node) =>
  node.type === RuleType.text ? smartQuotes(node.text) : next();

/**
 * An image source that names a file under `public/`: root-relative, and not
 * protocol-relative.
 */
export function isRootLocalImage(src: string): boolean {
  return src.startsWith('/') && !src.startsWith('//');
}
