import { act, fireEvent, render } from '@testing-library/react';
import { StrictMode } from 'react';
import { hydrateRoot, type Root } from 'react-dom/client';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { createHeadingId } from '@/lib/anchors';
import { readPostImageSizes } from '@/lib/imageSize';
import { getAllPosts, getPostBySlug } from '@/lib/posts';

import PostContent from '../PostContent';

const OG_SIZE = { '/og.png': { width: 1200, height: 630 } };

function headingIds(html: string): string[] {
  return Array.from(html.matchAll(/<h[1-6][^>]*\bid="([^"]+)"/g), (m) => m[1]);
}

function allIds(html: string): string[] {
  return Array.from(html.matchAll(/\bid="([^"]+)"/g), (m) => m[1]);
}

function aliasIds(html: string): string[] {
  return Array.from(
    html.matchAll(/<span class="prose-anchor-alias" id="([^"]+)"/g),
    (m) => m[1],
  );
}

describe('PostContent', () => {
  it('renders measured local images during server rendering', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content="![A social card](/og.png)"
        imageSizes={{ '/og.png': { width: 1200, height: 630 } }}
      />,
    );

    expect(html).toContain('alt="A social card"');
    expect(html).toContain('width="1200"');
    expect(html).toContain('height="630"');
  });

  it('refuses to invent dimensions for a local image', () => {
    expect(() =>
      renderToStaticMarkup(<PostContent content="![Missing](/missing.png)" />),
    ).toThrow(
      'Missing measured dimensions for local article image: /missing.png',
    );
  });

  it('uses a draft-only fallback for an intentionally unpublished image', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content="![Private draft screenshot](/private-draft.png)"
        allowMissingLocalImages
      />,
    );

    expect(html).toContain('alt="Private draft screenshot"');
    expect(html).toContain('width="1200"');
    expect(html).toContain('height="675"');
  });

  it('retains a fallback for remote images', () => {
    const html = renderToStaticMarkup(
      <PostContent content="![Remote](https://example.com/image.png)" />,
    );

    expect(html).toContain('width="1200"');
    expect(html).toContain('height="675"');
  });
});

