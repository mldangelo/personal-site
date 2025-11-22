import { render, screen } from '@testing-library/react';
import React from 'react';

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

  it('renders project title with link', () => {
    render(<Cell data={mockProject} />);
    const titleLink = screen.getByRole('link', { name: mockProject.title });
    expect(titleLink).toHaveAttribute('href', mockProject.link);
  });

  it('renders project description', () => {
    render(<Cell data={mockProject} />);
    expect(screen.getByText(mockProject.desc)).toBeInTheDocument();
  });

  it('renders project date in correct format', () => {
    render(<Cell data={mockProject} />);
    expect(screen.getByText('January, 2023')).toBeInTheDocument();
  });

  it('renders project image with alt text', () => {
    render(<Cell data={mockProject} />);
    const image = screen.getByAltText(
      `${mockProject.title} project screenshot`,
    );
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('test.jpg'));
  });

  it('renders image link with descriptive aria-label', () => {
    render(<Cell data={mockProject} />);
    const imageLink = screen.getByRole('link', {
      name: `View ${mockProject.title} project`,
    });
    expect(imageLink).toHaveAttribute('href', mockProject.link);
    expect(imageLink).toHaveClass('image');
  });
});
