# Adapting This Website

This repository can be a starting point for another personal site, but it is
not a blank theme. Forks need to replace the content, identity, links, metadata,
and generated assets.

## Before you start

With [nvm](https://github.com/nvm-sh/nvm) installed:

```bash
git clone https://github.com/YOUR-USER/personal-site.git
cd personal-site
nvm install
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If you use another version
manager, choose a release accepted by `engines.node` in `package.json`.

## Replace the content

### Identity and contact details

Start with the shared data, then update hard-coded text and links.

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

Page titles and descriptions also contain personal copy. Check `app/layout.tsx`
and the `page.tsx` files under `app/`. Structured data is assembled in
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

Keep current role details consistent across the profile, homepage, résumé, and
page metadata.

### Writing

Writing comes from two places:

- Markdown posts in `content/writing/`
- External articles in `src/data/writing.ts`

Both sources appear on `/writing/`. Dated entries can also appear on the
homepage and in the RSS feed.

To add a local post, create a Markdown file. Its filename becomes the URL slug,
so `my-post.md` becomes `/writing/my-post/`. Use lowercase letters and numbers
separated by single hyphens.

```markdown
---
title: 'Your Post Title'
date: '2026-01-15'
description: 'A short description for previews and search results.'
---

Your content here.
```

The required fields are `title`, `date`, and `description`. Set `draft: true`
to show a post during development without including it in the production
export. An optional `image` must be a root-relative path under `public/` and
must be paired with `imageAlt`.

Keep at least one published post. The static export cannot build the dynamic
post route when `generateStaticParams()` has no published slugs.

Removing the Writing link from `src/data/routes.ts` only hides it from
navigation. The homepage still promotes writing, and the routes remain
available by URL.

To remove writing completely, first find every consumer:

```bash
rg -n -i "writing|feed\\.xml|getWritingItems|getAllPosts" app src scripts
```

Expect to remove or update the writing routes, feed, content loaders, homepage
section, sitemap, schema, export verifier, styles, and tests. Run a production
build after the refactor.

## Replace the visual identity

| Setting                    | Location                                |
| -------------------------- | --------------------------------------- |
| Light and dark colors      | `app/styles/tokens/colors.css`          |
| Type scale                 | `app/styles/tokens/typography.css`      |
| Font files and assignments | `app/fonts.ts`                          |
| Favicon                    | `public/images/favicon/`                |
| Default metadata           | `app/layout.tsx`, `src/lib/metadata.ts` |
| Share-card generator       | `scripts/generate-og.mjs`               |

After changing profile fields used on the share card or changing its design,
run:

```bash
npm run og
npm run og:check
```

Commit both `public/og.png` and `public/og.meta.json`.

## Search for upstream details

Search for the current name, domain, handle, employer, and repository before
publishing:

```bash
rg -n -i "Michael|mldangelo|dangelosaurus|mldangelo\\.com|OpenAI|Promptfoo" \
  app content public scripts src package.json README.md
```

Repeat the search with any other upstream names or URLs you find. This catches
details in page descriptions, tests, images, and links that a checklist can
miss.

Some tests assert the site's public content. Search for the old exact text and
update those expectations when the corresponding content changes. Do not
weaken structural checks for metadata, canonical URLs, draft isolation,
accessibility, or export integrity.

Run the full validation suite:

```bash
npm run format
npm run lint
npm run type-check
npm test
npm run og:check
npm run build
npm run verify-export
```

## Deployment

### GitHub Pages

1. Set `SITE_URL` in `src/lib/utils.ts` to the final public URL without a
   trailing slash.
2. Set `homepage` in `package.json` to the same URL with a trailing slash.
3. In **Settings > Pages**, choose **GitHub Actions** as the source.
4. Push to `main`.

The site works as written at a root URL, such as a custom domain or a
`YOUR-USER.github.io` user site. A project site at
`https://YOUR-USER.github.io/personal-site/` needs more work. The workflow
injects Next's `basePath`, but raw asset paths and absolute URLs created by the
application still assume a root deployment. Updating `SITE_URL` and `homepage`
alone is not enough for that case.

### Custom domain

Add the domain in **Settings > Pages**, then configure its DNS records using
[GitHub's custom-domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
Update `SITE_URL` and `homepage` to the custom URL.

This repository publishes through a custom GitHub Actions workflow. GitHub
ignores `public/CNAME` for this publishing method, so delete the upstream file
from your fork.

### Other static hosts

Run `npm run build` and deploy the generated `out/` directory to the host's
root. A subpath deployment also needs a matching Next `basePath` and an audit of
raw asset and absolute URL construction. `SITE_URL` alone does not configure
that path.

## Common changes

### Remove a page

Deleting a route folder does not remove its other references. Search for its
path, label, component names, and data imports first. Update navigation,
`app/sitemap.ts`, schema, styles, and tests as applicable.

### Add a social link

In `src/data/contact.ts`, import a Font Awesome icon and add an item:

```typescript
import { faYoutube } from '@fortawesome/free-brands-svg-icons/faYoutube';

{ link: 'https://youtube.com/@you', label: 'YouTube', icon: faYoutube },
```

### Change theme colors

Edit the `:root` and `[data-theme='dark']` blocks in
`app/styles/tokens/colors.css`. Use `--color-accent` for links,
`--color-accent-fill` for filled controls, and `--color-signal` only for live
values.

### Add Google Analytics

Copy `.env.example` to `.env.local` and set:

```text
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXX
```

## Troubleshooting

| Problem                                 | Check                                                                                 |
| --------------------------------------- | ------------------------------------------------------------------------------------- |
| `EBADENGINE` warning or install failure | Run `nvm install`, then retry `npm ci`                                                |
| Port 3000 is in use                     | Run `npm run dev -- -p 3001`                                                          |
| Images do not appear                    | Use a URL such as `/images/photo.jpg`, not `public/images/photo.jpg`                  |
| `missing "generateStaticParams()"`      | Keep at least one published Markdown post                                             |
| Assets return 404 on a project site     | Review the repository subpath limitation in the [GitHub Pages section](#github-pages) |
| The export verifier fails               | Run `npm run build` first, then inspect the named file or route                       |

## Getting help

Open an [issue](https://github.com/mldangelo/personal-site/issues) when the
instructions are unclear or appear to be wrong.
