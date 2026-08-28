import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Footer from '../../Template/Footer';

describe('Footer', () => {
  it('renders the footer with correct structure', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('displays the name and role', () => {
    render(<Footer />);

    expect(screen.getByText('Pavankalyan Dosa')).toBeInTheDocument();
    expect(
      screen.getByText(/identity and access management/i),
    ).toBeInTheDocument();
  });

  it('does not introduce unrelated headings into the page outline', () => {
    render(<Footer />);

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('displays the current year in copyright', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear().toString();
    expect(
      screen.getByText(new RegExp(`© ${currentYear}`)),
    ).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute(
      'href',
      '/about',
    );
    expect(screen.getByRole('link', { name: /resume/i })).toHaveAttribute(
      'href',
      '/resume',
    );
    // Labelled "Archive" to match the nav and the page's own heading;
    // the route stays /projects.
    expect(screen.getByRole('link', { name: /archive/i })).toHaveAttribute(
      'href',
      '/projects',
    );
    expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute(
      'href',
      '/contact',
    );
  });

  it('renders contact icons section', () => {
    render(<Footer />);

    // Contact icons are rendered via ContactIcons component
    const socialSection = document.querySelector('.footer-social');
    expect(socialSection).toBeInTheDocument();
    expect(screen.getByText('Connect')).toBeInTheDocument();
  });

  it('renders the external Photography destination safely', () => {
    render(<Footer />);

    const photography = screen.getByRole('link', { name: /photography/i });
    expect(photography).toHaveAttribute(
      'href',
      'https://photos.pavankalyandosa.com',
    );
    expect(photography).toHaveAttribute('target', '_blank');
    expect(photography).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not render a portrait before one is supplied', () => {
    const { container } = render(<Footer />);

    expect(container.querySelector('.footer-avatar')).not.toBeInTheDocument();
  });
});
