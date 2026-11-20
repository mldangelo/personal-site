import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ContactIcons from '../Contact/ContactIcons';

describe('ContactIcons', () => {
  it('names each icon-only link, email included by default', () => {
    render(<ContactIcons />);

    screen.getByRole('link', { name: /github/i });
    screen.getByRole('link', { name: /email/i });
  });

  it('names labelled links by their visible text, with the new-tab warning', () => {
    render(<ContactIcons includeEmail={false} labelled />);

    const github = screen.getByRole('link', {
      name: /^GitHub\s*\(opens in new tab\)$/,
    });
    expect(github).not.toHaveAttribute('aria-label');
  });

  it('can omit email when the page already has a primary email action', () => {
    render(<ContactIcons includeEmail={false} />);

    expect(
      screen.queryByRole('link', { name: /email/i }),
    ).not.toBeInTheDocument();
  });
});
