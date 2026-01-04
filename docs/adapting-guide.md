# Adapting This Website

Fork this repo and make it your own personal site. You can have it running in 30 minutes.

> **Using an AI assistant?** This guide works great with Claude, Cursor, Copilot, etc. Just point your AI to this file and ask it to help you customize the site.

## Before You Start

1. Fork and clone the repository
2. Run `npm install` then `npm run dev`
3. Open http://localhost:3000 to see the site
4. Keep the dev server running—changes appear instantly

## Customization Checklist

Work through these steps in order for the smoothest experience.

### Step 1: Identity & Contact

| What to change  | File                                        | Notes                           |
| --------------- | ------------------------------------------- | ------------------------------- |
| Site URL        | `package.json` → `homepage`                 | Your domain or GitHub Pages URL |
| Social links    | `src/data/contact.ts`                       | Add/remove platforms as needed  |
| Portrait photos | `public/images/me-light.jpg`, `me-dark.jpg` | Square images, ~256×256px       |
| Hero content    | `src/components/Template/Hero.tsx`          | Your name, tagline              |
| Footer          | `src/components/Template/Footer.tsx`        | Links, copyright                |

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

The site includes a blog at `/writing` with RSS feed. You can use it, customize it, or remove it entirely.

**To add posts**, create Markdown files in `content/writing/`. The filename becomes the URL slug (e.g., `my-post.md` → `/writing/my-post`).

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

| What to change      | File                                       |
| ------------------- | ------------------------------------------ |
| Colors (light/dark) | `app/tailwind.css` → CSS custom properties |
| Favicon             | `public/images/favicon/`                   |
| Site metadata/SEO   | `app/layout.tsx`                           |

### Step 7: Final Cleanup

Search the codebase for "Michael" or "mldangelo" to find any remaining references to change.

```bash
grep -r "Michael" src/
grep -r "mldangelo" .
```

## Deployment

### GitHub Pages (Recommended)

1. Update `homepage` in `package.json` with your URL
2. Set your domain in `public/CNAME` (e.g., `yoursite.com`)
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

Edit `app/tailwind.css`. Find `:root` (light mode) and `[data-theme="dark"]` (dark mode) sections and modify the `--color-*` variables.

### Add Google Analytics

1. Create `.env.local` from the example: `cp .env.example .env.local`
2. Add your GA4 measurement ID: `NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXX`

## Troubleshooting

| Problem                    | Solution                                                   |
| -------------------------- | ---------------------------------------------------------- |
| Port 3000 in use           | `npm run dev -- -p 3001`                                   |
| Styles not updating        | Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)  |
| Images not appearing       | Use `/images/...` not `public/images/...` in code          |
| Build failing              | Run `npm run type-check` to find errors                    |
| CSS 404 or wrong path      | Check `homepage` in `package.json` matches your deploy URL |
| Git line endings (Windows) | `git config core.autocrlf input`                           |

## Getting Help

- Open an issue: https://github.com/mldangelo/personal-site/issues
- Email: help@mldangelo.com

If you find bugs or unclear instructions, please submit a PR—contributions help everyone.
