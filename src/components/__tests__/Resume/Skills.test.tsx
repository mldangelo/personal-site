import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { categories, skills } from '@/data/resume/skills';
import { buildJsonResume } from '@/lib/resumeJson';

import Skills from '../../Resume/Skills';

const mockCategories = [{ name: 'Lang' }, { name: 'ML' }, { name: 'Web' }];

// Out of order, so a list that merely echoed its input could not pass for one
// that sorts.
const mockSkills = [
  { title: 'React', competency: 3, category: ['Web'] },
  { title: 'JavaScript', competency: 4, category: ['Lang', 'Web'] },
  { title: 'PyTorch', competency: 4, category: ['ML'] },
  { title: 'TypeScript', competency: 5, category: ['Lang', 'Web'] },
  { title: 'Python', competency: 5, category: ['Lang', 'ML'] },
];

/** Each group's heading, then its skills. The tier in a tag is visually hidden. */
function groupsIn(container: HTMLElement) {
  return [...container.querySelectorAll('.skill-group')].map((group) => ({
    name: group.querySelector('h3')?.textContent,
    skills: [...group.querySelectorAll('.skill-tag')].map(
      (tag) => tag.firstChild?.textContent,
    ),
  }));
}

describe('Skills', () => {
  it('lists each skill under its categories, deepest first, and skips empty ones', () => {
    const { container } = render(
      <Skills
        skills={mockSkills}
        categories={[...mockCategories, { name: 'Databases' }]}
      />,
    );

    expect(groupsIn(container)).toEqual([
      { name: 'Lang', skills: ['Python', 'TypeScript', 'JavaScript'] },
      { name: 'ML', skills: ['Python', 'PyTorch'] },
      { name: 'Web', skills: ['TypeScript', 'JavaScript', 'React'] },
    ]);
  });

  it('sorts a copy, leaving the skills it was given as they were', () => {
    const given = [...mockSkills];

    render(<Skills skills={given} categories={mockCategories} />);

    expect(given).toEqual(mockSkills);
  });

  it('states the tier of every tag as text', () => {
    const { container } = render(
      <Skills skills={mockSkills} categories={[{ name: 'Web' }]} />,
    );

    expect(
      [...container.querySelectorAll('.skill-tag')].map(
        (tag) => tag.textContent,
      ),
    ).toEqual([
      'TypeScript, deep knowledge',
      'JavaScript, working knowledge',
      'React, familiarity',
    ]);
  });

  // The order holds for everyone; the tone is described only on screen, and
  // only when a tag is set in it.
  it('explains a fainter tone once, to those who can see it', () => {
    const { container } = render(
      <Skills skills={mockSkills} categories={mockCategories} />,
    );

    expect(container.querySelectorAll('.skill-tier-legend')).toHaveLength(1);
    expect(container.querySelector('.skill-tier-legend-tone')).toHaveAttribute(
      'aria-hidden',
      'true',
    );

    const strong = mockSkills.filter((skill) => skill.competency > 3);
    const { container: strongOnly } = render(
      <Skills skills={strong} categories={mockCategories} />,
    );

    expect(strongOnly.querySelector('.skill-tier-legend')?.textContent).toBe(
      'Strongest first.',
    );
  });

  // `/resume.json` publishes the same list, and the résumé must not disagree
  // with itself.
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