describe('PostContent figures', () => {
  it('promotes the site caption convention without repeating it as a tooltip', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={'Intro.\n\n![Alt](/og.png "July API spend: $9,986.20")\n'}
        imageSizes={OG_SIZE}
      />,
    );

    expect(html).toContain(
      '<figcaption class="prose-figcaption">July API spend: $9,986.20</figcaption>',
    );
    // The caption is visible copy; keeping the title would say it a second
    // time as a native tooltip and as the image's accessible description.
    expect(html).not.toContain('title="July API spend: $9,986.20"');
    expect(html).toContain('<figure class="prose-figure"');
  });

  it('keeps the tooltip on an image that stays inline', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={'Intro.\n\nInline ![Alt](/og.png "Hover copy") in a line.\n'}
        imageSizes={OG_SIZE}
      />,
    );

    expect(html).not.toContain('<figure');
    expect(html).toContain('title="Hover copy"');
  });

  it('does not emit an empty caption for a whitespace-only title', () => {
    const html = renderToStaticMarkup(
      <PostContent content={'![Alt](/og.png "   ")\n'} imageSizes={OG_SIZE} />,
    );

    expect(html).not.toContain('<figcaption');
  });

  it('renders the published contributions qualification as a figure caption', () => {
    const post = getPostBySlug('shipping-with-claude-code');
    if (!post) {
      throw new Error('expected shipping-with-claude-code to be published');
    }

    const html = renderToStaticMarkup(
      <PostContent
        content={post.content}
        imageSizes={readPostImageSizes(post.content)}
      />,
    );

    expect(html).toContain(
      '<figcaption class="prose-figcaption">GitHub counts commits, pull requests, reviews, and issue activity here; I use the total as a rough proxy for output.</figcaption>',
    );
    expect(html).not.toContain('title="GitHub counts');
  });

  it('promotes a standalone image to a figure without emitting one inside a paragraph', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={'Intro.\n\n![Alt](/og.png)\n\nOutro.\n'}
        imageSizes={OG_SIZE}
      />,
    );

    expect(html).toContain('<figure class="prose-figure"');
    expect(html).not.toContain('<p><figure');
    expect(html).not.toContain('<figcaption');
  });

  it('keeps a linked image a captioned figure', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={
          'Intro.\n\n[![Alt](/og.png "8,482 contributions")](https://example.com)\n'
        }
        imageSizes={OG_SIZE}
      />,
    );

    expect(html).toContain('<figure class="prose-figure"');
    expect(html).toContain('<a href="https://example.com">');
    expect(html).toContain('8,482 contributions</figcaption>');
    // The caption reaches an image one level down, so the tooltip must go too.
    expect(html).not.toContain('title="8,482 contributions"');
  });

  it('leaves a standalone raw-HTML embed alone', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={'Intro.\n\n<video src="/demo.mp4" controls></video>\n'}
      />,
    );

    // A `src` is not an image. Promoting one routes it through the build-time
    // image sizer, which only ever measures Markdown image syntax, so a local
    // clip took the whole static export down.
    expect(html).toContain('<video src="/demo.mp4"');
    expect(html).not.toContain('<figure');
  });

  it('leaves a paragraph that merely contains an image as a paragraph', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={'Intro.\n\nInline ![Alt](/og.png) inside a sentence.\n'}
        imageSizes={OG_SIZE}
      />,
    );

    expect(html).not.toContain('<figure');
    expect(html).toContain('Inline ');
  });

  it('publishes the build-measured width so a wide figure can exceed the reading measure', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={'Intro.\n\n![Wide](/wide.png)\n'}
        imageSizes={{ '/wide.png': { width: 1117, height: 812 } }}
      />,
    );

    expect(html).toContain('--figure-width:1117px');
  });
});

