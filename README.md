# V Sri Charan Reddy: Personal Site

[![Build Status](https://img.shields.io/github/actions/workflow/status/vsricharan16/personal-site/node.js.yml?branch=main)](https://github.com/vsricharan16/personal-site/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Portfolio, résumé, and writing site for [V Sri Charan Reddy](https://vsricharan16.github.io), built with
[Next.js](https://nextjs.org/), [React](https://react.dev/),
[TypeScript](https://www.typescriptlang.org/), and
[Tailwind CSS](https://tailwindcss.com/).

Forked from [mldangelo/personal-site](https://github.com/mldangelo/personal-site) and rebranded.

**[Visit the live site →](https://vsricharan16.github.io)**

## What is here

- A statically exported Next.js 16 site deployed to GitHub Pages.
- A responsive light/dark design system built from semantic CSS tokens.
- Markdown writing with drafts, RSS, and page metadata.
- A filterable résumé that still prints in full.
- Tests for components, content, metadata, and the final static export.

## Get started

With [nvm](https://github.com/nvm-sh/nvm) installed:

```bash
git clone https://github.com/vsricharan16/personal-site.git
cd personal-site
nvm install
npm ci
npm run dev
```

If you use another version manager, choose a release accepted by `engines.node`
in `package.json`.

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

Pushes to `main` deploy the same static build that CI validates.

## License

[MIT](./LICENSE).
