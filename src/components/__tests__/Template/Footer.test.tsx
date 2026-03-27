import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Footer from '../../Template/Footer';

describe('Footer', () => {
  it('renders the footer with correct structure', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('displays the current year in copyright', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear().toString();
    expect(
      screen.getByText(new RegExp(`© ${currentYear}`)),
    ).toBeInTheDocument();
  });

  it('renders source code link', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: /source/i })).toHaveAttribute(
      'href',
      'https://github.com/mldangelo/personal-site',
    );
  });

  it('renders contact icons', () => {
    render(<Footer />);

    // ContactIcons renders social links
    const footer = screen.getByRole('contentinfo');
    const icons = footer.querySelector('.icons');
    expect(icons).toBeInTheDocument();
  });
});
