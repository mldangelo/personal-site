import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ContactIcons from '../Contact/ContactIcons';

describe('ContactIcons', () => {
  it('renders contact icons', () => {
    render(<ContactIcons />);

    // Check if GitHub link is present
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute(
      'href',
      expect.stringContaining('github.com'),
    );

    // Check if email link is present
    const emailLink = screen.getByRole('link', { name: /email/i });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute(
      'href',
      expect.stringContaining('mailto:'),
    );
  });

  it('draws a decorative glyph in every link', () => {
    render(<ContactIcons />);

    for (const link of screen.getAllByRole('link')) {
      const path = link.querySelector('svg[aria-hidden="true"] path');
      expect(path?.getAttribute('d')).toMatch(/^M/);
    }
  });

  it('names labelled links by their visible text, with the new-tab warning', () => {
    render(<ContactIcons includeEmail={false} labelled />);

    const github = screen.getByRole('link', {
      name: /^GitHub\s*\(opens in new tab\)$/,
    });
    expect(github).not.toHaveAttribute('aria-label');
    expect(github).toHaveTextContent(/^GitHub/);
  });

  it('can omit email when the page already has a primary email action', () => {
    render(<ContactIcons includeEmail={false} />);

    expect(
      screen.queryByRole('link', { name: /email/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
  });
});
