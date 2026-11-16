# Michael D'Angelo: Personal Site

[![CI status](https://github.com/mldangelo/personal-site/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/mldangelo/personal-site/actions/workflows/node.js.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/mldangelo/personal-site?style=social)](https://github.com/mldangelo/personal-site)
[![GitHub Forks](https://img.shields.io/github/forks/mldangelo/personal-site?style=social)](https://github.com/mldangelo/personal-site/network/members)

The source for [mldangelo.com](https://mldangelo.com), a personal website with a
portfolio, résumé, and blog. Built with [Next.js](https://nextjs.org/),
[React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), and
[Tailwind CSS](https://tailwindcss.com/), and published as a static site on
GitHub Pages.

Feel free to fork it for your own site or reuse parts of it in another project.

[Live site](https://mldangelo.com) · [Get started](#get-started) · [Customize](#customize)

## Features

- Responsive layouts with light, dark, and system themes.
- Markdown posts with draft previews, RSS, and a sitemap.
- Generated social cards and page metadata.
- A printable résumé with a JSON Resume export.
- Pages for projects, talks, and writing published elsewhere.
- Automated checks for content, links, export size, and layout overflow.

## Get started

Use the Node.js version in [`.nvmrc`](./.nvmrc). With
[nvm](https://github.com/nvm-sh/nvm) installed:

```bash
git clone https://github.com/mldangelo/personal-site.git
cd personal-site
nvm install
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). Edits appear as you save.
To work on your own version, fork the repository and clone your fork instead.
If you use another Node version manager, choose a version supported by
[`engines.node`](./package.json).

### GitHub Codespaces

In your fork, select **Code → Codespaces → Create codespace**, then run
`nvm install`, `npm ci`, and `npm run dev`. Open the forwarded port 3000 to
preview the site in your browser.

## Customize

Most content lives in Markdown and typed data files. Start with the part you
want to change:

| To change                       | Start here                                                                                         |
| ------------------------------- | -------------------------------------------------------------------------------------------------- |
| Profile and contact details     | [`src/data/profile.json`](./src/data/profile.json), [`src/data/contact.ts`](./src/data/contact.ts) |
| Homepage introduction           | [`src/components/Template/Hero.tsx`](./src/components/Template/Hero.tsx)                           |
| About page and résumé           | [`src/data/about.ts`](./src/data/about.ts), [`src/data/resume/`](./src/data/resume/)               |
| Projects and talks              | [`src/data/projects.ts`](./src/data/projects.ts), [`src/data/speaking.ts`](./src/data/speaking.ts) |
| Blog posts and external writing | [`content/writing/`](./content/writing/), [`src/data/writing.ts`](./src/data/writing.ts)           |
| Colors, typography, and layout  | [`app/styles/`](./app/styles/), with shared values in [`tokens/`](./app/styles/tokens/)            |
| Navigation                      | [`src/data/routes.ts`](./src/data/routes.ts)                                                       |

The [customization guide](./docs/adapting-guide.md) maps related files, explains
how to add posts, and covers regenerating icons and social cards. It also lists
the shared copy and metadata to update when adding your own profile.

### With a coding agent

Open the repository in your preferred coding agent. You can paste your résumé
into the chat, attach a résumé file, or share a link to your résumé or LinkedIn
profile. Include any project links you want featured. For example:

```text
Update this site's bio, résumé, and projects using my résumé or LinkedIn
profile and any extra details I provide. Follow docs/adapting-guide.md to update
related content, and keep the current design. Ask me about missing details or
links you can't access, and run the project checks.
[PASTE YOUR RÉSUMÉ OR PROVIDE FILES AND LINKS]
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
   slash. For a project site, use `https://YOUR-USER.github.io/personal-site/`.
2. Remove `public/CNAME`, which contains the original site's domain.
3. Enable workflows in your fork's **Actions** tab, and select **GitHub Actions**
   under **Settings → Pages → Build and deployment → Source**.
4. Commit your changes to a branch and merge a pull request into `main` to deploy.

The [deployment guide](./docs/adapting-guide.md#deployment-reference) covers
custom domains and other static hosts. For another host, build with
`npm run build` and publish `out/`.

## Contributing

Bug reports and focused improvements are welcome. Open an
[issue](https://github.com/mldangelo/personal-site/issues) to report a problem
or discuss a larger change. See the [contributing guide](./docs/contributing.md)
for pull requests and the [design goals](./docs/design-goals.md) for context on
the site's design. To report a vulnerability, see [SECURITY.md](./SECURITY.md).

## License

[MIT](./LICENSE). Use it however you want.
