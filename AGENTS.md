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
- **TypeScript 7 needs `experimental.useTypeScriptCli`**: TS 7 is the native compiler and does not expose the JavaScript compiler API Next uses for its build-time type check, so `next build` fails without that flag in `next.config.mjs`. The flag makes Next shell out to the TypeScript CLI instead. It still gates the build — verified by injecting `const x: number = 'string'` and confirming a non-zero exit with no `out/` produced. Re-verify that if the flag ever changes, because a silently-skipped type check is worse than an old compiler
- **Biome upgrades need `biome migrate`**: Biome errors, not warns, when `biome.json`'s `$schema` version disagrees with the CLI, so a version bump alone fails `npm run lint`. Run `npx biome migrate --write` with the upgrade. `linter.rules.preset` replaced the deprecated `recommended` field; this repo uses `"none"` and opts into rules explicitly
- **FontAwesome packages move together**: each carries its own `@fortawesome/fontawesome-common-types`, where `IconName` is a string-literal union that grows every release. Bumping one package leaves multiple copies and `IconDefinition` stops being assignable across them. Bump `fontawesome-svg-core`, `free-regular-svg-icons`, and `free-brands-svg-icons` in lockstep
- **The artifact actions are coupled pairs**: `upload-artifact` feeds `download-artifact`, and `upload-pages-artifact` feeds `deploy-pages`, both on the path that publishes the site. Dependabot proposes them individually; bump each pair together
- **`overrides` exist to reach security patches upstream pins away from**: `next` pins `postcss` to an exact version and declares `sharp` as an optional `^0.34.x`, so neither can reach its patched release through normal resolution — `package.json` `overrides` lift them. Re-check these on every `next` upgrade: once Next ships a range that already includes the fix, drop the override rather than leaving it to pin something backwards. The postcss override was verified inert by building before and after and diffing the emitted CSS byte-for-byte. `sharp` is never imported here (`images.unoptimized` plus static export means Next's optimizer never runs), so it is patched rather than exercised
- **Node baseline lives in three places**: `.nvmrc` (development plus the install/quality/test jobs), `engines.node` in `package.json` (what forks are told they can use), and the `build` matrix in `.github/workflows/node.js.yml` (literals — a matrix cannot read `.nvmrc`). The deployed leg is named once as the workflow-level `DEPLOY_NODE` env so the Pages-configure and artifact-upload gates cannot drift apart; a build step asserts `DEPLOY_NODE` still matches `.nvmrc`. Derive the `engines` floor from the tightest transitive requirement rather than guessing, and re-derive it on every dependency bump — a major upgrade can narrow it without touching `package.json`, which leaves the support promise broader than anything actually installs. `jsdom` is the binding constraint and currently forces `^22.22.2 || ^24.15.0 || >=26.0.0`; jsdom 30 narrowed it from `^22.13.0`, and the mismatch surfaced only as an `EBADENGINE` warning during `npm ci`, not as a failed gate. The `22.x` matrix leg keeps working because it resolves to the newest 22 release, so CI cannot catch this for you
- **Production compiler**: `npm run build` intentionally passes `--webpack`. Turbopack's build tracer stalls on the build-time public-image header reader used by article rendering; keep development on Turbopack, but do not restore Turbopack production builds until this exact export completes promptly on the full CI matrix
- **Canonical/export URLs**: When generating absolute URLs for metadata, RSS, sitemap, or schema, match `trailingSlash: true` output (`/about/`, `/writing/post-slug/`) instead of non-canonical no-slash variants; file-like routes such as `/feed.xml` and `/sitemap.xml` stay file-like
- **Page metadata**: Route-level `metadata` exports and `generateMetadata` should override `openGraph` and `twitter`, not just `title`/`description`, otherwise subpages inherit the homepage share card from `app/layout.tsx`; for `app/not-found.tsx`, omit `openGraph.url` because there is no stable canonical 404 route in the static export
- **Metadata objects replace, they do not merge**: a route-level `openGraph`, `twitter`, or `alternates` object wholly replaces the inherited one, so anything omitted vanishes from that page. This has caused three separate bugs — posts with no `og:image`, subpages with no image at all, and the writing index with no canonical after it declared RSS `types`. Spread `sharedOpenGraph` / `sharedTwitter` from `src/lib/metadata.ts`, and spread the existing `alternates` before adding to it. `app/__tests__/page-metadata.test.ts` pins all of it
- **Share images**: The card is `public/og.png`, regenerated with `npm run og`; commit it together with `public/og.meta.json`, which binds the image to its generator and profile inputs. Do **not** convert this to an `app/opengraph-image.tsx` metadata route: it emits an extensionless file that GitHub Pages serves as `application/octet-stream`, which scrapers reject, and the file convention only reaches routes that do not declare their own `openGraph`
- **Drafts**: every read of a post goes through `isPublished` in `src/lib/posts.ts`, and `generateStaticParams` must use `getPostSlugs()` rather than raw filenames. Reading the directory directly is what once exported a full draft with `robots: index, follow`
- **robots**: never emit a positive `index, follow` globally. It is already the default, and it contradicts any page that sets `noindex` — the 404 shipped carrying both
- **Static export constrains data fetching**: `output: 'export'` requires every route to be statically renderable, so build-time fetches must stay cacheable (`revalidate: false`). An uncached fetch silently forces the route dynamic, which makes it fall back on every build. Cache staleness is handled in the Pages workflow instead, which deliberately does not restore `.next/cache`
- **Filtering hides, it does not unmount**: `Skills` keeps every group in the DOM behind `hidden` so `print.css` can restore them. Removing filtered content from the DOM means a printed resume silently reflects whatever filter was selected
- **Theme images**: Use `ThemePortrait` component for light/dark variants
- **Profile copy**: Keep role/bio updates in sync across `src/components/Template/Hero.tsx`, `app/layout.tsx` metadata, `src/data/about.ts`, and `src/data/resume/work.ts` so homepage copy, SEO, schema, and resume stay aligned
- **Long-form markdown pages**: Prefer a dedicated renderer component that can parse markdown into semantic sections instead of styling raw headings globally; if `markdown-to-jsx` causes dev/runtime issues in App Router, a `'use client'` boundary may still be required even without hooks. Preserve stable heading ids when converting markdown headings so deep links and `scroll-margin-top` behavior keep working, prefer a shared helper over duplicating slug logic in each page component, and expose those anchors in the UI with section nav or self-links if readers are expected to use them
- **Blog posts**: Markdown files in `content/writing/` with frontmatter (title, date, description); slug derived from filename
- **Writing page**: Add external links in `src/data/writing.ts` and keep dated entries sorted newest first; local posts still live in `content/writing/`
- **Design system**: Three type roles, and every element should pick one deliberately: `--font-display` (Bricolage Grotesque) for names and headings, `--font-body` (Newsreader) for prose, and `--font-mono` (JetBrains Mono) for data, dates, labels, and buttons. Structure is carried by hairlines (`--rule`) and near-square radii, not by shadow and float. A heavy `--color-fg-bold` rule opens a section; a `--color-border` hairline divides within one
- **Page measures are semantic**: use `--measure-wide` for split hero compositions, `--measure-page` for default pages/lists/footer, and `--measure-read` for continuous prose and compact data views. Component constraints such as portraits, controls, and short status messages may still use their own intrinsic measure; do not create a new page width for each route
- **Signal colour discipline**: `--color-accent` (ultramarine) is for structure and links. `--color-signal` (amber) is reserved for values that are live or in progress — the ticking age, a role with no end date. Using it decoratively is what makes the rest of it stop meaning anything. `--color-signal` is the text-safe value; use `--color-signal-mark` for non-text marks only
- **Link accents and button fills are different tokens**: `--color-accent` is tuned for text on the page background and is far too light in dark mode to sit behind white text (it measured 2.67:1). Filled controls use `--color-accent-fill` / `--color-accent-fill-hover` with `--color-on-accent`
- **Interactive labels use `--text-ui` (13px)**, not `--text-2xs` (11px). 11px is for genuinely secondary annotation only — dates, gutter markers, category labels
- **Fonts must be variable and self-hosted**: `app/fonts.ts` feeds versioned Fontsource variable files to `next/font/local`, preserving metric-adjusted fallbacks and critical preloads without a Google build dependency. The weight tokens only render as distinct weights because those files remain variable. Newsreader italic is scoped through `app/writing/layout.tsx` and deliberately is not preloaded site-wide
- **Type sizes are rem**: `--text-*` are absolute so nesting never compounds. Avoid reintroducing `em` sizes
- **Telemetry**: Measured values shown on `/stats` live in `src/lib/telemetry.ts`. Live readings use `useLiveAge`, which returns a ref rather than a value: render `agePlaceholder(precision)` as the element's content — fixed-width and digit-free, so server and client markup agree — and the hook assigns each reading to `textContent`. It deliberately does not hold the reading in state. At `AGE_PRECISION_FULL` the timer runs at the 25ms floor, so state meant 40 React renders a second; the out-of-band write survives re-renders only because the placeholder React renders never changes. Test the server path with `renderToStaticMarkup`, since effects flush during Testing Library's `render()`, and keep the render-count test that pins the no-re-render property
- **Hierarchy from data**: Where a list needs varying visual weight (e.g. `tierFor` in `src/components/Resume/Experience.tsx`), derive it from the data — dates, role titles — rather than hardcoding per-item styling, so new entries place themselves
- **Numbers about the site**: Never type a figure describing the codebase into a data file. `/stats` claimed 2,272 lines against ~4,400 actual before it was switched to `countSourceLines()` in `src/lib/loc.ts`. Anything countable should be counted at build
- **Motion**: Anything that animates continuously must check `prefers-reduced-motion` through the shared `usePrefersReducedMotion` hook (see `useLiveAge`, `EmailLink`) rather than hand-rolling a `matchMedia` read — the hand-rolled ones drifted, and only some of them subscribed to changes. The live age readout takes a single reading under the preference rather than ticking
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
