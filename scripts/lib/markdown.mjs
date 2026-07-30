/**
 * Reading the assets a post declares out of its own Markdown source.
 *
 * `verify-export.mjs` gates draft leaks two ways, and this is the half that does
 * not depend on naming. A slug rule can only see what the build *derives* from a
 * post — the share card is `og/writing/<slug>.png` by construction, and a leaked
 * route's RSC payload sits inside `writing/<slug>/` — but an author's
 * screenshots are filed wherever the author filed them. The draft in this
 * repository keeps three in `public/images/writing/codex-desktop-app-post/`, a
 * directory name that is not the slug and is not derived from it, so no filename
 * rule could ever have caught them.
 *
 * What can see them is the post itself. A post declares its images: the `image`
 * frontmatter field, and every image reference in the body. Reading that
 * declaration binds an exported file to the post it belongs to whatever the
 * directory is called, which is why the two checks are complementary rather than
 * alternatives — keep both.
 *
 * These are regexes rather than a Markdown parser for the same reason
 * `html.mjs` scrapes markup as text: this runs after the build, and the site's
 * own renderer (`markdown-to-jsx`) is a browser-oriented dependency that a gate
 * has no business booting. The failure mode is chosen to match: a construct
 * these patterns cannot read is *missed*, never mis-attributed, so the gate
 * under-reports rather than failing a build over a file it invented.
 */
import { attribute, tags } from './html.mjs';

/**
 * `![alt](destination "title")`, capturing the destination.
 *
 * The destination stops at whitespace, so a title is left behind, or is the
 * angle-bracketed form, which is how CommonMark spells a path containing
 * spaces. Alt text is `[^\]]*`: a nested bracket inside alt ends the match
 * early and the reference is missed, which is the safe direction. A linked
 * image (`[![alt](src)](href)`) still matches, because the inner image is a
 * complete reference on its own — that form is in use here, so it is not
 * hypothetical.
 */
const MARKDOWN_IMAGE = /!\[[^\]]*\]\(\s*(<[^<>]*>|[^\s)]*)/g;

/**
 * A URL scheme or the protocol-relative form. Both name a host, so neither can
 * be a file in this export.
 */
const OFF_SITE = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

/**
 * A reference resolved to the route its file occupies in the export, or
 * `undefined` when it is not a local file at all.
 *
 * Root-relative only. That is the form `validatePostFrontmatter` in
 * `src/lib/posts.ts` already requires of `image`, and the only form that
 * resolves to the same file from every route once `trailingSlash: true` has
 * given each post its own directory. A document-relative reference is therefore
 * not silently reinterpreted here; it is declined, because guessing the base it
 * was written against is how a gate ends up naming the wrong file.
 *
 * The result is a route — `out/` is the site root on disk, and a
 * repository-site base path is not — so a caller comparing it against the
 * export has to put the base path back with `publicPathForRoute` first.
 */
export function assetRoute(reference) {
  if (typeof reference !== 'string') return undefined;

  let value = reference.trim();
  if (value.startsWith('<') && value.endsWith('>')) {
    value = value.slice(1, -1).trim();
  }

  if (!value || OFF_SITE.test(value) || !value.startsWith('/')) {
    return undefined;
  }

  // A query or fragment on an image is decoration; the file is the same file.
  const route = value.replace(/[?#].*$/, '');
  return route === '/' ? undefined : route;
}

/**
 * Every local asset route one post declares.
 *
 * Fenced code is deliberately *not* stripped, unlike the word and reference
 * counts in `og-inputs.mjs`. Those measure what a reader sees; this asks which
 * files belong to this post, and a path an author wrote inside a fence is still
 * that answer. The cost of including it — a draft quoting a path a published
 * post also uses — is paid by the caller, which subtracts what published posts
 * declare before reporting anything.
 *
 * Inline `<img>` is read as well as Markdown image syntax, because
 * `markdown-to-jsx` renders raw HTML and so a post may legitimately be written
 * that way.
 */
export function declaredAssetRoutes({ data, content } = {}) {
  const body = typeof content === 'string' ? content : '';
  const references = [
    data?.image,
    ...[...body.matchAll(MARKDOWN_IMAGE)].map((match) => match[1]),
    ...tags(body, 'img').map((tag) => attribute(tag, 'src')),
  ];

  const routes = new Set();
  for (const reference of references) {
    const route = assetRoute(reference);
    if (route !== undefined) routes.add(route);
  }
  return routes;
}

/**
 * Assets declared by a draft and by no published post, mapped to the draft that
 * declared each.
 *
 * The subtraction is the point. An illustration shared between a draft and a
 * published post has to ship, and reporting it would be a false positive of
 * exactly the kind the slug scan was narrowed to avoid — a committed file that
 * nothing derived from an unpublished post, named as a draft leak. Where two
 * drafts declare the same file the first by scan order is named; the file is
 * one file either way and the message only needs to point somewhere real.
 *
 * `posts` entries are `{ slug, isDraft, assets }`, where `assets` is the set
 * from `declaredAssetRoutes`.
 */
export function draftOnlyAssetRoutes(posts) {
  const published = new Set();
  for (const post of posts) {
    if (!post.isDraft) {
      for (const route of post.assets) published.add(route);
    }
  }

  const owners = new Map();
  for (const post of posts) {
    if (!post.isDraft) continue;
    for (const route of post.assets) {
      if (published.has(route) || owners.has(route)) continue;
      owners.set(route, post.slug);
    }
  }
  return owners;
}
