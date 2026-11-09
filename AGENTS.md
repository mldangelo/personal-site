# AGENTS.md

Guidance for AI coding agents working on this Next.js personal portfolio site.

## Quick Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run format       # Format with Prettier + Biome
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
public/images/        → Images (favicons and the manifest live in app/)
src/lib/              → Shared helpers, including plain .mjs used by scripts
scripts/              → Export gates, size budget, share-card and icon generators
docs/                 → Documentation
```

## Code Style

**Do:**

- Use TypeScript strict mode, functional components with hooks
- Style with CSS custom properties in `app/styles/` (tokens in `tokens/`, components in `components/`)
- Keep components small and focused
- Use existing patterns from similar components
- Mark client components with `'use client'`
- Run `npm run format` before committing (CI enforces this)

**Don't:**

- Add new dependencies without clear need
- Create god components or monolithic files
- Hard-code colors—use CSS variables (`var(--color-*)`)
- Skip type annotations on function parameters

## Git Workflow

- Create a topic branch for every task; never commit or push directly to `main`
- Make small, frequent conventional commits as you go (e.g., `feat:`, `fix:`, `refactor:`)
- Push to your remote branch after every commit to keep it in sync
- Land changes on `main` by merging GitHub PRs with conventional-commit titles (deploys trigger automatically from these merges)
- If multiple PRs need to land together, open an integration branch PR; do not locally merge into `main`. Dependency upgrades follow the workflow below
- Treat `main` as protected: force-pushes and history rewrites require explicit user approval

### Dependency upgrade PRs

- Merge dependency upgrade PRs one at a time into `main`. Verify the result on `main` before merging the next PR
- Review and repair each existing PR in place, preserving its branch and discussion. Refresh the PR head, base, CI results, and review threads before merging; do not bypass required checks or reviews
- Leave a dependency PR open if it cannot be safely merged, and report the blocker. Do not close, supersede, replace, or combine dependency PRs, or retarget them to an integration branch, unless the user explicitly requests that approach

## Tech Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Biome · Vitest

Each entry below is a rule and the trap behind it. Git history has the stories.

## Build, Export, and Hosting

- **Static export**: `output: 'export'` for GitHub Pages, so no server features. Every route must render statically, and build-time fetches must stay cacheable (`revalidate: false`): an uncached fetch silently makes the route dynamic, so it falls back on every build. The Pages workflow deliberately does not restore `.next/cache`; that is how cache staleness is handled
- **GitHub Pages owns response headers**: a static export cannot set HTTP security headers, so never claim Next's `headers()`, Helmet, `_headers`, or a meta tag adds anti-framing or MIME-sniffing protection. The hosting section of `docs/adapting-guide.md` explains why
- **Production builds use webpack**: `npm run build` passes `--webpack` because Turbopack's build tracer stalls on the build-time public-image header reader that article rendering uses. Development stays on Turbopack. Do not restore Turbopack production builds until this export completes promptly on the full CI matrix
- **TypeScript 7 needs `experimental.useTypeScriptCli`** in `next.config.mjs`: the native compiler has no JavaScript API for Next's build-time type check, so the flag makes Next run the TypeScript CLI instead. It still gates the build (injecting `const x: number = 'string'` exits non-zero and produces no `out/`). Re-verify that whenever the flag changes: a silently skipped type check is worse than an old compiler
- **Canonical URLs match `trailingSlash: true`**: absolute URLs in metadata, RSS, the sitemap, and schema use `/about/` and `/writing/post-slug/`; file-like routes such as `/feed.xml` and `/sitemap.xml` stay file-like. Unit tests never apply that build-time config, so `next/link` renders `/writing/slug` under jsdom while the export writes `/writing/slug/`. Assert canonical shape against `out/`, and normalise the slash away in component tests
- **Export size budget**: `npm run measure-export` weighs `out/` by subsystem against `scripts/budget.json`, and CI runs it after `npm run verify-export` on every build leg. Most of what Pages serves is not JavaScript, so bundle analysis alone misses it.
  - Budgets are ratchets with documented headroom, not byte fingerprints. Raise one on purpose with `npm run measure-export -- --update-budget` and say why in the PR
  - **No gated metric may be a function of the page count.** HTML, RSC payloads, images, repeated inline SVG, and the export total grow with publishing, so they are printed ungated; inline SVG is gated on its distinct markup (the icon set), and oversized individual assets and routes fail their own gates. `_policy` in `scripts/budget.json` explains each metric. Before adding a budget, simulate a few extra posts against a real `out/`
  - JSON reports stay outside `out/`, there is no on-page version (writing one into the export changes the export's size), and an export with assets but no HTML fails closed
- **Post-build scripts share `scripts/lib/`**: `html.mjs` holds the tag, attribute, and meta readers (regex, because a DOM parser would have no other use), and `site.mjs` derives the base path from `package.json` `homepage` and holds the route helpers. Never re-derive the base path in a new script; a second copy only misbehaves in a fork published under `/repo/`
- **`verify-export.mjs` helpers take public paths, not routes**: `pageAt`, `exportedFileExists`, and `validateInternalTarget` pass their argument through `routeForPublicPath`, which strips the base path, so `pageAt('/resume/')` is `undefined` on a base-path build while passing locally. Wrap a route in `publicPathForRoute` first; the `basePath` fixture in `scripts/__tests__/verify-export.test.ts` catches this. Native links to file-like routes need the same care: `/resume/` links to `../resume.json`, which resolves at both root and repository paths, and the same fixture checks it
- **Exported form targets**: raw HTML forms survive Markdown rendering, so the export verifier checks both `form[action]` and `button/input[formaction]`, since a submit control can override its form's destination. Cover root and subpath deployments, and allow external services and empty actions
- **CI credential boundaries**: pin external actions to verified full commit SHAs with version comments, and keep `persist-credentials: false` on every checkout. Only the artifact-only deploy job gets write permissions. The build needs `pages: read` for `configure-pages` with `enablement: false`; it must not enable Pages, persist checkout authentication, or inject a job token into application code. Anonymous stats requests already fall back when rate limited. `scripts/__tests__/workflow-security.test.ts` checks these boundaries
- **The Node baseline lives in three places**: `.nvmrc` (development and the install, quality, and test jobs), `engines.node` in `package.json` (what forks are promised), and the literal `build` matrix in `.github/workflows/node.js.yml`, since a matrix cannot read `.nvmrc`. The deployed leg is named once, as the workflow-level `DEPLOY_NODE`, and a build step asserts it still matches `.nvmrc`. Derive the `engines` floor from the tightest transitive requirement and re-derive it on every dependency bump: `jsdom` currently forces `^22.22.2 || ^24.15.0 || >=26.0.0`. A narrower floor surfaces only as an `EBADENGINE` warning during `npm ci`, and the `22.x` leg resolves the newest 22 release, so CI will not catch it

## Dependencies

- **Biome upgrades need `npx biome migrate --write`**, patch releases included: a `$schema` version that disagrees with the CLI is reported only as information, and `biome check` still exits 0, so CI stays green and nothing else flags the stale schema. The repo sets `linter.rules.preset` to `"none"` and opts into rules explicitly; do not restore the deprecated `recommended` field it replaced. Biome's CSS, Markdown, and YAML formatters stay off: Prettier owns CSS and Markdown (Biome's Markdown output fails `prettier --check`), and nothing formats YAML. Read each release's newly supported languages rather than accepting the rewrite
- **Packages that move together**, each set in one Dependabot group:
  - `vitest` and `@vitest/coverage-v8`, an exact peer: upgrading only Vitest makes `npm ci` fail with `ERESOLVE`. Run `npm run test:coverage` on upgrade, since a plain run never loads the provider
  - `next`, `@next/third-parties`, and `@next/bundle-analyzer`
  - `react`, `react-dom`, `@types/react`, and `@types/react-dom`. Review runtime and type changes together: older declarations can hide new APIs or changed contracts
  - `tailwindcss` and `@tailwindcss/postcss`, which pins the `tailwindcss` its compiler loads. Bumped alone, the top-level package moves while the build keeps compiling with a nested copy of the old version
  - The artifact actions, which sit on the publishing path: `upload-artifact` with `download-artifact`, and `upload-pages-artifact` with `deploy-pages`
- **Re-check security overrides on upgrades**: `postcss` and `sharp` need none, because Next pins a patched `postcss` and asks for a patched `sharp`. Sharp still matters although the export disables Next's image optimiser: the icon and share-card generators load it through `scripts/lib/image-renderer.mjs`. The `nanoid` and `source-map-js` overrides set patched minimums within their majors. An override replaces every parent's own range, so keep its floor at or above the highest range any parent declares, and drop it once every parent requires the patched version; Next's pinned PostCSS still allows older ones. Run `npm audit` after resolving upgrades; CI does not. A clean audit covers declared packages only: magicast 0.5.5 bundles source-map-js 1.2.1, which the override cannot replace, and the current coverage configuration gives that consumer no indexed source maps. Recheck if coverage configuration or magicast usage changes
- **Frontmatter is parsed in one place**: `parseFrontmatter` from `src/lib/frontmatter.mjs`, in the site and plain-Node scripts alike. It splits the `---` block itself and hands it to js-yaml's safe-by-default `load`. An unclosed block throws rather than becoming body text, so a malformed post cannot lose its `draft: true`. Quote dates and numeric-looking text; js-yaml 4 and later read some unquoted leading-zero scalars differently from js-yaml 3

## Metadata, Share Images, and Icons

- **Metadata objects replace, they do not merge**: a route-level `openGraph`, `twitter`, or `alternates` object wholly replaces the inherited one, so anything omitted vanishes from that page. Spread `sharedOpenGraph` / `sharedTwitter` from `src/lib/metadata.ts`, and spread the existing `alternates` before adding to it. Every subpage's `metadata` or `generateMetadata` (usually through `createPageMetadata`) overrides `openGraph` and `twitter`, not only `title` and `description`, or it inherits the homepage card from `app/layout.tsx`. The homepage is the exception: it takes that card from the layout on purpose. `app/not-found.tsx` omits `openGraph.url`, because the export has no canonical 404 route. `app/__tests__/page-metadata.test.ts` pins the subpages, the 404, and the posts
- **robots**: never emit a global `index, follow`. It is already the default, and it contradicts any page that sets `noindex`
- **Share images**: `npm run og` writes the site card at `public/og.png` and one card per published post at `public/og/writing/<slug>.png`, all 1200x630.
  - Commit them with `public/og.meta.json`, the ledger recording every image alongside the generator source, locked renderer packages, checksummed font files, profile facts, colour tokens, and each post's measured readout
  - `npm run og:check` runs two halves as separate CI steps: `og:check:ledger` is hermetic, and `og:check:render` fetches the pinned fonts and re-renders byte for byte, so a red run reads as a network problem or a stale card, not both. Together they fail when a card is stale, edited, missing, or belongs to no published post
  - Generation and the render check refuse to run without Sharp: `next/og` silently falls back to a bundled resvg.wasm when `import('sharp')` fails, which changes every byte while the ledger still records Sharp
  - Pin the versioned font URL and SHA-256 in `scripts/lib/fonts.mjs` (the shared Inter) or `CARD_FONTS` in `scripts/og-inputs.mjs`, never a mutable Google Fonts endpoint, and let generation fail if the bytes change. Inputs that `generate-og.mjs` and `check-og.mjs` both need live in `og-inputs.mjs`, because a fact only one of them knows stops being checked
  - Cards carry no amber and no live value: a baked PNG is frozen
  - Never convert this to an `app/opengraph-image.tsx` route. It emits an extensionless file that Pages serves as `application/octet-stream`, which scrapers reject, and the convention only reaches routes that declare no `openGraph` of their own
- **The share card is not the article image**: a post's `image` frontmatter is its representative screenshot or diagram, used for JSON-LD, where the real dimensions matter. `og:image` and `twitter:image` always point at the generated card, because `summary_large_image` wants 1.91:1
- **Fitting text into a generated card**: satori reports nothing back, so `og-layout.mjs` picks the display size from an estimate built on the generator's own constants, and throws when the complete title and description cannot fit at the minimum size. Never replace that throw with a minimum-size fallback; it turns cropped output into a successful generation. The estimate wraps word by word using per-class character advances read from the pinned TTFs, and its geometry constants are measured from rendered cards, not added up from the styles. `og-measure.mjs` then decodes each PNG with Sharp and refuses to write a card whose ink reached the readout
- **Icons**: `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png`, and `app/manifest.json` are Next's static file conventions, and all four survive the export with real extensions. A `manifest.ts` route is different: it emits `/manifest.webmanifest` and fails the build without `export const dynamic = 'force-static'`. Keep the static `manifest.json`, whose extension has a content type GitHub Pages certainly knows. Declaring `metadata.icons` replaces the convention-derived links, like `openGraph`, and nothing is linked by hand. Regenerate with `npm run icons` and commit the art with `scripts/icons.meta.json`; `scripts/__tests__/generate-icons.test.ts` fails when the art falls behind the colour tokens and profile name it reads, the checksummed display font, or the locked Next, React, and Sharp versions. After upgrading any of those three, run `npm run icons` and `npm run og` and commit both ledgers even when no pixel changed. Files under `public/` always need an explicit link or manifest entry: only `app/` files take part in metadata conventions, and only `favicon.ico` is restricted to the root segment
- **Colours outside CSS**: `theme-color` and the icon art need literal colours. Read them at build with `readColorToken` from `src/lib/color-token.mjs`, which the generators import directly and `src/lib/tokens.ts` re-exports for the site; a hex typed into a file has nothing checking it. `theme-color` is `--color-bg-alt`, the page and header background. `themeInitScript` creates one script-owned tag with no `media` attribute from the two build-time hexes, because it runs before the stylesheet is guaranteed, and the tag follows the resolved `data-theme` across client navigation. After that, `syncThemeColor` (`src/lib/theme.ts`) writes the cascade's `--color-bg-alt` into it and leaves it alone when the token is unresolved. The `<noscript>` fallback is light, the only theme the CSS serves without the bootstrap

## Content

- **Blog posts** are Markdown files in `content/writing/` with `title`, `date`, and `description` frontmatter; the slug is the filename. External links on `/writing` go in `src/data/writing.ts`, dated entries newest first
- **Drafts**: every read of a post goes through `isPublished` in `src/lib/posts.ts`, and `generateStaticParams` uses `getPostSlugs()`, never raw filenames.
  - `public/` ships verbatim, so draft-only screenshots and downloads live outside it. The development route uses the generic card and may reserve a fallback ratio only for a missing root-relative draft image
  - `verify-export.mjs` parses the same inline, reference-style, relative, and passive raw-HTML resource forms as the renderer, resolves them from the post route, and fails when an asset referenced only by a draft reaches `out/`. Active raw tags and uninspectable CSS or data documents fail closed
  - Plain Node scripts validate with the dependency-free `src/lib/post-frontmatter.mjs` before any asset reader skips a draft, so malformed draft content cannot pass one boundary and fail the other
  - The name check for draft-derived files covers only the generated-card directory and the draft's own `/writing/<slug>` route, because slugs are ordinary words: a draft called `about` must not fail `/about/index.html`
- **Publishing moves the newest item**: the newest dated items drive the homepage's writing list, the feed's `lastBuildDate`, and the `Blog` schema date on `/writing`. Tests derive such values from `getWritingItems()`, never a literal date. A post-only branch can pass alone and fail once merged, so run the suite on the merge
- **Rename a post image with `git mv`, not a copy**: nothing flags an unreferenced file under `public/`, so a copied rename ships both files forever. Keep the `src/lib/__tests__/imageSize.test.ts` fixture an image a post renders
- **Source-backed claims need stable wording**: replace rolling phrases such as "last month" with the actual observation window, and link a consequential claim where the reader meets it. Fewer tokens is not lower spend unless the pricing or quota system was measured, especially when the source says the model costs more per token
- **`markdown-to-jsx` shapes the DOM** in `src/components/Writing/PostContent.tsx` in three ways:
  - It slugifies headings itself and keeps separators that `createHeadingId` collapses, so a code span of `--dangerously-skip-permissions` gets an id unlike the rest of the site's. Plan every Markdown id before rendering, reserve every emitted id so an authored `repeat-2` cannot collide with a generated suffix, keep one non-conflicting alias for each legacy published heading id, and leave non-heading ids such as footnotes on the renderer's own scheme
  - It wraps a standalone image in a `<p>`, so the `p` override produces the `<figure>`; a `<figure>` inside a `<p>` is hoisted out by the parser and breaks hydration. Detect it by the single child being the `img` override component, one level down for a linked image. Never test for a `src` prop: overrides apply to raw HTML too, so a lone `<video src="/demo.mp4">` would match, reach the build-time image sizer, and fail `next build`
  - It wraps multi-block output in a `<div>` that becomes the only child of `.prose`, so `.prose > *` rules land on the wrapper. `wrapper: null` removes it, and `forceBlock: true` keeps single-block content on the same path
- **Standalone image titles are captions**: CommonMark calls the string in `![alt](src "title")` a title, but `PostContent` promotes it to a visible `<figcaption>` for a standalone image and drops it from the `<img>`, so the sentence is not also a tooltip and description. An inline image keeps its tooltip. The signal travels by context (`CaptionedFigure`), because a linked figure puts the image a level below
- **Long-form Markdown pages** (`src/components/About/Sections.tsx`) parse Markdown into semantic sections rather than styling raw headings globally. Keep heading ids stable for deep links and `scroll-margin-top`, derive them through `src/lib/anchors.ts`, and expose the anchors with section nav or self-links when readers are expected to use them. The Markdown renderers (`Sections`, `PostContent`, `JobSummary`) stay client components: rendered on the server, the RSC payload carries the whole element tree instead of the compact Markdown source, which measured larger
- **Typographic quotes happen at render**: `smartQuotes` in `src/lib/typography.ts` sets quotes and apostrophes in text a reader sees: names, titles, descriptions, and Markdown text nodes through `renderRule`. Never apply it to code or to the data: `resume.json`, metadata, the feed, and the share-card ledger match exact ASCII strings
- **Profile copy**: keep role and bio updates in sync across `src/data/profile.json`, `SITE_DESCRIPTION` in `src/lib/utils.ts`, `src/components/Template/Hero.tsx`, `src/data/about.ts`, `src/data/resume/work.ts`, the `/resume/` summary, and the `/speaking/` introduction
- **Numbers about the site are counted, never typed**: the `/stats` line count comes from `countSourceLines()` in `src/lib/loc.ts`, which counts every non-test `.ts`/`.tsx` under `app/` and `src/`. A test-only helper therefore belongs in its test file; Vitest treats everything under `__tests__/` as a suite

## Theme, Type, and Colour

- **Theming**: the inline bootstrap in `app/layout.tsx` stamps two attributes on `<html>` before first paint. `data-theme` (`light`/`dark`) is the resolved theme every stylesheet keys off. `data-theme-choice` (`light`/`dark`/`system`) is what the visitor asked for; without it `ThemeToggle` could not know its state before hydrating.
  - Keep the bootstrap a literal head `<script>`. App Router turns `next/script` with `beforeInteractive` into a `self.__next_s` descriptor that runs too late for a first-paint decision. The bootstrap and the control share attribute, storage, and media-query names through `src/lib/theme.ts`, and a test runs the generated script to guard its duplicated storage parsing
  - CSS hides the theme, mobile-menu, and résumé print controls until `data-theme-choice` exists, because without the bootstrap their handlers cannot hydrate. Write that gate as `:root:not([data-theme-choice]) .x { display: none }`, never a base `display: none` plus a `:root[data-theme-choice]` restore: the base hide ties with `.hamburger-button { display: flex }` in `header.css`, leaving the outcome to `@import` order, and the restore's `(0,3,0)` weight outranks the desktop hide in `navigation.css`
  - `system` is stored as the absence of the `theme` key, so never choosing and choosing to follow the device are the same state
  - The cycle opens on the theme opposite the device's (`nextThemeChoice`: `system → dark → light → system` on a light device, `system → light → dark → system` on a dark one), so the one press that changes nothing visible comes last. As a result, static HTML names only the preference, and `Switch to …` joins `aria-label`/`title` after mount, because the server cannot see the device; a lap keeps its order if the device flips part-way; and the click handler reads storage and the device itself when it runs before the mount effects. The mount effect must not then adopt storage over that press (`setChoice((pressed) => pressed ?? …)`), or blocked storage, which reads as `system`, undoes the first press
  - Persist through `window.localStorage`, never bare `localStorage`, to keep Node globals out of browser-only paths
  - The bootstrap is an inline script in a static export, so a strict `script-src` policy would need its exact hash
- **Portraits**: render through `ThemePortrait`, a plain `<img>`, so the hero and the footer on every route do not pull in `next/image`; dark mode softens its white field with `brightness(0.9)`, which forced colours removes
- **Design system**: three type roles. `--font-display` (Inter) for names, page titles, navigation, and buttons; `--font-body` (Newsreader) for prose, section headings, and the titles of things; `--font-mono` (JetBrains Mono) for data, dates, and annotations. Navigation, actions, and headings are sentence case. Flat porcelain surfaces, hairlines (`--rule`), and spacing carry structure, and imagery stays in colour without requiring hover. `docs/design-goals.md` describes the homepage hero
- **One way to open a section, one way to title a thing**: `app/styles/components/section-header.css` owns the section header: an ink hairline, then the heading in Newsreader at `--text-xl`, with an optional mono `.section-header-meta` opposite. Use `.section-header` / `.section-heading` instead of styling a page's own `h2`; the homepage's two-column `.home-writing` is the one exception and draws the same rule itself. Titles of things a reader could name (posts, companies, projects, degrees) are Newsreader at weight 500. Mono is for data only (dates, counts, durations, tags, and code), never below 12px
- **Text sizes**: text is 12px or larger, and interactive labels use `--text-ui` (13px). Page-level actions beside a title (RSS, JSON, print) are `.button.button-secondary.button-compact`, in sentence case. `--text-*` tokens are rem so nesting never compounds; do not reintroduce `em` sizes
- **Fonts are variable and self-hosted**: `app/fonts.ts` feeds versioned Fontsource variable files to `next/font/local`, keeping metric-adjusted fallbacks and critical preloads without a Google build dependency. The weight tokens only render as distinct weights because the files are variable. Inter loads its `opsz` file, so the browser draws the display cut at large sizes unprompted; display tracking (`--tracking-display`, and `-0.03em` on the larger `.hero-name`) is tuned to that cut, so change the file and the tracking together. The preloaded axis costs about 25 KB on every route. Newsreader italic is scoped through `app/writing/layout.tsx` and deliberately not preloaded site-wide
- **Page measures are semantic**: `--measure-page` for the header, every page, and the footer, which share one pair of rails, and `--measure-read` for continuous prose, the text column of list rows, and compact data views. Components such as portraits, controls, and short status messages may use their own measure; do not create a page width per route
- **Colour roles**:
  - `--color-accent` (ink blue) is for links and controls on paper and is tuned for text on page backgrounds. Filled controls use `--color-accent-fill` / `--color-accent-fill-hover` with `--color-on-accent`; the dark theme pairs a pale fill with dark text
  - The hero uses `--color-hero` / `--color-on-hero` in both themes, inverted for its button (hovering on `--color-on-hero-hover`), with the pale token for offset focus rings. Never use the page accent inside the blue field: it disappears against the light-mode fill
  - `--color-signal` (amber) is reserved for live or in-progress values, and `--color-signal-mark` for non-text marks only
  - `--color-fg-muted` is not a text colour. It is for non-text marks (the hover-revealed `#`, a `li::marker`) and falls below 4.5:1 on light paper. Secondary text takes `--color-fg-light`; recover finer hierarchy with weight and tracking, not lighter ink
  - Focus rings use `--color-focus-ring` on page surfaces and `--color-focus-ring-fill` around accent-filled controls, in every `outline` and `outline-color` declaration
  - Palette edits require `npm run icons` and `npm run og`. Reset every new decorative fill in print
