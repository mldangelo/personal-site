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
- **Node baseline lives in three places**: `.nvmrc` (development plus the install/quality/test jobs), `engines.node` in `package.json` (what forks are told they can use), and the `build` matrix in `.github/workflows/node.js.yml` (literals — a matrix cannot read `.nvmrc`). The deployed leg is named once as the workflow-level `DEPLOY_NODE` env so the Pages-configure and artifact-upload gates cannot drift apart; a build step asserts `DEPLOY_NODE` still matches `.nvmrc`. Derive the `engines` floor from the tightest transitive requirement rather than guessing — `jsdom` currently forces `^22.13.0`, and `@testing-library/jest-dom` requires `>=22`, which is why Node 20 had to go
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
- **`markdown-to-jsx` shapes the DOM more than it looks**: three of its defaults have each caused a bug in `src/components/Writing/PostContent.tsx`. It **slugifies headings itself**, and its slugifier keeps every separator it strips, so a heading containing a code span of `--dangerously-skip-permissions` produced `on-using---dangerously-skip-permissions` while the rest of the site derived `on-using-dangerously-skip-permissions` from `createHeadingId` — pass `slugify: createHeadingId` so there is one scheme. It **wraps a standalone image in a `<p>`**, so a `<figure>` has to be produced by the `p` override (a `<figure>` inside a `<p>` is hoisted out by the parser and breaks hydration) — discriminate on the single child's `src` prop, recursing one level for a linked image. And it **wraps a multi-block document in a `<div>`**, which becomes the only child of `.prose`, so any `.prose > *` rule silently lands on the wrapper and constrains everything inside it; `wrapper: null` removes it. `forceBlock: true` keeps single-block content on the same path as everything else
- **Image titles are captions**: `![alt](src "title")` — `readPostImageSizes` in `src/lib/imageSize.ts` already parses the title out and markdown-to-jsx forwards it, so drop it from the `img` props and every caption an author writes disappears silently
- **`max-width` cannot widen a block**: a block at `width: auto` fills its containing block, so raising `max-width` alone does nothing — this is why wide article figures stayed at 640px. A figure that must exceed the reading measure needs an explicit `width`, and the prose blocks (not the article element) must be what carries `--measure-read`, or there is nothing to grow into. `--figure-width` is the build-time measurement, so `min()` against it means a figure is never upscaled past its own pixels
- **Blog posts**: Markdown files in `content/writing/` with frontmatter (title, date, description); slug derived from filename
- **Writing page**: Add external links in `src/data/writing.ts` and keep dated entries sorted newest first; local posts still live in `content/writing/`
- **Design system**: Three type roles, and every element should pick one deliberately: `--font-display` (Bricolage Grotesque) for names and headings, `--font-body` (Newsreader) for prose, and `--font-mono` (JetBrains Mono) for data, dates, labels, and buttons. Structure is carried by hairlines (`--rule`) and near-square radii, not by shadow and float. A heavy `--color-fg-bold` rule opens a section; a `--color-border` hairline divides within one
- **Page measures are semantic**: use `--measure-wide` for split hero compositions, `--measure-page` for default pages/lists/footer, and `--measure-read` for continuous prose and compact data views. Component constraints such as portraits, controls, and short status messages may still use their own intrinsic measure; do not create a new page width for each route
- **Signal colour discipline**: `--color-accent` (ultramarine) is for structure and links. `--color-signal` (amber) is reserved for values that are live or in progress — the ticking age, a role with no end date. Using it decoratively is what makes the rest of it stop meaning anything. `--color-signal` is the text-safe value; use `--color-signal-mark` for non-text marks only
- **Link accents and button fills are different tokens**: `--color-accent` is tuned for text on the page background and is far too light in dark mode to sit behind white text (it measured 2.67:1). Filled controls use `--color-accent-fill` / `--color-accent-fill-hover` with `--color-on-accent`
- **Focus rings come from tokens, and filled controls take the other one**: `--color-focus-ring` (accent) for controls on the page surface, `--color-focus-ring-fill` (ink) for accent-filled ones. In light mode `--color-accent-fill` resolves to `--color-accent`, so an accent ring around a filled button is the fill's own colour — 1.00:1 — and the entire indicator is the 2px of paper the offset leaves behind. Never hardcode `2px solid var(--color-accent)`; six rules did, and they had already drifted off `--rule-strong`
- **A graphic still owes 3:1**: `--color-signal-mark` is the only thing marking a role as current, so SC 1.4.11 applies to it against both `--color-bg` and `--color-bg-alt`. It shipped as `#e8930c`, which measured 2.36:1 and 2.16:1. Never write a ratio into a token comment without computing it — `contrastRatio` in `src/lib/contrast.ts` does, and `src/lib/__tests__/contrast.test.ts` pins the pairs. That test is a floor, not a proof: the paper grain, the header's `backdrop-filter`, and the portrait's `mix-blend-mode` all sit between the two colours a token pair compares, so it can be green while a real surface fails. Do not grow it into a whole-stylesheet contrast harness — it would report pairs that never touch and still miss the composited ones that do
- **Forced colors is a mode override, like dark and print**: `app/styles/forced-colors.css` is imported after `dark-mode.css` and before `print.css`, and its rules are deliberately unlayered so they beat the component and page files. A forced palette throws `background-image` away — which is how every prose underline here is drawn — and flattens fills, which is the whole of the state on the lit resume marker and the active skill filter. State has to survive as a shape (filled versus hollow) or as a system colour (`ButtonFace`/`ButtonText`, `Highlight`/`HighlightText`). `outline-color` and `border-color` are remapped by the UA, so rings and hairlines need nothing
- **Interactive labels use `--text-ui` (13px)**, not `--text-2xs` (11px). 11px is for genuinely secondary annotation only — dates, gutter markers, category labels
- **Fonts must be variable and self-hosted**: `app/fonts.ts` feeds versioned Fontsource variable files to `next/font/local`, preserving metric-adjusted fallbacks and critical preloads without a Google build dependency. The weight tokens only render as distinct weights because those files remain variable. Newsreader italic is scoped through `app/writing/layout.tsx` and deliberately is not preloaded site-wide
- **Type sizes are rem**: `--text-*` are absolute so nesting never compounds. Avoid reintroducing `em` sizes
- **Telemetry**: Measured values shown on `/stats` live in `src/lib/telemetry.ts`. Live readings go through `useLiveReadout` (`useLiveAge` is a thin wrapper over it), which returns `{ ref, live }` rather than a value: render the `initial` string as the element's content and the hook assigns each reading to `textContent`. It deliberately does not hold the reading in state. At `AGE_PRECISION_FULL` the timer runs at the 25ms floor, so state meant 40 React renders a second; the out-of-band write survives re-renders only because the content React renders never changes — which is also what makes the single `live` flip safe, since it reconciles `initial` against `initial` and touches nothing. Test the server path with `renderToStaticMarkup`, since effects flush during Testing Library's `render()`, and keep both the render-count test that pins the no-re-render property and the one that pins the mount budget at two renders
- **A readout must read correctly with the power off**: `/stats` shipped `--.-----------` as the age to every crawler, every no-JS reader, and every printed copy, because the only reading was the one the browser took. The server renders the reading it can prove and the client upgrades it in place: thread the server's string through as a **prop** (never recompute it client-side — the client clock is not the build clock, and React will warn and swap the text), reserve the widest form's width in `ch` so the upgrade cannot resize the cell, teach the hook to restore that string rather than a placeholder on cleanup, and **label what the unpowered value is** (`as of 2026-07-28`) so it cannot pass for a current reading. Precision is part of the honesty: `AGE_PRECISION_STATIC` is 2 because one unit is ~3.7 days, about a deploy cycle, where eleven decimals of a build-time snapshot would be nine digits of fiction. And never let the server render a value whose unpowered form is a lie — elapsed time at build is `00:00:00`, so `BuildClock` renders the build _date_ and only becomes a duration once it is counting. `--color-signal` follows the same rule: it is spent on `data-live="true"` only, because amber that sometimes means live stops meaning anything
- **Deploy provenance is not `pushed_at`**: the page said "Last updated at" over GitHub's `pushed_at`, which is the repository's last push on any branch — not the commit that produced the bytes being read, and ahead of the deploy whenever a push does not produce one. `deployedCommit()` reads `BUILD_SHA` (set by the build step in `.github/workflows/node.js.yml`, with the runner's `GITHUB_SHA` as a fork fallback) and returns `null` off CI, so the row drops rather than guessing and `npm run dev` still works. Dates the build publishes go through `utcDate`, not `dayjs`/`toLocaleDateString`: both read the host timezone, so a runner an hour either side of midnight would publish a different day
- **Hierarchy from data**: Where a list needs varying visual weight (e.g. `tierFor` in `src/components/Resume/Experience.tsx`), derive it from the data — dates, role titles — rather than hardcoding per-item styling, so new entries place themselves
- **Numbers about the site**: Never type a figure describing the codebase into a data file. `/stats` claimed 2,272 lines against ~4,400 actual before it was switched to `countSourceLines()` in `src/lib/loc.ts`, and `Number of linter warnings: '0'` sat four lines below the comment warning against exactly that. Anything countable is counted at build: lines in `src/lib/loc.ts`, dependency and lint-rule figures in `src/lib/manifest.ts`. A `source: 'measured'` row in `src/data/stats/site.ts` declares a `key` and no `value`, and the data test enforces it. A counter that cannot read its manifest returns `null` and `resolveReadings` drops the row — a fork with no `package-lock.json` shows one fewer reading rather than an invented one
- **Stats readings**: every row resolves through `resolveReadings` in `src/lib/readings.ts`, which formats counts, appends units, and carries provenance (`measured` / `github` / `profile`) so both tables describe their sources the same way. Format functions belong to the declaration, not to `Table` — they cannot cross the RSC boundary the site table renders on. Pin the locale on `toLocaleString`; otherwise the published figure follows the build host's locale. Append a unit only where the label does not already name it (`301 packages`, but not `53 countries`). The provenance mark hangs _below_ its label rather than above: stats cells align on their first baseline, so an 11px mark above the label would drag the 36px value up to meet it — which is why a readout's `as of` note hangs below its value for the same reason. A `Measurement` may be a React element, which is how a row whose current value only a browser can take (the age, the build clock) gets its client leaf supplied by the renderer instead of hardcoded in the data file. A `link` may be a function of the reading, so that even a URL that depends on its value (the deployed commit points at itself) still lives in the declaration
- **The about-page log has one temporal axis**: `src/lib/logEntry.ts` files every `Some History` / `Travel / Geography` entry under a year and prints the age beneath it, deriving whichever half the prose omits from `profile.birthDate` — the gutter used to print "Age 7" next to a sentence that said a year, which is two timelines in one column. It reads only the entry's opening sentence, and only the phrasings actually in the prose (`At 7,`, `14 - 17,`, `When I was 12,`, `I was 11 when`, `In the summer of 1996,`, and an embedded `…in 1995`). A leading phrase is lifted out of the sentence; an embedded one is annotated where it stands, because removing it would mean rewriting the author's words. So when a new entry dates itself some other way, add the form to `LEADING_PATTERNS` rather than rewording the entry — and keep the inline patterns anchored to a preposition or to "I was", or "approximately 50 countries" and "Mavica MVC-FD71" start becoming dates. `src/lib/__tests__/logEntry.test.ts` pins all fifteen history entries as dated and the log as opening on `profile.computingSince`
- **Numbers about the site**: Never type a figure describing the codebase into a data file. `/stats` claimed 2,272 lines against ~4,400 actual before it was switched to `countSourceLines()` in `src/lib/loc.ts`. Anything countable should be counted at build
- **Motion**: Anything that animates continuously must check `prefers-reduced-motion` through the shared `usePrefersReducedMotion` hook (see `useLiveAge`, `EmailLink`) rather than hand-rolling a `matchMedia` read — the hand-rolled ones drifted, and only some of them subscribed to changes. The live age readout takes a single reading under the preference rather than ticking
- **Numbers about the site**: Never type a figure describing the codebase into a data file. `/stats` claimed 2,272 lines against ~4,400 actual before it was switched to `countSourceLines()` in `src/lib/loc.ts`. Anything countable should be counted at build
- **Motion**: Anything that animates continuously must check `prefers-reduced-motion` through the shared `usePrefersReducedMotion` hook (see `useLiveAge`, `EmailLink`) rather than hand-rolling a `matchMedia` read — the hand-rolled ones drifted, and only some of them subscribed to changes. The live age readout takes a single reading under the preference rather than ticking. The preference is about motion and nothing else: the reduced-motion block in `base/reset.css` used to hide the paper grain (`body::before`) as a "heavy fixed overlay", but the grain is one static background image on its own composited layer (`contain: strict` plus `translateZ(0)`, so `position: fixed` costs no scroll repaint), and hiding it only took the design's single ambient texture away from the people who asked for less movement. Hide what moves
- **Opting out of base link styles**: `app/styles/base/links.css` paints an accent underline on every `p a` / `li a`. Navigation-like links must set `background-image: none` or they pick up a rule that appears nowhere else — this is what made the mobile menu look broken
- **Print**: `app/styles/print.css` is imported last so it can override both themes. The resume is the page people print; check it there after changing resume layout
- **No page transitions, on purpose**: `app/styles/utilities.css` once carried `@view-transition { navigation: auto }`, `::view-transition-old/new(root)` choreography, and its own `prefers-reduced-motion` guard. `@view-transition` is the _cross-document_ API; the App Router intercepts every `<Link>` into a same-document client navigation and `next.config.mjs` sets no `experimental.viewTransition`, so none of it ever ran. The reduced-motion guard was equally inert — the global reset in `app/styles/base/reset.css` already covers everything that does animate. A defended no-op is worse than no transition, because the comment convinces the next reader it works, so the file is gone. Reinstating root-level view-transition CSS requires `experimental.viewTransition` in `next.config.mjs` as well; `app/styles/__tests__/stylesheets.test.ts` fails if the CSS returns without it. Do not leave comment-only placeholder stylesheets behind either — `components/forms.css` sat in the import graph for the same reason and shipped nothing

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
