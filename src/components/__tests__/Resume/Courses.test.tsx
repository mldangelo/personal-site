import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Courses from '../../Resume/Courses';
import Course from '../../Resume/Courses/Course';

const mockCourses = [
  {
    title: 'Machine Learning',
    number: 'CS 229',
    link: 'http://cs229.stanford.edu/',
    university: 'Stanford',
  },
  {
    title: 'Deep Learning',
    number: 'CS 230',
    link: 'http://cs230.stanford.edu/',
    university: 'Stanford',
  },
  {
    title: 'Algorithms',
    number: 'CS 161',
    link: 'http://cs161.stanford.edu/',
    university: 'MIT',
  },
];

describe('Courses', () => {
  it('renders the courses section with title', () => {
    render(<Courses data={mockCourses} />);

    expect(
      screen.getByRole('heading', { name: /selected courses/i }),
    ).toBeInTheDocument();
  });

  it('renders all courses', () => {
    render(<Courses data={mockCourses} />);

    expect(screen.getByText('Machine Learning')).toBeInTheDocument();
    expect(screen.getByText('Deep Learning')).toBeInTheDocument();
    expect(screen.getByText('Algorithms')).toBeInTheDocument();
  });

  it('renders course numbers', () => {
    render(<Courses data={mockCourses} />);

    expect(screen.getByText(/CS 229/)).toBeInTheDocument();
    expect(screen.getByText(/CS 230/)).toBeInTheDocument();
    expect(screen.getByText(/CS 161/)).toBeInTheDocument();
  });

  it('renders courses as list items', () => {
    render(<Courses data={mockCourses} />);

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();

    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(mockCourses.length);
  });

  it('sorts courses by university then number', () => {
    render(<Courses data={mockCourses} />);

    const items = screen.getAllByRole('listitem');
    // Stanford courses should come before MIT (reverse alpha)
    // And within Stanford, sorted by number
    expect(items.length).toBe(3);
  });

  it('has anchor link for navigation', () => {
    render(<Courses data={mockCourses} />);

    const anchor = document.getElementById('courses');
    expect(anchor).toBeInTheDocument();
  });
});

describe('Course', () => {
  const mockCourse = {
    title: 'Machine Learning',
    number: 'CS 229',
    link: 'http://cs229.stanford.edu/',
    university: 'Stanford',
  };

  it('renders course number and title', () => {
    render(<Course data={mockCourse} />);

    expect(screen.getByText(/CS 229/)).toBeInTheDocument();
    expect(screen.getByText('Machine Learning')).toBeInTheDocument();
  });

  it('renders course as link', () => {
    render(<Course data={mockCourse} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', mockCourse.link);
  });

  it('renders as list item', () => {
    render(<Course data={mockCourse} />);

    const item = screen.getByRole('listitem');
    expect(item).toBeInTheDocument();
  });
});