- **Contrast tests are a design floor, not a conformance claim**: add every new reading surface to `src/lib/__tests__/contrast.test.ts`, and check both themes and every surface actually behind the text. The test's `contrastRatio` accepts only opaque hex, so a translucent colour needs an explicit backdrop. Filters and blending still need rendered QA

## CSS

- **Tailwind scans every non-CSS file for utility names**, including tests and this guide, so a word written here can change the built CSS. Diff the built utilities after editing prose
- **Let the production optimiser add vendor prefixes**: given a hand-written `-webkit-backdrop-filter` after the standard declaration, Lightning CSS emits only the prefixed form, so Chromium drops the effect. `app/styles/__tests__/stylesheets.test.ts` rejects the hand-written prefix. Verify rendered effects against the production export; source checks cannot exercise the optimiser
- **Bare links carry no decoration; links in running text take one style**: `app/styles/base/links.css` gives a bare `a` only a hover colour, and `p a` (on screen; the résumé is printed) the article's treatment: accent ink over a pale `text-decoration` underline that firms up on hover. Navigation, rows, and controls need no opt-out, and a prose list styles its `li a` from its own wrapper. `↗` means a link leaves the site in a new tab and nothing else; internal links carry `→` or no glyph. A rule that restyles a paragraph link names its own `text-decoration-color`, because Safari before 26.2 reads the shorthand as the line alone
- **Forced colors is a mode override, like dark and print**: `app/styles/forced-colors.css` is imported after `dark-mode.css` and before `print.css`. Forced colors removes background images, so never draw a link's underline with a gradient; real `text-decoration` survives and needs nothing restated. Preserve state with shape or system colours (`ButtonFace` with `ButtonText`, or `CanvasText`; `Highlight` is only guaranteed against `HighlightText`). Only `border-color` and `outline-color` are remapped for you, so anything drawn with `background`, such as the timeline spines and hamburger bars, needs an explicit rule. Restate the higher-specificity variants too (`.jobs-container:last-child::before`, `.hamburger-button:focus-visible .hamburger-icon span`), or the element disappears again in that state
- **`max-width` cannot widen a block**: a block at `width: auto` fills its containing block, so a figure wider than the reading measure needs an explicit `width`, and the prose blocks, not the article, carry `--measure-read` so there is room to grow into. For measured local images `--figure-width` is the build-time intrinsic width, so `min()` against it prevents upscaling; remote images use the documented fallback dimensions
- **Print**: `app/styles/print.css` is imported last so it overrides both themes. The résumé is the page people print; check it there after changing its layout. Paper hides the site header and footer, the only chrome that carries the name, so the résumé's one `<h1>` swaps its screen text for the name there
- **No placeholder stylesheets**: a stylesheet in the import graph ships rules, or it goes

