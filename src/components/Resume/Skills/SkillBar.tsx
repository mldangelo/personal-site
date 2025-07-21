'use client';

import React from 'react';

import type { Category, Skill } from '@/data/resume/skills';

interface SkillBarProps {
  data: Skill;
  categories: Category[];
}

const SkillBar: React.FC<SkillBarProps> = ({ data }) => {
  const { competency, title } = data;
  const progressPercentage = Math.min(100, Math.max((competency / 5.0) * 100.0, 0));

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm">{title}</span>
        <span className="text-sm text-gray-600 dark:text-gray-400">{competency} / 5</span>
      </div>
      <div className="h-2 w-full bg-gray-200 dark:bg-gray-800">
        <div
          className="h-full bg-gray-600 dark:bg-gray-400"
          style={{
            width: `${progressPercentage}%`,
          }}
        />
      </div>
    </div>
  );
};

export default SkillBar;
