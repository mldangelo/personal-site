import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import routes from '@/data/routes';
import HomePage from '../page';
import ProjectsPage from '../projects/page';
import ResumePage from '../resume/page';

describe('retired writing information architecture', () => {
  it('removes Writing from the site routes', () => {
    expect(routes.map(({ label }) => label)).not.toContain('Writing');
  });

  it('does not promote latest writing on the homepage', () => {
    const { container } = render(<HomePage />);

    expect(container.textContent).not.toContain('Latest writing');
  });
});

describe('professional content information architecture', () => {
  it('points the homepage About Me CTA to the canonical About page', () => {
    render(<HomePage />);

    expect(screen.getByRole('link', { name: /about me/i })).toHaveAttribute(
      'href',
      'https://pavankalyandosa.com/about/',
    );
  });

  it('does not ship retired Stats page styles', () => {
    const contentStyles = readFileSync(
      join(process.cwd(), 'app/styles/pages/content.css'),
      'utf8',
    );
    const printStyles = readFileSync(
      join(process.cwd(), 'app/styles/print.css'),
      'utf8',
    );

    expect(contentStyles).not.toMatch(/STATS PAGE|stat-table/);
    expect(printStyles).not.toContain('.stats-title');
  });

  it('keeps inherited courses and references out of the resume navigation', () => {
    render(<ResumePage />);

    expect(
      screen.queryByRole('link', { name: /courses/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /references/i }),
    ).not.toBeInTheDocument();
  });

  it('points project visitors to Pavan’s GitHub profile', () => {
    render(<ProjectsPage />);

    expect(
      screen.getByRole('link', { name: /view github profile/i }),
    ).toHaveAttribute('href', 'https://github.com/PavankalyanDosa');
  });
});
