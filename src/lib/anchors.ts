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
