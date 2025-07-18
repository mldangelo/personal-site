'use client';

import React, { useState } from 'react';

import Image, { ImageProps } from 'next/image';

import { cn } from '@/lib/utils';

import { Skeleton } from './Skeleton';

interface LoadingImageProps extends ImageProps {
  skeletonClassName?: string;
}

export const LoadingImage: React.FC<LoadingImageProps> = ({
  className,
  skeletonClassName,
  onLoad,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false);
    onLoad?.(e);
  };

  return (
    <div className="relative">
      {isLoading && (
        <Skeleton variant="rectangular" className={cn('absolute inset-0', skeletonClassName)} />
      )}
      <Image
        {...props}
        alt=""
        className={cn(
          className,
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
        )}
        onLoad={handleLoad}
      />
    </div>
  );
};
