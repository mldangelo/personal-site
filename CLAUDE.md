# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Austin Dase's personal website (dase.dev) — a Next.js app (Pages Router, `src/pages`) that statically exports to `out/` for deployment on GitHub Pages. Originally forked from Michael D'Angelo's [personal-site](https://github.com/mldangelo/personal-site) template, but the styling and most components have since been rewritten.

## Commands

Package manager is **pnpm** (v11, pinned via `packageManager` in `package.json`). Node is pinned to `v24.17.0` in `.nvmrc` and `engines`. A shell defaulting to an older Node will fail on `pnpm` itself — make sure the pinned version is on `PATH`.

- `pnpm install` — install dependencies
- `pnpm dev` — Next.js dev server (webpack) at http://localhost:3000
- `pnpm run build` — production build; static export per `output: 'export'` in `next.config.js`. Emits `out/`. There is no post-export step; page files are already lowercase.
- `pnpm start` — build, then serve `out/` via `pnpm dlx serve@latest out`
- `pnpm run lint` — Biome check with `--write` (config in `biome.json`; also handles import organization)
- `pnpm run lint:ci` — Biome in CI mode, no writes
- `pnpm run typecheck` — `tsc --noEmit`

There is **no test suite**. Nothing is configured and no test files exist; don't assume any command validates behavior.

CI: `.github/workflows/node.js.yml` runs lint, typecheck, and build. `.github/workflows/github-pages.yml` builds and deploys `out/` to GitHub Pages on pushes to `main`.

## Architecture

- **Routing**: Pages Router, files in `src/pages/*.tsx`, all lowercase (`about.tsx`, `resume.tsx`, …). `src/data/routes.tsx` is the single source of truth for nav labels and paths — add new pages there too.
- **Layout**: Every page wraps its content in `src/layouts/Main.tsx`, which sets up `react-helmet-async` (title/meta/OG), Google Analytics (`components/Template/Analytics`), scroll restoration (`components/Template/ScrollToTop`), the sticky `Navigation`, the colophon `Footer`, and — on `/about` only — the `ProfileCard` aside. The `fullPage` prop suppresses the aside.
- **Content as data**: Page content is driven by typed modules under `src/data/` (`bio.tsx`, `projects.tsx`, `contact.tsx`, `resume/{degrees,skills,work}.tsx`, `stats/{personal,site}.tsx`) rather than hardcoded JSX. To edit site content, edit the `data/` file, not the component.
- **Content loading**: `/about` reads `public/data/about.md` at *build* time via `getStaticProps` and renders it with `markdown-to-jsx`, so the copy is in the static HTML. `/stats` fetches live GitHub API numbers at runtime on the client.
- **Client state**: `src/store/cell-store.ts` (collapsible project cards) and `src/store/theme-store.ts` (light/dark/system preference) — small Zustand stores persisted to `localStorage` with `skipHydration: true`, so their values are only trusted after mount.
- **Theme**: `src/pages/_document.tsx` runs a blocking inline script that stamps `data-theme` on `<html>` before first paint, avoiding a flash. It must stay in sync with the persisted shape of `theme-store.ts`.
- **Static export specifics**: `next.config.js` sets `output: 'export'` and `images.unoptimized: true` — the site is on GitHub Pages, so there's no Next.js image server. Anything requiring a server (API routes, ISR, `next/image` optimization, middleware) is unavailable.

## Design system — "Ledger, quiet"

All styling is **Tailwind v4**, configured entirely in CSS. There is no `tailwind.config.js` and no SCSS.

`src/styles/theme.css` is the single source of truth and is imported once, in `src/pages/_app.tsx`. It defines:

- **Palette tokens** in `@theme` (light) with a `[data-theme='dark']` block overriding the same names: `bg`, `panel`, `fg`, `muted`, `faint`, `rule`, `accent`, `accent-soft`, `accent-fg`, `accent-subtle`, `glow`, plus `cat-*` colors for the skill bars. Consumers use the generated utilities (`text-muted`, `border-rule`, `bg-accent`) and never hardcode a hex.
- **Type tokens**: `--font-sans` (Geist), `--font-mono` (Geist Mono), `--font-serif` (Newsreader), and size tokens `--text-hero`, `--text-display`, `--text-section`, `--text-label` — used as `text-hero` etc., not as arbitrary values. Fonts are declared in `src/styles/fonts.ts` and their CSS variables wired onto a wrapper `div` in `_app.tsx`.
- **`--container-measure`** (48rem) — the reading measure, applied as `max-w-measure` by `Main`, `Navigation`, and `Footer`. All three must agree or the chrome will not line up with the content.
- **Custom utilities**: `label` (uppercase mono micro-label), `mark` (accent-underlined emphasized term), `sep-dot` / `sep-slash` (inline lists with glyph separators), `btn` / `btn-primary`.
- **Prose overrides**: `.prose` maps the `--tw-prose-*` variables onto the palette tokens. Because those tokens already flip on `data-theme`, `/about` needs no `dark:prose-invert`.

Two conventions this design depends on:

1. **Hairline rules, not cards.** Boundaries are `border-rule` hairlines. No rounded corners, no shadows, no filled panels except `bg-panel` as a bar track. If you find yourself adding `rounded-*`, it's off-system.
2. **Three type roles.** Serif (`font-serif`) for display and headings — the base layer already applies it to `h1`–`h4`. Sans for body prose. Mono for metadata: dates, labels, numbers, nav.

Two shared primitives express the repeated structures; prefer them over re-typing class strings:

- `src/components/Template/Section.tsx` — a top-ruled section with a serif heading. Used by resume sections, stats panels, and the homepage.
- `src/components/Template/Entry.tsx` — the ledger row: dateline in a 104px left column, content right, collapsing to one column below `sm`. Used by work history, degrees, and the homepage "Recently" list.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
