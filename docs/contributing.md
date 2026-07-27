# Contributing

Bug fixes and focused improvements are welcome. Before starting a larger
change, open an issue so the approach can be discussed.

## Guidelines

- Keep each pull request focused. Split unrelated changes.
- Review the [design goals](./design-goals.md).
- Follow the [Contributor Covenant](https://www.contributor-covenant.org/).
- If you use a coding agent, have it read [AGENTS.md](../AGENTS.md) and give it
  a focused task.

## Set up the project

With [nvm](https://github.com/nvm-sh/nvm) installed:

```bash
nvm install
npm ci
```

The version in `.nvmrc` is used for development and deployment. Other version
managers can use any release accepted by `engines.node` in `package.json`.

Create a topic branch rather than committing to `main`. Use a
[Conventional Commit](https://www.conventionalcommits.org/) prefix such as
`feat:`, `fix:`, `refactor:`, `docs:`, or `chore:`. Use the same format for the
pull request title so the merged history stays consistent.

## Validate the change

Ask your coding agent to run the local equivalents of the checks CI runs, or
run them yourself:

```bash
npm run format
npm run lint
npm run type-check
npm test
npm run og:check
npm run build
npm run verify-export
```

`npm run verify-export` reads the files produced by `npm run build`, so keep
that order. Add or update tests when behavior changes.

## Open the pull request

In the description:

- Explain what changed and why.
- Describe how you verified it.
- Call out any visual, compatibility, or follow-up work.

Before requesting review, inspect the complete diff yourself and confirm any
validation results reported by a coding agent. Remove unrelated formatting
changes, debugging code, stale comments, and unused files. State which checks
you did not run.
