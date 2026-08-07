# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Austin Dase's personal website (dase.dev) — a Next.js app (App/Pages Router using `src/pages`) that statically exports to a `out/` directory for deployment on GitHub Pages. Forked from Michael D'Angelo's [personal-site](https://github.com/mldangelo/personal-site) template.

## Commands

Package manager is **pnpm** (v10, pinned via `packageManager` in `package.json`). Node version is pinned in `.nvmrc` (`v24.2.0`).

- `pnpm install` — install dependencies
- `pnpm dev` — run the Next.js dev server at http://localhost:3000
- `pnpm run build` — production build; runs `next build` (static export, per `output: 'export'` in `next.config.js`) followed by `scripts/post-export.cjs`, which lowercases all generated `.html` filenames in `out/` for consistent GitHub Pages URLs
- `pnpm start` — build, then serve `out/` locally via `pnpm dlx serve@latest out`
- `pnpm run lint` — ESLint with `--fix` (flat config lives in `.eslintrc.cjs`, extends `next/core-web-vitals`, `airbnb`-derived rules, and `prettier`)
- `pnpm test` — **currently a no-op** (empty script). Jest is configured (`jest.config.js`, `@testing-library/react`) but the sole test file, `src/__tests__/App.test.tsx`, imports a `../App` module that no longer exists (stale from the pre-Next.js CRA version of this site). Don't assume `pnpm test` runs or validates anything; if asked to fix/restore tests, this file needs to be rewritten against the current Next.js page structure first.

There is no separate typecheck script; `tsc --noEmit` can be run directly if needed (see `tsconfig.json`).

CI (`.github/workflows/node.js.yml`) has its lint/build/test jobs disabled (`if: false`) — only `.github/workflows/github-pages.yml` is active, and it only runs `pnpm run build` on pushes to `main` before deploying `out/` to GitHub Pages.

## Architecture

- **Routing**: Next.js Pages Router. Route files live in `src/pages/*.tsx` (e.g. `About.tsx`, `Resume.tsx`, `Projects.tsx`, `Stats.tsx`, `Contact.tsx`, `Index.tsx`). `src/data/routes.tsx` is the single source of truth for nav labels/paths and is consumed by the navigation components — add new pages there too.
- **Layout**: Every page wraps its content in `src/layouts/Main.tsx`, which sets up `react-helmet-async` (page title/meta/OG tags), Google Analytics (`components/Template/Analytics`), scroll-restoration (`components/Template/ScrollToTop`), the top `Navigation`, and the `SideBar` (skippable via the `fullPage` prop).
- **Content as data**: Page content is largely driven by typed data modules under `src/data/` (e.g. `data/projects.tsx`, `data/contact.tsx`, `data/resume/{degrees,courses,skills,work}.tsx`, `data/stats/{personal,site}.tsx`) rather than hardcoded JSX — components in `src/components/**` render these data arrays. To edit site content (resume entries, projects, contact links, stats rows), edit the relevant `data/` file rather than the component.
- **Static assets fetched at runtime**: Some pages `fetch()` content from `public/` at runtime instead of importing it (e.g. `About.tsx` fetches `/data/about.md` and renders it with `markdown-to-jsx`; `Stats.tsx`'s components fetch live GitHub API stats). This is why `App.test.tsx` mocks `global.fetch`.
- **Styling**: SCSS under `src/static/css`, organized `base/`, `layout/`, `components/`, `pages/`, `libs/`, aggregated into `main.scss` and imported once in `src/pages/_app.tsx`. This follows the original Future Imperfect (HTML5 UP) template structure.
- **Client state**: `src/store/cell-store.ts` — a small Zustand store (with `localStorage` persistence, `skipHydration: true`) used for UI state like collapsible resume sections staying open/closed across visits.
- **Static export specifics**: `next.config.js` sets `output: 'export'` and `images.unoptimized: true` since the site is hosted on GitHub Pages (no Next.js image server). `scripts/post-export.cjs` runs post-build to lowercase generated HTML filenames (GitHub Pages is case-sensitive; source page filenames are PascalCase, e.g. `About.tsx` → `about.html`).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
