# Michael D'Angelo: Personal Site

[![CI status](https://github.com/mldangelo/personal-site/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/mldangelo/personal-site/actions/workflows/node.js.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/mldangelo/personal-site?style=social)](https://github.com/mldangelo/personal-site)
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
- A résumé that prints in full and is also published as JSON Resume.
- Tests for components, content, metadata, and the final static export.

## How the documentation is organized

The documentation is written for coding agents and the people who direct them.
Most agents read [AGENTS.md](./AGENTS.md) automatically; Claude Code reads
`CLAUDE.md`, which imports it. So every agent works from one set of rules, and
many of those rules are also enforced by a test or a check on the built site,
so a forgotten rule fails CI instead of shipping.

| To                                        | Read                                                                                                                       |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Change anything, with or without an agent | [AGENTS.md](./AGENTS.md): what needs your approval, the definition of done, and every rule with the trap behind it         |
| Fork and rebrand the site                 | [docs/adapting-guide.md](./docs/adapting-guide.md): the inputs to gather, copyable requests, and a map of personal details |
| Open a pull request                       | [docs/contributing.md](./docs/contributing.md)                                                                             |
| Understand the design                     | [docs/design-goals.md](./docs/design-goals.md)                                                                             |
| Report a vulnerability                    | [SECURITY.md](./SECURITY.md)                                                                                               |

## Get started

### With a coding agent

Open your fork in a coding agent and ask:

```text
Read AGENTS.md, use the Node version in .nvmrc, install the locked
dependencies, and start the development server. Do not change the site yet.
Tell me the local URL and report any setup failure with its exact output.
```

### Manual setup

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

### GitHub Codespaces

1. Click **Fork** at the top of this page.
2. In your fork, click **Code**, choose **Codespaces**, then create a codespace.
3. Run:

```bash
nvm install
npm ci
npm run dev
```

Codespaces provides the tools, so you do not need to install them locally.

## Adapt it with a coding agent

When you are ready to customize the site, gather the inputs the
[adapting guide](./docs/adapting-guide.md#gather-the-inputs) lists: your
résumé, profile details, links, images, and intended site URL. Then try:

```text
Read AGENTS.md and docs/adapting-guide.md, set up the repository, then rebrand
this fork for [NAME] with the details and assets I provide. Work on a topic
branch and preserve the current routes and design unless I say otherwise.
Inventory the existing posts, external writing, résumé, projects, and talks
before changing the shared identity. Do not relabel that content as mine. Ask
whether unmatched personal content should keep its original attribution, be
replaced, or be removed. Use the guide's reference map to update every identity
surface and generated asset. Run the guide's audit search and the definition of
done in AGENTS.md. Do not commit, push, merge, change GitHub settings, create
secrets, or modify DNS. Report the external steps that remain.
```

The **[adapting guide](./docs/adapting-guide.md)** has focused requests for
writing, the résumé and projects, feature removal, visual changes, and
deployment, plus a map of the files an agent should inspect.

## Commands

```bash
npm run dev      # Start the site at localhost:3000
npm test         # Run the tests
npm run format   # Fix formatting
npm run build    # Build the static site into out/
```

CI runs a few more checks on every pull request. The
[definition of done](./AGENTS.md#definition-of-done) lists them, and a coding
agent runs them for you.

## Deploy

Pushes to `main` deploy the same static build that CI validates. See the
[adapting guide](./docs/adapting-guide.md#deployment-reference) for URL and
domain setup.

## Contributing

See the [contributing guide](./docs/contributing.md) for setup, branch and commit
conventions, validation, and pull request expectations.

## License

[MIT](./LICENSE). Use it however you want.
