# Roadmap

This site has been a work in progress since 2014. I have tried to make updates to reflect a) my knowledge of web development and b) current best practices. It will continue to evolve a as a WIP guided by the following design goals.

## Design Goals

1. Simple
    1. Someone learning web development should be able to clone this repo and start making it their own within a few minutes.
2. Stable
    1. *Boring* technologies
        - Javascript, not typescript. One global style sheet. No experimental features.
        - uses common and well maintained npm packages.
    2. Good tests
    3. Maintainable
        - Easy setup.
        - It should be easy to deploy any version of this site.
        - Limited external dependencies (ie no missing headers for external libraries).
        - Dependencies are kept up to date. Currently uses dependabot.
3. Fast
    1. Everything that can be pre-rendered should be pre-rendered. Follow [JAMStack best practices](https://jamstack.org/best-practices/)
    2. Time to interact should be very fast (< 250 ms). Optimize for small bundle sizes.
4. Developer Experience
    1. Modular
        - It should be relatively straight forward to replace the content in this repository or to add a new feature.
        - Good separation of concerns. Components keep track of their own state. Props are not over-utilized.
        - Limited vertical depth (changes should be relatively self encapsulated).
        - Correct abstractions. IE Webpack is complex, but developers don't need to understand how webpack works to make contributions to the site.
    2. Limited horizontal fragmentation
        - Linter to prevent easy nits & to prevent developers from wasting time thinking about code style.
        - Preferred React Style - ie (functional components & proptypes).
        - Consistent file structure based on current best practices.
        - Similar features are built similarly. Code reads like an assembly line, not a layer cake.

For further reading, please review React's [Design Principles](https://reactjs.org/docs/design-principles.html).

## Future Direction

### Improvements

- use JSON resume instead of reinventing the wheel (perform literature search for wiki data resume standard)
- Fix navbar (use nav provided by template) -> Reduce Bundle size
- Separate concerns better in src/data. Some files are data, others are template variables.
- Get better at redefining duplicate types. They are especially prevalent in resume components.
- Make code splitting better - some bundles are under 1KB.
- Make styles more modular
- Make FA integration less terrible (consider building FA library)
- Better tests
  - one test per component
  - test using puppeteer again
  - test cross brower compatibility
  - Use google lighthouse
- Introduce a spell checker

### New Features

- Completely gut and redo server integration, use JWT
  - auto deploy backend, keep frontend on CDN
- revisit posts/blog
  - put one or two examples up from my knowledge base

### Repository Cleanup

- Don't allow pushes to main
- Generate releases using github action (increment version in package.json too) using semantic versioning.
- Add contributing guidelines
- encourage more PRs that support this roadmap / pay bug bounties
- Build something that allows people to propose changes.
- Make main / server distinction cleaner -> make sure PRs to main also land in server

- Implement better analytics
- Capture information about the community of people that have cloned this site.

### Under Consideration

- Use typescript everywhere instead of Vanilla JS/JSX - will this hinder new developer experience?
- Add support for more exotic integrations (reason, webassembly).
- hydrate all unique content on the site from one location -> deploy as npm package + json.
- Use husky for git pre-commit hooks.
