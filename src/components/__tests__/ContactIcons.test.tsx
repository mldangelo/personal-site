import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import contact from '@/data/contact';

import ContactIcons from '../Contact/ContactIcons';

/**
 * The real destinations, plus one the icon set has no mark for. The real list
 * has such an entry today, but the day it gains a mark the case below would
 * pass by having nothing to check.
 */
vi.mock('@/data/contact', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/data/contact')>();

  return {
    ...actual,
    default: [
      ...actual.default,
      {
        id: 'unmarked',
        link: 'https://unmarked.example/me',
        label: 'Unmarked',
      },
    ],
  };
});

const marked = contact.filter((item) => item.icon);
const isMailto = (link: string) => link.startsWith('mailto:');

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

  it('keeps the list markup the contact page styles', () => {
    const { container } = render(<ContactIcons />);

    const items = container.querySelectorAll('ul.icons > li');

    expect(items).toHaveLength(marked.length);
    for (const item of items) {
      expect(item.querySelector(':scope > a > svg')).toBeInTheDocument();
    }
  });

  // An icon has no text, so the name is all a screen reader has to go on.
  it('names every icon after its destination, and says which open a new tab', () => {
    render(<ContactIcons />);

    for (const item of marked) {
      const mailto = isMailto(item.link);
      const link = screen.getByRole('link', {
        name: mailto ? item.label : `${item.label} (opens in a new tab)`,
      });

      expect(link).toHaveAttribute('href', item.link);
      if (mailto) {
        expect(link).not.toHaveAttribute('target');
      } else {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link.getAttribute('rel')).toContain('noopener');
      }
    }
  });

  // The link named X drew the Twitter bird for years after the rename.
  it('draws the X mark for X', () => {
    render(<ContactIcons />);

    const x = screen.getByRole('link', { name: 'X (opens in a new tab)' });

    expect(x.querySelector('svg')).toHaveAttribute('data-icon', 'x-twitter');
  });

  it('leaves out a destination that has no mark instead of an empty target', () => {
    render(<ContactIcons />);

    expect(marked.length).toBeLessThan(contact.length);
    expect(screen.getAllByRole('link')).toHaveLength(marked.length);
    expect(
      screen.queryByRole('link', { name: /unmarked/i }),
    ).not.toBeInTheDocument();
    for (const link of screen.getAllByRole('link')) {
      expect(link.querySelector('svg')).toBeInTheDocument();
      expect(link).not.toHaveAttribute('href', 'https://unmarked.example/me');
    }
  });

  it('can omit email when the page already has a primary email action', () => {
    render(<ContactIcons includeEmail={false} />);

    expect(
      screen.queryByRole('link', { name: /email/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(
      marked.filter((item) => !isMailto(item.link)).length,
    );
  });
});
