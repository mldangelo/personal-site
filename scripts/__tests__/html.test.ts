import { describe, expect, it } from 'vitest';

import {
  attribute,
  canonicalValues,
  decodeHtml,
  elements,
  metaValues,
  tags,
} from '../lib/html.mjs';

/**
 * `scripts/lib/html.mjs` reads the exported markup with regexes rather than a
 * DOM, on purpose — the gates that use it run after the build with no DOM
 * available, and a parser dependency would have no other use here. That trade
 * only stays safe while its edges are stated, so this file pins both the
 * behaviour the gates rely on and the limitations that come with it.
 *
 * The gates are `verify-export.mjs` (drafts, internal links, share metadata)
 * and `measure-export.mjs` (the size budget), so a reader that quietly returns
 * nothing turns a gate green rather than red. Every assertion below therefore
 * distinguishes "absent" from "empty".
 */

describe('decodeHtml', () => {
  it('decodes the named entities an exported attribute can carry', () => {
    expect(
      decodeHtml('&lt;p&gt;A &amp; B&#39;s &quot;quote&quot;&lt;/p&gt;'),
    ).toBe(`<p>A & B's "quote"</p>`);
    expect(decodeHtml('&apos;')).toBe("'");
  });

  it('decodes &amp; last, so an escaped entity survives as text', () => {
    // `&amp;quot;` is the escaping of the literal text `&quot;`. Decoding
    // `&amp;` first would turn it into `&quot;` and then into `"`, silently
    // rewriting content the page renders as an entity reference.
    expect(decodeHtml('&amp;quot;')).toBe('&quot;');
    expect(decodeHtml('&amp;amp;')).toBe('&amp;');
  });

  it('decodes numeric references in either base and either case', () => {
    expect(decodeHtml('&#x2F;')).toBe('/');
    expect(decodeHtml('&#X2F;')).toBe('/');
    expect(decodeHtml('&#8212;')).toBe('—');
  });

  it('decodes references above the basic multilingual plane', () => {
    // Code points, not code units: an emoji in a share description is one
    // reference well past 0xFFFF.
    expect(decodeHtml('&#128512;')).toBe('😀');
    expect(decodeHtml('&#x1f600;')).toBe('😀');
  });

  it('leaves an unrecognised entity exactly as it found it', () => {
    expect(decodeHtml('a&nbsp;b')).toBe('a&nbsp;b');
  });
});

describe('tags', () => {
  it('returns opening tags only', () => {
    expect(tags('<p>text</p><p>more</p>', 'p')).toEqual(['<p>', '<p>']);
  });

  it('returns every element when no name is given', () => {
    // Names carry digits and hyphens (`h1`, a custom element), so the default
    // pattern has to be more than a run of letters.
    expect(
      tags(
        '<div class="a"><h1>t</h1><a href="x">y</a></div><my-el></my-el><br/>',
      ),
    ).toEqual(['<div class="a">', '<h1>', '<a href="x">', '<my-el>', '<br/>']);
  });

  it('matches element names case-insensitively', () => {
    expect(tags('<META charset="utf-8">', 'meta')).toEqual([
      '<META charset="utf-8">',
    ]);
  });

  it('requires a whole element name, not a prefix of a longer one', () => {
    // Without the word boundary, asking for `<link>` would also return
    // `<linkgroup>` and the gate would read attributes off the wrong element.
    expect(tags('<metadata content="x"><meta content="y">', 'meta')).toEqual([
      '<meta content="y">',
    ]);
  });

  it('returns a self-closing tag whole', () => {
    expect(tags('<img src="a.png" alt=""/>', 'img')).toEqual([
      '<img src="a.png" alt=""/>',
    ]);
  });

  it('keeps a tag whole when an escaped angle bracket is in a value', () => {
    // This is the case that occurs in practice: React escapes `>` in attribute
    // values, so what reaches the gate is `&gt;`.
    const tag = tags('<meta name="description" content="a &gt; b">', 'meta');

    expect(tag).toEqual(['<meta name="description" content="a &gt; b">']);
    expect(attribute(tag[0], 'content')).toBe('a > b');
  });
});

