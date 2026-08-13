'use client';

import { type RefObject, useEffect, useRef, useState } from 'react';

import { ageAt, ageIntervalFor, agePlaceholder } from '@/lib/telemetry';

import usePrefersReducedMotion from './usePrefersReducedMotion';

export interface LiveAgeState<T extends HTMLElement> {
  /** True only while a visible-page timer is actively updating the value. */
  live: boolean;
  /** Attach to the element whose text contains the age. */
  ref: RefObject<T | null>;
}

/**
 * Upgrade a server-rendered age snapshot without re-rendering on every tick.
 *
 * The hook writes only the text node. React state tracks the coarse
 * static/live status, not the value, so the eleven-decimal display does not
 * trigger 40 component renders a second. Hidden pages and readers who prefer
 * reduced motion keep the dated server snapshot instead of a frozen value
 * styled as live.
 */
export default function useLiveAge<T extends HTMLElement = HTMLSpanElement>(
  precision: number,
  initial: string = agePlaceholder(precision),
): LiveAgeState<T> {
  const ref = useRef<T>(null);
  const [live, setLive] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const interval = ageIntervalFor(precision);
    let timer: ReturnType<typeof setInterval> | undefined;

    const stop = () => {
      clearInterval(timer);
      timer = undefined;
    };

    const showSnapshot = () => {
      node.textContent = initial;
      setLive(false);
    };

    const tick = () => {
      node.textContent = ageAt(Date.now(), precision);
    };

    const sync = () => {
      stop();

      if (document.hidden || prefersReducedMotion) {
        showSnapshot();
        return;
      }

      tick();
      setLive(true);
      timer = setInterval(tick, interval);
    };

    sync();
    document.addEventListener('visibilitychange', sync);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', sync);
      node.textContent = initial;
    };
  }, [initial, precision, prefersReducedMotion]);

  return { live, ref };
}
