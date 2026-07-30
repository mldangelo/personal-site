import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Category, Skill } from '@/data/resume/skills';

import Skills from '../../Resume/Skills';

const mockCategories: Category[] = [
  { name: 'Agent Systems' },
  { name: 'AI Security & Evals' },
  { name: 'ML Systems' },
  { name: 'Software & Infrastructure' },
];

const mockSkills: Skill[] = [
  { title: 'Coding Agents', category: 'Agent Systems' },
  { title: 'Context Engineering', category: 'Agent Systems' },
  { title: 'Threat Modeling', category: 'AI Security & Evals' },
  { title: 'Computer Vision', category: 'ML Systems' },
  { title: 'Python', category: 'Software & Infrastructure' },
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

  it('renders category filter buttons in the supplied order', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.map((button) => button.textContent)).toEqual([
      'All',
      'Agent Systems',
      'AI Security & Evals',
      'ML Systems',
      'Software & Infrastructure',
    ]);
  });

  it('shows every skill exactly once by default', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    for (const skill of mockSkills) {
      expect(screen.getAllByText(skill.title)).toHaveLength(1);
    }
  });

  it('filters skills when a category button is clicked', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    fireEvent.click(screen.getByRole('button', { name: 'Agent Systems' }));

    expect(isShown(screen.getByText('Coding Agents'))).toBe(true);
    expect(isShown(screen.getByText('Context Engineering'))).toBe(true);
    expect(isShown(screen.getByText('Threat Modeling'))).toBe(false);
  });

  it('keeps filtered-out groups in the DOM so they can still be printed', () => {
    const { container } = render(
      <Skills skills={mockSkills} categories={mockCategories} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Agent Systems' }));

    // print.css un-hides these; removing them from the DOM would mean a
    // printed resume silently reflected whatever filter was selected.
    expect(container.querySelectorAll('.skill-group')).toHaveLength(
      mockCategories.length,
    );
    expect(container.querySelectorAll('.skill-group[hidden]')).toHaveLength(
      mockCategories.length - 1,
    );
    expect(container.querySelectorAll('.skill-tag')).toHaveLength(
      mockSkills.length,
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
    fireEvent.click(screen.getByRole('button', { name: 'Agent Systems' }));
    fireEvent.click(allButton);

    expect(allButton).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByRole('button', { name: 'Agent Systems' }),
    ).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows all skills when clicking the active category again', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    const agentButton = screen.getByRole('button', { name: 'Agent Systems' });
    fireEvent.click(agentButton);
    fireEvent.click(agentButton);

    expect(isShown(screen.getByText('Threat Modeling'))).toBe(true);
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('sets aria-pressed on the active category button', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    const agentButton = screen.getByRole('button', { name: 'Agent Systems' });
    expect(agentButton).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(agentButton);
    expect(agentButton).toHaveAttribute('aria-pressed', 'true');
  });

  /**
   * Authored order is the only hierarchy the section has now, so nothing may
   * sort it. It used to be sorted by a 1–5 self-score.
   */
  it('preserves the authored skill order within a category', () => {
    const { container } = render(
      <Skills skills={mockSkills} categories={mockCategories} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Agent Systems' }));

    const visibleGroup = container.querySelector('.skill-group:not([hidden])');
    const skillNames = Array.from(
      visibleGroup?.querySelectorAll('.skill-tag') ?? [],
    ).map((el) => el.textContent);

    expect(skillNames).toEqual(['Coding Agents', 'Context Engineering']);
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

      fireEvent.click(screen.getByRole('button', { name: 'Agent Systems' }));

      expect(screen.getByRole('status')).toHaveTextContent(
        'Showing 2 of 5 skills in Agent Systems.',
      );
    });

    it('counts the tags it actually rendered', () => {
      render(<Skills skills={mockSkills} categories={mockCategories} />);

      expect(document.querySelectorAll('.skill-tag')).toHaveLength(5);
      expect(screen.getByRole('status')).toHaveTextContent('all 5 skills');
    });

    it('returns to the full set when the filter is toggled off', () => {
      render(<Skills skills={mockSkills} categories={mockCategories} />);

      const agents = screen.getByRole('button', { name: 'Agent Systems' });
      fireEvent.click(agents);
      fireEvent.click(agents);

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
          skills={[{ title: 'Python', category: 'Software & Infrastructure' }]}
          categories={[{ name: 'Software & Infrastructure' }]}
        />,
      );

      expect(screen.getByRole('status')).toHaveTextContent(
        'Showing all 1 skill.',
      );
    });
  });
});
