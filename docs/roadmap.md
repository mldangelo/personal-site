# Roadmap

This site has been a work in progress since 2014. I have tried to make updates to reflect a) my knowledge of web development and b) current best practices. It will continue to evolve a as a WIP guided by the following design goals.

## Future Direction

### Improvements

- use JSON resume instead of reinventing the wheel (perform literature search for wiki data resume standard).
- Fix navbar (use nav provided by template) -> Reduce Bundle size.
- Separate concerns better in src/data. Some files are data, others are template variables.
- Get better at redefining duplicate types. They are especially prevalent in resume components.
- Make code splitting better - some bundles are under 1KB.
- Make styles more modular.
- Make FA integration less terrible (consider building FA library).
- Simplify Favicon. See: https://news.ycombinator.com/item?id=25520655
- Better tests
  - one test per component.
  - test using puppeteer again.
  - test cross browser compatibility.
  - Use google lighthouse.
- Introduce a spell checker.

### New Features

- Completely gut and redo server integration, use JWT
  - auto deploy backend, keep frontend on CDN.
- revisit posts/blog
  - put one or two examples up from my knowledge base.

### Repository Cleanup

- Don't allow pushes to main.
- Generate releases using github action (increment version in package.json too) using semantic versioning.
- Add contributing guidelines.
- encourage more PRs that support this roadmap / pay bug bounties.
- Build something that allows people to propose changes.
- Make main / server distinction cleaner -> make sure PRs to main also land in server.

- Implement better analytics
- Capture information about the community of people that have cloned this site.

### Under Consideration

- Use typescript everywhere instead of Vanilla JS/JSX - will this hinder new developer experience?
- Add support for more exotic integrations (reason, webassembly).
- hydrate all unique content on the site from one location -> deploy as npm package + json.
- Use husky for git pre-commit hooks.
