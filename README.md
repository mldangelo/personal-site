# Michael D'Angelo: Personal Site

[![CI status](https://github.com/mldangelo/personal-site/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/mldangelo/personal-site/actions/workflows/node.js.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

This repository contains the source for [mldangelo.com](https://mldangelo.com),
Michael D'Angelo's portfolio, résumé, and blog. It uses [Next.js](https://nextjs.org/),
[React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), and
[Tailwind CSS](https://tailwindcss.com/) and builds to static files hosted on GitHub Pages.

You're welcome to use it as a starting point for your own site or reuse parts
of it in another project.

[Live site](https://mldangelo.com) · [Get started](#get-started) · [Customize](#customize)

## Features

- Responsive layouts with light and dark themes.
- Markdown posts with draft previews, RSS, and a sitemap.
- Generated social cards and page metadata.
- A printable résumé with a JSON Resume export.
- Pages for projects, talks, and writing published elsewhere.
- Automated checks for content, links, export size, and layout overflow.

## Get started

You'll need [Git](https://git-scm.com/) and [Node.js](https://nodejs.org/) with npm.
Use the Node version in [`.nvmrc`](./.nvmrc); supported versions are listed in
[`package.json`](./package.json) under `engines.node`. If you use
[nvm](https://github.com/nvm-sh/nvm), run `nvm install` after cloning.

To make your own site, [fork this repository](https://github.com/mldangelo/personal-site/fork)
and use your fork's URL in the clone command. To try this version locally:

```bash
git clone https://github.com/mldangelo/personal-site.git
cd personal-site
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). The site updates as you save changes.

### GitHub Codespaces

In your fork, select **Code → Codespaces → Create codespace**, then run
`nvm install`, `npm ci`, and `npm run dev`. Open the forwarded port 3000 to
preview the site in your browser.

## Customize

Edit content in Markdown and the files under `src/data/`. Start with the part
you want to change:

| To change                       | Start here                                                                                         |
| ------------------------------- | -------------------------------------------------------------------------------------------------- |
| Profile and contact details     | [`src/data/profile.json`](./src/data/profile.json), [`src/data/contact.ts`](./src/data/contact.ts) |
| Homepage introduction           | [`src/components/Template/Hero.tsx`](./src/components/Template/Hero.tsx)                           |
| About page and résumé           | [`src/data/about.ts`](./src/data/about.ts), [`src/data/resume/`](./src/data/resume/)               |
| Projects and talks              | [`src/data/projects.ts`](./src/data/projects.ts), [`src/data/speaking.ts`](./src/data/speaking.ts) |
| Blog posts and external writing | [`content/writing/`](./content/writing/), [`src/data/writing.ts`](./src/data/writing.ts)           |
| Colors, typography, and layout  | [`app/styles/`](./app/styles/), with shared values in [`tokens/`](./app/styles/tokens/)            |
| Navigation                      | [`src/data/routes.ts`](./src/data/routes.ts)                                                       |

The [customization guide](./docs/adapting-guide.md) covers profile details used
across pages, adding posts, and regenerating icons and social cards.

### With a coding agent

You can also open the repository in your preferred coding agent. Paste your résumé
into the chat, attach a résumé file, or share a link to your résumé or LinkedIn
profile. Include any project links you want featured. For example:

```text
Update this site's bio, résumé, and projects using my résumé or LinkedIn
profile and any extra details I provide. Follow docs/adapting-guide.md to update
related content, and keep the current design. Ask me about missing details or
links you can't access, and run the project checks.
[Paste your résumé or add files and links here.]
```

The guide includes [more example requests](./docs/adapting-guide.md#copyable-requests)
for writing, visual changes, and deployment.

## Commands

| Command              | What it does                      |
| -------------------- | --------------------------------- |
| `npm run dev`        | Start the development server      |
| `npm test`           | Run the test suite                |
| `npm run test:watch` | Rerun tests as files change       |
| `npm run format`     | Format code, Markdown, and CSS    |
| `npm run lint`       | Check code with Biome             |
| `npm run type-check` | Check TypeScript types            |
| `npm run build`      | Build the static site into `out/` |

The [contributing guide](./docs/contributing.md#validate-the-change) covers the
full validation process, including checks on the built site.

## Deploy

The included workflow builds and deploys to GitHub Pages after checks pass on
`main`. To set up a fork:

1. Set `homepage` in `package.json` to your public URL, including a trailing
   slash: `https://YOUR-USER.github.io/YOUR-REPO/` for a project site, or your
   custom domain.
2. Remove `public/CNAME`, which contains the original site's domain.
3. Enable workflows in your fork's **Actions** tab, and select **GitHub Actions**
   under **Settings → Pages → Build and deployment → Source**.
4. Commit your changes to a branch and merge a pull request into `main` to deploy.

The [deployment guide](./docs/adapting-guide.md#deployment-reference) covers
custom domains and other static hosts. For another host, set `homepage` to its
public URL, build with `npm run build`, and publish `out/`.

## Contributing

Questions, bug reports, and improvements to the code or documentation are welcome.
Check the [existing issues](https://github.com/mldangelo/personal-site/issues)
before opening a new one. For a bug report, include steps to reproduce it,
what you expected, and your Node.js version.

The [contributing guide](./docs/contributing.md) explains how to prepare a pull
request. For larger changes, open an issue to discuss the approach first; the
[design goals](./docs/design-goals.md) provide context. Report vulnerabilities
privately using the instructions in [SECURITY.md](./SECURITY.md).

## License

Licensed under the [MIT License](./LICENSE).
