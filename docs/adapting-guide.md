# Adapting This Website

Fork this repository as a starting point for your own personal site. The code
is designed to be adapted, but the content and visual identity are intentionally
specific; budget time for a full rebrand rather than treating it as a generic
fill-in-the-blanks theme.

An AI assistant can help with the mechanical edits, but use the checklist below
to verify that facts, routes, metadata, images, and generated assets stay in
sync.

## Before You Start

1. Fork and clone the repository
2. Run `npm ci` then `npm run dev`
3. Open [http://localhost:3000](http://localhost:3000) to see the site
4. Keep the dev server running—changes appear instantly

## Customization Checklist

Work through these steps in order for the smoothest experience.

### Step 1: Identity & Contact

| What to change          | File                                    | Notes                                                 |
| ----------------------- | --------------------------------------- | ----------------------------------------------------- |
| Profile facts and email | `src/data/profile.json`                 | Shared by contact links, telemetry, metadata, and OG  |
| Site URL and author     | `src/lib/utils.ts`, `package.json`      | Keep `SITE_URL` and `homepage` aligned                |
| Social links            | `src/data/contact.ts`                   | Add or remove platforms as needed                     |
| Portrait                | `public/images/me.jpg`                  | Use a square image; the current asset is 1024×1024px  |
| Homepage copy           | `src/components/Template/Hero.tsx`      | Name, role, tagline, credentials, and calls to action |
| Footer                  | `src/components/Template/Footer.tsx`    | Identity, source link, and copyright                  |
| Resume introduction     | `app/resume/page.tsx`                   | Keep this summary aligned with the homepage           |
| SEO defaults            | `app/layout.tsx`, `src/lib/metadata.ts` | Keywords and shared page-card metadata                |

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

### Step 5: Blog/Writing (Optional)

The site includes a blog at `/writing/` with an RSS feed. You can use it, customize it, or remove it entirely.

**To add posts**, create Markdown files in `content/writing/`. The filename becomes the URL slug (for example, `my-post.md` becomes `/writing/my-post/`).

```markdown
---
title: 'Your Post Title'
date: '2026-01-15'
description: 'A brief description for previews and SEO.'
---

Your content here...
```

**To disable the blog entirely:**

```bash
rm -rf app/writing app/feed.xml content/writing
```

Then remove the "Writing" link from `src/data/routes.ts`.

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

| Problem                    | Solution                                                   |
| -------------------------- | ---------------------------------------------------------- |
| Port 3000 in use           | `npm run dev -- -p 3001`                                   |
| Styles not updating        | Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)  |
| Images not appearing       | Use `/images/...` not `public/images/...` in code          |
| Build failing              | Run `npm run lint`, `npm run type-check`, and `npm test`   |
| CSS 404 or wrong path      | Check `homepage` in `package.json` matches your deploy URL |
| Git line endings (Windows) | `git config core.autocrlf input`                           |

## Getting Help

- Open an issue: https://github.com/mldangelo/personal-site/issues
- Email: hi@mldangelo.com

If you find bugs or unclear instructions, please submit a PR—contributions help everyone.
