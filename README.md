# Michael D'Angelo: Personal Site

[![Build Status](https://img.shields.io/github/actions/workflow/status/mldangelo/personal-site/node.js.yml?branch=main)](https://github.com/mldangelo/personal-site/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/mldangelo/personal-site?style=social)](https://github.com/mldangelo/personal-site/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/mldangelo/personal-site?style=social)](https://github.com/mldangelo/personal-site/network/members)

The source for [mldangelo.com](https://mldangelo.com), a portfolio, résumé,
project archive, and writing site built with
[Next.js](https://nextjs.org/), [React](https://react.dev/),
[TypeScript](https://www.typescriptlang.org/), and
[Tailwind CSS](https://tailwindcss.com/).

The architecture is reusable and MIT licensed. The content and visual design
are personal, so a fork needs a full rebrand.

**[Visit the live site →](https://mldangelo.com)**

## What is here

- A statically exported Next.js 16 site deployed to GitHub Pages.
- A responsive light/dark design system built from semantic CSS tokens.
- Markdown writing with drafts, RSS, and page metadata.
- A filterable résumé that still prints in full.
- Tests for components, content, metadata, and the final static export.

## Get started

### Option 1: Local development

With [GitHub CLI](https://cli.github.com/) and
[nvm](https://github.com/nvm-sh/nvm) installed:

```bash
gh repo fork mldangelo/personal-site --clone
cd personal-site
nvm install
npm ci
npm run dev
```

If you use another version manager, choose a release accepted by `engines.node`
in `package.json`.

### Option 2: GitHub Codespaces

1. Click **Fork** at the top of this page.
2. In your fork, click **Code**, choose **Codespaces**, then create a codespace.
3. Run:

```bash
nvm install
npm ci
npm run dev
```

No local tool installation is required.

## Adapt it

The **[adapting guide](./docs/adapting-guide.md)** lists the content, links,
metadata, images, and styles a fork should replace. Finish by searching for
upstream details and reviewing a production build.

## Commands

```bash
npm run dev             # Start the development server
npm run format          # Format with Prettier and Biome
npm run lint            # Run Biome checks
npm run type-check      # Run TypeScript
npm test                # Run Vitest
npm run build           # Build the production static export
npm run verify-export   # Inspect the generated HTML and XML
npm run og              # Regenerate the share card
npm run og:check        # Verify the committed share card is current
```

CI checks formatting, linting, types, the share card, tests, the production
build, and the exported site on every pull request.

## Deploy

Pushes to `main` deploy the same static build that CI validates. See the
[adapting guide](./docs/adapting-guide.md#deployment) for URL and domain setup.

## Contributing

See the [contributing guide](./docs/contributing.md) for setup, branch and commit
conventions, validation, and pull request expectations.

## License

[MIT](./LICENSE). Use it however you want.
