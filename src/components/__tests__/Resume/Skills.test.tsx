import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { skills } from '@/data/resume/skills';
import { buildJsonResume } from '@/lib/resumeJson';

import Skills from '../../Resume/Skills';

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
  it('lists each skill under each of its categories, deepest first', () => {
    const { container } = render(<Skills skills={mockSkills} />);

    expect(groupsIn(container)).toEqual([
      { name: 'Lang', skills: ['Python', 'TypeScript', 'JavaScript'] },
      { name: 'ML', skills: ['Python', 'PyTorch'] },
      { name: 'Web', skills: ['TypeScript', 'JavaScript', 'React'] },
    ]);
  });

  it('states the tier of every tag as text', () => {
    const web = mockSkills
      .filter((skill) => skill.category.includes('Web'))
      .map((skill) => ({ ...skill, category: ['Web'] }));
    const { container } = render(<Skills skills={web} />);

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

  // `/resume.json` publishes the same list, and the résumé must not disagree
  // with itself.
  it('lists the real data in the groups and order /resume.json publishes', () => {
    const { container } = render(<Skills skills={skills} />);

    expect(groupsIn(container)).toEqual(
      buildJsonResume().skills.map((group) => ({
        name: group.name,
        skills: group.keywords,
      })),
    );
  });
});
