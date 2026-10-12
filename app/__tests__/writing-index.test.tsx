import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { getWritingItems } from '@/lib/writing';
import WritingPage from '../writing/page';

/**
 * The index as a reader meets it. Everything here is derived from
 * `getWritingItems()` rather than pinned to today's entries: publishing a post
 * or adding a link must not turn these red for correct behaviour.
 */

/** A quotation mark or apostrophe as a keyboard types it, against a letter. */
const TYPEWRITER_QUOTE = /\p{L}['"]|['"]\p{L}/u;

function section(name: string): HTMLElement {
  const heading = screen.getByRole('heading', { level: 2, name });
  const region = heading.closest('section');
  if (!region) {
    throw new Error(`"${name}" is not inside a section`);
  }

  return region;
}

/**
 * The titles a group shows, with their quotation marks put back the way the
 * data types them, so they can be compared with the data.
 */
function titlesIn(region: HTMLElement): (string | undefined)[] {
  return [...region.querySelectorAll('.writing-item h3')].map((title) =>
    title.textContent?.replace(/[‘’]/g, "'").replace(/[“”]/g, '"'),
  );
}

describe('writing index sections', () => {
  it('opens each group with the shared section header', () => {
    render(<WritingPage />);

    for (const name of ['Essays on this site', 'Selected writing elsewhere']) {
      const heading = screen.getByRole('heading', { level: 2, name });

      expect(heading).toHaveClass('section-heading');
      expect(heading.parentElement).toHaveClass('section-header');
      // The section is named by the heading a reader sees.
      expect(screen.getByRole('region', { name })).toBe(section(name));
    }
  });

  it('has two groups and no section for a single link', () => {
    render(<WritingPage />);

    expect(
      screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent),
    ).toEqual(['Essays on this site', 'Selected writing elsewhere']);
  });

  it('lists every entry once, in its group and in the order the data sorts it', () => {
    const items = getWritingItems();
    render(<WritingPage />);

    const here = section('Essays on this site');
    const elsewhere = section('Selected writing elsewhere');

    expect(titlesIn(here)).toEqual(
      items.filter((item) => !item.isExternal).map((item) => item.title),
    );
    expect(titlesIn(elsewhere)).toEqual(
      items.filter((item) => item.isExternal).map((item) => item.title),
    );
    // One link per row, and the whole row is that link.
    expect(within(here).getAllByRole('link')).toHaveLength(
      titlesIn(here).length,
    );
    expect(within(elsewhere).getAllByRole('link')).toHaveLength(
      titlesIn(elsewhere).length,
    );
  });
});

describe('writing index: an entry with no date', () => {
  const undated = getWritingItems().filter(
    (item) => item.isExternal && !item.date,
  );

  it('has one to place', () => {
    // With none, the tests below would pass by checking nothing.
    expect(undated.length).toBeGreaterThan(0);
  });

  it('closes the list of writing elsewhere, after everything dated', () => {
    render(<WritingPage />);

    const rows = [
      ...section('Selected writing elsewhere').querySelectorAll(
        '.writing-item',
      ),
    ];
    const firstUndated = rows.findIndex(
      (row) => row.querySelector('time') === null,
    );

    expect(firstUndated).toBe(rows.length - undated.length);
    expect(
      rows.slice(firstUndated).every((row) => !row.querySelector('time')),
    ).toBe(true);
  });

  it('shows its source in the gutter where a date would be', () => {
    const { container } = render(<WritingPage />);

    for (const item of undated) {
      const row = container.querySelector(`a.writing-item[href="${item.url}"]`);
      const gutter = row?.querySelector('.writing-meta');

      expect(gutter, item.url).not.toBeNull();
      expect(gutter?.querySelector('time'), item.url).toBeNull();
      // Nothing but the source and the mark that it leaves the site.
      expect(gutter?.textContent, item.url).toBe(`${item.source}↗`);
    }
  });
});

describe('writing index rows', () => {
  it('sets titles and descriptions with typographic quotes', () => {
    const items = getWritingItems();
    const { container } = render(<WritingPage />);
    const shown = [
      ...container.querySelectorAll('.writing-title, .writing-description'),
    ].map((element) => element.textContent ?? '');

    // The data is typed with a keyboard, so this cannot pass by there being
    // nothing to convert.
    expect(
      items.some((item) =>
        TYPEWRITER_QUOTE.test(`${item.title} ${item.description}`),
      ),
    ).toBe(true);
    expect(shown).toHaveLength(items.length * 2);
    expect(shown.filter((text) => TYPEWRITER_QUOTE.test(text))).toEqual([]);
  });

  it('writes each date out in full beside its machine-readable form', () => {
    const { container } = render(<WritingPage />);
    const dates = [...container.querySelectorAll('time.writing-date')];

    expect(dates).toHaveLength(
      getWritingItems().filter((item) => item.date).length,
    );
    for (const date of dates) {
      const [year, , day] = (date.getAttribute('datetime') ?? '').split('-');

      // "July 30, 2026": a whole month name, never an abbreviation or digits,
      // and the same day the attribute states.
      expect(date.textContent).toMatch(
        /^(?:January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4}$/,
      );
      expect(date.textContent).toMatch(new RegExp(` ${Number(day)}, ${year}$`));
    }
  });
});

describe('writing index feed control', () => {
  it('links the feed from the title row under its full name', () => {
    const { container } = render(<WritingPage />);
    const feed = screen.getByRole('link', { name: 'RSS Feed' });

    expect(feed).toHaveAttribute('href', '/feed.xml');
    expect(feed).toHaveAttribute('title', 'RSS Feed');
    expect(feed).toHaveTextContent('RSS');
    expect(container.querySelector('.writing-header-row')?.contains(feed)).toBe(
      true,
    );
    expect(container.querySelector('.writing-header-row h1')).toHaveTextContent(
      'Writing',
    );
  });
});
