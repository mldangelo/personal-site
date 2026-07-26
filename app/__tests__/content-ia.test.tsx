import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { getWritingItems } from '@/lib/writing';
import HomePage from '../page';
import WritingPage from '../writing/page';

describe('writing information architecture', () => {
  it('surfaces the three newest dated items on the homepage', () => {
    const expected = getWritingItems()
      .filter((item) => item.date)
      .slice(0, 3);

    const { container } = render(<HomePage />);
    const section = screen.getByRole('region', { name: 'Latest writing' });
    const cards = container.querySelectorAll('.home-writing-item');

    expect(cards).toHaveLength(3);
    expect(
      [...cards].map((card) => card.querySelector('h3')?.textContent),
    ).toEqual(expected.map((item) => item.title));
    expect(
      within(section).getByRole('link', { name: 'View all' }),
    ).toHaveAttribute('href', '/writing');
  });

  it('groups owned essays, external articles, and guides under real headings', () => {
    const { container } = render(<WritingPage />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Essays on this site' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Selected writing elsewhere',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Guides' }),
    ).toBeInTheDocument();

    expect(container.querySelectorAll('.writing-item h3')).toHaveLength(
      getWritingItems().length,
    );
  });
});
