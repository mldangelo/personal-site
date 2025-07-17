import React from 'react';

import { render, screen } from '@testing-library/react';

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
    const titleLinks = screen.getAllByRole('link', { name: mockProject.title });
    expect(titleLinks).toHaveLength(2); // Title link and image link
    expect(titleLinks[0]).toHaveAttribute('href', mockProject.link);
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
    const image = screen.getByAltText(mockProject.title);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('test.jpg'));
  });
});
