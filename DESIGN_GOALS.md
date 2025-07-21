# Design Goals for Style System Migration

## Core Principles

### 1. **Visual Parity First**
- Maintain 100% visual consistency with the current design during initial migration
- Every component should look identical before and after migration
- Only after full migration is complete should we enhance with new features

### 2. **Progressive Enhancement**
- Run dual styling systems (SCSS + Tailwind) during migration
- Components can be migrated one at a time without breaking others
- Each migrated component should be fully functional and tested

### 3. **Dark Mode Integration**
- Add dark mode support to each component as it's migrated
- Use CSS custom properties for smooth theme transitions
- Ensure readability and accessibility in both modes

## Specific Design Goals

### Color System
- **Preserve existing palette exactly**:
  - Background: #ffffff → bg-background
  - Alt Background: #f4f4f4 → bg-background-alt
  - Text: #646464 → text-foreground
  - Bold Text: #3c3b3b → text-foreground-bold
  - Accent: #2e59ba → text-accent
- **Add thoughtful dark mode colors**:
  - Not just inverted colors, but carefully chosen for readability
  - Maintain brand identity with accent colors
  - Proper contrast ratios for accessibility

### Typography System
- **Maintain font hierarchy**:
  - Body: Source Sans Pro (400, 700)
  - Headings: Raleway (400, 800, 900)
  - Keep uppercase headings with letter-spacing
- **Preserve sizing**:
  - Base: 14px desktop, 12px mobile
  - Line height: 1.75 for body text
  - Exact heading scales (h2: 1.1em, h3: 0.9em, h4-h6: 0.7em)

### Responsive Design
- **Convert breakpoint system accurately**:
  - SCSS uses max-width (desktop-first)
  - Tailwind uses min-width (mobile-first)
  - Ensure all responsive behaviors work identically
- **Key breakpoints to maintain**:
  - xs: 480px
  - sm: 736px  
  - md: 980px
  - lg: 1280px
  - xl: 1680px

### Component-Specific Goals

#### Navigation
- Preserve horizontal desktop layout
- Replace react-burger-menu with shadcn/ui Sheet
- Maintain smooth transitions
- Add dark mode toggle in navigation

#### SideBar
- Keep fixed positioning and exact dimensions
- Preserve photo styling and hover effects
- Maintain social icon styling
- Ensure proper responsive hiding

#### Skills Component
- Preserve interactive category filtering
- Maintain skill bar animations
- Keep color coding by category
- Convert to shadcn/ui Progress component

#### Project Cards (Cell)
- Maintain card hover effects
- Preserve image aspect ratios
- Keep typography hierarchy
- Use shadcn/ui Card as base

#### Tables (Stats)
- Convert to shadcn/ui Table
- Preserve alternating row colors
- Maintain responsive behavior
- Keep data formatting

### Performance Goals
- **Bundle size**: Equal or smaller than current
- **No runtime style calculations**: All utility classes
- **Tree-shaking**: Remove unused Tailwind classes
- **Font loading**: Maintain Next.js font optimization

### Developer Experience Goals
- **Type safety**: Full TypeScript support for all components
- **Consistent patterns**: Use cn() utility for conditional classes
- **Documentation**: Clear examples of Tailwind patterns
- **Maintainability**: Easier to update and extend

## Success Metrics

1. **Visual Regression**: Zero visual differences (use screenshot comparison)
2. **Performance**: Lighthouse scores maintained or improved
3. **Bundle Size**: CSS bundle ≤ current size
4. **Accessibility**: All WCAG standards maintained
5. **Browser Support**: Works in all currently supported browsers
6. **Dark Mode**: Fully functional with smooth transitions
7. **Mobile Experience**: Identical or improved responsive behavior

## Migration Phases

### Phase 1: Foundation (✅ Complete)
- Tailwind + shadcn/ui setup
- Theme provider infrastructure
- Dual CSS system running

### Phase 2: Critical Layout Components
- Navigation (with dark mode toggle)
- SideBar (most used component)
- PageWrapper (layout foundation)

### Phase 3: Interactive Components  
- Skills (complex state management)
- Hamburger → Sheet migration
- Contact icons with hover states

### Phase 4: Content Components
- Tables (Stats page)
- Cards (Projects page)
- Resume components (Education, Experience, etc.)

### Phase 5: Page-Level Styles
- Layout templates (_header, _main, _wrapper)
- Page-specific styles
- Responsive utilities

### Phase 6: Polish & Optimization
- Remove all SCSS
- Optimize bundle
- Full dark mode refinement
- Documentation

## Non-Goals (What We're NOT Doing)

1. **Redesigning**: This is a migration, not a redesign
2. **Adding features**: No new functionality during migration
3. **Changing layouts**: Preserve all current layouts exactly
4. **Modifying content**: No content changes
5. **Breaking changes**: Must remain backward compatible