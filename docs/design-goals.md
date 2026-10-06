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

The visual system pairs ink blue with porcelain paper, with neutral charcoal
at night. Inter handles headings, navigation, and buttons; Newsreader handles
prose and the homepage writing titles; JetBrains Mono identifies dates, data,
and annotations. Flat surfaces, hairlines, and spacing keep the composition
crisp. The homepage uses one blue poster field, with the name and introduction
in the left column and a square color portrait centered in the right. On
mobile, the portrait sits centered below the copy. Its location caption is
centered beneath the image in both layouts.

Blue handles links and controls on paper. The poster has its own surface/text
pair so its pale copy and inverted button remain readable in both themes.
The writing register stays on paper; green framing and background grain are
absent. Amber remains reserved for live or in-progress values. Portraits and
project imagery stay in color without requiring hover. New surface colors
must retain readable text and links in both themes, and print resets them to
ink on paper.

The implementation lives in [`app/styles/tokens/`](../app/styles/tokens/).

## References

- [Thinking in React](https://react.dev/learn/thinking-in-react)
- [Rules of React](https://react.dev/reference/rules)
