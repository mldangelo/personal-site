'use client';

import { useEffect, useRef } from 'react';

/**
 * setInterval with a callback that can close over fresh state without
 * resetting the timer. Passing `null` as the delay pauses the interval.
 */
export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
};

export default useInterval;