## Behaviour

- **Smooth scrolling is armed per click, never set on `html`**: root `scroll-behavior` also governs the browser's scroll restoration, so Back into a long article, or closing the mobile menu mid-page, replays the scroll from the top. Next's `data-scroll-behavior="smooth"` only wraps Next's own forward navigation. Section-nav links take `onLinkClick` from `useActiveSection`, which calls `armSmoothScroll` (`src/lib/smoothScroll.ts`) and leaves the event alone: it stamps `data-smooth-scroll` on `<html>` before the native fragment jump, `base/reset.css` honours it only under `prefers-reduced-motion: no-preference`, and it comes off on `scrollend` or, where that event is missing, once `scroll` events stop, since a fixed timeout would have to outlast the longest animation
- **Section navs share `useActiveSection`**, which reads positions on each scroll frame rather than observing a band of the viewport. A section is current once its top reaches a line under the sticky bar: the bar's bottom edge, or the section's `scroll-margin-top` when that is lower, since that is where a link parks it. The bottom of the document counts as the last section, sections stranded below the line share out the last of the scroll range, and a section asked for by name wins where its jump parked. Keep the sticky opaque bar and the masked, scrolling row inside it as separate elements; a mask on the bar lets the page show through its faded edge
- **Motion**: anything that animates continuously checks `prefers-reduced-motion` through the shared `usePrefersReducedMotion` hook (see `useLiveAge`, `EmailLink`), never a hand-rolled `matchMedia` subscription. The hook reads `false` until its effect runs, so an effect that must decide on its first run may also read `REDUCED_MOTION_QUERY` once, as `ReadingProgress` does. Reduced motion affects movement, not static decoration
- **An accessible name needs a role that accepts one**: `aria-label` on a bare `<span>` or `<div>` is discarded, because the element maps to role `generic`. Prefer real text, visually hidden with `.sr-only` if it must not be seen
- **A page not in `primary` routes is nearly unreachable**: `primary: false` in `src/data/routes.ts` removes a route from the header nav and the mobile menu, leaving the footer as its only inbound path, and `/contact` passes `hideFooter`. Demote a route only when that is the intent
- **The header names the site on every page but the homepage**: `Navigation` renders both the "md" monogram and the name, and `navigation.css` shows the name only under `:root:not(:has(.hero))`, in a container query on the brand's track, so the homepage, whose hero sets the name at display size, and a track too narrow for the name keep the monogram. Never choose by `usePathname`: GitHub Pages serves the homepage file at `/index.html` too, so a pathname check renders the name over the monogram in that file's HTML and fails hydration. The brand and the controls are equal flex tracks either side of the nav, which keeps it centred whatever either holds

