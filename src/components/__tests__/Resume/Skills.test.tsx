import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { categories, skills } from '@/data/resume/skills';
import { buildJsonResume } from '@/lib/resumeJson';

import Skills from '../../Resume/Skills';

const mockCategories = [
  { name: 'Languages' },
  { name: 'ML Engineering' },
  { name: 'Web Development' },
];

// Deliberately out of order, so a list that merely echoed its input would
// not pass for one that sorts.
const mockSkills = [
  { title: 'React', competency: 3, category: ['Web Development'] },
  {
    title: 'JavaScript',
    competency: 4,
    category: ['Languages', 'Web Development'],
  },
  { title: 'PyTorch', competency: 4, category: ['ML Engineering'] },
  {
    title: 'TypeScript',
    competency: 5,
    category: ['Languages', 'Web Development'],
  },
  { title: 'Python', competency: 5, category: ['Languages', 'ML Engineering'] },
];

/**
 * Each group as a sighted reader meets it: its heading, then its skills in
 * order. A tag's own text is its name; the tier beside it is visually hidden.
 */
function groupsIn(container: HTMLElement) {
  return [...container.querySelectorAll('.skill-group')].map((group) => ({
    name: group.querySelector('h3')?.textContent,
    skills: [...group.querySelectorAll('.skill-tag')].map(
      (tag) => tag.firstChild?.textContent,
    ),
  }));
}

describe('Skills', () => {
  it('opens with the shared section heading, in sentence case', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    const heading = screen.getByRole('heading', { level: 2, name: 'Skills' });
    expect(heading).toHaveClass('section-heading');
    expect(heading.parentElement).toHaveClass('section-header');
  });

  it('lists every skill under each category it belongs to, deepest first', () => {
    const { container } = render(
      <Skills skills={mockSkills} categories={mockCategories} />,
    );

    // Depth first, then name: the two fives before the four, and the three
    // last. Python and TypeScript each appear under both of their categories.
    expect(groupsIn(container)).toEqual([
      { name: 'Languages', skills: ['Python', 'TypeScript', 'JavaScript'] },
      { name: 'ML Engineering', skills: ['Python', 'PyTorch'] },
      {
        name: 'Web Development',
        skills: ['TypeScript', 'JavaScript', 'React'],
      },
    ]);
  });

  /**
   * The section used to open with a button per category, above tags already
   * grouped under those same names, and to hide whatever was not selected.
   */
  it('has no filter: nothing to press, nothing hidden, nothing announced', () => {
    const { container } = render(
      <Skills skills={mockSkills} categories={mockCategories} />,
    );

    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(container.querySelectorAll('[hidden]')).toHaveLength(0);
    expect(container.querySelectorAll('[aria-pressed]')).toHaveLength(0);
  });

  it('marks each group up as a headed list', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    const group = screen
      .getByRole('heading', { level: 3, name: 'Web Development' })
      .closest('.skill-group') as HTMLElement;
    const list = within(group).getByRole('list');

    expect(within(list).getAllByRole('listitem')).toHaveLength(3);
  });

  it('leaves out a category nothing belongs to', () => {
    const { container } = render(
      <Skills
        skills={mockSkills}
        categories={[...mockCategories, { name: 'Databases' }]}
      />,
    );

    expect(groupsIn(container).map((group) => group.name)).toEqual([
      'Languages',
      'ML Engineering',
      'Web Development',
    ]);
  });

  it('sorts a copy, leaving the skills it was given as they were', () => {
    const given = mockSkills.map((skill) => ({ ...skill }));
    const order = given.map((skill) => skill.title);

    render(<Skills skills={given} categories={mockCategories} />);

    expect(given.map((skill) => skill.title)).toEqual(order);
  });

  /**
   * The three tiers used to be told apart by one step of weight at 12px,
   * which nobody could see. Each is now stated as text for a screen reader,
   * and a sighted reader is told the two things the page actually shows.
   */
  describe('knowledge tiers', () => {
    it('states the tier of every tag as text', () => {
      const { container } = render(
        <Skills skills={mockSkills} categories={mockCategories} />,
      );

      expect(
        [...container.querySelectorAll('.skill-tag')].map(
          (tag) => tag.textContent,
        ),
      ).toEqual([
        'Python, deep knowledge',
        'TypeScript, deep knowledge',
        'JavaScript, working knowledge',
        'Python, deep knowledge',
        'PyTorch, working knowledge',
        'TypeScript, deep knowledge',
        'JavaScript, working knowledge',
        'React, familiarity',
      ]);
    });

    it('says once what the order and the fainter tone mean', () => {
      const { container } = render(
        <Skills skills={mockSkills} categories={mockCategories} />,
      );
      const legends = container.querySelectorAll('.skill-tier-legend');

      expect(legends).toHaveLength(1);
      expect(legends[0].textContent).toBe(
        'Strongest first. Fainter tags mark familiarity, not working knowledge.',
      );
    });

    it('keeps the sentence about a tone from readers who cannot see one', () => {
      const { container } = render(
        <Skills skills={mockSkills} categories={mockCategories} />,
      );
      const tone = container.querySelector('.skill-tier-legend-tone');

      // The order holds for everyone; the tone is described only on screen.
      expect(tone).toHaveAttribute('aria-hidden', 'true');
      expect(tone?.textContent?.trim()).toBe(
        'Fainter tags mark familiarity, not working knowledge.',
      );
    });

    it('does not explain a tone that nothing is set in', () => {
      const { container } = render(
        <Skills
          skills={mockSkills.filter((skill) => skill.competency > 3)}
          categories={mockCategories}
        />,
      );

      expect(container.querySelector('.skill-tier-legend')?.textContent).toBe(
        'Strongest first.',
      );
    });
  });

  /**
   * `/resume.json` publishes the same list. A page that grouped or ordered it
   * differently would be the résumé disagreeing with itself.
   */
  it('lists the real data in the groups and order /resume.json publishes', () => {
    const { container } = render(
      <Skills skills={skills} categories={categories} />,
    );

    expect(groupsIn(container)).toEqual(
      buildJsonResume().skills.map((group) => ({
        name: group.name,
        skills: group.keywords,
      })),
    );
  });
});
