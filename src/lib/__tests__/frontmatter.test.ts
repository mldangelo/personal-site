import { describe, expect, it } from 'vitest';

import { parseFrontmatter } from '../frontmatter.mjs';

describe('parseFrontmatter', () => {
  it('splits the YAML block from the body', () => {
    expect(parseFrontmatter('---\ntitle: A\n---\nBody\n')).toEqual({
      data: { title: 'A' },
      content: 'Body\n',
    });
  });

  it('removes only the newline that ends the closing delimiter', () => {
    expect(parseFrontmatter('---\ntitle: A\n---\n\nBody\n').content).toBe(
      '\nBody\n',
    );
  });

  it('stops at the first delimiter, leaving a thematic break in the body', () => {
    expect(parseFrontmatter('---\ntitle: A\n---\nOne\n\n---\n\nTwo\n')).toEqual(
      { data: { title: 'A' }, content: 'One\n\n---\n\nTwo\n' },
    );
  });

  it.each([
    ['no block', 'Just text.\n', {}, 'Just text.\n'],
    ['an empty block', '---\n---\nBody\n', {}, 'Body\n'],
    ['a blank block', '---\n\n---\nBody\n', {}, 'Body\n'],
    ['a block of comments', '---\n# note\n---\nBody\n', {}, 'Body\n'],
    ['CRLF line endings', '---\r\na: 1\r\n---\r\nB\r\n', { a: 1 }, 'B\r\n'],
    ['a byte order mark', '﻿---\na: 1\n---\nB\n', { a: 1 }, 'B\n'],
    ['nothing after the block', '---\na: 1\n---', { a: 1 }, ''],
    ['a longer rule', '----\na: 1\n----\n', {}, '----\na: 1\n----\n'],
  ])('handles %s', (_name, source, data, content) => {
    expect(parseFrontmatter(source)).toEqual({ data, content });
  });

  it('refuses an unclosed block rather than publishing it as body text', () => {
    expect(() => parseFrontmatter('---\ndraft: true\nBody\n')).toThrow(
      'no closing',
    );
  });

  it('never evaluates a block as code', () => {
    const source = '---js\nthrow new Error("evaluated")\n---\nBody\n';

    expect(parseFrontmatter(source)).toEqual({ data: {}, content: source });
  });
});
