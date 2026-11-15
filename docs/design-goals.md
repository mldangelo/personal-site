# Design Goals

These principles guide changes to the site.

## Easy to fork

A new contributor should be able to clone the repository, start the site, and
find the main content without learning the internals of Next.js. Fork-specific
settings should be documented, searchable, and kept in as few places as
practical.

## Fast by default

The production site is a static export, so routes must remain statically
renderable. Keep client-side JavaScript and third-party code modest. Measure
performance before adding complexity intended to improve it.

## Easy to change

- Keep components and data files focused.
- Put similar features in similar places.
- Prefer readable code over clever abstractions.
- Automate formatting and routine checks.
- Remove dead code and stale documentation.
- Add a dependency when it is maintained and clearly cheaper than owning the
  equivalent code.

## Safe to change with an agent

Coding agents make many of the changes here, and a person reviews them. So the
repository carries its own rules instead of relying on anyone's memory:

- Each rule lives in [AGENTS.md](../AGENTS.md) as the rule and the trap behind
  it, filed under the part of the site it governs.
- Where a check can enforce a rule, one does: a unit test, a gate on the
  exported site, a size budget, or a ledger for generated assets. A rule an
  agent forgets should fail CI, not ship.
- Generated files are rebuilt from their inputs, never edited by hand, and
  numbers about the site are counted from the source rather than typed.
- Facts about the owner come from the owner or a primary source. An agent asks
  instead of guessing.
- Actions outside the repository, such as merging, account settings, secrets,
  and DNS, wait for the owner's approval.

## Stable for forks

Prefer mature tools, explicit types, and repeatable builds. Test published
content, metadata, accessibility-sensitive behavior, and static deployment.
When a change affects fork configuration or public routes, document the
migration.

## Visual design

The visual system pairs ink blue with porcelain paper, with neutral charcoal
at night. Inter handles the name, page titles, navigation, and buttons;
Newsreader handles prose, section headings, and the titles of posts, companies,
projects, and degrees; JetBrains Mono identifies dates, data, and annotations.
Flat surfaces, hairlines, and spacing keep the composition crisp. The homepage uses one blue poster field on the page measure, with the
name and introduction in the left column and a square color portrait on the
right. On mobile, the portrait follows the copy. Its location caption is
centered beneath the image in both layouts. The header, every page, and the
footer share that one measure.

Blue handles links and controls on paper. The poster has its own surface and
text pair, so its pale copy and inverted button stay readable in both themes.
The writing register stays on paper. Amber is reserved for live or in-progress
values. Portraits and project imagery stay in color without requiring hover.
New surface colors must keep text and links readable in both themes, and print
resets them to ink on paper.

The implementation lives in [`app/styles/tokens/`](../app/styles/tokens/).

## References

- [Thinking in React](https://react.dev/learn/thinking-in-react)
- [Rules of React](https://react.dev/reference/rules)
