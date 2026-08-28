# Pavan Kalyan Dosa Personal Site Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the latest upstream Next.js portfolio as Pavan Kalyan Dosa's IAM site, make Photography the prominent external destination, and remove inherited Writing and Stats features completely.

**Architecture:** Keep profile identity in the existing data modules and update authored copy in the few upstream components that own it. Remove Writing and Stats as complete features so routes, sitemap, RSS, schema, tests, and static export cannot expose original-author content.

**Tech Stack:** Next.js 16 static export, React 19, TypeScript 7, Vitest, Biome, Prettier, Font Awesome, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-08-28-pavan-personal-site-design.md`

## Global Constraints

- Publish only `hello@pavankalyandosa.com`, GitHub, LinkedIn, and `https://photos.pavankalyandosa.com` as external personal destinations.
- Keep IAM as the headline; make Photography the primary hero action and external navigation link with `target="_blank"` and `rel="noopener noreferrer"`.
- Use the supplied résumé for claims; do not invent location, birth date, personal history, projects, or a portrait.
- Remove Writing and Stats end-to-end; retain the existing static export, accessibility conventions, and dependencies.
- Run `npm run format` before each commit. Do not push or change DNS/GitHub settings.

---

### Task 1: Rebrand shared identity, SEO, navigation, and contact

**Files:**

- Modify: `src/data/profile.json`, `src/lib/utils.ts`, `src/lib/metadata.ts`, `app/layout.tsx`, `src/data/contact.ts`, `src/data/routes.ts`, `src/components/Template/Navigation.tsx`, `src/components/Template/Footer.tsx`, `src/components/Template/Hero.tsx`, `public/CNAME`, `public/robots.txt`, `package.json`, `README.md`
- Test: `src/data/__tests__/routes.test.ts`, `src/components/__tests__/Template/Navigation.test.tsx`, `src/components/__tests__/Template/Hero.test.tsx`, `src/components/__tests__/Template/Footer.test.tsx`, `src/components/__tests__/ContactIcons.test.tsx`, `app/__tests__/page-metadata.test.ts`

**Interfaces:**

- Produces `profile.name === 'Pavan Kalyan Dosa'`, `profile.email === 'hello@pavankalyandosa.com'`, and `SITE_URL === 'https://pavankalyandosa.com'`.
- Extends `Route` with `external?: boolean`; produces `{ label: 'Photography', path: 'https://photos.pavankalyandosa.com', external: true }`.

- [ ] **Step 1: Write failing identity and hierarchy tests**

```tsx
expect(profile.name).toBe('Pavan Kalyan Dosa');
expect(profile.email).toBe('hello@pavankalyandosa.com');
expect(SITE_URL).toBe('https://pavankalyandosa.com');
expect(routes).toContainEqual(
  expect.objectContaining({
    label: 'Photography',
    path: 'https://photos.pavankalyandosa.com',
    external: true,
  }),
);
expect(screen.getByRole('link', { name: /view photography/i })).toHaveAttribute(
  'href',
  'https://photos.pavankalyandosa.com',
);
```

- [ ] **Step 2: Verify the tests fail on upstream content**

Run: `npm test -- routes Navigation Hero Footer ContactIcons page-metadata`

Expected: FAIL because inherited identity/copy remains and Photography is absent.

- [ ] **Step 3: Implement shared data and external-link rendering**

```ts
export interface Route {
  label: string;
  path: string;
  index?: boolean;
  primary?: boolean;
  external?: boolean;
}
```

Render `external` routes as anchors, with safe new-tab attributes and an `sr-only` new-tab notice. In the hero preserve the IAM professional summary, make Photography the `.button` CTA, retain Resume as the secondary CTA, and remove `ThemePortrait` from Hero/Footer. Limit contact data to LinkedIn, GitHub, and profile-derived mailto.

- [ ] **Step 4: Verify focused tests pass**

Run: `npm test -- routes Navigation Hero Footer ContactIcons page-metadata`

Expected: PASS with Pavan's identity, approved contact methods, and external Photography behavior.

- [ ] **Step 5: Format and commit**

```bash
npm run format
git add src app public package.json README.md
git commit -m "feat: rebrand shared site identity"
```

### Task 2: Replace IAM résumé, About, contact, and project content

**Files:**

