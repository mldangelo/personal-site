# Roadmap

This site has been a work in progress since 2014. I have tried to make updates to reflect a) my knowledge of web development and b) current best practices. It will continue to evolve as a WIP guided by the [design goals](./design-goals.md).

## Recently Completed (2024-2025)

- **Migrated from SCSS to Tailwind CSS v4** for modern, maintainable styling
- **Migrated from Jest to Vitest** with 76%+ test coverage (268 tests)
- **Upgraded to Next.js 16** with App Router and Turbopack
- **Upgraded to React 19** with improved performance
- **Migrated from ESLint to Biome** for faster linting and formatting
- **Replaced react-burger-menu with native slide menu** for reduced bundle size
- **Migrated to TypeScript** with strict mode enabled
- **Implemented Google Analytics 4** using @next/third-parties
- **Implemented SEO features** including sitemap, Open Graph tags, and metadata
- **Added Writing page** with RSS feed support

## Future Direction

### Improvements

- Adopt [JSON Resume](https://jsonresume.org/) standard instead of custom format
- Add Playwright for e2e testing
- Simplify favicon setup (see [discussion](https://news.ycombinator.com/item?id=25520655))
- Optimize FontAwesome integration (consider building icon library)
- Improve accessibility (WCAG compliance)

### New Features

- Explore server-side features with JWT authentication
- Add dark/light mode toggle persistence

### Repository Maintenance

- Set up branch protection for main
- Add automated releases with semantic versioning
- Run Lighthouse CI in GitHub Actions

### Under Consideration

- Use husky for git pre-commit hooks
- Add WebAssembly integrations for performance-critical features
