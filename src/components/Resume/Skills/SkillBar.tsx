import React from 'react';

import type { Category, Skill } from '@/data/resume/skills';

interface SkillBarProps {
  data: Skill;
  categories: Category[];
}

const SkillBar: React.FC<SkillBarProps> = ({ data, categories }) => {
  const { category, competency, title } = data;

  // Get the primary category color for styling
  const categoryColor = categories.find((cat) =>
    category.includes(cat.name),
  )?.color;

  const titleStyle = { background: categoryColor };

  const barStyle = {
    ...titleStyle,
    width: `${Math.min(100, Math.max((competency / 5.0) * 100.0, 0))}%`,
  };

  return (
    <div className="skillbar clearfix">
      <div className="skillbar-title" style={titleStyle}>
        <span>{title}</span>
      </div>
      <div className="skillbar-bar" style={barStyle} />
      <div className="skill-bar-percent">{competency} / 5</div>
    </div>
  );
};

export default SkillBar;
