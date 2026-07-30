/**
 * Markdown link routing: which prose links the App Router should intercept.
 *
 * Every hand-written link to a route goes through `next/link` — the only native
 * internal anchors are fragments and `/feed.xml` — but Markdown link syntax
 * does not: `markdown-to-jsx` renders a native `<a>`, so `[Good design](/)` in
 * `src/data/about.ts` shipped a same-origin cross-document navigation from a
 * page that is otherwise entirely client-routed. A full document load is slower
 * than a client navigation and it throws away scroll restoration.
 *
 * Both prose surfaces (`About/Sections`, `Writing/PostContent`) share this one
 * override, so the classification cannot drift between them.
 */
import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';

import { SITE_URL } from './utils';

const SITE_ORIGIN = new URL(SITE_URL).origin;

/**
 * A final path segment carrying an extension — `/feed.xml`, `/resume.json`,
 * `/og.png`. `trailingSlash: true` means every *route* in the export ends in a
 * slash, so a last segment with a dot in it is a file the host serves
 * directly, not something the router can navigate to.
 */
const FILE_SEGMENT = /\.[a-z0-9]+$/i;

/**
 * The route to hand `next/link`, or `null` when the link must stay a native
 * `<a>`.
 *
 * Internal means same-origin and addressable by the router: a rooted path, or
 * an absolute URL naming this site. Those come back rooted and
 * slash-normalised, because `trailingSlash: true` makes `/about/` the
 * canonical form and prose writes both spellings.
 *
 * Everything else stays native, and `internalUrl` is where each case is
 * decided: an off-site URL, a protocol-relative `//host/path`, a `mailto:` or
 * `tel:` (or any other scheme, which has no origin to match), a bare
 * `#fragment` — a same-document scroll rather than a navigation — and a
 * relative reference such as `sibling/` or `../other/`. The browser resolves a
 * relative reference against the document URL and the router would resolve it
 * against the current route; rather than reason about whether those agree
 * under `trailingSlash: true`, they are left to the browser. Nothing in
 * `content/writing/` or `src/data` writes one.
 */
export function markdownRouteHref(href: string | undefined): string | null {
  if (!href) {
    return null;
  }

  const url = internalUrl(href);
  if (!url) {
    return null;
  }

  const lastSegment = url.pathname.slice(url.pathname.lastIndexOf('/') + 1);
  if (FILE_SEGMENT.test(lastSegment)) {
    return null;
  }

  const pathname = url.pathname.endsWith('/')
    ? url.pathname
    : `${url.pathname}/`;

  return `${pathname}${url.search}${url.hash}`;
}

/**
 * The parsed URL when `href` addresses this site, otherwise `undefined`.
 *
 * Only a rooted path gets this site as its base; anything else has to name the
 * origin itself, and a bare fragment or a relative reference therefore fails to
 * parse. The origin comparison still applies to rooted paths, because a leading
 * `//` — or a `/\`, which the URL parser treats the same way — turns one into
 * an authority and would otherwise route an off-site host as a local path.
 */
function internalUrl(href: string): URL | undefined {
  // Chosen outside the `try`, which is there to catch an unparseable URL and
  // must not also swallow a type error from a caller that skipped its guard.
  const base = href.startsWith('/') ? SITE_URL : undefined;

  let url: URL;
  try {
    url = new URL(href, base);
  } catch {
    return undefined;
  }

  return url.origin === SITE_ORIGIN ? url : undefined;
}

/**
 * A Markdown link.
 *
 * Props pass through untouched in both branches: a Markdown title is the
 * anchor's `title`, and neither branch may add a class — `p a`, `.prose a`, and
 * `.about-content a` paint the accent underline that marks these as prose
 * links, and per AGENTS.md only navigation-like links opt out of that.
 */
export function ProseLink({ href, ...rest }: ComponentPropsWithoutRef<'a'>) {
  const route = markdownRouteHref(href);

  if (route === null) {
    return <a {...rest} href={href} />;
  }

  return <Link {...rest} href={route} />;
}

/** Spread into any `markdown-to-jsx` `overrides` object. */
export const PROSE_LINK_OVERRIDES = {
  a: { component: ProseLink },
};