describe('PostContent code fences', () => {
  it('labels a fence with the language it already declares', () => {
    const html = renderToStaticMarkup(
      <PostContent content={'Intro.\n\n```bash\nnpm run dev\n```\n'} />,
    );

    expect(html).toContain(
      '<span class="prose-fence-lang" aria-hidden="true">bash</span>',
    );
    expect(html).toContain('<span class="sr-only">bash code block</span>');
  });

  it('does not add tab stops or landmark regions during server rendering', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={
          '```markdown\n@AGENTS.md\n```\n\n```markdown\n@CLAUDE.md\n```\n'
        }
      />,
    );

    expect(html).not.toContain('tabindex');
    expect(html).not.toContain('role="region"');
    expect(html).not.toContain('aria-label');
  });

  it('adds a tab stop only while the rendered fence actually overflows', () => {
    const { container } = render(
      <PostContent content={'```text\nA deliberately long line\n```\n'} />,
    );
    const pre = container.querySelector('pre');
    if (!pre) {
      throw new Error('expected a rendered code fence');
    }

    let clientWidth = 320;
    let scrollWidth = 640;
    Object.defineProperties(pre, {
      clientWidth: {
        configurable: true,
        get: () => clientWidth,
      },
      scrollWidth: {
        configurable: true,
        get: () => scrollWidth,
      },
    });

    act(() => window.dispatchEvent(new Event('resize')));
    expect(pre).toHaveAttribute('tabindex', '0');
    expect(pre).not.toHaveAttribute('role');

    clientWidth = 640;
    scrollWidth = 640;
    act(() => window.dispatchEvent(new Event('resize')));
    expect(pre).not.toHaveAttribute('tabindex');
  });

  it('scrolls an overflowing focused fence with horizontal arrow keys', () => {
    const { container } = render(
      <PostContent content={'```text\nA deliberately long line\n```\n'} />,
    );
    const pre = container.querySelector('pre');
    if (!pre) {
      throw new Error('expected a rendered code fence');
    }

    Object.defineProperties(pre, {
      clientWidth: {
        configurable: true,
        value: 320,
      },
      scrollWidth: {
        configurable: true,
        value: 640,
      },
    });

    fireEvent.keyDown(pre, { key: 'ArrowRight' });
    expect(pre.scrollLeft).toBe(40);

    fireEvent.keyDown(pre, { key: 'ArrowLeft' });
    expect(pre.scrollLeft).toBe(0);
  });

  it('leaves Shift+Arrow to the browser so a selection can still extend', () => {
    const { container } = render(
      <PostContent content={'```text\nA deliberately long line\n```\n'} />,
    );
    const pre = container.querySelector('pre');
    if (!pre) {
      throw new Error('expected a rendered code fence');
    }

    Object.defineProperties(pre, {
      clientWidth: {
        configurable: true,
        value: 320,
      },
      scrollWidth: {
        configurable: true,
        value: 640,
      },
    });

    // fireEvent returns false once the handler cancels the default action.
    const notCancelled = fireEvent.keyDown(pre, {
      key: 'ArrowRight',
      shiftKey: true,
    });

    expect(notCancelled).toBe(true);
    expect(pre.scrollLeft).toBe(0);
  });

  it('remeasures overflow when a retained fence receives new code', () => {
    let scrollWidth = 320;
    const { container, rerender } = render(
      <PostContent content={'```text\nshort\n```\n'} />,
    );
    const pre = container.querySelector('pre');
    if (!pre) {
      throw new Error('expected a rendered code fence');
    }

    Object.defineProperties(pre, {
      clientWidth: {
        configurable: true,
        get: () => 320,
      },
      scrollWidth: {
        configurable: true,
        get: () => scrollWidth,
      },
    });

    act(() => window.dispatchEvent(new Event('resize')));
    expect(pre).not.toHaveAttribute('tabindex');

    scrollWidth = 640;
    rerender(
      <PostContent
        content={
          '```text\nA replacement line that now exceeds the retained fence\n```\n'
        }
      />,
    );
    expect(container.querySelector('pre')).toBe(pre);
    expect(pre).toHaveAttribute('tabindex', '0');
  });

  it('does not invent a language plate for an unlabelled fence', () => {
    const html = renderToStaticMarkup(
      <PostContent content={'Intro.\n\n```\nultrathink: audit this\n```\n'} />,
    );

    expect(html).not.toContain('prose-fence-lang');
  });
});

/**
 * What a reader sees takes typographic quotes; what a machine or a keyboard
 * would use keeps the characters that were typed. `renderToStaticMarkup`
 * escapes a straight quote in text as an entity, so the two cannot be confused
 * in these assertions: `“` is the conversion, `&quot;` and `&#x27;` are the
 * originals.
 */
