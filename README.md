# Personal Website Template

[![Build Status](https://img.shields.io/github/actions/workflow/status/mldangelo/personal-site/node.js.yml?branch=main)](https://github.com/mldangelo/personal-site/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/mldangelo/personal-site?style=social)](https://github.com/mldangelo/personal-site/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/mldangelo/personal-site?style=social)](https://github.com/mldangelo/personal-site/network/members)

A free, open-source portfolio website template built with [Next.js](https://nextjs.org/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), and [Tailwind CSS](https://tailwindcss.com/). Fork it and make it your own in under an hour.

**[See it live →](https://mldangelo.com)**

## Why This Template?

- **Zero setup required.** Fork, open in GitHub Codespaces, and start editing.
- **Modern tech stack.** Next.js 16, React 19, TypeScript, Tailwind CSS v4.
- **Free hosting.** Deploys automatically to GitHub Pages.
- **Dark mode.** System preference detection with manual toggle.
- **Blog ready.** Markdown posts with RSS feed (optional).
- **AI-friendly.** Works great with GitHub Copilot, Claude, and Cursor.

## Get Started

### Option 1: Local Development

```bash
gh repo fork mldangelo/personal-site --clone
cd personal-site
npm install
npm run dev
```

Requires [GitHub CLI](https://cli.github.com/) and Node.js 20+ ([nvm](https://github.com/nvm-sh/nvm) recommended).

### Option 2: GitHub Codespaces

1. Click **Fork** at the top of this page
2. In your fork, click **Code** → **Codespaces** → **Create codespace**
3. Run `npm run dev`

No local setup needed. Everything runs in your browser.

## Customize It

Follow the **[adapting guide](./docs/adapting-guide.md)** for a step-by-step checklist.

**Pro tip:** Open the adapting guide in Copilot Chat or your favorite AI assistant and ask it to help you customize each section.

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run format   # Format code
npm test         # Run tests
```

## Deploy

Push to `main` and GitHub Pages deploys automatically. See the [adapting guide](./docs/adapting-guide.md#deployment) for custom domain setup.

## Contributing

Contributions welcome! If you find a bug or want to improve something, please open a PR.

See [contributing guide](./docs/contributing.md) and [design goals](./docs/design-goals.md).

## License

[MIT](./LICENSE). Use it however you want.
