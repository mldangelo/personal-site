# Pavan Kalyan Dosa personal-site migration

## Purpose

Convert the inherited React portfolio into Pavan Kalyan Dosa's professional IAM portfolio. The site will present a factual SailPoint-focused profile, résumé, public contact details, and a future-facing photography destination.

## Scope

- Replace all public inherited identity, biography, résumé, contact, metadata, deployment-domain, and repository references.
- Use the supplied résumé as the source of truth for the professional summary, experience, skills, education, certifications, and achievements.
- Preserve only GitHub, LinkedIn, and `hello@pavankalyandosa.com` as public contact methods.
- Remove visible inherited personal photo, site statistics, legacy courses/references, and project cards/images.
- Make the Projects page a concise professional work page that links to `https://github.com/PavankalyanDosa`.
- Add a clearly labeled Photography link to `https://photos.pavankalyandosa.com`. It opens in a new tab and is not a gallery implementation.

## Content and navigation

The navigation will contain About, Resume, Projects, Photography, and Contact. Photography is an external link; the other items are internal routes.

The home page and sidebar will introduce Pavan as a Senior SailPoint Engineer specializing in IdentityIQ and Identity Security Cloud. The About page will describe identity governance, lifecycle management, integrations, access governance, automation, and collaboration without adding personal facts not supplied by Pavan.

The résumé will show experience at Avancer Corp, PwC, KPMG, and Cotelligent; the University of South Dakota master's degree; the listed SailPoint and Okta certifications; key achievements; and grouped technology skills. Existing template Courses and References sections will be removed.

## Domain and deployment

The primary site identity and repository configuration will use `pavankalyandosa.com` and `https://github.com/PavankalyanDosa/personal-site`.

This repository remains the primary GitHub Pages deployment. The `photos.pavankalyandosa.com` subdomain will be a future, separately deployed static photo site. It requires its own GitHub Pages site and DNS configuration; this repository only links to it. The link remains valid before the photo site goes live, but visitors may see a DNS or hosting error until it is deployed.

## Error handling and accessibility

External GitHub, LinkedIn, and Photography links will use descriptive labels. The removed portrait avoids exposing an unrelated image. No new runtime service or API dependency is introduced, so the existing site continues to function when the photography subdomain is unavailable.

## Verification

Automated tests will assert the new site identity, public contact links, Photography destination, and the visible navigation without Stats. The existing suite, linter, and production build will run after the migration.