## Pages

- **Projects register**: `/projects` is one register in two parts, split by `status` in `src/data/projects.ts` (`shipped` renders as "Selected work", `archive` as "Archive"), drawn by one row component, `src/components/Projects/Entry.tsx`.
  - The parts differ only by what the data states: a size step in the title (live work, then finished work, then the archive, which is never promoted whatever its dates say) and an optional thumbnail
  - Every shipped entry declares a `sourceWork`, and `src/data/__tests__/projects.test.ts` cross-checks its dates and numeric claims against that role in `src/data/resume/work.ts`. That is internal consistency, not external truth or link health: research public claims from primary sources and check destinations live
  - A project may outlive the role that started it (Promptfoo continues at OpenAI), so `ongoing` describes the project, and the subtitle must make a historical role explicit
  - Entries are hand-ordered, not sorted at runtime: live work by start date, then finished work by end or one-off date, with title as the tie-break. `projects.test.ts` pins the order
  - A thumbnail is cropped to one 16:10 frame. A row without an `image` has none; never ship placeholder art. An entry with no public `link` renders with no link or arrow, and no label explaining why
  - The description measure is set in `ch`, the width of a zero, so `53ch` is roughly 66 characters of Newsreader. Count characters per line in a browser instead of reading a `ch` value as a character count
