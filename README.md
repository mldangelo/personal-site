# Michael D'Angelo — Personal Site

[![Build Status](https://img.shields.io/github/actions/workflow/status/mldangelo/personal-site/node.js.yml?branch=main)](https://github.com/mldangelo/personal-site/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/mldangelo/personal-site?style=social)](https://github.com/mldangelo/personal-site/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/mldangelo/personal-site?style=social)](https://github.com/mldangelo/personal-site/network/members)

The source for [mldangelo.com](https://mldangelo.com): a deliberately bespoke
portfolio, résumé, archive, and writing site built with
[Next.js](https://nextjs.org/), [React](https://react.dev/),
[TypeScript](https://www.typescriptlang.org/), and
[Tailwind CSS](https://tailwindcss.com/).

The architecture is reusable and MIT-licensed, but the content and “Ground
Station” visual system are personal. Fork it as a starting point, not as a
one-hour fill-in-the-blanks theme.

**[Visit the live site →](https://mldangelo.com)**

## What Is Here

- A statically exported Next.js 16 site deployed to GitHub Pages.
- A responsive light/dark design system built from semantic CSS tokens.
- Markdown writing with draft isolation, RSS, sitemap, canonical metadata, and
  measured article images.
- A filterable résumé whose complete content remains available to print.
- Export-level verification for broken routes, fragments, metadata, duplicate
  IDs, draft leaks, and missing assets.
- Unit, accessibility-oriented component, metadata, and content-pipeline tests.

## Get Started

### Option 1: Local Development

```bash
gh repo fork mldangelo/personal-site --clone
cd personal-site
npm ci
npm run dev
```

Requires [GitHub CLI](https://cli.github.com/) and Node.js 20+ ([nvm](https://github.com/nvm-sh/nvm) recommended).

### Option 2: GitHub Codespaces

1. Click **Fork** at the top of this page
2. In your fork, click **Code** → **Codespaces** → **Create codespace**
3. Run `npm run dev`

No local setup needed. Everything runs in your browser.

## Adapt It

The **[adapting guide](./docs/adapting-guide.md)** maps the authored profile,
content, metadata, imagery, and theme surfaces that need to change together.
The site intentionally centralizes many facts, but a complete rebrand still
deserves a repository-wide search and a production-export review.

## Commands

```bash
npm run dev             # Start the development server
npm run format          # Format with Prettier and Biome
npm run lint            # Run Biome checks
npm run type-check      # Run TypeScript
npm test                # Run Vitest
npm run build           # Build the production static export
npm run verify-export   # Inspect the generated HTML and XML
```

## Deploy

Pushes to `main` deploy the same Linux/Node 22 export artifact that passed the
full CI graph. See the
[adapting guide](./docs/adapting-guide.md#deployment) for domain setup.

## Contributing

Contributions are welcome. If you find a bug or want to improve the reusable
parts of the site, please open a PR.

See [contributing guide](./docs/contributing.md) and [design goals](./docs/design-goals.md).

## License

[MIT](./LICENSE). Use it however you want.
