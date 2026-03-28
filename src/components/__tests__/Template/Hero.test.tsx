import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Hero from '../../Template/Hero';

describe('Hero', () => {
  it('renders the hero section', () => {
    render(<Hero />);
    expect(document.querySelector('.hero')).toBeInTheDocument();
  });

  it('displays the name', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      "Michael D'Angelo",
    );
  });

  it('renders avatar', () => {
    render(<Hero />);
    expect(document.querySelector('.hero-avatar')).toBeInTheDocument();
  });

  it('renders links', () => {
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
