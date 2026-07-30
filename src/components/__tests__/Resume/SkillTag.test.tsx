import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Skill } from '@/data/resume/skills';

import SkillTag from '../../Resume/Skills/SkillTag';

const skill: Skill = { title: 'Coding Agents', category: 'Agent Systems' };

describe('SkillTag', () => {
  it('renders the skill title as its text', () => {
    render(<SkillTag data={skill} />);

    expect(screen.getByText('Coding Agents')).toBeInTheDocument();
  });

  /**
   * The tag published a 1–5 self-score three ways at once: a `title` tooltip,
   * an `aria-label`, and a size variant. The `aria-label` reached nobody — it
   * sat on a bare `<span>`, which maps to role `generic`, so browsers discard
   * the name. All three are gone with the score.
   */
  it('carries no rating in a tooltip or an accessible name', () => {
    render(<SkillTag data={skill} />);

    const tag = document.querySelector('.skill-tag') as HTMLElement;
    expect(tag).not.toHaveAttribute('title');
    expect(tag).not.toHaveAttribute('aria-label');
    expect(tag.textContent).toBe('Coding Agents');
  });

  /**
   * Whatever weight a tag has must survive greyscale and print, so no cue may
   * come back as an inline colour or as a modifier class keyed off the data.
   */
  it('renders one class and no inline style, whatever the skill', () => {
    render(
      <>
        <SkillTag data={skill} />
        <SkillTag data={{ title: 'Online Learning', category: 'ML Systems' }} />
      </>,
    );

    const tags = Array.from(
      document.querySelectorAll<HTMLElement>('.skill-tag'),
    );
    expect(tags).toHaveLength(2);

    for (const tag of tags) {
      expect(tag.className).toBe('skill-tag');
      expect(tag.getAttribute('style')).toBeNull();
    }
  });
});
