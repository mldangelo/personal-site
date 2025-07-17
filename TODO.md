# Next.js TypeScript Migration TODO

## Critical Issues 🚨

### 1. Environment Variables
- [x] **Fix Google Analytics environment variable** ✅
  - Updated: `.env` now has `NEXT_PUBLIC_GA_TRACKING_ID`
  - Updated: `sample.env` with correct prefix
  - Ready for production testing

### 2. Node Version Requirement
- [ ] **Update Node version requirement**
  - Current: `package.json` requires Node >=24.x
  - Running: Node 22.14.0
  - Either update the requirement or upgrade Node version

## High Priority Tasks 🔥

### 3. SCSS Deprecation Warnings
- [x] **Fix deprecated Sass functions** ✅
  - Replaced `transparentize()` with RGBA equivalent
  - Replaced all global functions with module syntax:
    - `map-get` → `map.get`
    - `map-has-key` → `map.has-key`
    - `map-keys` → `map.keys`
    - `nth` → `list.nth`
    - `length` → `list.length`
    - `str-index` → `string.index`
    - `str-slice` → `string.slice`
    - `max` → `math.max`
  - Added necessary Sass module imports
  - Only legacy JS API warning remains (requires Next.js config change)

### 4. SEO & Metadata
- [ ] **Add missing SEO essentials**
  - Create `sitemap.xml` generator (use Next.js sitemap feature)
  - Add Open Graph tags to layout
  - Add Twitter Card metadata
  - Verify all pages have proper metadata

### 5. Image Optimization
- [ ] **Implement Next.js Image component**
  - Replace `<img>` tags with `next/image` for optimization
  - Currently images are unoptimized (as per next.config.js)
  - Profile picture at `/images/me.jpg`
  - Project images in `/images/projects/`

## Medium Priority Tasks 📋

### 6. Testing
- [ ] **Add test suite**
  - No tests found in the project
  - Set up Jest and React Testing Library
  - Add basic component tests
  - Add E2E tests with Playwright or Cypress

### 7. Performance Optimizations
- [ ] **Implement performance improvements**
  - Add proper loading states for components
  - Consider implementing ISR (Incremental Static Regeneration) for stats page
  - Add proper error boundaries
  - Implement proper 404 handling for static export

### 8. Type Safety Improvements
- [ ] **Enhance TypeScript usage**
  - Add stricter type definitions for data files
  - Create shared types for resume data structures
  - Add proper return types for all functions
  - Consider using Zod for runtime validation

### 9. Build Warnings
- [ ] **Address build-time warnings**
  - Legacy JS API warning from Sass
  - Consider migrating to CSS Modules or styled-components

## Low Priority Tasks 📝

### 10. Code Organization
- [ ] **Refactor for better maintainability**
  - Consider extracting constants to separate files
  - Add proper interfaces for all data structures
  - Document component props with JSDoc

### 11. Development Experience
- [ ] **Improve DX**
  - Add pre-commit hooks (Husky) for linting/formatting
  - Configure VS Code settings for the project
  - Add better error messages for missing env vars

### 12. Documentation
- [ ] **Update documentation**
  - Update README for Next.js specific instructions
  - Document deployment process for GitHub Pages
  - Add contributing guidelines

## Quality Assurance Checklist ✅

Before considering migration complete:
- [ ] All pages render correctly
- [ ] Navigation works on all pages
- [ ] Contact form/links work
- [ ] Resume data displays correctly
- [ ] Projects show with images
- [ ] Stats page loads and displays data
- [ ] Site works with JavaScript disabled (static export)
- [ ] Mobile responsiveness is maintained
- [ ] Page load performance is acceptable
- [ ] No console errors in development or production
- [ ] Google Analytics tracking works
- [ ] GitHub Pages deployment works
- [ ] Custom domain (mldangelo.com) works correctly

## Notes
- The migration from React to Next.js appears mostly complete
- All components have been converted to TypeScript
- App Router is properly implemented
- Static export is configured for GitHub Pages
- SCSS styling has been preserved