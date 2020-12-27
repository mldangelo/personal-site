# Notes about JSON resume implementation

## Why use JSON Resume?

- JSON resume attempts to implement a standard schema for resumes (here: https://github.com/jsonresume/resume-schema) Structured data is good.
  - resume can be rendered in many themes (for free / almost for free)
- JSON Resume is the most prolific implementation of a resume schema

## Criticism

- Schema definitions are not perfect. For example, I would like courses to have other attributes such as url and a date. EndDates should conditionally render on start date
- The maintainers don't seem on top of things.
  - Lots of stale PRs that have gone unreviewed.
  - No clear direction
  - Git fumbles they shouldn't be making in a project this large.
  - poor code standards & release schedule
  - breaking schema changes
  - JSON resume to PDF generation has been broken for several years: https://github.com/jsonresume/resumeToPDF
- Not widely adopted

## Open Questions

- Schema is complex. Schema validation should occur automatically
  - via proptypes ( NOTE: Someone manually defined lots of types here: https://github.com/suddi/suddi.github.io/blob/master/app/prop_types/resume.js)
  - via typescript interface
  - Should these sit within the jsonresume org? Alternatively - use github action + cron to render interface -> publish to NPM
- Can / should I extend the schema to fit my needs?
- Should the template generate programmatically from the schema?
- How do we have good separation of concerns if we extend the schema?
