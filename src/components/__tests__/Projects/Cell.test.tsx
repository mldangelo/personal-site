import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Cell from '../../Projects/Cell';

describe('Cell', () => {
  const mockProject = {
    title: 'Test Project',
    subtitle: 'A test subtitle',
    image: '/images/test.jpg',
    date: '2023-01-01',
    desc: 'This is a test project description',
    link: 'https://example.com',
  };

  it('renders project as a clickable card with link', () => {
    render(<Cell data={mockProject} />);
    const link = screen.getByRole('link', { name: mockProject.title });
    expect(link).toHaveAttribute('href', mockProject.link);
    expect(link).toHaveClass('project-card-link');
  });

  it('renders project description', () => {
    render(<Cell data={mockProject} />);
    expect(screen.getByText(mockProject.desc)).toBeInTheDocument();
  });

  it('renders project date in correct format', () => {
    render(<Cell data={mockProject} />);
    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  it('treats the thumbnail as decorative beside its matching heading', () => {
    render(<Cell data={mockProject} />);
    const image = document.querySelector('.project-card-image img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', '');
    expect(image).toHaveAttribute('src', expect.stringContaining('test.jpg'));
  });
});
