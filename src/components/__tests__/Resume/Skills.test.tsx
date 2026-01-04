import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Skills from '../../Resume/Skills';

const mockCategories = [
  { name: 'Languages', color: '#6968b3', textColor: 'light' as const },
  { name: 'ML Engineering', color: '#37b1f5', textColor: 'dark' as const },
  { name: 'Web Development', color: '#40494e', textColor: 'light' as const },
];

const mockSkills = [
  { title: 'Python', competency: 5, category: ['Languages', 'ML Engineering'] },
  {
    title: 'TypeScript',
    competency: 5,
    category: ['Languages', 'Web Development'],
  },
  {
    title: 'JavaScript',
    competency: 4,
    category: ['Languages', 'Web Development'],
  },
  { title: 'PyTorch', competency: 4, category: ['ML Engineering'] },
  { title: 'React', competency: 3, category: ['Web Development'] },
];

describe('Skills', () => {
  it('renders the skills section with title', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    expect(
      screen.getByRole('heading', { name: /skills/i }),
    ).toBeInTheDocument();
  });

  it('renders category filter buttons including All', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Languages' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'ML Engineering' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Web Development' }),
    ).toBeInTheDocument();
  });

  it('shows all skills by default', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    // Skills may appear in multiple groups if they belong to multiple categories
    expect(screen.getAllByText('Python').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('TypeScript').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('JavaScript').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('PyTorch').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('React').length).toBeGreaterThanOrEqual(1);
  });

  it('filters skills when category button is clicked', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    const mlButton = screen.getByRole('button', { name: 'ML Engineering' });
    fireEvent.click(mlButton);

    // Should show ML Engineering skills
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('PyTorch')).toBeInTheDocument();

    // Should not show non-ML skills
    expect(screen.queryByText('React')).not.toBeInTheDocument();
  });

  it('shows all skills when clicking category again (toggle off)', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    const mlButton = screen.getByRole('button', { name: 'ML Engineering' });
    fireEvent.click(mlButton);
    fireEvent.click(mlButton);

    // All skills should be visible again (may appear in multiple groups)
    expect(screen.getAllByText('Python').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('React').length).toBeGreaterThanOrEqual(1);
  });

  it('sets aria-pressed on active category button', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    const languagesButton = screen.getByRole('button', { name: 'Languages' });
    expect(languagesButton).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(languagesButton);
    expect(languagesButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('displays skills grouped by category', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    // Should have group titles
    const groupTitles = document.querySelectorAll('.skill-group-title');
    expect(groupTitles.length).toBeGreaterThan(0);
  });

  it('sorts skills by competency (highest first)', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    // Filter to Languages to check sorting
    fireEvent.click(screen.getByRole('button', { name: 'Languages' }));

    const skillTags = document.querySelectorAll('.skill-tag-name');
    const skillNames = Array.from(skillTags).map((el) => el.textContent);

    // Python (5) and TypeScript (5) should come before JavaScript (4)
    const jsIndex = skillNames.indexOf('JavaScript');
    const pythonIndex = skillNames.indexOf('Python');
    expect(pythonIndex).toBeLessThan(jsIndex);
  });
});
