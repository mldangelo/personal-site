'use client';

import React, { useEffect, useState } from 'react';

import type { Category, Skill } from '@/data/resume/skills';

interface SkillBarProps {
  data: Skill;
  categories: Category[];
}

const SkillBar: React.FC<SkillBarProps> = ({ data, categories }) => {
  const { category, competency, title } = data;
  const [progress, setProgress] = useState(0);

  // Get the color for the first category
  const categoryColor = categories
    .filter((cat) => category.includes(cat.name))
    .map((cat) => cat.color)[0];
  const progressPercentage = Math.min(100, Math.max((competency / 5.0) * 100.0, 0));

  // Animate the progress bar on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(progressPercentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  return (
    <div className="relative w-full mb-6 group">
      <div className="flex items-center justify-between mb-2">
        <div
          className="px-3 py-1.5 text-white text-sm font-semibold rounded-md shadow-button relative overflow-hidden"
          style={{
            backgroundColor: categoryColor,
          }}
        >
          <div className="absolute inset-0 bg-black/10" />
          <span className="relative">{title}</span>
        </div>
        <span className="text-sm font-medium text-foreground-bold ml-2">{competency} / 5</span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted dark:bg-muted shadow-inner">
        <div
          className="h-full transition-all duration-[1400ms] ease-out rounded-full relative"
          style={{
            width: `${progress}%`,
            backgroundColor: categoryColor,
          }}
        >
          <div className="absolute inset-0 bg-white/20" />
        </div>
      </div>
    </div>
  );
};

export default SkillBar;
