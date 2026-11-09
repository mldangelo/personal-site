# Adapting This Website

A coding agent can handle the repository changes once you provide your
identity, content, assets, and target URL. You decide what to publish, and
account or DNS changes still require your approval.

## Set up the workspace

Fork the repository and start the site as the README's
[Get started](../README.md#get-started) section describes, then open
[http://localhost:3000](http://localhost:3000).

## Copyable requests

Use the full rebrand prompt in the
[README](../README.md#adapt-it-with-a-coding-agent) for a first pass. For a
smaller change, copy one of these.

### Manage writing

```text
Read AGENTS.md and work on a topic branch. Do not commit, push, merge, or change
account settings unless I explicitly authorize it.
Manage writing for this site as follows: [ADD, UPDATE, OR REMOVE CONTENT].
Use content/writing/ for local posts and src/data/writing.ts for external
links. Preserve draft isolation, RSS, the homepage writing section, metadata,
and valid post slugs. Pair each frontmatter `image` with `imageAlt`, and give
Markdown images descriptive alt text. Keep at least one published post unless I
asked you to remove writing completely. Run the full validation suite and
report unresolved content decisions or validation failures.
```

### Remove a page or feature

```text
Read AGENTS.md and work on a topic branch. Do not commit, push, merge, or change
account settings unless I explicitly authorize it.
Remove [PAGE OR FEATURE] completely. Before deleting anything, trace its route,
navigation entry, homepage references, data imports, sitemap entries, schema,
feed integration, styles, tests, and export verifier checks. Do not change
unrelated routes or URLs. Run the full validation suite and report any
remaining references.
```

### Change the visual identity

```text
Read AGENTS.md and work on a topic branch. Do not commit, push, merge, or change
account settings unless I explicitly authorize it.
Rebrand the visual identity using [COLORS], [FONTS], [PORTRAIT], and
[DESIGN DIRECTION]. Work through the existing semantic tokens. Keep light and
dark themes, print behavior, accessibility, and the signal-color rules intact.
Regenerate and verify the share cards and the icon set, then run the full
validation suite.
```

### Prepare deployment

```text
Read AGENTS.md and work on a topic branch. Do not commit, push, merge, or change
account settings unless I explicitly authorize it.
Read the deployment reference in docs/adapting-guide.md, then prepare this
repository for [FINAL URL] on [HOST]. Make every required repository change,
run the full validation suite, and inspect out/. Do not create secrets or
modify DNS. Report the exact external steps that remain.
```

### Add a social link

```text
Read AGENTS.md and work on a topic branch. Do not commit, push, merge, or change
account settings unless I explicitly authorize it.
Add my [PLATFORM] profile at [URL]. Follow the existing src/data/contact.ts
pattern, copying the icon's viewBox and path from a freely licensed set and
crediting it in the attribution comment. Update affected tests, run the
relevant checks, and show me the diff.
```

### Add Google Analytics

```text
Read AGENTS.md and work on a topic branch. Do not commit, push, merge, or change
account settings unless I explicitly authorize it.
Configure this fork to use GA4 measurement ID [G-XXXXXXX]. Use the existing
NEXT_PUBLIC_GA_TRACKING_ID integration. Put the local value in .env.local and
keep that file untracked. Tell me which GitHub repository variable production
needs.
```

## Reference map

### Identity and contact details

Identity data starts in shared files, but some text and links are hard-coded.

| Content                                                        | Location                                                             |
| -------------------------------------------------------------- | -------------------------------------------------------------------- |
| Name, role, employer, location, email, and personal statistics | `src/data/profile.json`                                              |
| Canonical URL, social handle, descriptions, and image settings | `src/lib/utils.ts`                                                   |
| Social links                                                   | `src/data/contact.ts`                                                |
| Homepage biography and employer links                          | `src/components/Template/Hero.tsx`                                   |
| Logo initials                                                  | `src/components/Template/Navigation.tsx`                             |
| Footer source link                                             | `src/components/Template/Footer.tsx`                                 |
| Portrait                                                       | `public/images/me.jpg`, with its path and size in `src/lib/utils.ts` |
| Web app name and icon monogram                                 | Derived from `src/data/profile.json` by `npm run icons`              |
| Sitemap URL for crawlers                                       | `public/robots.txt`                                                  |
| Writing description, on `/writing/` and in the RSS feed        | `WRITING_DESCRIPTION` in `src/lib/schema.ts`                         |
| Repository statistics and GitHub API URL                       | `SOURCE_REPOSITORY` in `src/lib/telemetry.ts`                        |
| Vulnerability reporting contact                                | `SECURITY.md`                                                        |

Page titles and descriptions also contain personal copy in `app/layout.tsx` and
the `page.tsx` files under `app/`. Structured data is assembled in
`src/lib/schema.ts`.

### About, résumé, and projects

| Content        | Location                     |
| -------------- | ---------------------------- |
| About page     | `src/data/about.ts`          |
| Work history   | `src/data/resume/work.ts`    |
| Education      | `src/data/resume/degrees.ts` |
| Skills         | `src/data/resume/skills.ts`  |
| Courses        | `src/data/resume/courses.ts` |
| Projects       | `src/data/projects.ts`       |
| Project images | `public/images/projects/`    |

The current role appears in the profile, homepage, résumé, and page metadata.
Update those together.

### Writing

Writing comes from two places:

- Markdown posts in `content/writing/`
- External articles in `src/data/writing.ts`

Both sources appear on `/writing/`. Dated entries can also appear on the
homepage and in the RSS feed.

Local posts are Markdown files. The filename becomes the URL slug, so
`my-post.md` becomes `/writing/my-post/`. Valid filenames use lowercase letters
and numbers separated by single hyphens.

```markdown
---
title: 'Your Post Title'
date: '2026-01-15'
description: 'A short description for previews and search results.'
---

Your content here.
```

The required fields are `title`, `date`, and `description`. `draft: true` shows
a post during development without including it in the production export. An
optional `image` must be paired with `imageAlt`. Images, in the frontmatter or
the body, use root-relative paths to files under `public/`, such as
`/images/writing/my-post/figure.png`.

The production export requires at least one published post. It cannot build the
dynamic post route when `generateStaticParams()` has no published slugs.

Removing the Writing entry from `src/data/routes.ts` only takes it out of
navigation; the routes, feed, and homepage section remain. To remove writing
entirely, use the request under
[Remove a page or feature](#remove-a-page-or-feature).

### Visual identity

| Setting                    | Location                                |
| -------------------------- | --------------------------------------- |
| Light and dark colors      | `app/styles/tokens/colors.css`          |
| Type scale                 | `app/styles/tokens/typography.css`      |
| Font files and assignments | `app/fonts.ts`                          |
| Icons and web app manifest | `scripts/generate-icons.mjs`            |
| Default metadata           | `app/layout.tsx`, `src/lib/metadata.ts` |
| Share-card generator       | `scripts/generate-og.mjs`               |

The icon set is generated, not hand-drawn: `npm run icons` renders the monogram
from the colour tokens and your name in `src/data/profile.json`, writing
`app/favicon.ico`, `app/icon.png`, `app/apple-icon.png`, `app/manifest.json`,
and the manifest icons under `public/images/icons/`. Commit them with
`scripts/icons.meta.json`; a test fails when they fall behind the tokens.

The share cards are generated the same way. After changing the profile fields
they show, their design, the colour tokens, or a published post, run
`npm run og` and commit `public/og.png`, `public/og/writing/`, and the
`public/og.meta.json` ledger together. `npm run og:check` re-renders every card
from checksum-pinned fonts and compares it byte for byte, so it needs network
access and Sharp; `npm run og:check:ledger` is its offline half. Both ledgers
record the locked Next, React, and Sharp versions, so upgrading any of them
means running `npm run icons` and `npm run og` even when no pixel changes.

Keep draft-only screenshots and downloads outside `public/`, which ships
verbatim. A draft can still reference them while you write, and
`npm run verify-export` fails if a file referenced only by a draft reaches
`out/`.

## Audit the result

Require the final search output and validation results, not only a completion
claim. This search covers the current name, domain, handle, employer, and
repository:

```bash
rg -n -i "Michael|mldangelo|dangelosaurus|mldangelo\\.com|OpenAI|Promptfoo" \
  app content public scripts src package.json README.md
```

Repeat it with any other upstream names or URLs the search uncovers. This
catches details in page descriptions, tests, images, and links that a checklist
can miss.

Some tests assert the site's public content, so exact-text expectations may
need updates. Do not weaken structural checks for metadata, canonical URLs,
draft isolation, accessibility, or export integrity.

The full validation suite is the command list under
[Validate the change](./contributing.md#validate-the-change) in the
contributing guide.

## Deployment reference

### Changes inside the repository

A coding agent can prepare and verify the repository:

- Set `SITE_URL` in `src/lib/utils.ts` to the final public URL without a
  trailing slash.
- Set `homepage` in `package.json` to the same URL with a trailing slash.
- Update `public/robots.txt` and other URL-bearing files.
- Build the site and inspect `out/`.

The site works as written at a root URL, such as a custom domain. A GitHub user
or organization site also has a root URL, but its repository must be named
[`<owner>.github.io`](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).
A fork left under another repository name is a project site at
`https://YOUR-USER.github.io/REPOSITORY/` and needs more work. The workflow
injects Next's `basePath`, but raw asset paths and absolute URLs created by the
application still assume a root deployment. Updating `SITE_URL` and `homepage`
alone is not enough for that case.

### Actions outside the repository

GitHub settings, deployment accounts, and DNS changes require account access.
An agent can perform them only with explicit authorization.

For GitHub Pages:

1. In the fork's **Actions** tab, enable workflows. GitHub
   [disables workflows in forks by default](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflows-in-forked-repositories).
2. To use the default root URL without a custom domain, rename the fork to
   `YOUR-USER.github.io` in **Settings > General**.
3. In **Settings > Pages**, choose **GitHub Actions** as the source.
4. For a custom domain,
   [verify the domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
   in your profile or organization settings before attaching it to the
   repository.
5. Add the custom domain in **Settings > Pages** before changing its routing
   records.
6. Configure DNS using
   [GitHub's custom-domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
7. After reviewing the branch, push or merge it to `main` to deploy.

GitHub ignores `public/CNAME` when a custom Actions workflow publishes the
site. The agent can delete the upstream file from the fork.

For another static host, the agent can build `out/` and prepare the deployment.
Uploading it to the hosting account still requires explicit authorization. A
subpath deployment also needs a matching Next `basePath` and an audit of raw
assets and absolute URL construction.

### Security boundaries and hosting headers

Everything the site publishes, including the public résumé and About page, is
authored in repository files and reviewed like code. There is no CMS, upload,
or user-supplied Markdown, and the Markdown renderer keeps its default
sanitization. Treat any external content source you add as a new trust
boundary.

Only the deployment job can write to Pages. The build reads Pages settings to
configure Next's base path and fetches public GitHub statistics without a token;
when that anonymous API is rate limited, `/stats` shows its last-known counts as
floors instead of failing the export. Keep actions pinned to full commit SHAs;
Dependabot maintains the pins.

GitHub Pages sets the HTTP response headers, and it sends no `X-Frame-Options`,
CSP `frame-ancestors`, or `X-Content-Type-Options: nosniff`. Nothing in this
repository can add them: Next's `headers()` and Helmet need a running server,
Pages does not read a `_headers` file, and
[`frame-ancestors` is ignored in a meta policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors).
If those headers become a requirement, put the site behind an approved proxy or
host that sets them, then verify the deployed responses. Do not add meta tags or
frame-busting JavaScript to quiet a scanner. The site has no authenticated
actions, and no concrete clickjacking or MIME-sniffing exploit is known.

## Troubleshooting

| Problem                                 | Check                                                                                         |
| --------------------------------------- | --------------------------------------------------------------------------------------------- |
| `EBADENGINE` warning or install failure | Run `nvm install`, then retry `npm ci`                                                        |
| Port 3000 is in use                     | Run `npm run dev -- -p 3001`                                                                  |
| Images do not appear                    | Use a URL such as `/images/photo.jpg`, not `public/images/photo.jpg`                          |
| `missing "generateStaticParams()"`      | Keep at least one published Markdown post                                                     |
| Assets return 404 on a project site     | Review the repository subpath limitation in the [deployment reference](#deployment-reference) |
| The export verifier fails               | Run `npm run build` first, then inspect the named file or route                               |

## Getting help

Open an [issue](https://github.com/mldangelo/personal-site/issues) when the
instructions are unclear or appear to be wrong.
