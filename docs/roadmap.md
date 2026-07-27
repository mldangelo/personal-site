# Roadmap

This site has been a work in progress since 2014, evolving to reflect current best practices, guided by the [design goals](./design-goals.md).

## Recently Completed

**Design**

- "Ground Station" visual system: three deliberate type roles, structure carried
  by hairlines rather than shadow, and a signal colour reserved for live values
  (see the design-system notes in [AGENTS.md](../AGENTS.md))
- Self-hosted variable fonts via Fontsource, removing the Google Fonts build
  dependency while keeping metric-adjusted fallbacks
- Print stylesheet, so the résumé prints in full regardless of the active filter
- Generated Open Graph share card (`npm run og`), committed alongside the
  metadata that binds it to its inputs

**Features**

- Writing/blog page with RSS feed (`/writing`, `/feed.xml`), including draft
  isolation so unpublished posts never reach the export
- Dark mode with system preference detection and manual toggle
- Theme-aware portraits for light/dark modes
- Modernized favicon with SVG source

**Infrastructure**

- Migrated from SCSS to Tailwind CSS v4
- Migrated from Jest to Vitest; 459 tests at ~87% line coverage
- Upgraded to Next.js 16 (App Router) and React 19
- Migrated from ESLint to Biome
- Replaced react-burger-menu with native slide menu
- TypeScript strict mode throughout, now on the native TypeScript compiler
- Node baseline moved to 26, dropping end-of-life Node 20
- `verify-export`, which inspects the generated HTML and XML for draft leaks,
  contradictory robots directives, duplicate IDs, broken internal links, and
  incomplete share metadata
- Google Analytics 4 via @next/third-parties
- SEO: sitemap, Open Graph, structured metadata
- Branch protection on `main`

## Future Direction

**Improvements**

- Adopt [JSON Resume](https://jsonresume.org/) standard
- Add Playwright for e2e testing
- Optimize FontAwesome (consider custom icon library)
- Improve accessibility (WCAG compliance)

**Repository**

- Automated releases with semantic versioning
