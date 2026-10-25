import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { getAppearances } from '@/data/speaking';
import SpeakingPage from '../speaking/page';

describe('speaking page', () => {
  const appearances = getAppearances();

  it('lists every appearance, newest first, under a counted heading', () => {
    const { container } = render(<SpeakingPage />);
    const register = screen.getByRole('region', { name: 'Public sessions' });
    const titles = within(register)
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.textContent?.replace('↗', ''));

    expect(titles).toEqual(appearances.map((appearance) => appearance.title));
    expect(
      container.querySelector('.projects-section-count'),
    ).toHaveTextContent(`${appearances.length} appearances`);
  });

  it('states each format as the organiser billed it, beside the date', () => {
    const { container } = render(<SpeakingPage />);
    const rows = [...container.querySelectorAll('.project-entry')];

    expect(rows).toHaveLength(appearances.length);
    rows.forEach((row, index) => {
      const labels = [...row.querySelectorAll('.project-entry-role')].map(
        (label) => label.textContent,
      );

      expect(labels).toEqual([
        appearances[index].format,
        appearances[index].place,
      ]);
    });
  });

  /**
   * An `aria-label` would replace the row's whole accessible name and drop
   * the place and host; the warning is appended to the text instead.
   */
  it('opens each listing in a new tab and says so without hiding the row', () => {
    render(<SpeakingPage />);
    const register = screen.getByRole('region', { name: 'Public sessions' });
    // By position, not by name: one row's description names another's event.
    const links = within(register).getAllByRole('link');

    expect(links).toHaveLength(appearances.length);
    links.forEach((link, index) => {
      const appearance = appearances[index];

      expect(link).toHaveAttribute('href', appearance.link);
      expect(link).toHaveAccessibleName(
        expect.stringContaining(appearance.title),
      );
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link).not.toHaveAttribute('aria-label');
      expect(link).toHaveAccessibleName(
        expect.stringContaining(appearance.place),
      );
      expect(link).toHaveAccessibleName(
        expect.stringContaining('(opens in a new tab)'),
      );
    });
  });

  it('mentions closed-door sessions without listing them, and links contact', () => {
    render(<SpeakingPage />);
    const closed = screen.getByRole('region', {
      name: 'Closed-door sessions',
    });

    expect(within(closed).queryByRole('list')).not.toBeInTheDocument();
    // jsdom never applies `trailingSlash`, so compare without it.
    expect(
      within(closed)
        .getByRole('link', { name: 'get in touch' })
        .getAttribute('href')
        ?.replace(/\/$/, ''),
    ).toBe('/contact');
  });
});
