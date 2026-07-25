# AGENTS.md

Guidance for AI coding agents working on this Next.js personal portfolio site.

## Quick Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run format       # Format with Prettier + Biome (run before committing)
npm run lint         # Biome linting
npm run type-check   # TypeScript checking
npm test             # Vitest tests
npm run build        # Production build + static export
```

**File-scoped (faster feedback):**

```bash
npx tsc --noEmit path/to/file.tsx           # Type check single file
npx biome check path/to/file.tsx            # Lint single file
npm test -- ComponentName                    # Test single component
```

## Project Structure

```
app/                  → Pages, layouts, global CSS
app/styles/           → Modular CSS (tokens, base, components, layout, pages)
src/components/       → React components (organized by feature)
src/data/             → Static data (resume, projects, contact)
src/hooks/            → Custom React hooks
content/writing/      → Blog posts (Markdown with frontmatter)
src/data/writing.ts   → External writing links shown on `/writing`
public/images/        → Images and favicons
docs/                 → Documentation
```

## Code Style

**Do:**

- Use TypeScript strict mode, functional components with hooks
- Style with CSS custom properties in `app/styles/` (tokens in `tokens/`, components in `components/`)
- Keep components small and focused
- Use existing patterns from similar components
- Mark client components with `'use client'`
- Follow conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
- Run `npm run format` before committing (CI enforces this)

**Don't:**

- Add new dependencies without clear need
- Create god components or monolithic files
- Hard-code colors—use CSS variables (`var(--color-*)`)
- Skip type annotations on function parameters
- Commit without running `npm run format` first

## Git Workflow

- Create a topic branch for every task; never commit or push directly to `main`
- Make small, frequent conventional commits as you go (e.g., `feat:`, `fix:`, `refactor:`)
- Push to your remote branch after every commit to keep it in sync
- Land changes on `main` by merging GitHub PRs with conventional-commit titles (deploys trigger automatically from these merges)
- If multiple PRs need to land together, open an integration branch PR; do not locally merge into `main`
- Treat `main` as protected: force-pushes and history rewrites require explicit user approval

## Tech Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Biome · Vitest

## Key Patterns

- **Theming**: `data-theme` attribute on `<html>`, persisted to `window.localStorage` in client code/tests to avoid Node runtime globals leaking into browser-only paths
- **Static export**: `output: 'export'` for GitHub Pages—no server features
- **Canonical/export URLs**: When generating absolute URLs for metadata, RSS, sitemap, or schema, match `trailingSlash: true` output (`/about/`, `/writing/post-slug/`) instead of non-canonical no-slash variants; file-like routes such as `/feed.xml` and `/sitemap.xml` stay file-like
- **Page metadata**: Route-level `metadata` exports and `generateMetadata` should override `openGraph` and `twitter`, not just `title`/`description`, otherwise subpages inherit the homepage share card from `app/layout.tsx`; for `app/not-found.tsx`, omit `openGraph.url` because there is no stable canonical 404 route in the static export
- **Share images**: A route-level `openGraph` object _replaces_ the inherited one — it does not merge — so every page declaring one must repeat `images`, or it ships with no `og:image`. `app/__tests__/page-metadata.test.ts` pins this; it has regressed silently twice. The card is `public/og.png`, regenerated with `npm run og` and committed. Do **not** convert this to an `app/opengraph-image.tsx` metadata route: it emits an extensionless file that GitHub Pages serves as `application/octet-stream`, which scrapers reject, and the file convention only reaches routes that do not declare their own `openGraph`
- **Theme images**: Use `ThemePortrait` component for light/dark variants
- **Profile copy**: Keep role/bio updates in sync across `src/components/Template/Hero.tsx`, `app/layout.tsx` metadata, `src/data/about.ts`, and `src/data/resume/work.ts` so homepage copy, SEO, schema, and resume stay aligned
- **Long-form markdown pages**: Prefer a dedicated renderer component that can parse markdown into semantic sections instead of styling raw headings globally; if `markdown-to-jsx` causes dev/runtime issues in App Router, a `'use client'` boundary may still be required even without hooks. Preserve stable heading ids when converting markdown headings so deep links and `scroll-margin-top` behavior keep working, prefer a shared helper over duplicating slug logic in each page component, and expose those anchors in the UI with section nav or self-links if readers are expected to use them
- **Blog posts**: Markdown files in `content/writing/` with frontmatter (title, date, description); slug derived from filename
- **Writing page**: Add external links in `src/data/writing.ts` and keep dated entries sorted newest first; local posts still live in `content/writing/`
- **Design system ("Ground Station")**: Three type roles, and every element should pick one deliberately — `--font-display` (Bricolage Grotesque) for names and headings, `--font-body` (Newsreader) for prose, `--font-mono` (JetBrains Mono) for data, dates, labels, and buttons. Structure is carried by hairlines (`--rule`) and near-square radii, not by shadow and float; a heavy `--color-fg-bold` rule opens a section, a `--color-border` hairline divides within one
- **Signal colour discipline**: `--color-accent` (ultramarine) is for structure and links. `--color-signal` (amber) is reserved for values that are live or in progress — the ticking age, a role with no end date. Using it decoratively is what makes the rest of it stop meaning anything. `--color-signal` is the text-safe value; use `--color-signal-mark` for non-text marks only
- **Fonts must be variable**: The weight tokens (`--font-weight-medium` through `--font-weight-black`) only render as distinct weights because all three families load as variable fonts in `app/layout.tsx`. Loading fixed weights instead silently collapses the scale — CSS font matching snaps to the nearest loaded face with no warning
- **Type sizes are rem**: `--text-*` are absolute so nesting never compounds. Avoid reintroducing `em` sizes
- **Telemetry**: Measured values live in `src/lib/telemetry.ts` so the hero readout and `/stats` cannot disagree. Live readings use `useLiveAge`, which paints a fixed-width digit-free placeholder until the first client tick — test that path with `renderToStaticMarkup`, since effects flush during Testing Library's `render()`
- **Hierarchy from data**: Where a list needs varying visual weight (e.g. `tierFor` in `src/components/Resume/Experience.tsx`), derive it from the data — dates, role titles — rather than hardcoding per-item styling, so new entries place themselves
- **Numbers about the site**: Never type a figure describing the codebase into a data file. `/stats` claimed 2,272 lines against ~4,400 actual before it was switched to `countSourceLines()` in `src/lib/loc.ts`. Anything countable should be counted at build
- **Motion**: Anything that animates continuously must check `prefers-reduced-motion` (see `useLiveAge`, `useScrollAnimation`, `EmailLink`). The bar is higher for above-the-fold elements — the live age readout takes a single reading under the preference rather than ticking
- **Opting out of base link styles**: `app/styles/base/links.css` paints an accent underline on every `p a` / `li a`. Navigation-like links must set `background-image: none` or they pick up a rule that appears nowhere else — this is what made the mobile menu look broken
- **Print**: `app/styles/print.css` is imported last so it can override both themes. The resume is the page people print; check it there after changing resume layout

## Testing

Tests live in `__tests__/` directories adjacent to the code they test. Run `npm test` before committing.

```bash
npm test                        # Run all tests
npm test -- --watch             # Watch mode
npm test -- ComponentName       # Run specific test
```

## Further Reading

- [README.md](./README.md) — Setup and deployment
- [docs/adapting-guide.md](./docs/adapting-guide.md) — Guide for forking and customizing
- [docs/design-goals.md](./docs/design-goals.md) — Architecture principles
- [docs/contributing.md](./docs/contributing.md) — Contribution guidelines

## Maintaining This Document

When creating a PR, audit this file and make small, targeted improvements based on your learnings—new patterns discovered, outdated references, or missing guidance that would have helped.
