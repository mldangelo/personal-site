import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import References from '../../Resume/References';

describe('References', () => {
  it('renders the references section', () => {
    render(<References />);

    expect(
      screen.getByText('References are available upon request'),
    ).toBeInTheDocument();
  });

  it('has a link to the contact page', () => {
    render(<References />);

    const link = screen.getByRole('link', {
      name: /references are available upon request/i,
    });
    expect(link).toHaveAttribute('href', '/contact');
  });

  it('has an anchor for navigation', () => {
    render(<References />);

    const anchor = document.getElementById('references');
    expect(anchor).toBeInTheDocument();
  });

  it('wraps text in a heading', () => {
    render(<References />);

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('References are available upon request');
  });
});