describe('PostContent typographic quotes', () => {
  it('converts prose and leaves a code span in the same paragraph alone', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={'She said "quoted" and typed `"code"`, and it\'s fine.\n'}
      />,
    );

    expect(html).toBe(
      '<p>She said “quoted” and typed <code>&quot;code&quot;</code>, and it’s fine.</p>',
    );
  });

  it('leaves a code fence alone', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={
          'Before "a".\n\n```js\nconst s = "it\'s";\n```\n\nAfter "b".\n'
        }
      />,
    );

    expect(html).toContain('const s = &quot;it&#x27;s&quot;;');
    expect(html).toContain('<p>Before “a”.</p>');
    expect(html).toContain('<p>After “b”.</p>');
  });

  it('leaves every attribute as it was typed', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={
          'See ["the title"](https://example.com/it\'s "it\'s a tip") and ![it\'s "alt"](https://example.com/a.png "it\'s here") now.\n'
        }
      />,
    );

    expect(html).toContain('href="https://example.com/it&#x27;s"');
    expect(html).toContain('title="it&#x27;s a tip"');
    expect(html).toContain('alt="it&#x27;s &quot;alt&quot;"');
    expect(html).toContain('title="it&#x27;s here"');
    // The link text is prose, and is the one part of that link a reader reads.
    expect(html).toContain('>“the title”</a>');
  });

  it('leaves raw HTML code and keyboard input alone, then resumes', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={
          "Press <kbd>'</kbd> or <code><b>\"x\"</b> it's</code> for \"quotes\", and <samp>'out'</samp> isn't prose.\n"
        }
      />,
    );

    expect(html).toContain('<kbd>&#x27;</kbd>');
    expect(html).toContain('<code><b>&quot;x&quot;</b> it&#x27;s</code>');
    expect(html).toContain('<samp>&#x27;out&#x27;</samp>');
    // Each verbatim element is left behind before the text after it is read.
    expect(html).toContain(' for “quotes”, and ');
    expect(html).toContain(' isn’t prose.');
  });

  it('converts prose inside ordinary raw HTML', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={'An <abbr title="it\'s">it\'s</abbr> and <b>"bold"</b>.\n'}
      />,
    );

    expect(html).toContain('<abbr title="it&#x27;s">it’s</abbr>');
    expect(html).toContain('<b>“bold”</b>');
  });

  it('leaves a bare URL and a bare address reading as their destinations', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={
          "It's at https://en.wikipedia.org/wiki/Zeno's_paradoxes or <o'brien@example.com>.\n"
        }
      />,
    );

    expect(html).toContain(
      '>https://en.wikipedia.org/wiki/Zeno&#x27;s_paradoxes</a>',
    );
    expect(html).toContain('>o&#x27;brien@example.com</a>');
    expect(html).toContain('<p>It’s at ');
  });

  it('opens a quotation that begins a block ahead of a link or emphasis', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={
          '"[A title](https://example.com)" by someone.\n\n- "*Move fast*" was the mantra\n\n## "`code`" in a heading\n'
        }
      />,
    );

    // Each quotation mark arrives as a text node of its own, with nothing in
    // it to say which way it faces.
    expect(html).toContain(
      '<p>“<a href="https://example.com">A title</a>” by someone.</p>',
    );
    expect(html).toContain('<li>“<em>Move fast</em>” was the mantra</li>');
    expect(html).toContain('>“<code>code</code>” in a heading</h2>');
  });

  it('closes a quotation that ends a block after a link', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={'They called it "[a title](https://example.com)"\n'}
      />,
    );

    expect(html).toBe(
      '<p>They called it “<a href="https://example.com">a title</a>”</p>',
    );
  });

  it('converts headings, lists, quotations, tables, and footnotes', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={
          '## What\'s changed\n\n- a user\'s session\n\n> It\'s "quoted".\n\n| "H" |\n| --- |\n| it\'s |\n\nA claim.[^n]\n\n[^n]: It\'s a "footnote".\n'
        }
      />,
    );

    expect(html).toContain('>What’s changed</h2>');
    expect(html).toContain('<li>a user’s session</li>');
    expect(html).toContain('<blockquote><p>It’s “quoted”.</p></blockquote>');
    expect(html).toContain('<th>“H”</th>');
    expect(html).toContain('<td>it’s</td>');
    expect(html).toContain('It’s a “footnote”.');
  });

  it('does not move a heading whose apostrophe it curls', () => {
    const html = renderToStaticMarkup(
      <PostContent content={'## What\'s "changed"\n'} />,
    );

    // Ids are planned from the source before anything is rendered.
    expect(headingIds(html)).toEqual([createHeadingId('What\'s "changed"')]);
    expect(headingIds(html)).toEqual(['whats-changed']);
    expect(html).toContain('>What’s “changed”</h2>');
  });

  it('hydrates the server markup without a mismatch', async () => {
    // The rule counts its way through verbatim elements. Strict Mode compiles
    // twice, so a count that leaked between passes would curl the `<kbd>` on
    // one side of hydration and not the other.
    const article = (
      <StrictMode>
        <PostContent
          content={
            'It\'s "quoted", <kbd>\'</kbd> then "more", and `"code"`.\n\n"[A title](https://example.com)" closes it.\n'
          }
        />
      </StrictMode>
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(article);
    document.body.append(container);

    const mismatches: unknown[] = [];
    let root: Root | undefined;
    await act(async () => {
      root = hydrateRoot(container, article, {
        onRecoverableError: (error) => mismatches.push(error),
      });
    });

    expect(mismatches).toEqual([]);
    expect(container.querySelector('kbd')).toHaveTextContent("'");
    expect(container.querySelector('code')).toHaveTextContent('"code"');
    expect(container).toHaveTextContent("It’s “quoted”, ' then “more”");
    expect(container).toHaveTextContent('“A title” closes it.');

    act(() => root?.unmount());
    container.remove();
  });

  it('leaves no typewriter quote against a letter in any published post', () => {
    // A quotation mark or apostrophe always touches a letter; a mark that
    // only touches digits is a measurement (`5'10"`) and is left as typed, so
    // a post that states one does not turn this red.
    const typewriterQuote = /\p{L}['"]|['"]\p{L}/u;
    const posts = getAllPosts();

    // The sources are written with a keyboard, so the loop below cannot pass
    // by there being nothing to convert.
    expect(posts.some((post) => typewriterQuote.test(post.content))).toBe(true);

    for (const post of posts) {
      const html = renderToStaticMarkup(
        <PostContent
          content={post.content}
          imageSizes={readPostImageSizes(post.content)}
        />,
      );
      const document = new DOMParser().parseFromString(html, 'text/html');
      // Code is typed, and a caption is an image's `title` attribute promoted
      // to the page: neither is a Markdown text node, so neither is converted.
      for (const literal of document.querySelectorAll(
        'pre, code, kbd, samp, figcaption',
      )) {
        literal.remove();
      }

      expect(document.body.textContent, post.slug).not.toMatch(typewriterQuote);
    }
  });
});

