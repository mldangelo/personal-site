'use client';

import React from 'react';

import { Toggle } from '@/components/ui/toggle';
import { useMobileDetection } from '@/hooks/useMobileDetection';

interface CategoryButtonProps {
  label: string;
  handleClick: (label: string) => void;
  active: Record<string, boolean>;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ handleClick, active, label }) => {
  const { isTouch } = useMobileDetection();

  return (
    <Toggle
      pressed={active[label]}
      onPressedChange={() => handleClick(label)}
      className={`h-auto px-5 py-2.5 text-sm font-medium uppercase tracking-wide border border-border/50 rounded-lg transition-all duration-200 data-[state=on]:bg-accent data-[state=on]:text-white data-[state=on]:border-accent data-[state=on]:shadow-button hover:bg-muted hover:border-border dark:hover:bg-muted dark:hover:border-border/70 ${
        isTouch ? 'active:scale-95 min-h-[44px]' : ''
      }`}
    >
      {label}
    </Toggle>
  );
};

export default CategoryButton;