describe('attribute', () => {
  it('reads a double-quoted value', () => {
    expect(attribute('<meta content="hello">', 'content')).toBe('hello');
  });

  it('reads a single-quoted value, including one holding a double quote', () => {
    expect(attribute("<meta content='hello'>", 'content')).toBe('hello');
    expect(attribute(`<meta content='say "hi"'>`, 'content')).toBe('say "hi"');
  });

  it('reads an unquoted value, stopping at whitespace or the tag end', () => {
    expect(attribute('<meta charset=utf-8>', 'charset')).toBe('utf-8');
    expect(attribute('<meta charset=utf-8 name="x">', 'charset')).toBe('utf-8');
  });

  it('tolerates whitespace around the equals sign', () => {
    expect(attribute('<meta content = "hello">', 'content')).toBe('hello');
  });

  it('decodes entities in the value', () => {
    expect(
      attribute('<meta content="Tom &amp; Jerry &#39;96">', 'content'),
    ).toBe("Tom & Jerry '96");
  });

  it('matches the attribute name case-insensitively', () => {
    expect(attribute('<META CONTENT="hello">', 'content')).toBe('hello');
  });

  it('returns an empty value as the empty string, not as absent', () => {
    // `og:image:alt=""` is a share card with no alt text, which is a failure
    // the gate must see. Collapsing it to `undefined` would read as "this page
    // has no alt attribute" and take a different branch.
    expect(attribute('<meta content="">', 'content')).toBe('');
    expect(attribute('<meta content="">', 'content')).not.toBeUndefined();
  });

  it('returns undefined for an attribute that is not there', () => {
    expect(attribute('<meta name="x">', 'content')).toBeUndefined();
    expect(attribute('<meta>', 'content')).toBeUndefined();
  });

  it('requires the name to start at an attribute boundary', () => {
    // `data-content` is not `content`; matching inside a longer name would let
    // a framework data attribute impersonate the one being checked.
    expect(attribute('<meta data-content="x">', 'content')).toBeUndefined();
  });

  it('is not fooled by an attribute whose name merely starts the same', () => {
    expect(
      attribute('<meta contentx="wrong" content="right">', 'content'),
    ).toBe('right');
  });

  it('does not swallow the slash of a self-closing tag from a quoted value', () => {
    expect(attribute('<meta content="hello"/>', 'content')).toBe('hello');
  });
});

describe('metaValues', () => {
  const html = `
    <meta charset="utf-8">
    <meta property="og:image" content="first.png">
    <meta property="OG:IMAGE" content="second.png">
    <meta property="og:image">
    <meta property="og:image:alt" content="ignored">
    <meta name="og:image" content="wrong attribute">
  `;

  it('returns every matching value in document order', () => {
    // Order and multiplicity both matter: a page carrying two canonical share
    // images is exactly what the gate is looking for.
    expect(metaValues(html, 'property', 'og:image')).toEqual([
      'first.png',
      'second.png',
    ]);
  });

  it('matches the key value case-insensitively', () => {
    expect(
      metaValues(
        '<meta name="TWITTER:CARD" content="summary">',
        'name',
        'twitter:card',
      ),
    ).toEqual(['summary']);
  });

  it('compares against a lowercase expectation, so callers must pass one', () => {
    expect(metaValues(html, 'property', 'OG:IMAGE')).toEqual([]);
  });

  it('drops a matching meta that carries no content attribute', () => {
    expect(metaValues('<meta name="robots">', 'name', 'robots')).toEqual([]);
  });

  it('keeps a matching meta whose content is empty', () => {
    expect(
      metaValues('<meta name="robots" content="">', 'name', 'robots'),
    ).toEqual(['']);
  });

  it('ignores meta tags that do not carry the key attribute at all', () => {
    expect(metaValues(html, 'property', 'og:title')).toEqual([]);
    expect(metaValues('', 'property', 'og:title')).toEqual([]);
  });
});

