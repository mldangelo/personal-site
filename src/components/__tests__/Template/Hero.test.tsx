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

  it('describes the current work and Promptfoo joining OpenAI', () => {
    const { container } = render(<Hero />);

    const openAiLink = screen.getByRole('link', { name: /openai/i });
    expect(openAiLink).toHaveAttribute('href', 'https://openai.com');
    expect(openAiLink).toHaveClass('hero-highlight');

    const promptfooLink = screen.getByRole('link', { name: /promptfoo/i });
    expect(promptfooLink).toHaveAttribute('href', 'https://promptfoo.dev');
    expect(promptfooLink).toHaveClass('hero-highlight');

    const codexSecurityLink = screen.getByRole('link', {
      name: 'Codex Security',
    });
    expect(codexSecurityLink).toHaveAttribute(
      'href',
      'https://openai.com/index/codex-security-now-in-research-preview/',
    );
    expect(codexSecurityLink).toHaveClass('hero-highlight');

    expect(container.querySelector('.hero-tagline')).toHaveTextContent(
      "I'm a Member of the Technical Staff at OpenAI, working on Promptfoo and Codex Security. I help secure AI systems and use AI to find software vulnerabilities. I co-founded Promptfoo before it joined OpenAI in 2026.",
    );
  });

  it('keeps personal stats and incomplete credential lists off the homepage', () => {
    const { container } = render(<Hero />);

    expect(container.querySelector('.telemetry')).not.toBeInTheDocument();
    expect(container.querySelector('.hero-chips')).not.toBeInTheDocument();
    expect(screen.queryByText('Countries visited')).not.toBeInTheDocument();
    expect(screen.queryByText('Computing since')).not.toBeInTheDocument();
    expect(screen.queryByText('Based in')).not.toBeInTheDocument();
    expect(screen.queryByText('YC Alum')).not.toBeInTheDocument();
    expect(screen.queryByText('Stanford ICME')).not.toBeInTheDocument();
  });

  it('renders one primary CTA and one quieter resume link', () => {
    render(<Hero />);

    const aboutButton = screen.getByRole('link', { name: /about me/i });
    expect(aboutButton).toHaveAttribute('href', '/about');
    expect(aboutButton).toHaveClass('button');

    const resumeButton = screen.getByRole('link', { name: /view resume/i });
    expect(resumeButton).toHaveAttribute('href', '/resume');
    expect(resumeButton).toHaveClass('hero-resume-link');
    expect(resumeButton).not.toHaveClass('button');
  });

  it('has decorative background elements', () => {
    render(<Hero />);

    const bg = document.querySelector('.hero-bg');
    expect(bg).toBeInTheDocument();
    expect(bg).toHaveAttribute('aria-hidden', 'true');
  });
});
