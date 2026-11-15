# Contributing

Bug fixes and focused improvements are welcome. Before starting a larger
change, open an issue so the approach can be discussed.

## Guidelines

- Keep each pull request focused. Split unrelated changes.
- Review the [design goals](./design-goals.md).
- Follow the [Contributor Covenant](https://www.contributor-covenant.org/).
- If you use a coding agent, give it a focused task. It reads
  [AGENTS.md](../AGENTS.md) on its own, or through `CLAUDE.md` for Claude Code,
  and that file tells it what needs your approval.

## Set up the project

Follow [Get started](../README.md#get-started) in the README. Work on a topic
branch rather than `main`, and give commits and the pull request title a
[Conventional Commit](https://www.conventionalcommits.org/) prefix such as
`feat:`, `fix:`, `refactor:`, `docs:`, or `chore:`.

## Validate the change

Run the [definition of done](../AGENTS.md#definition-of-done) in `AGENTS.md`:
the checks CI runs, in the order they need. It is kept in that one place so
people and agents run the same list. `measure-export` fails when the export
outgrows a budget in `scripts/budget.json`, and `check-reflow`, which needs
Chrome, fails when a page is wider than a 320px phone at the default or doubled
text size. Add or update tests when behavior changes, and check a visual change
in a browser.

## Open the pull request

In the description:

- Explain what changed and why.
- Describe how you verified it.
- Call out any visual, compatibility, or follow-up work.

Before requesting review, inspect the complete diff yourself and confirm any
validation results reported by a coding agent. Remove unrelated formatting
changes, debugging code, stale comments, and unused files. State which checks
you did not run.
