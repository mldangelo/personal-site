# AGENTS.md

Guidance for AI coding agents working on this Next.js personal portfolio site.

## Quick Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run lint         # Biome linting
npm run type-check   # TypeScript checking
npm test             # Jest tests
npm run build        # Production build + static export
```

**File-scoped (faster feedback):**

```bash
npx tsc --noEmit path/to/file.tsx           # Type check single file
npx biome check path/to/file.tsx            # Lint single file
npm test -- ComponentName                    # Test single component
```

## Project Structure

```
/app/                 → Pages, layouts, tailwind.css
/src/components/      → React components by feature
/src/data/            → Static data (resume, projects, stats)
/src/hooks/           → Custom React hooks
/public/images/       → Images and favicons
```

## Code Style

**Do:**

- Use TypeScript strict mode, functional components with hooks
- Style with CSS custom properties in `app/tailwind.css`
- Keep components small and focused
- Use existing patterns from similar components
- Mark client components with `'use client'`

**Don't:**

- Add new dependencies without clear need
- Create god components or monolithic files
- Hard-code colors—use CSS variables (`var(--color-*)`)
- Skip type annotations on function parameters

## Tech Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Biome · Jest

## Key Patterns

- **Theming**: `data-theme` attribute on `<html>`, persisted to localStorage
- **Static export**: `output: 'export'` for GitHub Pages—no server features
- **Theme images**: Use `ThemePortrait` component for light/dark variants

## Further Reading

- [README.md](./README.md) — Setup and deployment
- [docs/adapting-guide.md](./docs/adapting-guide.md) — Customization checklist
- [docs/design-goals.md](./docs/design-goals.md) — Architecture principles
