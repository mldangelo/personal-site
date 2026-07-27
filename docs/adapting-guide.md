# Adapting This Website

Fork this repository as a starting point for your own personal site. The code
is designed to be adapted, but the content and visual identity are intentionally
specific; budget time for a full rebrand rather than treating it as a generic
fill-in-the-blanks theme.

An AI assistant can help with the mechanical edits, but use the checklist below
to verify that facts, routes, metadata, images, and generated assets stay in
sync.

## Before You Start

You need Node.js 22.13 or newer. The repository develops on the version pinned
in `.nvmrc`, which is also what CI and the deployed build use; with
[nvm](https://github.com/nvm-sh/nvm) installed, `nvm use` selects it.

1. Fork and clone the repository
2. Run `nvm use` (or otherwise switch to Node 22.13+)
3. Run `npm ci` then `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) to see the site
5. Keep the dev server running—changes appear instantly

## Customization Checklist

Work through these steps in order for the smoothest experience.

### Step 1: Identity & Contact

| What to change          | File                                    | Notes                                                |
| ----------------------- | --------------------------------------- | ---------------------------------------------------- |
| Profile facts and email | `src/data/profile.json`                 | Shared by contact links, stats, metadata, and OG     |
| Site URL and author     | `src/lib/utils.ts`, `package.json`      | Keep `SITE_URL` and `homepage` aligned               |
| Social links            | `src/data/contact.ts`                   | Add or remove platforms as needed                    |
| Portrait                | `public/images/me.jpg`                  | Use a square image; the current asset is 1024×1024px |
| Homepage copy           | `src/components/Template/Hero.tsx`      | Name, role, tagline, and calls to action             |
| Footer                  | `src/components/Template/Footer.tsx`    | Identity, source link, and copyright                 |
| Resume introduction     | `app/resume/page.tsx`                   | Keep this summary aligned with the homepage          |
| SEO defaults            | `app/layout.tsx`, `src/lib/metadata.ts` | Keywords and shared page-card metadata               |

### Step 2: About Page

| What to change         | File                |
| ---------------------- | ------------------- |
| Bio, intro, everything | `src/data/about.ts` |

### Step 3: Resume

| What to change      | File                         |
| ------------------- | ---------------------------- |
| Work experience     | `src/data/resume/work.ts`    |
| Education           | `src/data/resume/degrees.ts` |
| Skills & categories | `src/data/resume/skills.ts`  |
| Courses (optional)  | `src/data/resume/courses.ts` |

### Step 4: Projects

| What to change  | File                      |
| --------------- | ------------------------- |
| Project entries | `src/data/projects.ts`    |
| Project images  | `public/images/projects/` |

### Step 5: Blog/Writing

The site includes a blog at `/writing/` with an RSS feed.

**To add posts**, create Markdown files in `content/writing/`. The filename becomes the URL slug (for example, `my-post.md` becomes `/writing/my-post/`).

```markdown
---
title: 'Your Post Title'
date: '2026-01-15'
description: 'A brief description for previews and SEO.'
image: /images/writing/optional-share-image.png
imageAlt: 'Describes the image for screen readers and as a fallback'
draft: true
---

Your content here...
```

Only `title`, `date`, and `description` are required. `image` and `imageAlt`
set the post's share card and travel together—an image without alt text is an
accessibility gap. `draft: true` keeps a post visible in development and out of
the production export entirely, including the sitemap and feed.

**Keep at least one published post.** With an empty `content/writing/`,
`generateStaticParams()` returns nothing and the static export fails with
`Page "/writing/[slug]" is missing "generateStaticParams()"`—an error that
never mentions posts. Replace the example posts rather than emptying the
directory.

**To hide the blog** without removing it, delete the `/writing` entry from
`src/data/routes.ts`. The routes still build and remain reachable by URL, but
they leave the navigation.

**Removing the blog outright is a refactor, not a delete.** The content is
woven into the homepage, sitemap, schema, and export verifier, so budget real
time for it. Expect to touch:

| Area         | Files                                                                                                      |
| ------------ | ---------------------------------------------------------------------------------------------------------- |
| Routes       | `app/writing/`, `app/feed.xml/`, `content/writing/`                                                        |
| Data loaders | `src/lib/posts.ts`, `src/lib/writing.ts`, `src/data/writing.ts`                                            |
| Consumers    | `app/page.tsx` (the "Latest writing" section), `app/sitemap.ts`, `src/lib/schema.ts`, `src/data/routes.ts` |
| Verification | `scripts/verify-export.mjs`, plus the tests covering each of the above                                     |

Unless you specifically need those routes gone, hiding the blog is the cheaper
and far less error-prone option.

### Step 6: Branding & Theme

| What to change      | File                                 |
| ------------------- | ------------------------------------ |
| Colors (light/dark) | `app/styles/tokens/colors.css`       |
| Type scale          | `app/styles/tokens/typography.css`   |
| Font families       | `app/fonts.ts`                       |
| Favicon             | `public/images/favicon/`             |
| Site metadata/SEO   | `app/layout.tsx`, `src/lib/utils.ts` |
| Share card          | `scripts/generate-og.mjs`            |

After changing the profile or share-card design, run `npm run og` and commit
both `public/og.png` and `public/og.meta.json`. The metadata file binds the
committed image to the generator and profile inputs, so omitting either file
will fail CI.

### Step 7: Final Cleanup

Search the authored files for the existing name and handle to find any remaining references:

```bash
rg -n "Michael|mldangelo" . \
  -g '!node_modules/**' -g '!.next/**' -g '!out/**' \
  -g '!coverage/**' -g '!.git/**'
```

Then format and validate the finished site:

```bash
npm run format
npm run lint
npm run type-check
npm test
npm run og:check
npm run build
npm run verify-export
```

**Some tests assert this site's specific content, so replacing it will fail
them.** That is expected, not a sign you broke something—update the
expectations to match your own content:

| If you change             | Update                                                                                                         |
| ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| The posts                 | `app/__tests__/content-ia.test.tsx`, `app/writing/[slug]/page.test.ts`, `app/feed.xml/__tests__/route.test.ts` |
| The navigation routes     | `src/components/__tests__/Template/Navigation.test.tsx`                                                        |
| Profile, résumé, projects | the matching suites under `src/data/__tests__/`                                                                |

Tests that assert structure rather than content—metadata completeness, canonical
URLs, draft isolation, duplicate IDs—should keep passing. If one of those fails,
it is worth reading closely.

## Deployment

### GitHub Pages (Recommended)

1. Update `SITE_URL` in `src/lib/utils.ts` and `homepage` in `package.json`
2. Set your domain in `public/CNAME` (for example, `yoursite.com`)
3. In your repo settings, enable GitHub Pages with source: GitHub Actions
4. Push to `main`—it deploys automatically

### Custom Domain

1. Purchase a domain from Squarespace Domains, Cloudflare, or Namecheap
2. Add your domain to `public/CNAME`:
   ```bash
   echo "yourdomain.com" > public/CNAME
   ```
3. Configure DNS per [GitHub's documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

### Other Hosts

Run `npm run build` and upload the `out/` directory to any static host (Vercel, Netlify, S3, etc.).

## Common Tasks

### Remove a page

Delete its folder from `app/` and remove the link from `src/data/routes.ts`.

```bash
rm -rf app/stats  # removes the /stats page
```

### Add a social icon

In `src/data/contact.ts`, import from Font Awesome and add to the array:

```typescript
import { faYoutube } from '@fortawesome/free-brands-svg-icons/faYoutube';
// Add to data array:
{ link: 'https://youtube.com/@you', label: 'YouTube', icon: faYoutube },
```

### Change theme colors

Edit `app/styles/tokens/colors.css`. Its `:root` and `[data-theme='dark']` blocks define the semantic `--color-*` variables used throughout the site. Keep links on `--color-accent`, filled controls on `--color-accent-fill`, and reserve `--color-signal` for live values.

### Add Google Analytics

1. Create `.env.local` from the example: `cp .env.example .env.local`
2. Add your GA4 measurement ID: `NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXX`

## Troubleshooting

| Problem                            | Solution                                                                                                                                                                            |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Port 3000 in use                   | `npm run dev -- -p 3001`                                                                                                                                                            |
| Styles not updating                | Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)                                                                                                                           |
| Images not appearing               | Use `/images/...` not `public/images/...` in code                                                                                                                                   |
| Build failing                      | Run `npm run lint`, `npm run type-check`, and `npm test`                                                                                                                            |
| `npm ci` refuses to install        | You are on Node older than 22.13; run `nvm use`                                                                                                                                     |
| `missing "generateStaticParams()"` | `content/writing/` has no published posts—keep at least one                                                                                                                         |
| Assets 404 on a project site       | Repository sites are served from `/<repo>/`. The Pages workflow injects that basePath via `actions/configure-pages`; a custom domain in `public/CNAME` serves from the root instead |
| Git line endings (Windows)         | `git config core.autocrlf input`                                                                                                                                                    |

## Getting Help

- Open an issue: https://github.com/mldangelo/personal-site/issues
- Email: hi@mldangelo.com

If you find bugs or unclear instructions, please submit a PR—contributions help everyone.
