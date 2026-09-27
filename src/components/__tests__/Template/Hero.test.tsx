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
    expect(heading).toHaveTextContent('V Sri Charan Reddy');
  });

  it('describes the current work at Nutanix', () => {
    const { container } = render(<Hero />);

    const nutanixLink = screen.getByRole('link', { name: /nutanix/i });
    expect(nutanixLink).toHaveAttribute('href', 'https://www.nutanix.com');
    expect(nutanixLink).toHaveAttribute('target', '_blank');
    expect(nutanixLink).toHaveClass('hero-highlight');

    const dataPathLink = screen.getByRole('link', { name: /core data path/i });
    expect(dataPathLink).toHaveAttribute(
      'href',
      'https://www.nutanix.com/products/cloud-platform',
    );
    expect(dataPathLink).toHaveClass('hero-highlight');

    expect(container.querySelector('.hero-tagline')).toHaveTextContent(
      "I'm a Member of Technical Staff at Nutanix, working on Core Data Path. I build petabyte-scale storage control planes and high-concurrency systems in C++ and gRPC.",
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
    expect(aboutButton).not.toHaveAttribute('target');
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