- Modify: `src/data/about.ts`, `src/data/resume/work.ts`, `src/data/resume/degrees.ts`, `src/data/resume/skills.ts`, `src/data/projects.ts`, `app/about/page.tsx`, `app/resume/page.tsx`, `app/projects/page.tsx`, `app/contact/page.tsx`, `src/components/Resume/ResumeNav.tsx`
- Delete: `src/data/resume/courses.ts`, `src/components/Resume/Courses.tsx`, `src/components/Resume/Courses/`, `src/components/Resume/References.tsx`, inherited project images after references are removed
- Test: `src/data/__tests__/about.test.ts`, `src/data/__tests__/work.test.ts`, `src/data/__tests__/degrees.test.ts`, `src/data/__tests__/skills.test.ts`, `src/data/__tests__/projects.test.ts`, `app/__tests__/content-ia.test.tsx`, `app/__tests__/resume-anchors.test.tsx`, `src/components/__tests__/Resume/ResumeNav.test.tsx`

**Interfaces:**

- Produces work entries in this order: Avancer Corp, PwC, KPMG, Cotelligent.
- Produces one University of South Dakota master's degree and skill groups for IAM, Languages & Frameworks, and Tools & Infrastructure.
- Produces a Projects page with a GitHub-profile call to action instead of inherited project cards.

- [ ] **Step 1: Write failing factual-content tests**

```ts
expect(work.map(({ name }) => name)).toEqual(['Avancer Corp', 'PwC', 'KPMG', 'Cotelligent']);
expect(degrees).toEqual([
  expect.objectContaining({
    school: 'University of South Dakota',
    year: 2024,
  }),
]);
expect(aboutMarkdown).toContain('SailPoint IdentityIQ');
expect(aboutMarkdown).not.toMatch(/OpenAI|Promptfoo|Michael D'Angelo/);
```

```tsx
expect(screen.queryByRole('link', { name: /courses/i })).not.toBeInTheDocument();
expect(screen.queryByRole('link', { name: /references/i })).not.toBeInTheDocument();
expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
  'href',
  'https://github.com/PavankalyanDosa',
);
```

- [ ] **Step 2: Verify focused tests fail**

Run: `npm test -- about work degrees skills projects content-ia resume-anchors ResumeNav`

Expected: FAIL on inherited career, degree, cards, and Courses/References.

- [ ] **Step 3: Implement factual content**

Write a concise About profile covering IdentityIQ/ISC, lifecycle management, access governance, integration, automation, compliance, and collaboration. Populate supplied work dates/highlights, education, SailPoint and Okta certifications, achievements, and skills. Remove Courses/References imports, components, anchors, data, and tests. Replace project cards with a concise work statement and the external GitHub profile link.

- [ ] **Step 4: Verify focused tests pass**

Run: `npm test -- about work degrees skills projects content-ia resume-anchors ResumeNav`

Expected: PASS; the Resume shows Experience, Education, Skills, and Certifications only.

- [ ] **Step 5: Format and commit**

```bash
npm run format
git add app src public/images/projects
git commit -m "feat: add Pavan IAM portfolio content"
```

### Task 3: Remove Writing as a complete feature

**Files:**

- Modify: `app/page.tsx`, `app/sitemap.ts`, `src/lib/schema.ts`, `scripts/verify-export.mjs`, `app/__tests__/content-ia.test.tsx`, `app/__tests__/sitemap.test.ts`, `scripts/__tests__/verify-export.test.ts`
- Delete: `app/writing/`, `app/feed.xml/`, `content/writing/`, `src/data/writing.ts`, `src/lib/writing.ts`, `src/lib/posts.ts`, `src/lib/logEntry.ts`, `src/components/Writing/`, `app/styles/pages/writing.css`, and colocated Writing tests
- Test: `app/__tests__/content-ia.test.tsx`, `app/__tests__/sitemap.test.ts`, `scripts/__tests__/verify-export.test.ts`

**Interfaces:**

- Removes `getWritingItems`, `getAllPosts`, `/writing/`, and `/feed.xml` consumers.
- Produces a sitemap and export verifier that validate only retained artifacts.

- [ ] **Step 1: Write failing absence tests**

```ts
expect(routes.map(({ label }) => label)).not.toContain('Writing');
expect(await sitemap()).not.toEqual(
  expect.arrayContaining([expect.objectContaining({ url: expect.stringContaining('/writing/') })]),
);
expect(homepage).not.toContain('Latest writing');
expect(exportVerifierSource).not.toContain('content/writing');
```

- [ ] **Step 2: Verify the tests fail**

Run: `npm test -- content-ia sitemap verify-export`

Expected: FAIL on Writing navigation, homepage promotion, sitemap entries, and post/RSS assumptions.

- [ ] **Step 3: Remove all writing consumers before deleting files**

Remove imports/JSX, writing schema nodes, RSS alternates, and sitemap post generation. Simplify `verify-export.mjs` by deleting `gray-matter`, Markdown directory walking, draft detection, post-route checks, and RSS validation while retaining link, canonical, image, and duplicate-id validation. Delete feature files only after:

