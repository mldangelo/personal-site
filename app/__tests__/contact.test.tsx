import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import profile from '@/data/profile.json';
import ContactPage from '../contact/page';

describe('contact page', () => {
  it('uses the main region as the centering surface without a duplicate footer', () => {
    render(<ContactPage />);

    expect(screen.getByRole('main')).toHaveClass('page-main--contact');
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
  });

  // The page exists to give out one address. It is the only email link here —
  // the icon row is told to leave its own out — and it reads as the address.
  it('offers the address once, as a link that reads as the address', () => {
    render(<ContactPage />);

    const emailLinks = screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('mailto:'));

    expect(emailLinks).toHaveLength(1);
    expect(emailLinks[0]).toHaveAttribute('href', `mailto:${profile.email}`);
    expect(emailLinks[0]).toHaveAccessibleName(profile.email);
  });
});
