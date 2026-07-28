import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import SkillTag, { tierFor } from '../../Resume/Skills/SkillTag';

describe('tierFor', () => {
  it('maps the top of the scale to core', () => {
    expect(tierFor(5)).toBe('core');
  });

  it('maps one below the top to working', () => {
    expect(tierFor(4)).toBe('working');
  });

  it('maps everything else to familiar', () => {
    expect(tierFor(3)).toBe('familiar');
    expect(tierFor(1)).toBe('familiar');
  });
});

describe('SkillTag', () => {
  it('renders the skill title', () => {
    const skill = { title: 'Python', competency: 5, category: ['Languages'] };

    render(<SkillTag data={skill} />);

    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  /**
   * Competency used to reach the reader only through `--tag-color` (identical
   * for every category) and an `aria-label` on a bare `<span>`, which maps to
   * role `generic` — browsers discard accessible names there, so the
   * proficiency was announced to nobody. It is real text now.
   */
  it('states the competency tier as text', () => {
    const skill = { title: 'Python', competency: 5, category: ['Languages'] };

    render(<SkillTag data={skill} />);

    const tag = document.querySelector('.skill-tag') as HTMLElement;
    expect(tag.textContent).toContain('core');
    expect(tag.querySelector('.skill-tag-tier')).toHaveTextContent(
      'proficiency: core',
    );
  });

  it('does not lean on an accessible name a generic element would discard', () => {
    const skill = { title: 'Python', competency: 5, category: ['Languages'] };

    render(<SkillTag data={skill} />);

    const tag = document.querySelector('.skill-tag') as HTMLElement;
    expect(tag).not.toHaveAttribute('aria-label');
  });

  it('applies the core tier class for the top competency', () => {
    const skill = { title: 'Python', competency: 5, category: ['Languages'] };

    render(<SkillTag data={skill} />);

    expect(document.querySelector('.skill-tag')).toHaveClass('skill-tag--core');
  });

  it('applies the working tier class one below the top', () => {
    const skill = {
      title: 'JavaScript',
      competency: 4,
      category: ['Languages'],
    };

    render(<SkillTag data={skill} />);

    const tag = document.querySelector('.skill-tag');
    expect(tag).toHaveClass('skill-tag--working');
    expect(tag).toHaveTextContent('working');
  });

  it('applies the familiar tier class for competency 3 or below', () => {
    const skill = { title: 'Ruby', competency: 3, category: ['Languages'] };

    render(<SkillTag data={skill} />);

    const tag = document.querySelector('.skill-tag');
    expect(tag).toHaveClass('skill-tag--familiar');
    expect(tag).toHaveTextContent('familiar');
  });

  /**
   * The tier is the only competency cue, so it has to survive greyscale and
   * print. No inline colour may be reintroduced to carry it.
   */
  it('sets no inline colour custom property', () => {
    const skill = {
      title: 'Python',
      competency: 5,
      category: ['Languages', 'ML Engineering'],
    };

    render(<SkillTag data={skill} />);

    const tag = document.querySelector('.skill-tag') as HTMLElement;
    expect(tag.style.getPropertyValue('--tag-color')).toBe('');
    expect(tag.getAttribute('style')).toBeNull();
  });
});
