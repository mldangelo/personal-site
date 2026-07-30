import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Skills from '../../Resume/Skills';

const mockCategories = [
  { name: 'Languages' },
  { name: 'ML Engineering' },
  { name: 'Web Development' },
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

/**
 * Filtering hides groups rather than unmounting them, so presence in the DOM
 * no longer implies visibility. jsdom here has no `checkVisibility`, so this
 * walks for a `hidden` ancestor instead.
 */
function isShown(el: HTMLElement) {
  return el.closest('[hidden]') === null;
}

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

    fireEvent.click(screen.getByRole('button', { name: 'ML Engineering' }));

    // Groups stay in the DOM and are hidden, so assert on visibility.
    expect(screen.getAllByText('Python').some(isShown)).toBe(true);
    expect(isShown(screen.getByText('PyTorch'))).toBe(true);
    expect(screen.getAllByText('React').some(isShown)).toBe(false);
  });

  it('keeps filtered-out groups in the DOM so they can still be printed', () => {
    const { container } = render(
      <Skills skills={mockSkills} categories={mockCategories} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'ML Engineering' }));

    // print.css un-hides these; removing them from the DOM would mean a
    // printed resume silently reflected whatever filter was selected.
    expect(container.querySelectorAll('.skill-group')).toHaveLength(
      mockCategories.length,
    );
    expect(container.querySelectorAll('.skill-group[hidden]')).toHaveLength(
      mockCategories.length - 1,
    );
  });

  it('marks All as pressed on first paint, when everything is showing', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('keeps All pressed after it is clicked', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    const allButton = screen.getByRole('button', { name: 'All' });
    fireEvent.click(screen.getByRole('button', { name: 'Languages' }));
    fireEvent.click(allButton);

    expect(allButton).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Languages' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('shows all skills when clicking category again (toggle off)', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    const mlButton = screen.getByRole('button', { name: 'ML Engineering' });
    fireEvent.click(mlButton);
    fireEvent.click(mlButton);

    expect(screen.getAllByText('React').some(isShown)).toBe(true);
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
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

  it('explains competency tiers once instead of repeating them visibly on every tag', () => {
    const { container } = render(
      <Skills skills={mockSkills} categories={mockCategories} />,
    );

    expect(container.querySelectorAll('.skill-tier-legend')).toHaveLength(1);
    expect(container.querySelector('.skill-tier-legend')).toHaveTextContent(
      /Levels\s*Core\s*·\s*Working\s*·\s*Familiar/,
    );
    expect(container.querySelectorAll('.skill-tag-tier')).toHaveLength(0);
  });

  /**
   * Clicking a filter used to change most of the section with no announcement
   * of any kind — `aria-pressed` reports the control, not the outcome — and
   * there was no live region anywhere on the resume.
   */
  describe('filter status', () => {
    it('reports the full set on first paint', () => {
      render(<Skills skills={mockSkills} categories={mockCategories} />);

      expect(screen.getByRole('status')).toHaveTextContent(
        'Showing all 5 skills.',
      );
    });

    it('announces the result of filtering, not the state of the button', () => {
      render(<Skills skills={mockSkills} categories={mockCategories} />);

      fireEvent.click(screen.getByRole('button', { name: 'Languages' }));

      expect(screen.getByRole('status')).toHaveTextContent(
        'Showing 3 of 5 skills in Languages.',
      );
    });

    it('counts a skill in two categories once', () => {
      render(<Skills skills={mockSkills} categories={mockCategories} />);

      // Python, TypeScript and JavaScript each render in two groups.
      expect(document.querySelectorAll('.skill-tag')).toHaveLength(8);
      expect(screen.getByRole('status')).toHaveTextContent('all 5 skills');
    });

    it('returns to the full set when the filter is toggled off', () => {
      render(<Skills skills={mockSkills} categories={mockCategories} />);

      const languages = screen.getByRole('button', { name: 'Languages' });
      fireEvent.click(languages);
      fireEvent.click(languages);

      expect(screen.getByRole('status')).toHaveTextContent(
        'Showing all 5 skills.',
      );
    });

    it('is polite so it never interrupts', () => {
      render(<Skills skills={mockSkills} categories={mockCategories} />);

      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    });

    /**
     * Printing shows every group regardless of the filter, so a visible count
     * would contradict the paper it is printed on.
     */
    it('is not visible on the page', () => {
      render(<Skills skills={mockSkills} categories={mockCategories} />);

      expect(screen.getByRole('status')).toHaveClass('sr-only');
    });

    it('keeps the noun singular for a one-skill set', () => {
      render(
        <Skills
          skills={[{ title: 'Python', competency: 5, category: ['Languages'] }]}
          categories={[{ name: 'Languages' }]}
        />,
      );

      expect(screen.getByRole('status')).toHaveTextContent(
        'Showing all 1 skill.',
      );
    });
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
