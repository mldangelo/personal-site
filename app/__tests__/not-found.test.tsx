import { readFileSync } from 'node:fs';
import { join } from 'node:path';
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

  it('sets its one sentence with typographic apostrophes', () => {
    render(<NotFound />);

    // Straight ones were the last on the site a reader could see.
    expect(
      screen.getByText(
        'The page you\u2019re looking for doesn\u2019t exist or has been moved.',
      ),
    ).toBeInTheDocument();
  });

  it('reports the status code at the size mono takes everywhere else', () => {
    const css = readFileSync(
      join(process.cwd(), 'app/styles/pages/content.css'),
      'utf8',
    );
    const rule = /\.not-found-code\s*\{([^}]*)\}/.exec(css)?.[1] ?? '';

    // 11px was the annotation size; nothing a reader reads is set at it.
    expect(rule).toContain('font-size: var(--text-xs);');
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
