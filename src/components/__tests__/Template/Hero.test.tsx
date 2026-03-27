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

  it('renders the tagline with OpenAI and promptfoo links', () => {
    render(<Hero />);

    const openAiLink = screen.getByRole('link', { name: /openai/i });
    expect(openAiLink).toHaveAttribute('href', 'https://openai.com');
    expect(openAiLink).toHaveClass('hero-highlight');

    const promptfooLink = screen.getByRole('link', { name: /promptfoo/i });
    expect(promptfooLink).toHaveAttribute('href', 'https://promptfoo.dev');
    expect(promptfooLink).toHaveClass('hero-highlight');
  });

  it('renders CTA buttons with correct links', () => {
    render(<Hero />);

    const aboutButton = screen.getByRole('link', { name: /about me/i });
    expect(aboutButton).toHaveAttribute('href', '/about');
    expect(aboutButton).toHaveClass('button-primary');

    const resumeButton = screen.getByRole('link', { name: /view resume/i });
    expect(resumeButton).toHaveAttribute('href', '/resume');
    expect(resumeButton).toHaveClass('button-secondary');
  });
});
