# Migration Strategy: SCSS to Tailwind + shadcn/ui

## Overview

This document outlines our strategic approach to migrating from SCSS to Tailwind CSS with shadcn/ui components while maintaining 100% visual parity.

## Migration Approach

### 1. **Dual System Period**
- Keep SCSS and Tailwind running simultaneously
- Components can use either system during transition
- No breaking changes to existing functionality

### 2. **Component Priority Matrix**

| Priority | Component | Reason | Complexity |
|----------|-----------|---------|------------|
| **P0** | Navigation | On every page, defines site structure | High (responsive menu) |
| **P0** | SideBar | On most pages, central to layout | Medium |
| **P0** | ContactIcons | Used in SideBar, simple migration | Low |
| **P1** | PageWrapper | Layout foundation | Low |
| **P1** | Skills | Most complex interactive component | High |
| **P2** | Table/TableRow | Used in stats pages | Medium |
| **P2** | Cell | Project cards, used multiple times | Medium |
| **P3** | Resume components | Page-specific, less critical | Low |
| **P4** | Page styles | Final cleanup | Low |

### 3. **Migration Pattern**

For each component:

```typescript
// 1. Analyze current SCSS implementation
// 2. Create Tailwind version alongside SCSS
// 3. Add dark mode support
// 4. Test visual parity
// 5. Remove SCSS version
// 6. Update all imports
```

### 4. **Technical Decisions**

#### Color System
- Use CSS custom properties for theme colors
- Map SCSS variables to Tailwind config
- Ensure dark mode uses thoughtful color choices

#### Responsive Design
- Convert from desktop-first (SCSS) to mobile-first (Tailwind)
- Test at all breakpoints
- Maintain exact responsive behaviors

#### Component Architecture
```typescript
// Before (SCSS)
<div className="navigation">
  <div className="navigation__item">...</div>
</div>

// After (Tailwind)
<nav className="flex items-center justify-between px-6 py-4">
  <div className="text-sm font-medium hover:text-accent">...</div>
</nav>
```

#### State Management
- Preserve all interactive behaviors
- Use shadcn/ui primitives where possible
- Maintain existing React patterns

### 5. **Testing Strategy**

1. **Visual Regression Testing**
   - Screenshot comparison before/after
   - Test in both light/dark modes
   - Check all responsive breakpoints

2. **Functional Testing**
   - All interactions work identically
   - Navigation flows preserved
   - Form submissions (if any) unchanged

3. **Performance Testing**
   - Bundle size comparison
   - Lighthouse scores
   - Load time metrics

### 6. **Risk Mitigation**

| Risk | Mitigation |
|------|------------|
| Visual differences | Screenshot testing, gradual rollout |
| Broken functionality | Component-by-component migration |
| Performance regression | Bundle analysis at each step |
| Lost SCSS features | Document all SCSS patterns first |

### 7. **Success Criteria**

- ✅ Zero visual regression
- ✅ All functionality preserved
- ✅ Dark mode fully implemented
- ✅ Improved developer experience
- ✅ Equal or better performance
- ✅ Cleaner, more maintainable code

## Next Steps

1. Start with Navigation component analysis
2. Build Tailwind version alongside SCSS
3. Test thoroughly before proceeding
4. Document patterns for consistency

## Notes

- This is a MIGRATION not a REDESIGN
- Preserve ALL current behaviors
- Add dark mode as the only enhancement
- Focus on long-term maintainability