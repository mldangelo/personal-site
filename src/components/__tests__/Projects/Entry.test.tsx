import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Project } from '@/data/projects';
import Entry from '../../Projects/Entry';
import { NEW_TAB_SUFFIX, NO_LINK_LABEL } from '../../Projects/shared';

const base: Project = {
  title: 'Test Platform',
  subtitle: 'Co-founder & CTO',
  link: 'https://example.com',
  date: '2024-07-01',
  desc: 'A description of the shipped work.',
  tech: ['TypeScript', 'AWS Lambda'],
  status: 'shipped',
};

describe('Entry', () => {
  it('renders the whole row as one outbound link', () => {
    render(<Entry data={base} />);

    const link = screen.getByRole('link', {
      name: `${base.title} ${NEW_TAB_SUFFIX}`,
    });
    expect(link).toHaveAttribute('href', base.link);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveClass('project-entry--linked');
    expect(link.querySelector('.project-entry-external')).toHaveTextContent(
      '↗',
    );
  });

  /** No screenshots exist for this work; the row must not want one. */
  it('renders no image', () => {
    render(<Entry data={base} />);

    expect(document.querySelector('img')).not.toBeInTheDocument();
  });

  it('renders the title, role, description, and tech', () => {
    render(<Entry data={base} />);

    expect(
      screen.getByRole('heading', { level: 3, name: /Test Platform/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(base.subtitle as string)).toBeInTheDocument();
    expect(screen.getByText(base.desc)).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('AWS Lambda')).toBeInTheDocument();
  });

  /** Amber is reserved for a value that is live. */
  it('marks live work as present and gives it the size step', () => {
    render(<Entry data={{ ...base, ongoing: true }} />);

    const dates = document.querySelector('.project-dates');
    expect(dates).toHaveTextContent('Jul 2024');
    expect(dates?.querySelector('.daterange-present')).toHaveTextContent(
      'Present',
    );
    expect(document.querySelector('.project-entry--live')).toBeInTheDocument();
  });

  it('renders a closed range and no live styling once work has ended', () => {
    render(<Entry data={{ ...base, endDate: '2026-03-09' }} />);

    const dates = document.querySelector('.project-dates');
    expect(dates).toHaveTextContent('Jul 2024');
    expect(dates).toHaveTextContent('Mar 2026');
    expect(dates?.querySelector('.daterange-present')).not.toBeInTheDocument();
    expect(
      document.querySelector('.project-entry--live'),
    ).not.toBeInTheDocument();
  });

  it('speaks the range rather than running the two dates together', () => {
    render(<Entry data={{ ...base, endDate: '2026-03-09' }} />);

    expect(screen.getByText('to')).toHaveClass('sr-only');
    expect(document.querySelector('.daterange-sep')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('renders an entry with no destination as inert and says so', () => {
    render(<Entry data={{ ...base, link: undefined }} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(
      document.querySelector('.project-entry--static'),
    ).toBeInTheDocument();
    expect(
      document.querySelector('.project-entry-external'),
    ).not.toBeInTheDocument();
    expect(screen.getByText(NO_LINK_LABEL)).toBeInTheDocument();
  });
});
