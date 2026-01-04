import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import References from '../../Resume/References';

describe('References', () => {
  it('renders the references section', () => {
    render(<References />);

    expect(
      screen.getByText(/references available upon request/i),
    ).toBeInTheDocument();
  });

  it('has a link to the contact page', () => {
    render(<References />);

    const link = screen.getByRole('link', {
      name: /get in touch/i,
    });
    expect(link).toHaveAttribute('href', '/contact');
  });

  it('has an anchor for navigation', () => {
    render(<References />);

    const anchor = document.getElementById('references');
    expect(anchor).toBeInTheDocument();
  });

  it('displays as minimal inline text', () => {
    render(<References />);

    const paragraph = screen.getByText(/references available upon request/i);
    expect(paragraph.tagName).toBe('P');
  });
});
