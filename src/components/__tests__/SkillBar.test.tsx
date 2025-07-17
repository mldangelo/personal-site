import React from 'react';

import { render, screen } from '@testing-library/react';

import SkillBar from '../Resume/Skills/SkillBar';

describe('SkillBar', () => {
  const mockData = {
    title: 'JavaScript',
    competency: 4,
    category: ['Languages', 'Web Development'],
  };

  it('renders skill title', () => {
    render(<SkillBar data={mockData} />);
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
  });

  it('renders competency level', () => {
    render(<SkillBar data={mockData} />);
    const competencyElement = screen.getByText('4 / 5');
    expect(competencyElement).toBeInTheDocument();
  });

  it('applies correct width style based on competency', () => {
    const { container } = render(<SkillBar data={mockData} />);
    const skillBar = container.querySelector('.skillbar-bar');
    expect(skillBar).toHaveStyle({ width: '80%' }); // 4/5 * 100 = 80%
  });

  it('renders with low competency', () => {
    const lowSkillData = { ...mockData, competency: 1 };
    const { container } = render(<SkillBar data={lowSkillData} />);
    const skillBar = container.querySelector('.skillbar-bar');
    expect(skillBar).toHaveStyle({ width: '20%' }); // 1/5 * 100 = 20%
  });
});
