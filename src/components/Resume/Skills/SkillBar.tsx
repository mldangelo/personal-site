import React from 'react';

import type { Category, Skill } from '@/data/resume/skills';

interface SkillBarProps {
  data: Skill;
  categories: Category[];
}

const SkillBar: React.FC<SkillBarProps> = ({ data, categories }) => {
  const { category, competency, title } = data;

  // TODO: Consider averaging colors
  const titleStyle = {
    background: categories
      .filter((cat) => category.includes(cat.name))
      .map((cat) => cat.color)[0],
  };

  const barStyle = {
    ...titleStyle,
    width: `${String(Math.min(100, Math.max((competency / 5.0) * 100.0, 0)))}%`,
  };

  return (
    <div
      className="skillbar clearfix"
      role="group"
      aria-label={`${title}: ${competency} out of 5`}
    >
      <div className="skillbar-title" style={titleStyle}>
        <span>{title}</span>
      </div>
      <div
        className="skillbar-bar"
        style={barStyle}
        role="progressbar"
        aria-valuenow={competency}
        aria-valuemin={0}
        aria-valuemax={5}
        aria-label={`Skill level: ${competency} out of 5`}
      />
      <div className="skill-bar-percent" aria-hidden="true">
        {competency} / 5
      </div>
    </div>
  );
};

export default SkillBar;