describe('PostContent heading anchors', () => {
  it('slugifies headings with the shared helper instead of a second scheme', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={
          '## On using `--dangerously-skip-permissions`\n\n## CLAUDE.md + AGENTS.md\n'
        }
      />,
    );

    expect(headingIds(html)).toEqual([
      createHeadingId('On using `--dangerously-skip-permissions`'),
      createHeadingId('CLAUDE.md + AGENTS.md'),
    ]);
    expect(headingIds(html)).toEqual([
      'on-using-dangerously-skip-permissions',
      'claude-md-agents-md',
    ]);
  });

  it('gives normalized duplicate headings deterministic unique ids', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={'## Repeat\n\n## Repeat\n\n## Répeat\n\n## !!!\n\n## ???\n'}
      />,
    );

    expect(headingIds(html)).toEqual([
      'repeat',
      'repeat-2',
      'repeat-3',
      'section',
      'section-2',
    ]);
    expect(new Set(allIds(html)).size, html).toBe(allIds(html).length);
  });

  it('keeps ids unique when a heading already ends in a generated suffix', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={
          '## Repeat\n\n## Repeat\n\n## Repeat 2\n\n## Repeat\n\n## !!!\n\n## Section\n\n## !!!\n'
        }
      />,
    );

    expect(headingIds(html)).toEqual([
      'repeat',
      'repeat-2',
      'repeat-2-2',
      'repeat-3',
      'section',
      'section-2',
      'section-3',
    ]);
    expect(new Set(allIds(html)).size).toBe(allIds(html).length);
  });

  it('keeps duplicate ids stable when Strict Mode repeats compilation', () => {
    const { container } = render(
      <StrictMode>
        <PostContent content={'## Repeat\n\n## Repeat\n\n## Répeat\n'} />
      </StrictMode>,
    );

    expect(headingIds(container.innerHTML)).toEqual([
      'repeat',
      'repeat-2',
      'repeat-3',
    ]);
  });

  it('emits anchor-clean ids for every heading in every published post', () => {
    for (const post of getAllPosts()) {
      const html = renderToStaticMarkup(
        <PostContent
          content={post.content}
          imageSizes={readPostImageSizes(post.content)}
        />,
      );

      for (const id of headingIds(html)) {
        expect(id, `${post.slug} → ${id}`).toBe(createHeadingId(id));
      }
    }
  });

  it('renders the real post whose headings the two schemes disagreed about', () => {
    const post = getPostBySlug('shipping-with-claude-code');
    if (!post) {
      throw new Error('expected shipping-with-claude-code to be published');
    }

    const html = renderToStaticMarkup(
      <PostContent
        content={post.content}
        imageSizes={readPostImageSizes(post.content)}
      />,
    );

    expect(headingIds(html)).toContain('on-using-dangerously-skip-permissions');
    expect(headingIds(html)).toContain('claude-md-agents-md');
    expect(headingIds(html)).not.toContain(
      'on-using---dangerously-skip-permissions',
    );
  });

  it('keeps the previously published ids resolving as hidden aliases', () => {
    const post = getPostBySlug('shipping-with-claude-code');
    if (!post) {
      throw new Error('expected shipping-with-claude-code to be published');
    }

    const html = renderToStaticMarkup(
      <PostContent
        content={post.content}
        imageSizes={readPostImageSizes(post.content)}
      />,
    );

    expect(aliasIds(html).sort()).toEqual(
      [
        'browser-automation---chrome-for-interaction-playwright-mcp-for-screenshots',
        'claudemd--agentsmd',
        'on-using---dangerously-skip-permissions',
        'plan-mode--writing-plans-to-files',
      ].sort(),
    );
    expect(new Set(allIds(html)).size).toBe(allIds(html).length);
  });

  it('keeps one legacy alias when a formerly duplicated heading repeats', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={
          '## On using `--dangerously-skip-permissions`\n\n## On using `--dangerously-skip-permissions`\n'
        }
      />,
    );

    expect(headingIds(html)).toEqual([
      'on-using-dangerously-skip-permissions',
      'on-using-dangerously-skip-permissions-2',
    ]);
    expect(aliasIds(html)).toEqual(['on-using---dangerously-skip-permissions']);
    expect(new Set(allIds(html)).size).toBe(allIds(html).length);
  });

  it('does not collide with raw HTML or footnote ids in the document', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={
          '<h2 id="custom">Raw heading</h2>\n\n## Custom\n\n[^note]\n\n[^note]: Footnote copy\n\n## note\n'
        }
      />,
    );

    expect(headingIds(html)).toEqual(['custom', 'custom-2', 'note-2']);
    expect(allIds(html)).toContain('note');
    expect(html).toContain('href="#note"');
    expect(new Set(allIds(html)).size, html).toBe(allIds(html).length);
  });

  it('preserves authored attributes on raw HTML headings', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={
          '<h2 id="kept" class="special" data-kind="example">Raw heading</h2>\n'
        }
      />,
    );

    expect(html).toContain(
      '<h2 class="special" data-kind="example" id="kept">',
    );
    expect(html).toContain('Raw heading</h2>');
  });

  it('keeps footnote links paired with the library-generated footer id', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={
          '## foo.bar\n\nA dotted footnote label.[^foo.bar]\n\n[^foo.bar]: Footnote copy\n'
        }
      />,
    );

    expect(headingIds(html)).toEqual(['foo-bar']);
    expect(html).toContain('href="#foobar"');
    expect(html).toContain('<div id="foobar">');
    expect(html).not.toContain('<div id="foo-bar">');
  });

  it('suppresses a legacy alias that would collide with another canonical id', () => {
    const html = renderToStaticMarkup(
      <PostContent content={'## Node.js\n\n## Nodejs\n'} />,
    );

    expect(headingIds(html)).toEqual(['node-js', 'nodejs']);
    expect(aliasIds(html)).toEqual([]);
  });

  it('emits no duplicate ids in any published post', () => {
    for (const post of getAllPosts()) {
      const html = renderToStaticMarkup(
        <PostContent
          content={post.content}
          imageSizes={readPostImageSizes(post.content)}
        />,
      );
      const ids = allIds(html);

      expect(new Set(ids).size, post.slug).toBe(ids.length);
    }
  });
});
