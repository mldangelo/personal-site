'use client';

import React, { ReactNode } from 'react';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

interface ScrollAnimationProps {
  children: ReactNode;
  animation?: 'slideUp' | 'slideInLeft' | 'slideInRight' | 'scaleIn' | 'stagger';
  className?: string;
  delay?: number;
  threshold?: number;
  triggerOnce?: boolean;
}

export const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  animation = 'slideUp',
  className,
  delay = 0,
  threshold = 0.1,
  triggerOnce = true,
}) => {
  const { ref, isInView } = useScrollAnimation<HTMLDivElement>({ threshold, triggerOnce });

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all',
        {
          'opacity-0': !isInView && animation !== 'stagger',
          'animate-slideUp': isInView && animation === 'slideUp',
          'animate-slideInLeft': isInView && animation === 'slideInLeft',
          'animate-slideInRight': isInView && animation === 'slideInRight',
          'animate-scaleIn': isInView && animation === 'scaleIn',
          'animate-stagger': animation === 'stagger',
          'in-view': isInView && animation === 'stagger',
        },
        className,
      )}
      style={{
        animationDelay: delay ? `${delay}ms` : undefined,
      }}
    >
      {children}
    </div>
  );
};
