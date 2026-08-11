import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import SkillTag, { tierFor } from '../../Resume/Skills/SkillTag';

/**
 * Everything in the tag except its `.sr-only` equivalents — what a sighted
 * reader actually sees. Asserting on this rather than on the absence of some
 * class name is what makes "the tier is explained once, not printed on every
 * tag" a property a future badge can violate.
 */
function visibleText(el: HTMLElement) {
  const clone = el.cloneNode(true) as HTMLElement;
  for (const hidden of clone.querySelectorAll('.sr-only')) hidden.remove();
  return clone.textContent;
}

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
    // The tier reaches assistive technology through that hidden text and
    // nowhere else: the whole tag reads as one phrase, and its visible half is
    // the title alone.
    expect(tag.textContent).toBe('Python, deep knowledge');
    expect(visibleText(tag)).toBe('Python');
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
