import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MAIN_CONTENT_ID } from '@/components/Template/PageWrapper';
import NotFound, { metadata } from '../not-found';

const stripTrailingSlash = (href: string | null) => href?.replace(/\/$/, '');

describe('not found page', () => {
  it('provides a focusable target for the global skip link', () => {
    render(<NotFound />);

    expect(screen.getByRole('main')).toHaveAttribute('id', MAIN_CONTENT_ID);
    expect(screen.getByRole('main')).toHaveAttribute('tabindex', '-1');
  });

  it('names the page in sentence case, in the heading and the tab alike', () => {
    render(<NotFound />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Page not found' }),
    ).toBeInTheDocument();
    expect(metadata.title).toBe('Page not found');
  });

  it('offers two ways out, labelled in sentence case', () => {
    render(<NotFound />);

    expect(screen.getByRole('link', { name: 'Go home' })).toHaveAttribute(
      'href',
      '/',
    );
    // `next/link` drops the configured trailing slash in this environment, so
    // the shape is normalised rather than pinned.
    expect(
      stripTrailingSlash(
        screen.getByRole('link', { name: 'Contact me' }).getAttribute('href'),
      ),
    ).toBe('/contact');
  });
});
