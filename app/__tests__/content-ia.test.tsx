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