- **Speaking register**: `/speaking` renders `getAppearances()` from `src/data/speaking.ts` (sorted newest first, so source order is free) with the Projects register classes in `cards.css`, as `/writing` does. Each `link` is the organiser's own listing for the session, which should name Michael; note a stale lineup in a comment on the entry rather than dropping it or linking something unofficial. `format` is the organiser's billing: an Arsenal Lab is a demo, not a talk. Closed-door sessions are mentioned but never listed, and described as run on behalf of OpenAI rather than as a service. Black Hat and SecTor pages return 403 to automated fetchers and resolve presenter anchors only through JavaScript, so verify them in a real browser and link the schedule entry
- **The `/contact` address holds one line**: `EmailLink` types joke aliases into the local part, and one that wrapped pushed the page below it down and back on every cycle. The alias types into a slot of its own, where right-to-left overflow clips the start behind an ellipsis and keeps the newest characters in view, so only the width changes. Check it with motion on: reduced motion freezes it on the real address, which hides the problem
- **A `/stats` row earns its place by being worth reading, not by being countable.**
  - When a build cannot reach GitHub (anonymous CI requests are rate limited), `Site.tsx` shows `LAST_KNOWN` as floors (`1,695+`), not as a second, captioned state; refresh it now and then. A fork changes `SOURCE_REPOSITORY` in `src/lib/telemetry.ts`, which every GitHub reading and link derives from
  - A linked value is ink over a rule (`.stat-table-link`), never accent-coloured, because beside the amber age blue numbers read as a second data colour. The rule is then the only sign of a link at rest, so it uses `--color-control-border`, which the contrast tests hold to 3:1
  - Neither column declares a width: values never break, so each column hugs its widest value, and only a value `TableRow` marks as too long for a 320px phone may wrap
  - Pin the locale on numeric counts, and send a date published by a build through `utcDate`, not a host-local formatter
