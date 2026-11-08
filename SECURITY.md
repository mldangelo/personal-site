# Security Policy

## Reporting a vulnerability

Please report privately, through GitHub's
[private vulnerability reporting](https://github.com/mldangelo/personal-site/security/advisories/new)
or by email to [hi@mldangelo.com](mailto:hi@mldangelo.com), rather than in a
public issue. Include the affected URL or file, steps to reproduce, and the
impact you expect. A small proof of concept helps when it can be shared safely.
Please allow time to investigate and fix the issue before disclosing it.

This is a personal project maintained in spare time. Reports are welcome, but
there is no guaranteed response time and no bug bounty.

## Scope

This policy covers [mldangelo.com](https://mldangelo.com), this repository, and
the GitHub Actions workflows that build and deploy the site. Only the live site
and the `main` branch are supported.

The site is a static Next.js export hosted on GitHub Pages. It has no accounts,
stores nothing a visitor submits, and offers visitors no way to publish
content. Everything it serves is built from this public repository, its
dependencies, and public data fetched during the build.

## What to report

- A practical way to run attacker-controlled script in a visitor's browser.
- A way to change the deployed site without authorization, whether through the
  build, a dependency, or a workflow.
- A leaked secret, or a draft post or its assets reaching the deployed site.

Please explain how the issue is reached and what an attacker gains. A
dependency advisory, scanner finding, or missing header is not a vulnerability
here on its own; show how it affects this site or its build. GitHub Pages sets
the response headers, so their limits are a known property of the hosting,
described in the
[hosting notes](docs/adapting-guide.md#security-boundaries-and-hosting-headers).
A concrete exploit that depends on those headers is still worth reporting.

## Research guidelines

Please do not disrupt the site or its hosting, access or keep other people's
data, or use social engineering. If you come across sensitive data, stop and
report the exposure without sharing the data further. Report issues in
third-party services to their maintainers as well.
