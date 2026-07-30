import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Project } from '@/data/projects';
import Cell from '../../Projects/Cell';
import { NEW_TAB_SUFFIX, NO_LINK_LABEL } from '../../Projects/shared';

describe('Cell', () => {
  const mockProject: Project = {
    title: 'Test Project',
    subtitle: 'A test subtitle',
    image: '/images/test.jpg',
    date: '2023-01-01',
    desc: 'This is a test project description',
    link: 'https://example.com',
    status: 'archive',
  };

  it('renders project as a clickable card with link', () => {
    render(<Cell data={mockProject} />);
    const link = screen.getByRole('link', {
      name: `${mockProject.title} ${NEW_TAB_SUFFIX}`,
    });
    expect(link).toHaveAttribute('href', mockProject.link);
    expect(link).toHaveClass('project-card-link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(
      document.querySelector('.project-card-affordance'),
    ).toHaveTextContent('↗');
  });

  it('renders project description', () => {
    render(<Cell data={mockProject} />);
    expect(screen.getByText(mockProject.desc)).toBeInTheDocument();
  });

  /**
   * Year precision made every archive card read "2015", which is what hid the
   * fact that these are four separate weekends.
   */
  it('renders the month, not just the year', () => {
    render(<Cell data={mockProject} />);

    const date = document.querySelector('.project-dates');
    expect(date).toHaveTextContent('Jan 2023');
    expect(date?.querySelector('time')).toHaveAttribute(
      'datetime',
      '2023-01-01',
    );
  });

  it('renders a closed range when the work ended', () => {
    render(<Cell data={{ ...mockProject, endDate: '2024-06-01' }} />);

    const date = document.querySelector('.project-dates');
    expect(date).toHaveTextContent('Jan 2023');
    expect(date).toHaveTextContent('Jun 2024');
    expect(date?.querySelector('.daterange-present')).not.toBeInTheDocument();
  });

  it('treats the thumbnail as decorative beside its matching heading', () => {
    render(<Cell data={mockProject} />);
    const image = document.querySelector('.project-card-image img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', '');
    expect(image).toHaveAttribute('src', expect.stringContaining('test.jpg'));
  });

  /** No screenshot means no frame — never a broken or invented one. */
  it('drops the image frame entirely when there is no image', () => {
    render(<Cell data={{ ...mockProject, image: undefined }} />);

    expect(document.querySelector('img')).not.toBeInTheDocument();
    expect(
      document.querySelector('.project-card-image'),
    ).not.toBeInTheDocument();
    expect(document.querySelector('.project-card--text')).toBeInTheDocument();
    expect(screen.getByText(mockProject.desc)).toBeInTheDocument();
  });

  it('does not imply that a static archive card is clickable', () => {
    render(<Cell data={{ ...mockProject, link: undefined }} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(document.querySelector('.project-card--static')).toBeInTheDocument();
    expect(
      document.querySelector('.project-card-affordance'),
    ).not.toBeInTheDocument();
    // Says why there is nothing to click, rather than looking broken.
    expect(screen.getByText(NO_LINK_LABEL)).toBeInTheDocument();
  });
});
