import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { WritingItem } from '@/lib/writing';

import PostOnward from '../PostOnward';

function essay(title: string, slug: string): WritingItem {
  return {
    title,
    url: `/writing/${slug}/`,
    date: '2026-01-05',
    description: '',
    isExternal: false,
    source: 'On this site',
  };
}

const NEWER = essay('Notes on the "vulnerability" report', 'newer-essay');
const OLDER = essay("What's changed since", 'older-essay');

/**
 * `next/link` drops the configured trailing slash in this environment: the
 * setting is build-time config the unit tests never apply. Normalise it away
 * rather than pin whichever shape happens to render here.
 */
const withoutTrailingSlash = (href: string | null) => href?.replace(/\/$/, '');

describe('PostOnward', () => {
  it('is a named landmark, so it can be told from the site navigation', () => {
    render(<PostOnward newer={NEWER} older={OLDER} />);

    expect(
      screen.getByRole('navigation', { name: 'More writing' }),
    ).toBeInTheDocument();
  });

  it('links both neighbours, each under a label saying which way it lies', () => {
    render(<PostOnward newer={NEWER} older={OLDER} />);

    const newer = screen.getByRole('link', { name: /^Newer: / });
    const older = screen.getByRole('link', { name: /^Older: / });

    expect(withoutTrailingSlash(newer.getAttribute('href'))).toBe(
      '/writing/newer-essay',
    );
    expect(withoutTrailingSlash(older.getAttribute('href'))).toBe(
      '/writing/older-essay',
    );
    // In reading order the newer essay comes first, as it does in the index.
    expect(
      newer.compareDocumentPosition(older) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('sets the titles with typographic quotes', () => {
    render(<PostOnward newer={NEWER} older={OLDER} />);

    expect(
      screen.getByRole('link', {
        name: 'Newer: Notes on the “vulnerability” report',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Older: What’s changed since' }),
    ).toBeInTheDocument();
  });

  /**
   * The name is stated, because browsers join the two stacked lines three
   * different ways. A stated name can drift from what is on screen, so the
   * visible text has to be exactly what it says, in the same order.
   */
  it('names each link with the words a reader sees in it', () => {
    render(<PostOnward newer={NEWER} older={OLDER} />);

    for (const link of screen.getAllByRole('link', {
      name: /^(Newer|Older): /,
    })) {
      const [label, title] = [...link.children].map((line) => line.textContent);

      expect(link.children).toHaveLength(2);
      expect(link.getAttribute('aria-label')).toBe(`${label}: ${title}`);
    }
  });

  it.each([
    ['newest', { older: OLDER }, 'Older', 'Newer'],
    ['oldest', { newer: NEWER }, 'Newer', 'Older'],
  ] as const)(
    'offers the %s essay only the neighbour it has',
    (_position, neighbours, present, absent) => {
      render(<PostOnward {...neighbours} />);

      expect(
        screen.getByRole('link', { name: new RegExp(`^${present}: `) }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('link', { name: new RegExp(`^${absent}`) }),
      ).not.toBeInTheDocument();
      expect(screen.queryByText(absent)).not.toBeInTheDocument();
    },
  );

  it('still leads back to the list and the feed when an essay stands alone', () => {
    const { container } = render(<PostOnward />);
    const nav = screen.getByRole('navigation', { name: 'More writing' });

    expect(container.querySelector('.post-onward-neighbours')).toBeNull();
    expect(within(nav).getAllByRole('link')).toHaveLength(2);
  });

  it('leads back to the writing index', () => {
    render(<PostOnward newer={NEWER} older={OLDER} />);

    const all = screen.getByRole('link', { name: 'All writing' });

    expect(withoutTrailingSlash(all.getAttribute('href'))).toBe('/writing');
    // The arrow is a direction, not part of the name.
    expect(all).toHaveTextContent('← All writing');
    expect(all.querySelector('[aria-hidden="true"]')).toHaveTextContent('←');
  });

  it('links the feed with an href that survives a repository base path', () => {
    render(<PostOnward newer={NEWER} older={OLDER} />);

    const feed = screen.getByRole('link', { name: 'RSS Feed' });
    const href = feed.getAttribute('href');

    expect(feed).toHaveTextContent('RSS');
    expect(feed).toHaveAttribute('title', 'RSS Feed');
    // A native link to a file-like route: Next will not prefix it, so it has
    // to resolve from an article's own URL in both deployments.
    expect(href).not.toMatch(/^\//);
    expect(
      new URL(href!, 'https://example.com/writing/an-essay/').pathname,
    ).toBe('/feed.xml');
    expect(
      new URL(href!, 'https://example.com/personal-site/writing/an-essay/')
        .pathname,
    ).toBe('/personal-site/feed.xml');
  });
});
