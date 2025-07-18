import React from 'react';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseClasses = 'bg-muted relative overflow-hidden';

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'after:absolute after:inset-0 after:translate-x-[-100%] after:animate-shimmer after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent',
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], animationClasses[animation], className)}
      style={{
        width: width,
        height: height || (variant === 'text' ? '1em' : undefined),
      }}
    />
  );
};

// Specialized skeleton components
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className,
}) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} width={i === lines - 1 ? '80%' : '100%'} className="h-4" />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('p-6 rounded-xl glass glass-border', className)}>
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-8 w-20" variant="rectangular" />
    </div>
    <SkeletonText lines={3} />
  </div>
);

export const SkeletonProjectCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('overflow-hidden rounded-xl glass glass-border', className)}>
    <Skeleton variant="rectangular" className="aspect-[3/2]" />
    <div className="p-4">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  </div>
);

export const SkeletonTimeline: React.FC<{ items?: number }> = ({ items = 3 }) => (
  <div className="space-y-8">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="relative flex items-start">
        {i < items - 1 && <div className="absolute left-4 top-8 w-0.5 h-full bg-muted" />}
        <Skeleton variant="circular" className="w-8 h-8 mr-6" />
        <div className="flex-1">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-5 w-48 mb-1" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>
    ))}
  </div>
);