- **The live age is truthful in every state**: the measured values live in `src/lib/telemetry.ts`. The server renders a two-decimal snapshot with an `as of YYYY-MM-DD` note, so crawlers, readers without JavaScript, and printed copies get a real value, and the client upgrades it in place. Thread the server string through as a prop, reserve the full-precision width in `ch`, and keep the note line mounted to avoid a hydration shift. `useLiveAge` writes the higher-precision age to `textContent` and keeps only the static/live status in React state, because at `AGE_PRECISION_FULL` the timer reaches the 25ms floor and would otherwise render 40 times a second. `data-live="true"` and `--color-signal` mean an active timer; hidden pages and reduced-motion users keep the dated snapshot in ordinary ink. Keep the no-rerenders-per-tick test, but do not pin a mount render count, since Strict Mode may replay effects
- **About-page log markers mirror the source**: `src/lib/logEntry.ts` reads only an entry's opening sentence and shows only the year, age, or range the prose states. Never derive a counterpart from `profile.birthDate`: a year-only event can span two ages and an age two calendar years.
  - Lift a leading marker only when removing it keeps every qualifier; `In the summer of 1996` stays in the body and is annotated in place
  - Keep inline patterns anchored to real date phrasing, so `approximately 50 countries` or the model name `Tandy 2000` never become markers
  - `I was` precedes durations and counts as often as ages, so `INLINE_AGE` rejects a number followed by a measure noun or a second number (`I was 6 months into…`, `I was 1 of 3 founders…`). Guard that with a negative lookahead, not a positive one: requiring a following `,`, `.`, `when`, or `and` drops `When I was 12 I set a record`
  - Inline gutter copies are `aria-hidden`, because the body still states the fact; lifted leading markers stay exposed
  - Keep `Some history` ordered chronologically by each entry's starting marker, and update the real-content tests when adding a phrasing
  - A section takes its layout from `sectionVariants` in `src/components/About/Sections.tsx` by exact title, so renaming a heading in `src/data/about.ts` means renaming its key there. A missed key renders the section as a plain list, which `Sections.test.tsx` catches. Ids are the other way round: `createHeadingId` folds case, so only a change of words moves a deep link
  - The gutter reads text that `renderRule` has already typeset, which is safe only because no marker pattern contains a quote; a pattern that ever needs one has to match both forms
