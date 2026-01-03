# Roadmap

This site has been a work in progress since 2014, evolving to reflect current best practices, guided by the [design goals](./design-goals.md).

## Recently Completed (2024-2026)

**Features**

- Writing/blog page with RSS feed (`/writing`, `/feed.xml`)
- Dark mode with system preference detection and manual toggle
- Theme-aware portraits for light/dark modes
- Modernized favicon with SVG source

**Infrastructure**

- Migrated from SCSS to Tailwind CSS v4
- Migrated from Jest to Vitest with 76%+ test coverage (268 tests)
- Upgraded to Next.js 16 (App Router, Turbopack) and React 19
- Migrated from ESLint to Biome
- Replaced react-burger-menu with native slide menu
- TypeScript strict mode throughout
- Google Analytics 4 via @next/third-parties
- SEO: sitemap, Open Graph, structured metadata

## Future Direction

**Improvements**

- Adopt [JSON Resume](https://jsonresume.org/) standard
- Add Playwright for e2e testing
- Optimize FontAwesome (consider custom icon library)
- Improve accessibility (WCAG compliance)

**Repository**

- Branch protection for main
- Automated releases with semantic versioning
