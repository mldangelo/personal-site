# Design Goals

## Simple

1. Someone learning web development should be able to clone this repo and start making it their own within a few minutes.

## Stable

1. *Boring* technologies
    - Javascript, not typescript. One global style sheet. No experimental features.
    - uses common and well maintained npm packages.
2. Good tests
3. Maintainable
    - Easy setup.
    - It should be easy to deploy any version of this site.
    - Limited external dependencies (ie no missing headers for external libraries).
    - Dependencies are kept up to date. Currently uses dependabot.

## Fast

1. Everything that can be pre-rendered should be pre-rendered. Follow [JAMStack best practices](https://jamstack.org/best-practices/)
2. Time to interact should be very fast (< 250 ms). Optimize for small bundle sizes.

## Good Developer Experience

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
