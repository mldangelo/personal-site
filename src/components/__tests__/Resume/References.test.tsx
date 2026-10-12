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

  it('opens with the shared section heading, in sentence case', () => {
    render(<References />);

    // The section index links to #references, so there has to be a heading
    // here to land on.
    const heading = screen.getByRole('heading', {
      level: 2,
      name: 'References',
    });
    expect(heading).toHaveClass('section-heading');
    expect(heading.parentElement).toHaveClass('section-header');
  });

  it('has a link to the contact page', () => {
    render(<References />);

    const link = screen.getByRole('link', {
      name: /get in touch/i,
    });
    expect(link).toHaveAttribute('href', '/contact');
  });

  it('displays as minimal inline text', () => {
    render(<References />);

    const paragraph = screen.getByText(/references available upon request/i);
    expect(paragraph.tagName).toBe('P');
  });

  /**
   * It was the one centred line on a left-aligned page, styled by a run of
   * utility classes of its own. It takes the section-note class now, and the
   * link takes its look from being a link in running text.
   */
  it('is styled by the section-note class, not by utilities of its own', () => {
    render(<References />);

    const paragraph = screen.getByText(/references available upon request/i);
    const link = screen.getByRole('link');

    expect(paragraph.className).toBe('resume-note');
    expect(link).not.toHaveAttribute('class');
  });

  it('keeps the arrow out of the name of the link', () => {
    render(<References />);

    const link = screen.getByRole('link', { name: 'Get in touch' });

    expect(link.textContent).toBe('Get in touch →');
    expect(link.querySelector('[aria-hidden="true"]')?.textContent).toBe('→');
  });
});
