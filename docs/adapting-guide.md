# Adapting This Website

A coding agent can make every repository change once you provide your
identity, content, assets, and target URL. You decide what to publish, and
account or DNS changes still need your approval.

The agent reads [AGENTS.md](../AGENTS.md) for the rules it follows while it
works. This guide covers what a fork adds: the inputs to gather, copyable
requests, and a map of every personal detail in the repository.

## Set up the workspace

Fork the repository and start the site as the README's
[Get started](../README.md#get-started) section describes, then open
[http://localhost:3000](http://localhost:3000).

## Gather the inputs

Give the agent everything you can up front. It asks for a missing fact instead
of inventing one, so anything you leave out comes back as a question.

| Input                                                                 | Where it goes                                                                 |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Name, role, employer, city, and contact email                         | `src/data/profile.json`                                                       |
| Birth date, the year you started computing, and countries visited     | `src/data/profile.json`, read by `/stats`, the About page, and the share card |
| A one-line bio and the homepage introduction                          | `SITE_DESCRIPTION` in `src/lib/utils.ts`, `src/components/Template/Hero.tsx`  |
| A square portrait, 1024×1024 or larger                                | `public/images/me.jpg`, with its size in `SITE_IMAGE_DIMENSIONS`              |
| Your résumé: roles with dates and summaries, degrees, skills, courses | `src/data/resume/`                                                            |
| Projects, with links, dates, and optional 16:10 thumbnails            | `src/data/projects.ts`, `public/images/projects/`                             |
| Talks, each with the organiser's own listing for the session          | `src/data/speaking.ts`                                                        |
| Posts as Markdown, and links to writing published elsewhere           | `content/writing/`, `src/data/writing.ts`                                     |
| The About page: biography, history, and lists                         | `src/data/about.ts`                                                           |
| Social profile URLs and your X handle                                 | `src/data/contact.ts`, `TWITTER_HANDLE` in `src/lib/utils.ts`                 |
| The site's public URL, by default `https://YOUR-USER.github.io/REPO/` | `homepage` in `package.json`, the only place it is set                        |
| Optional: a GA4 measurement ID                                        | A `NEXT_PUBLIC_GA_TRACKING_ID` repository variable                            |
| Optional: colours, fonts, and a design direction                      | See [Visual identity](#visual-identity)                                       |

For anything you leave out, decide whether the agent should keep the upstream
content with its original attribution, replace it, or remove the feature.

## Copyable requests

Start with the example in the
[README](../README.md#with-a-coding-agent), or copy a request below for a
specific change.

### Manage writing

```text
Read AGENTS.md and work on a topic branch. Do not commit, push, merge, or change
account settings unless I explicitly authorize it.
Manage writing for this site as follows: [ADD, UPDATE, OR REMOVE CONTENT].
Use content/writing/ for local posts and src/data/writing.ts for external
links. Preserve draft isolation, RSS, the homepage writing section, metadata,
and valid post slugs. Pair each frontmatter `image` with `imageAlt`, and give
Markdown images descriptive alt text. Keep at least one published post unless I
asked you to remove writing completely. Run the definition of done in AGENTS.md
and report unresolved content decisions or failing checks.
```

### Update the résumé, projects, or talks

```text
Read AGENTS.md and work on a topic branch. Do not commit, push, merge, or change
account settings unless I explicitly authorize it.
Update [THE RÉSUMÉ, PROJECTS, OR TALKS] with the details below. Use only facts I
give you or that a primary source states, and list anything you could not
confirm. Keep the current role in step everywhere AGENTS.md lists it, keep
project dates consistent with the résumé, and link each talk to the
organiser's own listing. Run the definition of done in AGENTS.md and show me
the diff.
[DETAILS]
```

### Remove a page or feature

```text
Read AGENTS.md and work on a topic branch. Do not commit, push, merge, or change
account settings unless I explicitly authorize it.
Remove [PAGE OR FEATURE] completely. Before deleting anything, trace its route,
navigation entry, homepage references, data imports, sitemap entries, schema,
feed integration, styles, tests, and export verifier checks. Do not change
unrelated routes or URLs. Run the definition of done in AGENTS.md and report
any remaining references.
```

### Change the visual identity

```text
Read AGENTS.md and work on a topic branch. Do not commit, push, merge, or change
account settings unless I explicitly authorize it.
Rebrand the visual identity using [COLORS], [FONTS], [PORTRAIT], and
[DESIGN DIRECTION]. Work through the existing semantic tokens. Keep light and
dark themes, print behavior, accessibility, and the signal-color rules intact.
Regenerate and verify the share cards and the icon set, then run the definition
of done in AGENTS.md and check the pages in a browser in both themes.
```

### Prepare deployment

```text
Read AGENTS.md and work on a topic branch. Do not commit, push, merge, or change
account settings unless I explicitly authorize it.
Read the deployment reference in docs/adapting-guide.md, then prepare this
repository for [FINAL URL] on [HOST]. Make every required repository change,
run the definition of done in AGENTS.md, and inspect out/. Do not create
secrets or modify DNS. Report the exact external steps that remain.
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

Identity data starts in shared files, but some text and links are written into
components.

| Content                                                                   | Location                                                                                                               |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Name, role, employer, city, email, and personal statistics                | `src/data/profile.json`                                                                                                |
| The public URL, which every link, feed, and share URL derives from        | `homepage` in `package.json` (see [Changes inside the repository](#changes-inside-the-repository))                     |
| X handle, one-line bio, and the portrait's path and size                  | `src/lib/utils.ts`                                                                                                     |
| Social links                                                              | `src/data/contact.ts`                                                                                                  |
| Homepage kicker, introduction, and employer links                         | `src/components/Template/Hero.tsx`                                                                                     |
| Header monogram                                                           | `src/components/Template/Navigation.tsx`                                                                               |
| Portrait                                                                  | `public/images/me.jpg`                                                                                                 |
| Contact page note                                                         | `app/contact/page.tsx`                                                                                                 |
| Aliases the contact page types into the address, which assume a catch-all | `messages` in `src/components/Contact/EmailLink.tsx`                                                                   |
| The address length the contact page lays out for                          | The `contact-email` container query in `app/styles/pages/contact.css`                                                  |
| Web app name and icon monogram                                            | Derived from `src/data/profile.json` by `npm run icons`                                                                |
| Upstream custom domain                                                    | `public/CNAME`, which a fork deletes (see [Actions outside the repository](#actions-outside-the-repository))           |
| Writing description, on `/writing/` and in the RSS feed                   | `WRITING_DESCRIPTION` in `src/lib/schema.ts`                                                                           |
| Source repository: the footer's Source link and the `/stats` counts       | `SOURCE_REPOSITORY` in `src/lib/telemetry.ts`, with fallback counts in `LAST_KNOWN` in `src/components/Stats/Site.tsx` |
| Vulnerability reporting contact                                           | `SECURITY.md`                                                                                                          |
| Copyright notice                                                          | `LICENSE`, which keeps the upstream notice because MIT requires it; add your own line beside it                        |

Page titles and descriptions also contain personal copy in `app/layout.tsx` and
the `page.tsx` files under `app/`. Structured data is assembled in
`src/lib/schema.ts`.

The current role appears in several places, which `AGENTS.md` lists under
**Profile copy**: the profile, the one-line bio, the homepage, the About page,
the résumé's work history and summary, and the `/speaking/` introduction.
Update them together.

### About, résumé, projects, and talks

| Content                                 | Location                                                                 |
| --------------------------------------- | ------------------------------------------------------------------------ |
| About page                              | `src/data/about.ts`                                                      |
| About section layouts, by exact heading | `sectionVariants` in `src/components/About/Sections.tsx`                 |
| Work history                            | `src/data/resume/work.ts`                                                |
| Résumé summary                          | `app/resume/page.tsx`                                                    |
| Education                               | `src/data/resume/degrees.ts`                                             |
| Skills                                  | `src/data/resume/skills.ts`                                              |
| Courses                                 | `src/data/resume/courses.ts`                                             |
| Projects                                | `src/data/projects.ts`                                                   |
| Project images                          | `public/images/projects/`                                                |
| Talks                                   | `src/data/speaking.ts`, with the introduction in `app/speaking/page.tsx` |
| Header and footer navigation            | `src/data/routes.ts`                                                     |

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
`/images/writing/my-post/figure.png`. Any other key, or one of these in another
case, such as `Draft`, stops the build, as does a folder, a link, or a
differently named file in `content/writing/`; otherwise the post would publish
without the setting, or not at all, with nothing to say so.

The production export requires at least one published post, and the build
stops with that message when there is none.

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

Require the final search output and check results, not only a completion
claim. This search covers the current name, domain, handle, employer, and
repository:

```bash
rg -n -i "Michael|mldangelo|dangelosaurus|mldangelo\\.com|OpenAI|Promptfoo" \
  app content public scripts src package.json README.md SECURITY.md AGENTS.md docs
```

Repeat it with any other upstream names or URLs the search uncovers. This
catches details in page descriptions, tests, images, and links that a checklist
can miss. Matches that stay are upstream content you chose to keep with its
original attribution. `LICENSE` is left out of the search on purpose: it keeps
the upstream copyright line, which MIT requires.

Some tests assert the site's public content, so exact-text expectations may
need updates. Do not weaken structural checks for metadata, canonical URLs,
draft isolation, accessibility, or export integrity.

Finish with the [definition of done](../AGENTS.md#definition-of-done) in
`AGENTS.md`, and look at every page in a browser at phone and desktop width in
both themes.

## Deployment reference

### Changes inside the repository

The site's address is one setting: `homepage` in `package.json`, written with a
trailing slash. Next's base path, canonical and share URLs, the RSS feed, the
sitemap, `robots.txt`, and `resume.json` all derive from it, so the site works
the same under a subpath as at a root URL.

- A fork that keeps its repository name is a GitHub Pages project site, served
  under that name. This is the default:
  `npm pkg set homepage=https://YOUR-USER.github.io/REPOSITORY/`.
- A custom domain, or a repository named `YOUR-USER.github.io`, serves from the
  root: `npm pkg set homepage=https://example.com/`.
- Delete `public/CNAME`, which names the upstream domain.

Under a subpath, the development server serves the site there too, at
`http://localhost:3000/REPOSITORY/`. Build the site and run the definition of
done: the export gates fail on any address that misses the base path.

When the workflow deploys from `main`, it reads the repository's Pages URL and
stops before building if `homepage` disagrees, naming the value to set.

### Actions outside the repository

GitHub settings, deployment accounts, and DNS changes require account access.
An agent can perform them only with explicit authorization.

For GitHub Pages:

1. In the fork's **Actions** tab, enable workflows. GitHub
   [disables workflows in forks by default](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflows-in-forked-repositories).
2. In **Settings > Pages**, choose **GitHub Actions** as the source. With
   **Deploy from a branch**, Pages publishes the repository's README instead of
   the site.
3. Optional: to serve from `https://YOUR-USER.github.io/` rather than under the
   repository's name, rename the fork to `YOUR-USER.github.io` in
   **Settings > General** and set `homepage` to match.
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
site, so the upstream file does nothing in a fork except name someone else's
domain.

For another static host, set `homepage` to the URL it serves the site at, and
the agent can build `out/` and prepare the deployment. Uploading it to the
hosting account still requires explicit authorization.

### Security boundaries and hosting headers

Everything the site publishes, including the public résumé and About page, is
authored in repository files and reviewed like code. There is no CMS, upload,
or user-supplied Markdown, and the Markdown renderer keeps its default
sanitization. Treat any external content source you add as a new trust
boundary.

Only the deployment job can write to Pages. The build reads Pages settings to
check `homepage` against the Pages URL and fetches public GitHub statistics without a token;
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

| Problem                                      | Check                                                                              |
| -------------------------------------------- | ---------------------------------------------------------------------------------- |
| `EBADENGINE` warning or install failure      | Run `nvm install`, then retry `npm ci`                                             |
| Port 3000 is in use                          | Run `npm run dev -- -p 3001`                                                       |
| Images do not appear                         | Use a URL such as `/images/photo.jpg`, not `public/images/photo.jpg`               |
| `missing "generateStaticParams()"`           | Keep at least one published Markdown post                                          |
| The deployed site shows the README           | In **Settings > Pages**, choose **GitHub Actions** as the source                   |
| No workflow runs in the fork                 | Enable workflows in the fork's **Actions** tab                                     |
| The deployment stops at the `homepage` check | Run the `npm pkg set homepage=…` command the error names, then commit and push     |
| Pages loads without styles, or links 404     | Set `homepage` to the URL the site is served at, including its `/REPOSITORY/` path |
| The export verifier fails                    | Run `npm run build` first, then inspect the named file or route                    |
| `npm run og:check` fails without a network   | Run `npm run og:check:ledger`, its offline half, and leave the render check to CI  |
| `npm run check-reflow` cannot find Chrome    | Set `CHROME_PATH` to a Chrome or Chromium executable                               |
| The icon test or `og:check` reports stale    | Run `npm run icons` or `npm run og`, then commit the files with their ledger       |

## Getting help

Open an [issue](https://github.com/mldangelo/personal-site/issues) when the
instructions are unclear or appear to be wrong.
