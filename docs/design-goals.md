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

## Stable for forks

Prefer mature tools, explicit types, and repeatable builds. Test published
content, metadata, accessibility-sensitive behavior, and static deployment.
When a change affects fork configuration or public routes, document the
migration.

## Visual design

The visual system uses display type for headings, serif type for prose, and
monospace type for labels and data. Hairlines and spacing establish structure.
Ultramarine handles links, structure, and controls. Amber is reserved for live
or in-progress values.

The implementation lives in [`app/styles/tokens/`](../app/styles/tokens/).

## References

- [Thinking in React](https://react.dev/learn/thinking-in-react)
- [Rules of React](https://react.dev/reference/rules)
