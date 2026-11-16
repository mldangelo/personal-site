import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import AboutContent from '@/components/About/Sections';
import PostContent from '@/components/Writing/PostContent';
import { prefixBasePath } from '../site-url.mjs';

// Rendered as a fork at https://user.github.io/repo/ publishes it.
vi.mock('../utils', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../utils')>()),
  BASE_PATH: '/repo',
  withBasePath: (path: string) => prefixBasePath('/repo', path),
}));

const RAW_HTML = [
  '<picture><source srcset="/a.webp 1x, /b,c.webp 2x" type="image/webp"><img src="/a.png" alt="A"></picture>',
  '',
  '<video src="/demo.mp4" poster="/poster.jpg"></video>',
  '',
  '<form action="/search/"><button formaction="/go/">Go</button><input type="image" src="/button.png" alt="Go"></form>',
].join('\n');

/** Every URL-bearing attribute value in the markup, in document order. */
const urls = (html: string) =>
  Array.from(
    html.matchAll(
      /\s(?:href|src|srcSet|srcset|poster|action|formAction|formaction)="([^"]*)"/g,
    ),
    (match) => match[1],
  );

describe('Markdown URLs on a project site', () => {
  it('prefixes every local address an author writes on About', () => {
    const html = renderToStaticMarkup(
      <AboutContent
        markdown={`# About\n\n![Portrait](/images/me.jpg) [Stats](/stats/) [Top](#about)\n\n${RAW_HTML}\n`}
      />,
    );

    expect(urls(html)).toEqual(
      expect.arrayContaining([
        '/repo/images/me.jpg',
        '/repo/stats/',
        '#about',
        '/repo/a.webp 1x, /repo/b,c.webp 2x',
        '/repo/a.png',
        '/repo/demo.mp4',
        '/repo/poster.jpg',
        '/repo/search/',
        '/repo/go/',
        '/repo/button.png',
      ]),
    );
    expect(urls(html).filter((url) => /^\/(?!repo\/)/.test(url))).toEqual([]);
  });

  it('prefixes raw media in a post and leaves other origins alone', () => {
    const html = renderToStaticMarkup(
      <PostContent
        imageSizes={{ '/a.png': { width: 16, height: 10 } }}
        content={`Intro.\n\n${RAW_HTML}\n\n[Elsewhere](https://example.com/a.png) [Bad](javascript:alert(1))\n`}
      />,
    );

    expect(urls(html)).toContain('https://example.com/a.png');
    expect(html).not.toContain('javascript:');
    expect(urls(html).filter((url) => /^\/(?!repo\/)/.test(url))).toEqual([]);
  });
});
