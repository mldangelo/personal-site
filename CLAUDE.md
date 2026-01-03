# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server with Turbopack (http://localhost:3000)
npm run dev

# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build

# Build and export (for deployment)
npm run predeploy  # This runs 'npm run build' which includes static export

# Analyze bundle size
npm run analyze
```

## Architecture Overview

This is a personal portfolio/resume website built with Next.js and TypeScript, designed to be easily forked and customized.

### Technology Stack

- **Next.js 16** with App Router and Turbopack
- **TypeScript** for type safety
- **React 19** with functional components and hooks
- **Biome** for linting and code formatting
- **Prettier** for markdown and CSS formatting
- **Tailwind CSS v4** for styling
- **Vitest** with React Testing Library
- **Static Export** for GitHub Pages deployment
- **Node 20+** runtime

### Project Structure

- `/app/` - Next.js App Router pages, layouts, and Tailwind CSS styles
- `/src/components/` - React components organized by feature
- `/src/data/` - Static data files (resume, projects, stats)
- `/src/hooks/` - Custom React hooks
- `/public/` - Static assets (images, favicons)

### Key Design Patterns

1. **App Router**: File-based routing with layouts
2. **Component Structure**: TypeScript functional components with type safety
3. **Styling**: Tailwind CSS v4 with CSS variables for theming
4. **Data Management**: Static TypeScript files in `/src/data/`
5. **Performance**: Static export, lazy loading, optimized fonts

### Deployment

- Static export to `/out` directory
- GitHub Actions for automatic deployment to GitHub Pages
- Custom domain support through CNAME file

### Testing

- **Framework**: Vitest with React Testing Library and jsdom environment
- **Coverage**: ~76% statement coverage with 268+ tests
- **Conventions**:
  - Use explicit Vitest imports: `import { describe, expect, it, vi } from 'vitest'`
  - Tests run in random order for isolation (`sequence: { shuffle: true }`)
  - Test files in `__tests__/` subdirectories mirroring source structure
  - Component tests: `src/components/__tests__/`
  - Data tests: `src/data/__tests__/`
  - Hook tests: `src/hooks/__tests__/`

### Code Quality

- **Biome** handles linting with strict rules including `noUnusedImports`
- Run `npm run lint` before committing to catch issues early
- Use `npx biome check . --write` to auto-fix issues

### Important Notes

- The site uses static export (`output: 'export'`) for GitHub Pages compatibility
- Client components use 'use client' directive
- Google Analytics 4 is configured with NEXT_PUBLIC_GA_TRACKING_ID using @next/third-parties
- Fonts are optimized using Next.js font optimization
