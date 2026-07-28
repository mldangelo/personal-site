import { parser } from 'markdown-to-jsx';

export function createHeadingId(title: string): string {
  const slug = title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || 'section';
}

export function createUniqueHeadingIds(titles: readonly string[]): string[] {
  const seen = new Map<string, number>();

  return titles.map((title) => {
    const baseId = createHeadingId(title);
    const count = (seen.get(baseId) ?? 0) + 1;

    seen.set(baseId, count);

    return count === 1 ? baseId : `${baseId}-${count}`;
  });
}

/**
 * Heading ids a post used to publish, keyed by the canonical id that replaced
 * them.
 *
 * Putting `createHeadingId` behind markdown-to-jsx's `slugify` unified the two
 * slug schemes, which was right — but it also renamed four of the fifteen
 * `<h2 id>` values on an already-published post, so every deep link anyone had
 * shared into those sections stopped resolving. The new ids stay canonical and
 * the old ones are re-emitted as alias targets.
 *
 * Nothing here is a list to maintain. markdown-to-jsx hands its own default
 * slugifier to a custom `slugify`, so both schemes are computed for every
 * heading from the library's own parse of the document: the legacy scheme is
 * the one that actually shipped rather than a copy of it that could drift, and
 * posts written after this are covered for free.
 *
 * An alias is only emitted when it can be emitted safely. Two elements sharing
 * an id is worse than one dead link, so a legacy id that some other heading
 * already claims as its canonical id — or that a second heading would claim as
 * its own alias, or that would have to attach to an id appearing twice — is
 * dropped instead.
 */
export function planHeadingAliases(markdown: string): Map<string, string> {
  const headings: Array<{ canonical: string; legacy: string }> = [];

  parser(markdown, {
    slugify: (source, legacySlugify) => {
      const canonical = createHeadingId(source);

      headings.push({ canonical, legacy: legacySlugify(source) });

      return canonical;
    },
  });

  const canonicalCounts = new Map<string, number>();
  for (const { canonical } of headings) {
    canonicalCounts.set(canonical, (canonicalCounts.get(canonical) ?? 0) + 1);
  }

  const aliases = new Map<string, string>();
  const claimed = new Set(canonicalCounts.keys());

  for (const { canonical, legacy } of headings) {
    // The default slugifier keeps nothing from a heading with no anchor-safe
    // characters, and an empty id is not a link target.
    if (!legacy) {
      continue;
    }

    // Every canonical id is already claimed, so this is also what makes the
    // common case — the two schemes agreeing — emit nothing extra.
    if (claimed.has(legacy)) {
      continue;
    }

    // A repeated heading has no single element to hang the alias on.
    if (canonicalCounts.get(canonical) !== 1) {
      continue;
    }

    aliases.set(canonical, legacy);
    claimed.add(legacy);
  }

  return aliases;
}
