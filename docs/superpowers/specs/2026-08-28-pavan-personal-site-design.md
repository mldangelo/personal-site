# Pavan Kalyan Dosa personal-site migration

## Purpose

Convert the current Next.js portfolio into Pavan Kalyan Dosa's professional IAM portfolio. The result presents a factual SailPoint-focused profile, résumé, contact details, and an external photography destination while retaining the upstream site's accessible static-export architecture.

## Content scope

- Replace all inherited identity, biography, résumé, contact, metadata, schema, deployment-domain, repository, and site-copy references.
- Use the supplied résumé as the source of truth for the professional summary, experience, skills, education, certifications, and achievements.
- Publish only GitHub, LinkedIn, and `hello@pavankalyandosa.com` as contact methods.
- Remove visible inherited portrait imagery, personal statistics, original projects, writing, and all original-author personal details.
- Keep the Projects route as a concise professional-work page that points visitors to `https://github.com/PavankalyanDosa`.
- Add Photography as an external navigation and footer link to `https://photos.pavankalyandosa.com`.

## Architecture

The site remains a Next.js 16 static export. Profile fields are centralized in `src/data/profile.json`; shared identity constants, canonical URLs, and metadata are in `src/lib/utils.ts` and `src/lib/metadata.ts`.

Page content is data-driven: About content is in `src/data/about.ts`, résumé entries live under `src/data/resume/`, contact links live in `src/data/contact.ts`, and project content lives in `src/data/projects.ts`. The hero, navigation, footer, schema, and page metadata consume those shared values or receive targeted copy updates where the upstream site has hard-coded original-author text.

The original portrait will be removed from the visible hero and footer until Pavan supplies an appropriate replacement. Site and personal statistics will be removed rather than replaced with unsupported values.

## Navigation and writing removal

Primary navigation will contain About, Resume, Photography, Projects, and Contact. Photography is a normal external anchor with an explicit new-tab indication. It is not a gallery and does not host photo assets in this repository.

Writing will be removed completely: navigation, homepage promotion, writing routes, RSS route, post loaders, local and external writing content, sitemap/schema references, styles, tests, and static-export validation assumptions. This avoids publishing original-author articles and removes the upstream requirement to retain a published post.

## Domain and deployment

The primary site uses `https://pavankalyandosa.com` and `https://github.com/PavankalyanDosa/personal-site`. Its production setup remains a GitHub Pages static export.

`https://photos.pavankalyandosa.com` is a future, separate static photo-site deployment. This repository links to it only. Its DNS and hosting configuration are external follow-up steps; visitors may see a host error until that photo site exists.

## Accessibility and failure behavior

External links have descriptive labels, safe `rel` attributes, and a new-tab announcement where applicable. Removing the inherited portrait prevents an unrelated image from representing Pavan. No runtime API or photo-host dependency is introduced, so the portfolio continues to work when the photo subdomain is unavailable.

## Verification

Tests will cover Pavan's public identity, contact links, navigation, photography destination, writing removal, and removed stats. Full repository checks will include formatting, linting, type checking, unit tests, Open Graph verification, production build, and static-export verification.
