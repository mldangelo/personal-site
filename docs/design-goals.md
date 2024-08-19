# Design Goals

This projects attempts to follow these design principles. Feedback and discussion around these are encouraged. Please feel free to submit an issue or get in touch.

## Simple

1. Someone learning web development should be able to clone this repo and start making it their own within a few minutes.
2. Does not require reading a large amount of documentation.

## Fast

1. Follows [JAMStack best practices](https://jamstack.org/best-practices/). Everything that can be pre-rendered should be pre-rendered.
1. Time to interact should be very fast (< 250 ms). Optimized for small bundle sizes.

## Good Developer Experience

1. Modular
   - It should be relatively straight forward to replace the content in this repository or to add a new feature.
   - Good separation of concerns. Components keep track of their own state. Props are not over-utilized.
   - Limited vertical depth (changes should be relatively self encapsulated).
   - Correct abstractions. - Webpack is complex, but developers don't need to understand how exactly webpack works to use this project.
1. Good Documentation
   - Comments exist and have an appropriate level of detail.
   - Code should be readable.
1. Lean
   - Projects bloat over time. Actively prune for old and dead code.
   - New features that affect the entire project should be carefully considered.
   - Buy, don't build. Don't reinvent the wheel. Use popular npm libraries when possible.
1. Limited horizontal fragmentation
   - Linter to prevent easy PR nits & to prevent developers from wasting time thinking about code style.
   - Preferred React Style - ie (functional components & proptypes).
   - Consistent file structure based on current best practices.
   - Similar features are built similarly. Code reads like an assembly line, not a layer cake.

## Stable

1. Use _Boring_ technologies
   - Javascript over reason or typescript. Limited ecmascript experimental features.
   - Prefer popular and well maintained npm packages.
1. Maintainable
   - Easy setup.
   - It should be easy to deploy any version of this site.
   - Limited external dependencies (ie no missing headers for external libraries).
   - Dependencies are kept up to date (currently uses dependabot).
1. Good tests.
1. Stable API - This project has been forked > 100 times. It should be easy for those forks adopt changes in main.

## References

For further reading, please review

- React's [Design Principles](https://reactjs.org/docs/design-principles.html).
