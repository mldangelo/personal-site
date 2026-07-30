import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';
import { describe, expect, it } from 'vitest';

import { markdownRouteHref, ProseLink } from '@/lib/markdownLinks';
import { SITE_URL } from '@/lib/utils';

/**
 * `ProseLink` is a pure function of its props, so calling it returns the
 * element it chose. Asserting on the element's `type` names the component
 * directly — `next/link` renders a plain `<a>` into the DOM, so nothing in the
 * rendered markup can tell the two branches apart.
 */
function chosen(props: ComponentPropsWithoutRef<'a'>) {
  const element = ProseLink(props) as ReactElement<
    ComponentPropsWithoutRef<'a'>
  >;

  return { type: element.type, props: element.props };
}

describe('markdownRouteHref', () => {
  it('routes internal paths, normalised to the exported trailing slash', () => {
    const cases: [string, string][] = [
      ['/', '/'],
      ['/about', '/about/'],
      ['/about/', '/about/'],
      [
        '/writing/shipping-with-claude-code/',
        '/writing/shipping-with-claude-code/',
      ],
      // A route whose own segment holds a dot is still a route: the trailing
      // slash is what separates a route from a file.
      ['/writing/claude.md-notes/', '/writing/claude.md-notes/'],
    ];

    for (const [href, route] of cases) {
      expect(markdownRouteHref(href), href).toBe(route);
    }
  });

  it('keeps a fragment and a query on the routed href', () => {
    expect(markdownRouteHref('/writing/post#verification-layers')).toBe(
      '/writing/post/#verification-layers',
    );
    expect(markdownRouteHref('/writing?tag=agents')).toBe(
      '/writing/?tag=agents',
    );
  });

  it('routes an absolute URL that addresses this site', () => {
    expect(markdownRouteHref(`${SITE_URL}/about`)).toBe('/about/');
    expect(markdownRouteHref(SITE_URL)).toBe('/');
  });

  it('leaves an exported file to the host rather than the router', () => {
    for (const href of [
      '/feed.xml',
      '/sitemap.xml',
      '/resume.json',
      '/og.png',
      '/OG.PNG',
      '/images/writing/api-costs-july-2025.png',
      `${SITE_URL}/feed.xml`,
    ]) {
      expect(markdownRouteHref(href), href).toBeNull();
    }
  });

  it('leaves everything that is not a same-origin route native', () => {
    for (const href of [
      // Same-document scroll, not a navigation.
      '#some-history',
      'mailto:michael@example.com',
      'tel:+15551234567',
      'https://example.com/',
      'https://example.com/about',
      // Protocol-relative, which shares its prefix with a rooted path.
      '//example.com/about',
      // The URL parser reads a leading `/\` as an authority too, so a rooted
      // path is not automatically same-origin.
      '/\\evil.com/about',
      // Same host, but not the canonical origin.
      'http://mldangelo.com/about',
      // Relative references: the browser resolves these against the document
      // URL, and nothing in the site's prose writes one.
      'sibling/page/',
      '../other/',
      './same/',
      '',
      undefined,
    ]) {
      expect(markdownRouteHref(href), String(href)).toBeNull();
    }
  });
});

describe('ProseLink', () => {
  it('hands an internal href to next/link as a normalised route', () => {
    const internal = chosen({ href: '/', children: 'Good design' });

    expect(internal.type).toBe(Link);
    expect(internal.props.href).toBe('/');
    expect(internal.props.children).toBe('Good design');

    expect(chosen({ href: '/writing/post' }).props.href).toBe('/writing/post/');
  });

  it('leaves an external href a native anchor, byte for byte', () => {
    const external = chosen({ href: 'https://openai.com', children: 'OpenAI' });

    expect(external.type).toBe('a');
    expect(external.props.href).toBe('https://openai.com');
    expect(external.props.children).toBe('OpenAI');
  });

  it('carries a Markdown title through either branch', () => {
    expect(chosen({ href: '/about', title: 'About me' }).props.title).toBe(
      'About me',
    );
    expect(
      chosen({ href: 'https://example.com', title: 'Example' }).props.title,
    ).toBe('Example');
  });

  it('adds no class to either branch, so prose links keep their underline', () => {
    // `app/styles/base/links.css` paints the accent underline on `p a`;
    // per AGENTS.md only navigation-like links opt out of it.
    expect(chosen({ href: '/about' }).props.className).toBeUndefined();
    expect(
      chosen({ href: 'https://example.com' }).props.className,
    ).toBeUndefined();
  });

  it('keeps a new-tab affordance an author supplied', () => {
    const external = chosen({
      href: 'https://example.com',
      target: '_blank',
      rel: 'noopener noreferrer',
    });

    expect(external.props.target).toBe('_blank');
    expect(external.props.rel).toBe('noopener noreferrer');
  });
});
