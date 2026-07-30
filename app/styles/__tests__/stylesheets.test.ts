import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, posix, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Structural guards on the stylesheet graph.
 *
 * `app/tailwind.css` is the single entry point — `app/layout.tsx` imports
 * nothing else — so a stylesheet that is not reachable from it ships no bytes,
 * and an import with no file behind it breaks the build.
 */

const REPO_ROOT = resolve(__dirname, '../../..');
const ENTRY = join(REPO_ROOT, 'app/tailwind.css');
const STYLES_DIR = join(REPO_ROOT, 'app/styles');

const IMPORT_PATTERN = /@import\s+['"]([^'"]+)['"]/g;
const COMMENT_PATTERN = /\/\*[\s\S]*?\*\//g;

function isFile(path: string): boolean {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

function cssFilesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);

    if (statSync(path).isDirectory()) {
      return cssFilesUnder(path);
    }

    return path.endsWith('.css') ? [path] : [];
  });
}

function repoPath(file: string): string {
  return relative(REPO_ROOT, file).split(/[\\/]/).join(posix.sep);
}

/**
 * Relative `@import` targets in a stylesheet, resolved to absolute paths,
 * whether or not the file exists. Bare specifiers such as `tailwindcss`
 * resolve from node_modules and are not the graph's business.
 */
function importTargetsOf(file: string): string[] {
  const contents = readFileSync(file, 'utf8');

  return [...contents.matchAll(IMPORT_PATTERN)]
    .map((match) => match[1])
    .filter((specifier) => specifier.startsWith('.'))
    .map((specifier) => resolve(dirname(file), specifier));
}

/** Every stylesheet reachable from the entry point, following `@import`. */
function reachableFrom(entry: string): Set<string> {
  const seen = new Set<string>();
  const queue = [entry];

  while (queue.length > 0) {
    const file = queue.pop() as string;

    // A dangling import is reported by its own test; skipping it here keeps
    // the walk from throwing and taking the whole suite down with it.
    if (seen.has(file) || !isFile(file)) {
      continue;
    }
    seen.add(file);

    for (const imported of importTargetsOf(file)) {
      queue.push(imported);
    }
  }

  return seen;
}

/** A stylesheet's content with comments and surrounding whitespace stripped. */
function declarationsOf(file: string): string {
  return readFileSync(file, 'utf8').replace(COMMENT_PATTERN, '').trim();
}

const stylesheets = cssFilesUnder(STYLES_DIR);
const reachable = reachableFrom(ENTRY);

describe('stylesheet graph', () => {
  it('finds stylesheets to check', () => {
    expect(stylesheets.length).toBeGreaterThan(0);
  });

  it('resolves every @import to a file that exists', () => {
    const dangling = [ENTRY, ...stylesheets].flatMap((file) =>
      importTargetsOf(file)
        .filter((imported) => !isFile(imported))
        .map((imported) => `${repoPath(file)} → ${repoPath(imported)}`),
    );

    expect(dangling).toEqual([]);
  });

  it('reaches every stylesheet from app/tailwind.css', () => {
    const orphans = stylesheets
      .filter((file) => !reachable.has(file))
      .map(repoPath);

    expect(orphans).toEqual([]);
  });

  it('ships no comment-only placeholder stylesheets', () => {
    // `components/forms.css` was seven lines saying form styles "would go here
    // if needed in the future". It was imported, and it emitted nothing.
    const empty = stylesheets
      .filter((file) => declarationsOf(file) === '')
      .map(repoPath);

    expect(empty).toEqual([]);
  });
});

/**
 * The printed page suppresses screen chrome, and the list is hand-maintained,
 * so it drifts. `.skip-link` sat outside it for as long as it existed and
 * printed an accent-filled button on four of five résumé pages.
 *
 * This derives the expectation from `app/layout.tsx` instead of restating it:
 * anything rendered as a direct child of `<body>` outside `.site-wrapper` is
 * chrome by construction — it is not page content — so it must appear in the
 * suppression block. That is the property that was violated, and it catches the
 * next element appended there without anyone remembering this file exists.
 */