- **Career chronology is derived, never hand-maintained**: `src/lib/career.ts` owns the résumé timeline.
  - `sortPositions()` orders roles by recency of involvement (end date first). An open-ended `commitment: 'part-time'` role sorts by its start, so a long-running side engagement does not outrank later primary jobs, and `tierFor()` never promotes it to the lead tier
  - Anything meaning "the job I hold now", such as the footer on every page and the JSON-LD `Person` node, calls `currentPosition()`, never `work[0]`. `src/lib/__tests__/current-role.test.tsx` pins both against a fixture whose current role is last, which is where a job change recorded the natural way puts it
  - `monthsBetween()` and `formatDuration()` derive each tenure. `careerSpanYears()` is the elapsed span since the earliest role, not summed experience, so copy must call it a career span
  - Both are measured at build with no scheduled rebuild, so an ongoing tenure renders as a floor, like the span: a trailing `+`, and "or more" in the unabbreviated `.sr-only` label every visible duration carries. The page reads `Date.now()` once and threads it down, and `Job` requires that shared instant. Ordering compares validated `YYYY-MM-DD` strings directly rather than parsing to `Date`
- **Hierarchy from data**: where a list needs varying visual weight (`tierFor` in `src/components/Resume/Experience.tsx`), derive it from the data, such as dates and role titles, so new entries place themselves. A tier is a step in size within one typeface, with its spacing, never a change of weight or colour. Name what a tier changes as a custom property (`--job-title` in `cards.css`) when something else is placed against it: the spine has to begin at the first tick, wherever that tier's type puts it
- **The résumé skills list**: `Skills` is a server component that renders every group in the order `/resume.json` publishes them. The three knowledge tiers survive as text on each tag for a screen reader and, for the eye, as the order of each list plus one fainter tone
- **The résumé is published as data too**: `/resume.json` is a `force-static` route handler assembled by `src/lib/resumeJson.ts` from shared profile and résumé data, with mapping tests where the JSON and page intentionally differ. `/resume/` exposes a visible JSON link and an `application/json` metadata alternate, and the export verifier requires both. The `summary` strings in `src/data/resume/work.ts` are Markdown with inline `<a>` tags that `JobSummary` renders; anything that uses them as text goes through `toPlainText`, which strips only those anchors. JSON Resume sets `additionalProperties: false` only at the document root: nested objects allow extensions, while types, URI formats, and date patterns keep their own rules
- **`toPlainText` and the export gate promise the same thing**: `HTML_TAG` in `scripts/verify-export.mjs` rejects prose that still carries markup, but résumé prose is technical, and a broad `<[a-z/]…>` fires on `Map<string, number>` and `vector<int>`, which `toPlainText` keeps on purpose; that passes `npm test` and fails `npm run verify-export` after a build. Keep the gate an element-name whitelist requiring whitespace, `/`, or `>` after the name, keep unsupported elements such as `<canvas>` in it so a construct the conversion cannot strip still surfaces, and keep the agreement tests on both sides: the positive case in `scripts/__tests__/verify-export.test.ts` uses the same literal string as `src/lib/__tests__/resumeJson.test.ts`
- **Cross-file joins in `src/data/` match whole values**: `resumeJson.ts` files coursework under a degree by comparing `course.university` to `Degree.school` exactly, which is why `courses.ts` says "Stanford University" rather than "Stanford". Containment would publish the same courses under every degree whose school name contains another's. Assert cardinality across the whole document, not per entry, since per-entry assertions never see the duplicate
- **Print reveals hrefs for identifying links, not citations**: the `attr(href)` rule in `print.css` covers external links in `.about-content` and `.prose` and, on the résumé, only `.job-company` and `.degree-container .school a`; role-summary citations, `.resume-print-contact`, and course links stay bare, for the reasons the comment there gives. Validate link ownership as well as syntax: retired company domains may be unregistered or hijacked, so point them at a stable, trusted retrospective profile instead of an unrelated redirect chain, and take a course's title and link from the same record, because an old class site is often an archived offering under a title the catalogue has since retired. `app/__tests__/print-resume.test.tsx` pins known retired-company destinations and link-data invariants

