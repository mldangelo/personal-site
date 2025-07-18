'use client';

import React, { useState } from 'react';

import type { Category, Skill } from '@/data/resume/skills';
import { useMobileDetection } from '@/hooks/useMobileDetection';

interface SkillBubbleProps {
  data: Skill;
  categories: Category[];
}

const SkillBubble: React.FC<SkillBubbleProps> = ({ data, categories }) => {
  const { category, competency, title } = data;
  const { isTouch } = useMobileDetection();
  const [showTooltip, setShowTooltip] = useState(false);

  // Get the color for the first category
  const categoryColor = categories
    .filter((cat) => category.includes(cat.name))
    .map((cat) => cat.color)[0];

  // Size based on competency (40px to 120px)
  const size = 40 + (competency / 5) * 80;

  // Convert competency to proficiency level
  const getProficiencyLevel = (level: number) => {
    if (level >= 4.5) return { text: 'Expert', opacity: 1 };
    if (level >= 3.5) return { text: 'Advanced', opacity: 0.85 };
    if (level >= 2.5) return { text: 'Intermediate', opacity: 0.7 };
    return { text: 'Learning', opacity: 0.55 };
  };

  const proficiency = getProficiencyLevel(competency);

  const handleTap = () => {
    if (isTouch) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    }
  };

  return (
    <div className="group relative inline-flex">
      <div
        className={`relative flex items-center justify-center rounded-full transition-all duration-500 hover:scale-110 cursor-default backdrop-blur-sm ${
          isTouch ? 'active:scale-95' : ''
        }`}
        onClick={handleTap}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: `${categoryColor}${Math.round(proficiency.opacity * 30)
            .toString(16)
            .padStart(2, '0')}`,
          border: `2px solid ${categoryColor}${Math.round(proficiency.opacity * 50)
            .toString(16)
            .padStart(2, '0')}`,
          boxShadow: `0 0 20px ${categoryColor}20, inset 0 0 20px ${categoryColor}10`,
        }}
      >
        {/* Glassmorphism effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent" />

        {/* Floating animation */}
        <div
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${categoryColor}40, transparent 70%)`,
          }}
        />

        {/* Text content */}
        <div className="relative text-center px-2">
          <span
            className="font-semibold text-xs leading-tight block"
            style={{
              color: categoryColor,
              fontSize: `${Math.max(10, size / 8)}px`,
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            {title}
          </span>
        </div>

        {/* Hover/Touch tooltip */}
        <div
          className={`absolute -bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-300 pointer-events-none whitespace-nowrap ${
            showTooltip || (!isTouch && 'group-hover:opacity-100')
          } ${showTooltip ? 'opacity-100' : 'opacity-0'}`}
        >
          <div
            className="px-2 py-1 rounded text-xs font-medium text-white shadow-lg"
            style={{ backgroundColor: categoryColor }}
          >
            {proficiency.text} • {competency}/5
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillBubble;
