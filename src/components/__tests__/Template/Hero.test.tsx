import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Hero from '../../Template/Hero';

describe('Hero', () => {
  it('renders the hero section', () => {
    render(<Hero />);
    const heroSection = document.querySelector('.hero');
    expect(heroSection).toBeInTheDocument();
  });

  it('displays the name as heading', () => {
    render(<Hero />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent("Michael D'Angelo");
  });

  it('renders the tagline with links', () => {
    render(<Hero />);
    expect(screen.getByRole('link', { name: /openai/i })).toHaveAttribute(
      'href',
      'https://openai.com',
    );
    expect(screen.getByRole('link', { name: /promptfoo/i })).toHaveAttribute(
      'href',
      'https://promptfoo.dev',
    );
  });
});
