# How to Contribute

Contributions are encouraged. Please feel free to get in touch (I will happily pair program with you), take a look at the [roadmap](./roadmap.md), or open a PR.

## Guidelines

Here are a few recommendations to land PRs quickly.

- Small PRs are better than large PRs. If you do two unrelated things, split your changes into two PRs.
- Review the [design goals](./design-goals.md).
- Respect the [Contributor Covenant](https://www.contributor-covenant.org/).

## Setup

You need Node.js 22.13 or newer. `nvm use` selects the version in `.nvmrc`,
which is what CI and the deployed build run.

Work on a topic branch rather than `main`, and title commits with a
[conventional commit](https://www.conventionalcommits.org/) prefix—`feat:`,
`fix:`, `chore:`, `docs:`. PR titles use the same prefixes, because merges to
`main` deploy automatically.

## Before You Open a PR

Run the same checks CI runs:

```bash
npm run format        # must run first — format:check is a hard CI gate
npm run lint
npm run type-check
npm test
npm run build
npm run verify-export
npm run og:check      # only if you changed the profile or share-card generator
```

`npm run format` is the step people forget, and it is the most common reason an
otherwise good PR shows a red check.

[AGENTS.md](../AGENTS.md) documents the constraints that are easy to trip
over—metadata inheritance, draft isolation, the static-export rules, and the
design system. It is worth skimming before a first PR.

## Preparing a Pull Request

1. Write a good summary in your PR description.
   - Concisely explain your changes.
   - Justify why your changes are important.
   - Explain how to test your change (if not obvious).
1. Make sure everything runs.
1. Write tests (if appropriate).
1. Self review your branch.
   - Lint your code.
   - Add comments where appropriate and if things are unclear. Comments should help ensure others not familiar with the problem you're solving will understand your code months or years from now.
   - Minimize perceptual changes in files that are not relevant to your feature. Remove any extra white-spaces in other files that were added by mistake.
   - Remove anything unnecessary. Remove extra print statements, commented out blocks of code, unused variables, etc.
   - Check your spelling.

## References

- https://github.com/google/eng-practices (Recommended Reading)