describe('print chrome suppression', () => {
  const printCss = readFileSync(
    join(REPO_ROOT, 'app/styles/print.css'),
    'utf8',
  );
  const layout = readFileSync(join(REPO_ROOT, 'app/layout.tsx'), 'utf8');

  /** Class names on elements rendered directly under `<body>`. */
  function bodyLevelClasses(): string[] {
    const body = layout.slice(layout.indexOf('<body'));
    const found = new Set<string>();

    for (const match of body.matchAll(/className="([a-z][a-z0-9- ]*)"/g)) {
      for (const name of match[1].split(/\s+/)) {
        // `site-wrapper` holds the page itself; everything else at this level
        // is chrome.
        if (name && name !== 'site-wrapper') found.add(name);
      }
    }

    return [...found];
  }

  it('suppresses the skip link, which is not inside the header', () => {
    expect(printCss).toMatch(/^\s*\.skip-link,$/m);
  });

  it('suppresses every chrome element rendered at body level', () => {
    const classes = bodyLevelClasses();

    // Guard the guard: if the layout stops rendering chrome at body level this
    // test would pass vacuously.
    expect(classes.length).toBeGreaterThan(0);

    for (const name of classes) {
      expect(
        printCss,
        `.${name} is rendered at body level but never suppressed for print`,
      ).toContain(`.${name},`);
    }
  });
});

// There was a fourth guard here, asserting that `::view-transition-*` CSS may
// only exist when `next.config.mjs` sets `experimental.viewTransition`. It is
// deliberately gone rather than repaired, for two independent reasons.
//
// It was false: those pseudo-elements are generated for *any* active view
// transition, including a same-document one started by
// `document.startViewTransition()`, which needs no framework flag at all. And
// it could not have proved what it claimed anyway — it read `next.config.mjs`
// as text, so a commented-out `viewTransition: true` satisfied it.
//
// The honest version — view-transition CSS must be accompanied by something
// that can start a transition — would have passed the file that motivated the
// guard: deleted `utilities.css` declared its own `@view-transition
// { navigation: auto }` trigger. What was actually wrong with it is
// app-specific, a fact about this app's routing rather than a rule a
// stylesheet-graph test can hold, so `app/tailwind.css` records it as a
// comment instead.
//
// That routing fact was overstated when it was first written here. It said
// every internal link goes through `<Link>`, while Markdown prose still
// rendered native anchors — `[Good design](/)` in `src/data/about.ts` exported
// a literal `<a href="/">` from `/about/`, which is precisely the same-origin
// cross-document navigation the deleted rule could have run for.
// `src/lib/markdownLinks.tsx` routes internal Markdown links through `<Link>`
// as well now, and `src/lib/__tests__/markdownLinks.test.tsx` pins the
// classification. What is left native and same-origin is links to exported
// files — `/feed.xml`, `/resume.json`, `/og.png` — and a navigation to one of
// those has no document on the other side to opt in.

/**
 * Paged media repeats a `position: fixed` element on every page instead of
 * scrolling it away, and offscreen tricks that hold on a viewport need not hold
 * there: `.skip-link` is hidden only by `transform: translateY(-200%)`, and it
 * printed an accent-filled "SKIP TO CONTENT" box at the foot of four of the
 * resume's five pages.
 *
 * So this pins the class, not the instance — every fixed selector has to be
 * named in `print.css`, or explicitly excused below.
 */
const PRINT_CSS = join(STYLES_DIR, 'print.css');

/** Selectors that are `position: fixed` but must survive onto paper. */
const PRINT_EXEMPT: string[] = [];

/**
 * Selector lists of every rule in a stylesheet whose body matches `pattern`.
 *
 * Regex, not a parser: `[^{}]` cannot cross a brace, so a rule nested inside
 * `@media` is matched on its own and the at-rule prelude — which has a brace
 * between it and the rule — is never mistaken for a selector.
 */
function selectorsDeclaring(file: string, pattern: RegExp): string[] {
  const css = readFileSync(file, 'utf8').replace(COMMENT_PATTERN, '');

  return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(([, , body]) => pattern.test(body))
    .flatMap(([, prelude]) => prelude.split(','))
    .map((selector) => selector.trim())
    .filter((selector) => selector.length > 0 && !selector.startsWith('@'));
}

describe('print suppresses the fixed screen chrome', () => {
  const fixed = [
    ...new Set(
      stylesheets
        .filter((file) => file !== PRINT_CSS)
        .flatMap((file) => selectorsDeclaring(file, /position:\s*fixed\b/)),
    ),
  ];
  const hidden = new Set(selectorsDeclaring(PRINT_CSS, /display:\s*none\b/));

  it('finds fixed-position selectors to check', () => {
    // If this goes empty the next assertion passes for the wrong reason.
    expect(fixed).toContain('.skip-link');
    expect(fixed.length).toBeGreaterThan(3);
  });

  it('hides every fixed-position selector on paper', () => {
    const unsuppressed = fixed.filter(
      (selector) => !PRINT_EXEMPT.includes(selector) && !hidden.has(selector),
    );

    expect(unsuppressed).toEqual([]);
  });
});