describe('canonicalValues', () => {
  it('returns the href of a canonical link', () => {
    expect(canonicalValues('<link rel="canonical" href="https://x/">')).toEqual(
      ['https://x/'],
    );
  });

  it('reads rel as a token list and matches case-insensitively', () => {
    expect(
      canonicalValues('<link rel="alternate CANONICAL" href="https://x/">'),
    ).toEqual(['https://x/']);
  });

  it('does not match a rel that merely contains the word', () => {
    expect(
      canonicalValues('<link rel="canonicalish" href="https://x/">'),
    ).toEqual([]);
  });

  it('returns every canonical, so a page carrying two is visible', () => {
    expect(
      canonicalValues(
        '<link rel="canonical" href="a"><link rel="stylesheet" href="s.css"><link rel="canonical" href="b">',
      ),
    ).toEqual(['a', 'b']);
  });

  it('skips links with no rel and canonical links with no href', () => {
    expect(canonicalValues('<link href="a">')).toEqual([]);
    expect(canonicalValues('<link rel="canonical">')).toEqual([]);
  });
});

describe('elements', () => {
  it('returns whole elements including their markup', () => {
    expect(elements('<p>x</p><style>a{b:c}</style>', 'style')).toEqual([
      '<style>a{b:c}</style>',
    ]);
  });

  it('does not merge two siblings into one match', () => {
    // A greedy match would weigh everything between the first opening tag and
    // the last closing one, which for inline styles is most of the document.
    expect(
      elements('<style>a</style><p>x</p><style>b</style>', 'style'),
    ).toEqual(['<style>a</style>', '<style>b</style>']);
  });

  it('spans newlines', () => {
    expect(elements('<style>\na {\n  b: c;\n}\n</style>', 'style')).toEqual([
      '<style>\na {\n  b: c;\n}\n</style>',
    ]);
  });

  it('keeps the attributes on the opening tag', () => {
    expect(
      elements('<svg class="icon" viewBox="0 0 1 1"><path/></svg>', 'svg'),
    ).toEqual(['<svg class="icon" viewBox="0 0 1 1"><path/></svg>']);
  });

  it('matches either case and tolerates space in the closing tag', () => {
    expect(elements('<STYLE>a</StYlE >', 'style')).toEqual([
      '<STYLE>a</StYlE >',
    ]);
  });

  it('returns nothing for an unclosed element', () => {
    expect(elements('<style>a', 'style')).toEqual([]);
  });
});

/**
 * These are not desirable behaviours. They are the price of reading markup
 * with regexes, and they are pinned so that a change to them is a deliberate
 * one rather than a surprise — and so that a future reader can tell what this
 * module is not able to do without having to rediscover it.
 */
describe('documented limitations', () => {
  it('truncates an opening tag at a raw > inside a quoted value', () => {
    // Safe only because React escapes `>` as `&gt;` in attribute values, which
    // is what the exported pages actually contain (see the `tags` case above).
    // Hand-written markup in `public/` would not be covered.
    const [tag] = tags('<meta name="x" content="a > b">', 'meta');

    expect(tag).toBe('<meta name="x" content="a >');
    expect(attribute(tag, 'content')).not.toBe('a > b');
  });

  it('sees tags inside HTML comments', () => {
    expect(
      tags('<!-- <meta name="robots" content="noindex"> -->', 'meta'),
    ).toEqual(['<meta name="robots" content="noindex">']);
  });

  it('includes the closing slash in an unquoted value on a self-closing tag', () => {
    expect(attribute('<meta content=hello/>', 'content')).toBe('hello/');
  });

  it('truncates an element that nests inside itself', () => {
    // `elements` is for inline `<svg>` icons and inline `<style>`/`<script>`
    // bodies, none of which nest. A nested `<svg>` would be under-weighed by
    // the size budget rather than reported.
    expect(elements('<svg>a<svg>b</svg></svg>', 'svg')).toEqual([
      '<svg>a<svg>b</svg>',
    ]);
  });
});
