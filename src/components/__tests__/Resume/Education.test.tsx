import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Education from '../../Resume/Education';
import Degree from '../../Resume/Education/Degree';

const mockDegrees = [
  {
    school: 'Stanford University',
    degree: 'M.S. Computer Science',
    link: 'https://stanford.edu',
    year: 2020,
  },
  {
    school: 'MIT',
    degree: 'B.S. Computer Science',
    link: 'https://mit.edu',
    year: 2016,
  },
];

describe('Education', () => {
  it('opens with the shared section heading, in sentence case', () => {
    render(<Education data={mockDegrees} />);

    const heading = screen.getByRole('heading', {
      level: 2,
      name: 'Education',
    });
    expect(heading).toHaveClass('section-heading');
    expect(heading.parentElement).toHaveClass('section-header');
  });

  it('renders all degrees', () => {
    render(<Education data={mockDegrees} />);

    expect(screen.getByText('M.S. Computer Science')).toBeInTheDocument();
    expect(screen.getByText('B.S. Computer Science')).toBeInTheDocument();
  });

  it('renders school links', () => {
    render(<Education data={mockDegrees} />);

    const stanfordLink = screen.getByRole('link', { name: /stanford/i });
    expect(stanfordLink).toHaveAttribute('href', 'https://stanford.edu');

    const mitLink = screen.getByRole('link', { name: /mit/i });
    expect(mitLink).toHaveAttribute('href', 'https://mit.edu');
  });
});

describe('Degree', () => {
  const mockDegree = {
    school: 'Stanford University',
    degree: 'M.S. Computer Science',
    link: 'https://stanford.edu',
    year: 2020,
  };

  it('renders degree title', () => {
    render(<Degree data={mockDegree} />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'M.S. Computer Science',
    );
  });

  it('renders school name with link', () => {
    render(<Degree data={mockDegree} />);

    const link = screen.getByRole('link', { name: /stanford/i });
    expect(link).toHaveAttribute('href', 'https://stanford.edu');
  });

  it('displays year', () => {
    render(<Degree data={mockDegree} />);

    expect(screen.getByText(/2020/)).toBeInTheDocument();
  });

  it('sets the school and the year on one line under the degree', () => {
    render(<Degree data={mockDegree} />);

    const line = document.querySelector('.degree + .school') as HTMLElement;

    expect(line.textContent).toBe('Stanford University, 2020');
    expect(line.querySelector('time')).toHaveAttribute('datetime', '2020');
  });

  it('sets typographic quotes in the degree and the school', () => {
    render(
      <Degree
        data={{
          ...mockDegree,
          degree: "Master's in Computer Science",
          school: "Queen's University",
        }}
      />,
    );

    expect(document.querySelector('.degree')?.textContent).toBe(
      'Master’s in Computer Science',
    );
    expect(document.querySelector('.school a')?.textContent).toBe(
      'Queen’s University',
    );
  });

  it('renders as article element', () => {
    render(<Degree data={mockDegree} />);

    const article = document.querySelector('article.degree-container');
    expect(article).toBeInTheDocument();
  });
});
