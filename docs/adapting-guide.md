# Adapting This Website

A coding agent can handle the repository changes once you provide your
identity, content, assets, and target URL. You decide what to publish, and
account or DNS changes still require your approval.

## Set up the workspace

Ask your agent to use the Node version in `.nvmrc`, install the locked
dependencies, and start the development server. To set up the fork manually,
run:

```bash
git clone https://github.com/YOUR-USER/personal-site.git
cd personal-site
nvm install
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If you use another version
manager, choose a release accepted by `engines.node` in `package.json`.

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
Regenerate and verify the share card, then run the full validation suite.
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
pattern and reuse the installed Font Awesome packages. Update affected tests,
run the relevant checks, and show me the diff.
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

| Content                                                        | Location                                                            |
| -------------------------------------------------------------- | ------------------------------------------------------------------- |
| Name, role, employer, location, email, and personal statistics | `src/data/profile.json`                                             |
| Canonical URL, social handle, descriptions, and image settings | `src/lib/utils.ts`                                                  |
| Social links                                                   | `src/data/contact.ts`                                               |
| Homepage biography and employer links                          | `src/components/Template/Hero.tsx`                                  |
| Logo initials                                                  | `src/components/Template/Navigation.tsx`                            |
| Footer source link                                             | `src/components/Template/Footer.tsx`                                |
| Portrait and its alt text                                      | `public/images/me.jpg`, `src/components/Template/ThemePortrait.tsx` |
| Favicon files and web app name                                 | `public/images/favicon/`                                            |
| Sitemap URL for crawlers                                       | `public/robots.txt`                                                 |
| RSS title and description                                      | `app/feed.xml/route.ts`                                             |
| Repository statistics and GitHub API URL                       | `src/components/Stats/Site.tsx`, `src/data/stats/site.ts`           |
| Countries map                                                  | `src/data/stats/personal.tsx`                                       |

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
optional `image` must be a root-relative path under `public/` and must be paired
with `imageAlt`.

The production export requires at least one published post. It cannot build the
dynamic post route when `generateStaticParams()` has no published slugs.

Removing the Writing link from `src/data/routes.ts` only hides it from
navigation. The homepage still promotes writing, and the routes remain
available by URL.

Full removal requires a consumer search before any files are deleted:

```bash
rg -n -i "writing|feed\\.xml|getWritingItems|getAllPosts" app src scripts
```

A complete removal touches the writing routes, feed, content loaders, homepage
section, sitemap, schema, export verifier, styles, and tests. Run a production
build after the refactor.

### Visual identity

| Setting                    | Location                                |
| -------------------------- | --------------------------------------- |
| Light and dark colors      | `app/styles/tokens/colors.css`          |
| Type scale                 | `app/styles/tokens/typography.css`      |
| Font files and assignments | `app/fonts.ts`                          |
| Favicon                    | `public/images/favicon/`                |
| Default metadata           | `app/layout.tsx`, `src/lib/metadata.ts` |
| Share-card generator       | `scripts/generate-og.mjs`               |

After changing profile fields on the share card or its design, run:

```bash
npm run og
npm run og:check
```

`npm run og` updates `public/og.png` and `public/og.meta.json`. The image and
metadata must stay in sync.

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

The full validation suite is:

```bash
npm run format
npm run lint
npm run type-check
npm test
npm run og:check
npm run build
npm run verify-export
```

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
