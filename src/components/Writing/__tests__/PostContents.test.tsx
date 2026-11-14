import { render, within } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { readPostImageSizes } from '@/lib/imageSize';
import { getAllPosts } from '@/lib/posts';

import PostContent from '../PostContent';
import PostContents from '../PostContents';

describe('PostContents', () => {
  it('links main sections to their rendered ids, including collisions', () => {
    const content = [
      '<span id="repeat"></span>',
      '> ## Repeat',
      '## Repeat',
      '### Detail',
      '```md\n## Example only\n```',
      '## Repeat',
      '## A **bold** [link](https://example.com) and `--flag`',
    ].join('\n\n');
    const { container, getByRole } = render(
      <>
        <PostContents content={content} />
        <PostContent content={content} />
      </>,
    );
    const links = within(
      getByRole('navigation', { name: 'On this page' }),
    ).getAllByRole('link', { hidden: true });

    expect(links.map((link) => link.textContent)).toEqual([
      'Repeat',
      'Repeat',
      'A bold link and --flag',
    ]);
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '#repeat-3',
      '#repeat-4',
      '#a-bold-link-and-flag',
    ]);
    for (const link of links) {
      const target = container.querySelector(link.getAttribute('href') ?? '');
      expect(target?.tagName).toBe('H2');
      expect(target?.closest('blockquote')).toBeNull();
    }
  });

  it.each(['Intro only.', '## One section\n\n### A detail'])(
    'omits unnecessary navigation for a short article: %s',
    (content) => {
      expect(renderToStaticMarkup(<PostContents content={content} />)).toBe('');
    },
  );

  it('ships working contents links in the initial HTML of published posts', () => {
    for (const post of getAllPosts()) {
      const html = renderToStaticMarkup(
        <>
          <PostContents content={post.content} />
          <article>
            <PostContent
              content={post.content}
              imageSizes={readPostImageSizes(post.content)}
            />
          </article>
        </>,
      );
      const document = new DOMParser().parseFromString(html, 'text/html');
      const links = document.querySelectorAll('nav a');
      const headings = document.querySelectorAll('article > h2');

      expect(links.length, post.slug).toBe(
        headings.length < 2 ? 0 : headings.length,
      );
      for (const link of links) {
        const id = link.getAttribute('href')?.slice(1) ?? '';
        expect(document.getElementById(id)?.tagName, `${post.slug}#${id}`).toBe(
          'H2',
        );
      }
    }
  });
});