```bash
rg -n -i "writing|feed\.xml|getWritingItems|getAllPosts|postSlug" app src scripts content
```

has no retained-feature references.

- [ ] **Step 4: Verify focused tests pass**

Run: `npm test -- content-ia sitemap verify-export`

Expected: PASS without Writing routes or RSS assumptions.

- [ ] **Step 5: Format and commit**

```bash
npm run format
git add app src scripts content
git commit -m "feat: remove inherited writing feature"
```

### Task 4: Remove Stats and its inherited personal data

**Files:**

- Modify: `src/data/routes.ts`, `app/sitemap.ts`, `src/lib/schema.ts`, `app/__tests__/content-ia.test.tsx`, `app/__tests__/sitemap.test.ts`, `src/data/__tests__/routes.test.ts`
- Delete: `app/stats/`, `src/components/Stats/`, `src/data/stats/`, `src/hooks/useLiveAge.ts`, `src/hooks/__tests__/useLiveAge.test.tsx`, Stats-only styles, and Stats tests
- Test: `src/data/__tests__/routes.test.ts`, `app/__tests__/content-ia.test.tsx`, `app/__tests__/sitemap.test.ts`

**Interfaces:** Produces no `/stats/` route, navigation item, sitemap URL, schema link, personal-value import, or live-age hook.

- [ ] **Step 1: Write failing route/sitemap removal tests**

```ts
expect(routes).not.toEqual(expect.arrayContaining([expect.objectContaining({ path: '/stats' })]));
expect((await sitemap()).map(({ url }) => url)).not.toContain('https://pavankalyandosa.com/stats/');
```

- [ ] **Step 2: Verify tests fail**

Run: `npm test -- routes content-ia sitemap`

Expected: FAIL on inherited Stats registration.

- [ ] **Step 3: Remove Stats consumers and files**

Remove route/sitemap/schema consumers, then delete the page, data, components, hook, styles, and tests. Resolve every audit hit from:

```bash
rg -n -i "stats|useLiveAge|countriesVisited|birthDate|currentCity" app src scripts
```

- [ ] **Step 4: Verify focused tests pass**

Run: `npm test -- routes content-ia sitemap`

Expected: PASS with no Stats references in retained code.

- [ ] **Step 5: Format and commit**

```bash
npm run format
git add app src scripts
git commit -m "feat: remove inherited stats feature"
```

### Task 5: Regenerate identity artifacts and pass the release gate

**Files:**

- Modify: `public/og.png`, `public/og.meta.json`, favicon manifest/name fields that identify the inherited author, remaining test assertions
- Test: full repository suite

**Interfaces:** Produces a share-image/metadata pair generated from Pavan's profile, and a static export whose canonical URLs and schema use `https://pavankalyandosa.com`.

- [ ] **Step 1: Write a failing inherited-content audit test**

```ts
const inherited = /Michael|mldangelo|dangelosaurus|OpenAI|Promptfoo|Codex Security/iu;
expect(publicSurfaceText).not.toMatch(inherited);
expect(publicSurfaceText).toContain('Pavan Kalyan Dosa');
```

- [ ] **Step 2: Verify the audit fails before cleanup**

Run: `npm test -- page-metadata content-ia`

Expected: FAIL with inherited metadata or page copy.

- [ ] **Step 3: Regenerate Open Graph assets and resolve audit hits**

Run `npm run og`, keep `public/og.png` and `public/og.meta.json` together, then run:

```bash
rg -n -i "Michael|mldangelo|dangelosaurus|mldangelo\.com|OpenAI|Promptfoo|Codex Security" \
  app content public scripts src package.json README.md
```

Update retained public-site references and their assertions. Preserve the upstream license attribution where applicable.

- [ ] **Step 4: Run the complete verification suite**

```bash
npm run format
npm run lint
npm run type-check
npm test
npm run og:check
npm run build
npm run verify-export
```

Expected: every command exits `0`, `out/` exists, and the export verifier reports no invalid links, metadata, or removed-feature artifacts.

- [ ] **Step 5: Commit verified output**

```bash
git add app src public scripts package.json README.md docs
git commit -m "feat: finalize Pavan personal site migration"
```

## Plan Self-Review

- Spec coverage: Task 1 covers identity, contacts, domain, photography prominence, portrait removal, and metadata. Task 2 covers About, résumé, certifications, education, skills, and projects. Tasks 3 and 4 remove Writing and Stats end-to-end. Task 5 covers generated assets and complete validation.
- Placeholder scan: every task names the files, tests, commands, expected results, and implementation behavior needed to execute independently.
- Type consistency: Task 1 defines `Route.external` before Navigation/Footer consume it. Tasks 3 and 4 remove imports before deleting their exported modules.
