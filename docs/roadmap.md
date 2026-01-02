# Roadmap

This site has been a work in progress since 2014. I have tried to make updates to reflect a) my knowledge of web development and b) current best practices. It will continue to evolve as a WIP guided by the [design goals](./design-goals.md).

## Recently Completed (2024-2025)

- **Upgraded to Next.js 16** with App Router and Turbopack
- **Upgraded to React 19** with improved performance
- **Migrated from ESLint to Biome** for faster linting and formatting
- **Replaced react-burger-menu with native slide menu** for reduced bundle size
- **Migrated to TypeScript** with strict mode enabled
- **Implemented Google Analytics 4** using @next/third-parties
- **Added Jest testing with SWC** for fast test execution
- **Implemented SEO features** including sitemap, Open Graph tags, and metadata
- **Migrated SCSS from `@import` to `@use`** to address deprecation warnings

## Future Direction

### Improvements

- Adopt [JSON Resume](https://jsonresume.org/) standard instead of custom format
- Improve test coverage (currently low)
- Add Playwright for e2e testing
- Simplify favicon setup (see [discussion](https://news.ycombinator.com/item?id=25520655))
- Make styles more modular
- Optimize FontAwesome integration (consider building icon library)

### New Features

- Revisit posts/blog functionality
- Explore server-side features with JWT authentication

### Repository Maintenance

- Set up branch protection for main
- Add automated releases with semantic versioning
- Improve contributing guidelines
- Run Lighthouse CI in GitHub Actions

### Under Consideration

- Migrate to Tailwind CSS for more maintainable styles
- Use husky for git pre-commit hooks
- Add WebAssembly integrations for performance-critical features
