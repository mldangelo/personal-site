'use client';

import { useEffect, useState } from 'react';

interface UseLoadingStateOptions {
  delay?: number;
  minDuration?: number;
}

export function useLoadingState(isLoading: boolean, options: UseLoadingStateOptions = {}) {
  const { delay = 200, minDuration = 500 } = options;
  const [showLoading, setShowLoading] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    let delayTimer: NodeJS.Timeout;
    let minDurationTimer: NodeJS.Timeout;

    if (isLoading) {
      // Delay showing loading state to avoid flash for fast loads
      delayTimer = setTimeout(() => {
        setShowLoading(true);
        setStartTime(Date.now());
      }, delay);
    } else if (showLoading && startTime) {
      // Ensure minimum duration to avoid jarring transitions
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDuration - elapsed);

      minDurationTimer = setTimeout(() => {
        setShowLoading(false);
        setStartTime(null);
      }, remaining);
    } else {
      setShowLoading(false);
      setStartTime(null);
    }

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(minDurationTimer);
    };
  }, [isLoading, showLoading, startTime, delay, minDuration]);

  return showLoading;
}
