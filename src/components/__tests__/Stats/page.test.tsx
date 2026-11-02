import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// `Site` is an async server component, which a client render cannot await,
// and what the two tables contain is covered by their own suites. These hold
// only what the page itself decides: how its two sections are opened.
vi.mock('@/components/Stats/Personal', () => ({
  default: () => <table aria-label="personal readings" />,
}));
vi.mock('@/components/Stats/Site', () => ({
  default: () => <table aria-label="site readings" />,
}));

import StatsPage from '../../../../app/stats/page';

describe('stats page', () => {
  it('opens each section with a heading that names it', () => {
    render(<StatsPage />);

    const main = within(screen.getByRole('main'));
    const about = main.getByRole('region', { name: 'About me' });
    const site = main.getByRole('region', { name: 'This site' });

    expect(
      within(about).getByRole('table', { name: 'personal readings' }),
    ).toBeInTheDocument();
    expect(
      within(site).getByRole('table', { name: 'site readings' }),
    ).toBeInTheDocument();
  });

  it('draws both headings with the shared section header', () => {
    // The page had a heading style of its own: 11px tracked capitals with the
    // rule beneath, one of four ways the site opened a section. The class is
    // all jsdom can see of the shared one.
    render(<StatsPage />);

    // Within the page's own content: the footer is free to have headings.
    const headings = within(screen.getByRole('main')).getAllByRole('heading', {
      level: 2,
    });

    expect(headings.map((heading) => heading.textContent)).toEqual([
      'About me',
      'This site',
    ]);
    for (const heading of headings) {
      expect(heading).toHaveClass('section-heading');
      expect(heading.parentElement).toHaveClass('section-header');
    }
  });

  it('keeps one page title above them', () => {
    render(<StatsPage />);

    expect(
      within(screen.getByRole('main')).getByRole('heading', { level: 1 }),
    ).toHaveTextContent(/^Stats$/);
  });
});
