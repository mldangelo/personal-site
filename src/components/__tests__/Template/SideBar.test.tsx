import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import profile from '@/data/profile';

import SideBar from '../../Template/SideBar';

const mockPathname = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

describe('SideBar', () => {
  beforeEach(() => {
    mockPathname.mockReturnValue('/');
  });

  it('renders the sidebar section', () => {
    render(<SideBar />);

    const sidebar = document.querySelector('.site-sidebar');
    expect(sidebar).toBeInTheDocument();
  });

  it('displays the name', () => {
    render(<SideBar />);

    expect(screen.getByText(profile.name)).toBeInTheDocument();
  });

  it('displays email link', () => {
    render(<SideBar />);

    const emailLink = screen.getByRole('link', {
      name: new RegExp(profile.email.replace(/\./g, '\\.')),
    });
    expect(emailLink).toHaveAttribute('href', `mailto:${profile.email}`);
  });

  it('renders about section with bio', () => {
    render(<SideBar />);

    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByText(/Stanford ICME/)).toBeInTheDocument();
  });

  it('renders bio with company links', () => {
    render(<SideBar />);

    expect(screen.getByRole('link', { name: /promptfoo/i })).toHaveAttribute(
      'href',
      'https://promptfoo.dev',
    );
    expect(screen.getByRole('link', { name: /smileid/i })).toHaveAttribute(
      'href',
      'https://usesmileid.com',
    );
    expect(screen.getByRole('link', { name: /arthena/i })).toHaveAttribute(
      'href',
      'https://arthena.com',
    );
  });

  it('shows Learn More button when not on resume page', () => {
    mockPathname.mockReturnValue('/about');
    render(<SideBar />);

    expect(screen.getByRole('link', { name: /learn more/i })).toHaveAttribute(
      'href',
      '/resume',
    );
  });

  it('shows About Me button when on resume page', () => {
    mockPathname.mockReturnValue('/resume');
    render(<SideBar />);

    expect(screen.getByRole('link', { name: /about me/i })).toHaveAttribute(
      'href',
      '/about',
    );
  });

  it('renders contact icons', () => {
    render(<SideBar />);

    const footer = document.querySelector('.site-footer');
    expect(footer).toBeInTheDocument();
  });

  it('renders copyright notice', () => {
    render(<SideBar />);

    expect(
      screen.getByText(new RegExp(`© ${profile.name}`)),
    ).toBeInTheDocument();
  });

  it('has logo link to home', () => {
    render(<SideBar />);

    const logoLink = document.querySelector('.logo');
    expect(logoLink).toHaveAttribute('href', '/');
  });
});
