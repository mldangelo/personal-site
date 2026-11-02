import { load } from 'js-yaml';

/**
 * Split a leading `---` YAML block from a document's body.
 *
 * An unclosed block throws rather than becoming body text, so a malformed post
 * cannot lose its `draft: true` and publish.
 *
 * @param {string} source
 */
export function parseFrontmatter(source) {
  const text = source.replace(/^﻿/, '');
  const open = /^---[ \t]*\r?\n/.exec(text);

  if (!open) {
    return { data: {}, content: text };
  }

  const rest = text.slice(open[0].length);
  const close = /^---[ \t]*(?:\r?\n|$)/m.exec(rest);

  if (!close) {
    throw new SyntaxError('Frontmatter has no closing --- delimiter');
  }

  const block = rest.slice(0, close.index);
  // js-yaml throws on a document with nothing in it but blanks and comments.
  const isEmpty = block.replace(/^\s*#.*$/gm, '').trim() === '';

  return {
    data: isEmpty ? {} : (load(block) ?? {}),
    content: rest.slice(close.index + close[0].length),
  };
}
