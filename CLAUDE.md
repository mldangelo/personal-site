# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Austin Dase's personal website (dase.dev) — a Next.js **App Router** app (`src/app`) deployed on **Vercel**. Originally forked from Michael D'Angelo's [personal-site](https://github.com/mldangelo/personal-site) template, but the styling and most components have since been rewritten.

## Commands

Package manager is **pnpm** (v11, pinned via `packageManager` in `package.json`). Node is pinned to `v24.17.0` in `.nvmrc` and `engines`. A shell defaulting to an older Node will fail on `pnpm` itself — make sure the pinned version is on `PATH`.

- `pnpm install` — install dependencies
- `pnpm dev` — Next.js dev server (webpack) at http://localhost:3000
- `pnpm run build` — production build
- `pnpm start` — serve the production build (`next start`)
- `pnpm run lint` — Biome check with `--write` (config in `biome.json`; also handles import organization)
- `pnpm run lint:ci` — Biome in CI mode, no writes
- `pnpm run typecheck` — `tsc --noEmit`

There is **no test suite**. Nothing is configured and no test files exist; don't assume any command validates behavior.

CI: `.github/workflows/node.js.yml` runs lint, typecheck, and build. Deployment is Vercel's Git integration — there is no deploy workflow in the repo.

TypeScript is v7, which **removed `baseUrl`**. The `@/*` alias is declared with a repo-relative path (`"@/*": ["./src/*"]`) and no `baseUrl`; re-adding one is a build error.

## Architecture

- **Routing**: App Router, `src/app/<route>/page.tsx`. `src/data/routes.tsx` is the single source of truth for nav labels and paths — add new pages there too. Paths are clean and case-exact, so no lowercasing or `/index` special-casing anywhere.
- **Imports**: use the `@/*` alias (`@/components/ui/section`), not deep relative paths.
- **Layout**: `src/app/layout.tsx` is the only shell — it owns `<html>`/`<body>`, the font variables, the pre-paint theme script, `Navigation`, `<main>`, `Footer`, and Vercel Analytics + Speed Insights. It is a Server Component; the two theme effects live in `src/app/theme-sync.tsx` (`'use client'`).
- **Metadata**: the Metadata API, never `next/head` or a helmet library. Build every page's export with `pageMetadata()` from `src/lib/metadata.ts` — Next **replaces** a page's `openGraph`/`twitter` object rather than deep-merging it, so a page that declares one inline silently drops `og:type`, `og:site_name`, and the Twitter handles. `metadataBase` in the root layout absolutizes the relative canonicals and image paths.
- **Icons**: `lucide-react` for interface icons; `@icons-pack/react-simple-icons` for brand marks. Simple Icons dropped LinkedIn after a trademark request, so that one mark is drawn locally in `src/components/ui/icons.tsx`.
- **Components**: `src/components/ui/` for shared primitives, `src/components/layout/` for chrome. Anything used by exactly one route is colocated in that route's folder (`src/app/resume/skill-filter.tsx`).
- **Server vs Client**: everything is a Server Component unless it needs state, effects, or browser APIs. Today only `navigation`, `theme-toggle`, `theme-sync`, `age`, `project-cell`, `email-link`, and `skill-filter` carry `'use client'`. Push the directive as deep as possible — `skills.tsx` stays a Server Component and only the filter it renders crosses the boundary.
- **Content as data**: Page content is driven by typed modules under `src/data/` (`bio.tsx`, `projects.tsx`, `contact.tsx`, `resume/{degrees,skills,universities}.tsx`, `stats/{personal,site}.tsx`) rather than hardcoded JSX. To edit site content, edit the `data/` file, not the component.
- **Content loading**: `/about` reads `public/data/about.md` with `fs` directly in an `async` Server Component. `/stats` fetches the GitHub API server-side via `src/lib/github.ts` with `next: { revalidate: 3600 }`, wrapped in `<Suspense>` — the numbers are in the HTML. That fetch falls back to the static rows on any failure, so a rate limit never breaks the build.
- **Client state**: `src/store/cell-store.ts` (collapsible project cards) and `src/store/theme-store.ts` (light/dark/system preference) — small Zustand stores persisted to `localStorage` via `createJSONStorage` with `skipHydration: true`, so their values are only trusted after mount.
- **Theme**: `src/app/layout.tsx` runs a blocking inline script that stamps `data-theme` on `<html>` before first paint, avoiding a flash. It must stay in sync with the persisted shape of `theme-store.ts`.

## Design system — "Ledger, quiet"

All styling is **Tailwind v4**, configured entirely in CSS. There is no `tailwind.config.js` and no SCSS.

`src/styles/theme.css` is the single source of truth and is imported once, in `src/app/layout.tsx`. It defines:

- **Palette tokens** in `@theme` (light) with a `[data-theme='dark']` block overriding the same names: `bg`, `panel`, `fg`, `muted`, `faint`, `rule`, `accent`, `accent-soft`, `accent-fg`, `accent-subtle`, `glow`, plus `cat-*` colors for the skill bars. Consumers use the generated utilities (`text-muted`, `border-rule`, `bg-accent`) and never hardcode a hex.
- **Type tokens**: `--font-sans` (Geist), `--font-mono` (Geist Mono), `--font-serif` (Newsreader), and size tokens `--text-hero`, `--text-display`, `--text-section`, `--text-label` — used as `text-hero` etc., not as arbitrary values. Fonts are declared in `src/styles/fonts.ts` and their CSS variables go on `<html>` in `layout.tsx` — **not** a wrapper element. `theme.css` declares `--font-sans/serif/mono` at `:root`, and a `var()` that cannot resolve where it is declared poisons the declaration for every descendant.
- **`--container-measure`** (48rem) — the reading measure, applied as `max-w-measure` by the root layout's `<main>`, `Navigation`, and `Footer`. All three must agree or the chrome will not line up with the content.
- **Custom utilities**: `label` (uppercase mono micro-label), `mark` (accent-underlined emphasized term), `sep-dot` / `sep-slash` (inline lists with glyph separators), `btn` / `btn-primary`, `nav-link` (uppercase mono link typography — callers own the colour and underline), `icon-btn` (square hairline icon button — pair with a `size-*`).
- **Prose overrides**: `.prose` maps the `--tw-prose-*` variables onto the palette tokens. Because those tokens already flip on `data-theme`, `/about` needs no `dark:prose-invert`.

Two conventions this design depends on:

1. **Hairline rules, not cards.** Boundaries are `border-rule` hairlines. No rounded corners, no shadows, no filled panels except `bg-panel` as a bar track. If you find yourself adding `rounded-*`, it's off-system.
2. **Three type roles.** Serif (`font-serif`) for display and headings — the base layer already applies it to `h1`–`h4`. Sans for body prose. Mono for metadata: dates, labels, numbers, nav.

Two shared primitives express the repeated structures; prefer them over re-typing class strings:

- `src/components/ui/section.tsx` — a top-ruled section with a serif heading. Used by resume sections, stats panels, and the homepage.
- `src/components/ui/entry.tsx` — the ledger row: dateline in a 104px left column, content right, collapsing to one column below `sm`. Used by work history, degrees, and the homepage "Recently" list.
- `src/components/ui/page-header.tsx` — the eyebrow + display title + lede block every non-home route opens with.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
