import { describe, expect, it } from 'vitest';

import { parseFrontmatter, stringifyFrontmatter } from '../frontmatter.mjs';

describe('frontmatter YAML engine', () => {
  it('preserves quoted dates, draft booleans, multiline text, and the body', () => {
    const source = `---
title: "A title: with punctuation"
date: '2026-10-06'
draft: false
description: >-
  A folded
  description.
---
# Body

---
An ordinary horizontal rule.
`;
    expect(parseFrontmatter(source)).toEqual({
      data: {
        title: 'A title: with punctuation',
        date: '2026-10-06',
        draft: false,
        description: 'A folded description.',
      },
      content: '# Body\n\n---\nAn ordinary horizontal rule.\n',
    });
  });

  it('preserves BOM and CRLF handling', () => {
    expect(
      parseFrontmatter('\uFEFF---\r\ntitle: Windows\r\n---\r\nBody.\r\n'),
    ).toEqual({ data: { title: 'Windows' }, content: 'Body.\r\n' });
  });

  it.each(['', 'Body without frontmatter.\n'])(
    'accepts plain content %j',
    (content) => {
      expect(parseFrontmatter(content)).toEqual({ data: {}, content });
    },
  );

  it('round-trips metadata through the configured serializer', () => {
    const data = {
      title: 'Numbers stay strings',
      date: '2026-10-06',
      draft: true,
      description: '0128',
    };
    expect(parseFrontmatter(stringifyFrontmatter('Body.\n', data))).toEqual({
      data,
      content: 'Body.\n',
    });
  });

  it('retains JSON frontmatter support', () => {
    expect(parseFrontmatter('---json\n{"draft":false}\n---\nBody.')).toEqual({
      data: { draft: false },
      content: 'Body.',
    });
  });

  it.each([
    'draft: true\ndraft: false',
    'title: [unfinished',
    'value: !!js/function "function () { return 1; }"',
  ])('rejects malformed or unsafe YAML %j', (yaml) => {
    expect(() => parseFrontmatter(`---\n${yaml}\n---\nBody.`)).toThrow();
  });
});
