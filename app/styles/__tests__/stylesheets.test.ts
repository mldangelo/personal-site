import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { THEME_COLOR_TOKEN } from '@/lib/theme';
import { readColorToken } from '@/lib/tokens';

/**
 * `app/tailwind.css` is the only stylesheet `app/layout.tsx` imports, and no
 * stylesheet imports another. A file under `app/styles` the entry point does
 * not list ships nothing; an import with no file behind it breaks the build.
 */

const REPO_ROOT = resolve(__dirname, '../../..');
const ENTRY = join(REPO_ROOT, 'app/tailwind.css');
const STYLES_DIR = join(REPO_ROOT, 'app/styles');

const COMMENT = /\/\*[\s\S]*?\*\//g;
const RELATIVE_IMPORT = /@import\s+['"](\.[^'"]+)['"]/g;

function withoutComments(file: string): string {
  return readFileSync(file, 'utf8').replace(COMMENT, '');
}

function repoPaths(files: string[]): string[] {
  return files.map((file) => relative(REPO_ROOT, file)).sort();
}

const onDisk = readdirSync(STYLES_DIR, { encoding: 'utf8', recursive: true })
  .filter((entry) => entry.endsWith('.css'))
  .map((entry) => join(STYLES_DIR, entry));

const imported = [...withoutComments(ENTRY).matchAll(RELATIVE_IMPORT)].map(
  (match) => resolve(dirname(ENTRY), match[1]),
);

describe('stylesheet graph', () => {
  it('imports every stylesheet under app/styles, and only those', () => {
    expect(repoPaths(imported)).toEqual(repoPaths(onDisk));
  });

  it('ships no comment-only stylesheets', () => {
    const empty = onDisk.filter((file) => withoutComments(file).trim() === '');

    expect(repoPaths(empty)).toEqual([]);
  });
});

interface Declaration {
  property: string;
  value: string;
}

interface DeclarationBlock {
  /** A selector list, or the at-rule prelude of a block such as `@theme`. */
  prelude: string;
  declarations: Declaration[];
}

const INNERMOST_BLOCK = /([^{};]*)\{([^{}]*)\}/g;
const DECLARATION = /^\s*([-\w]+)\s*:\s*([\s\S]*\S)\s*$/;
const VENDOR_PREFIX = /^-(?:webkit|moz|ms|o)-(.+)$/;

/**
 * Every declaration block in a comment-free stylesheet. Peeling the innermost
 * braces off until none are left, rather than matching rules once, keeps a
 * parent's own declarations in view if these files ever nest rules.
 */
function declarationBlocks(css: string): DeclarationBlock[] {
  const blocks: DeclarationBlock[] = [];
  let rest = css;
  let peeled = true;

  while (peeled) {
    peeled = false;
    rest = rest.replace(
      INNERMOST_BLOCK,
      (_block, prelude: string, body: string) => {
        peeled = true;
        blocks.push({
          prelude: prelude.trim().replace(/\s+/g, ' '),
          declarations: body.split(';').flatMap((entry) => {
            const match = DECLARATION.exec(entry);

            return match
              ? [{ property: match[1].toLowerCase(), value: match[2] }]
              : [];
          }),
        });

        return '';
      },
    );
  }

  return blocks;
}

/** Prefixed properties whose standard form is declared in the same block. */
function prefixedTwins({ declarations }: DeclarationBlock): string[] {
  const declared = new Set(declarations.map(({ property }) => property));

  return declarations
    .map(({ property }) => property)
    .filter((property) => {
      const standard = VENDOR_PREFIX.exec(property)?.[1];

      return standard !== undefined && declared.has(standard);
    });
}

const sourceBlocks = onDisk.flatMap((file) =>
  declarationBlocks(withoutComments(file)).map((block) => ({
    ...block,
    file: relative(REPO_ROOT, file),
  })),
);

