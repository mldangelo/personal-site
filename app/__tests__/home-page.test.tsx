import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import HomePage from '../page';

vi.mock('@/lib/writing', () => ({
  getWritingItems: () => [
    {
      title: 'Local essay',
      url: '/writing/local/',
      date: '2026-07-30',
      description: '',
      isExternal: false,
      source: 'On this site',
    },
    {
      title: 'Remote article',
      url: 'https://example.com/',
      date: '2026-03-10',
      description: '',
      isExternal: true,
      source: 'Elsewhere',
    },
  ],
}));

// ↗ means a link leaves the site in a new tab; on-site links carry → or nothing.
describe('homepage arrows', () => {
  it('follow the destination', () => {
    render(<HomePage />);
    const text = (name: RegExp) =>
      screen.getByRole('link', { name }).textContent;

    expect(text(/About me/)).toBe('About me');
    expect(text(/All writing/)).toBe('All writing →');
    expect(text(/Local essay/)).toMatch(/→$/);
    expect(text(/Remote article/)).toMatch(/↗ \(opens in a new tab\)$/);
  });
});
