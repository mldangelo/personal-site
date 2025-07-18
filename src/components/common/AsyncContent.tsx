'use client';

import React, { ReactNode } from 'react';

import { useLoadingState } from '@/hooks/useLoadingState';

interface AsyncContentProps {
  children: ReactNode;
  loading?: boolean;
  skeleton: ReactNode;
  delay?: number;
  minDuration?: number;
}

export const AsyncContent: React.FC<AsyncContentProps> = ({
  children,
  loading = false,
  skeleton,
  delay = 200,
  minDuration = 500,
}) => {
  const showLoading = useLoadingState(loading, { delay, minDuration });

  if (showLoading) {
    return <>{skeleton}</>;
  }

  return <>{children}</>;
};
