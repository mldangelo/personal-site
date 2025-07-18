'use client';

import React from 'react';

import type { Category, Skill } from '@/data/resume/skills';

interface ModernSkillBarProps {
  data: Skill;
  categories: Category[];
}

const ModernSkillBar: React.FC<ModernSkillBarProps> = ({ data, categories }) => {
  const { category, competency, title } = data;

  // Get the color for the first category
  const categoryColor = categories
    .filter((cat) => category.includes(cat.name))
    .map((cat) => cat.color)[0];

  // Convert competency to proficiency level
  const getProficiencyLevel = (level: number) => {
    if (level >= 4.5) return 'Expert';
    if (level >= 3.5) return 'Advanced';
    if (level >= 2.5) return 'Intermediate';
    return 'Learning';
  };

  const proficiency = getProficiencyLevel(competency);

  return (
    <div className="group relative">
      <div
        className="relative px-4 py-2.5 rounded-lg border transition-all duration-300 hover:scale-105 hover:shadow-md cursor-default"
        style={{
          borderColor: `${categoryColor}30`,
          backgroundColor: `${categoryColor}08`,
        }}
      >
        {/* Gradient background on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${categoryColor}10 0%, ${categoryColor}20 100%)`,
          }}
        />

        <div className="relative flex items-center justify-between gap-3">
          <span className="font-medium text-foreground-bold">{title}</span>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${categoryColor}20`,
              color: categoryColor,
            }}
          >
            {proficiency}
          </span>
        </div>

        {/* Subtle progress indicator */}
        <div
          className="absolute bottom-0 left-0 h-0.5 rounded-full transition-all duration-700 group-hover:opacity-100 opacity-70"
          style={{
            width: `${(competency / 5) * 100}%`,
            backgroundColor: categoryColor,
          }}
        />
      </div>
    </div>
  );
};

export default ModernSkillBar;
