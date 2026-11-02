import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Skill } from '@/data/resume/skills';

import SkillTag from '../../Resume/Skills/SkillTag';

/** A tag is a list item, so it is rendered where one belongs. */
function renderTag(skill: Skill) {
  return render(
    <ul>
      <SkillTag data={skill} />
    </ul>,
  );
}

describe('SkillTag', () => {
  it('renders the skill title as an item of its list', () => {
    renderTag({ title: 'Python', competency: 5, category: ['Languages'] });

    expect(screen.getByRole('listitem')).toHaveTextContent('Python');
  });

  /**
   * The tier used to be a numeric `aria-label` on a bare `<span>`, which maps
   * to role `generic` and discards accessible names, so it reached nobody. It
   * is real text now: hidden from sight, part of the phrase read aloud.
   */
  it('states the competency tier in visually hidden text', () => {
    renderTag({ title: 'Python', competency: 5, category: ['Languages'] });

    const tag = document.querySelector('.skill-tag') as HTMLElement;
    expect(tag).toHaveClass('skill-tag--deep');
    expect(tag.querySelector('.sr-only')).toHaveTextContent(', deep knowledge');
    expect(tag.textContent).toBe('Python, deep knowledge');
    // What is left on show once the hidden run is taken away is the name.
    expect(tag.firstChild?.textContent).toBe('Python');
  });

  it('applies the working tier class one below the top', () => {
    renderTag({
      title: 'JavaScript',
      competency: 4,
      category: ['Languages'],
    });

    const tag = document.querySelector('.skill-tag');
    expect(tag).toHaveClass('skill-tag--working');
    expect(tag?.querySelector('.sr-only')).toHaveTextContent(
      'working knowledge',
    );
  });

  it('applies the familiar tier class for competency 3 or below', () => {
    renderTag({ title: 'Ruby', competency: 3, category: ['Languages'] });

    const tag = document.querySelector('.skill-tag');
    expect(tag).toHaveClass('skill-tag--familiar');
    expect(tag?.querySelector('.sr-only')).toHaveTextContent('familiarity');
  });
});