## Testing

Tests live in `__tests__/` directories, beside the code or grouped by feature under `src/components/__tests__/`, or as a `*.test.ts` beside a route's `page.tsx`. Run `npm test` before committing.

Test application behavior, not third-party library internals or installed package
versions. Validate dependency upgrades with lockfile resolution, `npm audit`,
the build, and existing application tests; do not add suites that repeat a
dependency's parser or sanitizer tests.

Keep one test per distinct failure mode. Do not pin class names, stylesheet text,
markup shape, or copy unless the string itself is the contract, and do not test
what TypeScript or `verify-export` already enforces: the export gates check the
real HTML, and how a page looks takes a browser.

Suites run in parallel workers against the same checkout, so a test must never
write into a directory the site reads, such as `content/writing/`. Another suite
can list the file and then find it gone. Build fixtures in a temporary directory,
or substitute them in the suite's own view of the filesystem, as
`app/writing/[slug]/page.test.ts` does for its draft.

**Testing what `next/script` emits**: render inside `HeadManagerContext.Provider value={{ appDir: true }}` (from `next/dist/shared/lib/head-manager-context.shared-runtime`), as `app/__tests__/theme-color.test.ts` does. Without it, `renderToStaticMarkup` renders a `beforeInteractive` `<Script>` as nothing, so any assertion about how it was queued passes against every implementation. `data-nscript` is set only client-side and is no marker.

**jsdom styles a 1024x768 desktop, and nothing else**: its media queries read a frozen internal viewport, not `window.innerWidth`, so a stylesheet a test loads always takes the desktop side of every breakpoint. It also matches `:focus-visible` on every focus, so it cannot tell a key press from a mouse press. `Hamburger.test.tsx` reaches a phone by moving the breakpoint in the stylesheet text it loads, and `useActiveSection.test.tsx` supplies the browser's `:focus-visible` answer.

`vitest.config.ts` pins `TZ` to a non-UTC zone for the whole run. Every CI runner is UTC, where a UTC-pinned formatter and a host-local one produce identical strings — so a date guard written on a UTC host asserts nothing on the machines that publish the site. Keep it set, and be wary of any test whose assertion restates the implementation (`toBe(x.toLocaleString('en-US'))`): pin the literal the reader would see instead, or the guard can never fail.

## Further Reading

- [README.md](./README.md) — Setup and deployment
- [docs/adapting-guide.md](./docs/adapting-guide.md) — Guide for forking and customizing
- [docs/design-goals.md](./docs/design-goals.md) — Architecture principles
- [docs/contributing.md](./docs/contributing.md) — Contribution guidelines

## Maintaining This Document

When creating a PR, audit this file and make small, targeted improvements based on your learnings: new patterns discovered, outdated references, or missing guidance that would have helped. Write each entry as the rule and the trap behind it, in the present tense, and put it under the section it belongs to. Drop an entry when the code it describes is gone.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
