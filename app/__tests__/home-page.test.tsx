import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { WritingItem } from '@/lib/writing';
import HomePage from '../page';

/**
 * The homepage list, against a fixture rather than the published posts. Which
 * three items are newest changes whenever something is published, and what is
 * pinned here has to hold for whichever three they are: the arrow a
 * destination gets, and the quotes a title is set with.
 */
const items = vi.hoisted<WritingItem[]>(() => [
  {
    title: 'Notes on the "vulnerability" report',
    url: '/writing/an-essay-here/',
    date: '2026-07-30',
    description: 'An essay published on this site.',
    isExternal: false,
    source: 'On this site',
  },
  {
    title: "McKinsey's Lilli",
    url: 'https://elsewhere.example/lilli/',
    date: '2026-03-10',
    description: 'An article published somewhere else.',
    isExternal: true,
    source: 'Elsewhere',
  },
]);

vi.mock('@/lib/writing', () => ({ getWritingItems: () => items }));

function renderList() {
  const { container } = render(<HomePage />);
  const [onSite, external] = container.querySelectorAll('.home-writing-item');

  return {
    section: screen.getByRole('region', { name: 'Notes & essays' }),
    onSite,
    external,
  };
}

describe('homepage writing list', () => {
  /**
   * ↗ means "leaves the site and opens a new tab", and nothing else. Every row
   * used to carry it, including the essay that opens right here.
   */
  it('marks an essay on this site with →, in the same tab', () => {
    const { onSite } = renderList();

    expect(onSite.querySelector('.home-writing-arrow')?.textContent).toBe('→');
    expect(onSite).not.toHaveAttribute('target');
  });

  it('marks an article elsewhere with ↗, in a new tab', () => {
    const { external } = renderList();

    expect(external.querySelector('.home-writing-arrow')?.textContent).toBe(
      '↗',
    );
    expect(external).toHaveAttribute('href', items[1].url);
    expect(external).toHaveAttribute('target', '_blank');
    expect(external).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('announces neither arrow, and says which row opens a new tab', () => {
    const { onSite, external } = renderList();

    // Anchored at the end, where a glyph that leaked into the name would sit.
    expect(onSite).toHaveAccessibleName(/ report$/);
    expect(external).toHaveAccessibleName(/ Lilli \(opens in a new tab\)$/);
  });

  it('points "All writing" onward with →, since the index is on this site', () => {
    const { section } = renderList();
    const all = within(section).getByRole('link', { name: 'All writing' });

    expect(all.textContent).toBe('All writing →');
    expect(all).not.toHaveAttribute('target');
  });

  it('sets titles with typographic quotes', () => {
    const { onSite, external } = renderList();

    expect(onSite.querySelector('h3')?.textContent).toBe(
      'Notes on the “vulnerability” report',
    );
    expect(external.querySelector('h3')?.textContent).toBe('McKinsey’s Lilli');
  });

  it('dates each item for a machine as well as for a reader', () => {
    const { onSite } = renderList();

    expect(onSite.querySelector('time')).toHaveAttribute(
      'datetime',
      '2026-07-30',
    );
    expect(onSite.querySelector('.home-writing-meta')?.textContent).toBe(
      'July 30, 2026 · On this site',
    );
  });
});
