import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import SkillTag, { tierFor } from '../../Resume/Skills/SkillTag';

describe('tierFor', () => {
  it('maps the top of the scale to deep', () => {
    expect(tierFor(5)).toBe('deep');
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
   * The old visual size/weight cue was paired with an `aria-label` on a bare
   * `<span>`, which maps to role `generic`. Browsers discard accessible names
   * there, so the proficiency was announced to nobody.
   */
  it('states the competency tier in visually hidden text', () => {
    const skill = { title: 'Python', competency: 5, category: ['Languages'] };

    render(<SkillTag data={skill} />);

    const tag = document.querySelector('.skill-tag') as HTMLElement;
    expect(tag.querySelector('.sr-only')).toHaveTextContent(', deep knowledge');
    expect(tag.querySelector('.skill-tag-tier')).not.toBeInTheDocument();
  });

  it('does not lean on an accessible name a generic element would discard', () => {
    const skill = { title: 'Python', competency: 5, category: ['Languages'] };

    render(<SkillTag data={skill} />);

    const tag = document.querySelector('.skill-tag') as HTMLElement;
    expect(tag).not.toHaveAttribute('aria-label');
  });

  it('applies the deep tier class for the top competency', () => {
    const skill = { title: 'Python', competency: 5, category: ['Languages'] };

    render(<SkillTag data={skill} />);

    expect(document.querySelector('.skill-tag')).toHaveClass('skill-tag--deep');
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
    expect(tag?.querySelector('.sr-only')).toHaveTextContent(
      'working knowledge',
    );
  });

  it('applies the familiar tier class for competency 3 or below', () => {
    const skill = { title: 'Ruby', competency: 3, category: ['Languages'] };

    render(<SkillTag data={skill} />);

    const tag = document.querySelector('.skill-tag');
    expect(tag).toHaveClass('skill-tag--familiar');
    expect(tag?.querySelector('.sr-only')).toHaveTextContent('familiarity');
  });

  /**
   * The old category colour did not encode competency and distinguished no
   * categories because every value was identical. Do not restore that prop
   * chain as if it were part of the tier model.
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