/**
 * A hand-written vendor-prefixed copy of a property is not harmless insurance
 * in this build.
 *
 * Tailwind's production optimiser runs the stylesheets through Lightning CSS,
 * which adds whichever prefixes its browser targets still need — and which
 * reads `-webkit-backdrop-filter` as one more declaration of the standard
 * property, keeping only the last one written. So the standard line followed
 * by its `-webkit-` copy, which is how the site header had them, shipped as
 * the `-webkit-` line alone whatever the browser targets, while the standard
 * line by itself compiles to both. Only Safari honours the prefixed form, so
 * everywhere else nothing blurred the page behind the header and its text read
 * straight through an 88% wash. `-webkit-filter` swallows its twin the same
 * way; the other pairs tried came through intact, which only makes the copy
 * dead weight.
 *
 * None of that is visible to jsdom — it happens in the build — so the guard is
 * on the source: write the standard property and nothing else.
 *
 * The same build is why this file spells that property oddly. Tailwind reads
 * class names out of every non-CSS file git does not ignore, tests and their
 * comments included, and two words this subject keeps reaching for are
 * utilities: the standard property's name, and the function name in
 * `blur(12px)`. Written out on their own here they grew the built CSS by
 * 1.6 kB, so the property appears only as `-webkit-…`, inside a regex, or
 * glued to its value.
 */
describe('vendor prefixes', () => {
  // The first rule is the header's old pair, written tight for the reason
  // above. If the parsing ever stops seeing one like it, the two checks on the
  // real stylesheets pass by finding nothing.
  it('tells a prefixed copy from a property with no standard form', () => {
    const twins = Object.fromEntries(
      declarationBlocks(`
        .site-header{backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
        body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        .card { user-select: none; &:hover { color: red; } -webkit-user-select: none; }
      `).map((block) => [block.prelude, prefixedTwins(block)]),
    );

    expect(twins).toEqual({
      '.site-header': ['-webkit-backdrop-filter'],
      body: [],
      '&:hover': [],
      '.card': ['-webkit-user-select'],
    });
  });

  it('never repeats a property under a vendor prefix in the same rule', () => {
    const repeated = sourceBlocks.flatMap((block) =>
      prefixedTwins(block).map(
        (property) => `${block.file}: ${block.prelude} { ${property} }`,
      ),
    );

    expect(repeated).toEqual([]);
  });

  // Alone it is exactly what the build shipped: an effect for Safari only. The
  // optimiser already emits it beside the standard property for the Safari
  // versions that still need it.
  it('never hand-writes -webkit-backdrop-filter', () => {
    const written = sourceBlocks
      .filter(({ declarations }) =>
        declarations.some(
          ({ property }) => property === '-webkit-backdrop-filter',
        ),
      )
      .map((block) => `${block.file}: ${block.prelude}`);

    expect(written).toEqual([]);
  });
});

/**
 * The header is fixed over everything that scrolls, so its surface has to be
 * opaque. It was an 88% wash that leaned on blurring whatever sat behind it;
 * once the build dropped that, the homepage's display-size name was readable
 * beside the logo and article text ran behind the navigation.
 *
 * Opaque rather than re-blurred is the design, not a workaround:
 * `tokens/effects.css` takes structure from hairlines and precise corners
 * rather than from blurring, and this was the one glassy surface on the site.
 */
describe('site header surface', () => {
  const declarations = declarationBlocks(
    withoutComments(join(STYLES_DIR, 'layout/header.css')),
  )
    .filter(({ prelude }) =>
      prelude.split(',').some((selector) => selector.trim() === '.site-header'),
    )
    .flatMap((block) => block.declarations);

  it('filters nothing behind it', () => {
    expect(
      declarations.filter(({ property }) => /backdrop-filter$/.test(property)),
    ).toEqual([]);
  });

  /**
   * One colour token and nothing thinner: no `color-mix()`, no `rgba()`, no
   * second declaration at another breakpoint. It is the token `theme-color`
   * paints the browser's own chrome with, so the header and the chrome above
   * it read as one surface, and it has to be a plain hex in both themes — a
   * token that is itself translucent would pass a check on this file alone.
   */
  it('is painted in the opaque page colour the browser chrome uses', () => {
    const backgrounds = declarations
      .filter(({ property }) => /^background(?:-color)?$/.test(property))
      .map(({ value }) => value);

    expect(backgrounds).toEqual([`var(${THEME_COLOR_TOKEN})`]);

    for (const theme of ['light', 'dark'] as const) {
      expect(readColorToken(THEME_COLOR_TOKEN, theme)).toMatch(
        /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/,
      );
    }
  });
});
