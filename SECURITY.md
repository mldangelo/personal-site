# Security Policy

## Reporting a vulnerability

Please email [hi@mldangelo.com](mailto:hi@mldangelo.com) rather than opening a
public issue for a suspected vulnerability. Include the affected URL or file,
steps to reproduce the issue, and the impact you believe it could have. A small
proof of concept is helpful when it can be shared safely. Please allow time to
investigate and coordinate a fix before disclosing details publicly.

This is a personal project maintained in spare time. Reports are welcome, but
there is no guaranteed response or fix timeline and no paid bug bounty.

## Scope and security boundaries

This policy covers [mldangelo.com](https://mldangelo.com), this repository, and
the workflows that build and deploy the site. The site is a static Next.js
export hosted on GitHub Pages. It has no authenticated actions or path for
visitors to submit content for publication. Site content and Markdown are
maintained in the repository; the public repository itself is not a place to
keep secrets or private drafts.

The build uses third-party dependencies and fetches some public data. Changes
to the source, dependencies, build, or deployment can affect what visitors
receive. Draft posts and their assets should not appear in the deployed export
until published, even though content committed to this public repository is
already public.

## What to report

Examples include a practical way to run attacker-controlled code in a
visitor's browser, change the deployed site without authorization, expose a
secret or unintentionally publish a draft asset, or compromise the build or
deployment process. Please explain how the issue can be reached and what an
attacker could do. Reports about dependencies are useful when they explain how
the issue affects this site or its build.

An automated alert, dependency advisory, or missing header alone does not
establish an exploitable issue. GitHub Pages controls the site's HTTP response
headers; the [hosting notes](docs/adapting-guide.md#security-boundaries-and-hosting-headers)
describe the current limitations. A concrete impact involving those headers
is still worth reporting.

## Research guidelines

Please avoid disrupting the site or its infrastructure, accessing or retaining
other people's data, and using social engineering. If you encounter sensitive
data, stop and report the exposure without sharing the data unnecessarily.
Report vulnerabilities in third-party services to their maintainers as well.
